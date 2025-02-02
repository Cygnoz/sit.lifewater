const Receipt = require('../Models/receiptSchema');
const Order = require('../Models/OrderSchema');
const Customer = require('../Models/CustomerSchema');
const TrialBalance = require('../Models/trialBalance');
const moment = require('moment-timezone');
const Account = require('../Models/account');


// Helper function to clean incoming data
const cleanData = (data) => {
  const cleanedData = {};
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      cleanedData[key] = data[key];
    }
  }
  return cleanedData;
};

// Fetch existing data
const dataExist = async ( customerId , depositAccountId ) => {
  const [ customerAccount, depositAccount ] = await Promise.all([
    Account.findOne({  accountId:customerId }),
    Account.findOne({  _id:depositAccountId }),
  ]);
  return { customerAccount, depositAccount};
};


exports.getAllReceipts = async (req, res) => {
  try {
    // Fetch all receipts from the database
    const receipts = await Receipt.find().sort({ createdAt: -1 });

    // Map through receipts to fetch customer fullNames manually
    const result = await Promise.all(receipts.map(async (receipt) => {
      const customer = await Customer.findById(receipt.customerId).select('fullName');
      return {
        ...receipt.toObject(),
        fullName: customer ? customer.fullName : 'Unknown Customer'
      };
    }));

    // Check if receipts exist
    if (!result.length) {
      return res.status(404).json({ message: 'No receipts found.' });
    }

    return res.status(200).json({
      message: 'Receipts retrieved successfully.',
      data: result,
    });
  } catch (error) {
    console.error('Error retrieving receipts:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



exports.createReceipt = async (req, res) => {
  try {
    let { customerId, orderId, paidAmount, depositAccountId } = cleanData(req.body);

    // Validate essential fields with specific error messages
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required.' });
    }
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }
    if (!paidAmount && paidAmount !== 0) {
      return res.status(400).json({ message: 'Paid amount is required.' });
    }
    if (paidAmount <= 0) {
      return res.status(400).json({ message: 'Paid amount must be greater than zero.' });
    }
    if (!depositAccountId) {
      return res.status(400).json({ message: 'Deposit account ID is required.' });
    }

    const { customerAccount, depositAccount } = await dataExist( customerId, depositAccountId );
    if (!customerAccount) {
        res.status(404).json({ message: "Customer Account not found" });
        return false;
      } 
    if (!depositAccount) {
        res.status(404).json({ message: "Customer Account not found" });
        return false;
    } 

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Validate customer association with the order
    if (order.customerId.toString() !== customerId) {
      return res.status(400).json({ message: 'Order does not belong to the specified customer.' });
    }

    // Check if the paid amount exceeds the balance
    if (paidAmount > order.balanceAmount) {
      return res.status(400).json({ message: 'Paid amount exceeds the balance amount.' });
    }

    // Decrement the balance amount from the order
    order.balanceAmount -= paidAmount;
    await order.save();


    //prefix
    let nextId = 1;
    const lastPrefix = await Receipt.findOne().sort({ _id: -1 }); 
    if (lastPrefix) {
      const lastId = parseInt(lastPrefix.receiptNumber.slice(3)); 
      nextId = lastId + 1; 
    }    
    const receiptNumber = `CP-${nextId}`;


 



    // Create a new receipt entry
    const receipt = new Receipt({
      customerName: order.customerName,
      customerId,
      orderId,
      receiptNumber:receiptNumber,
      orderNumber: order.orderNumber,
      depositAccountId,
      paidAmount,
    });

    await receipt.save();

     //Journal
     await journal( receipt, customerAccount, depositAccount );

    return res.status(201).json({
      message: 'Receipt created successfully.',
      receipt,
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

     // Function to generate time and date for storing in the database
     function generateTimeAndDateForDB(
      timeZone,
      dateFormat,
      dateSplit,
      baseTime = new Date(),
      timeFormat = "HH:mm:ss",
      timeSplit = ":"
    ) {
      // Convert the base time to the desired time zone
      const localDate = moment.tz(baseTime, timeZone);
    
      // Format date and time according to the specified formats
      let formattedDate = localDate.format(dateFormat);
    
      // Handle date split if specified
      if (dateSplit) {
        // Replace default split characters with specified split characters
        formattedDate = formattedDate.replace(/[-/]/g, dateSplit); // Adjust regex based on your date format separators
      }
    
      const formattedTime = localDate.format(timeFormat);
      const timeZoneName = localDate.format("z"); // Get time zone abbreviation
    
      // Combine the formatted date and time with the split characters and time zone
      const dateTime = `${formattedDate} ${formattedTime
        .split(":")
        .join(timeSplit)}`;
    
      return {
        date: formattedDate,
        time: `${formattedTime} (${timeZoneName})`,
        dateTime: dateTime,
      };
    }
    













async function journal( receipt, customerAccount, depositAccounts ) {  

  const customerPaid = {
    operationId: receipt._id,
    transactionId: receipt.receiptNumber,
    date: receipt.createdDate,
    accountId: customerAccount._id || undefined,
    action: "Receipt",
    debitAmount: 0,
    creditAmount: receipt.paidAmount || 0,
    remark: receipt.note,
  };
  let depositAccount 
 
  if(depositAccounts){
     depositAccount = {
      operationId: receipt._id,
      transactionId: receipt.receiptNumber,
      date: receipt.createdDate,
      accountId: depositAccounts._id || undefined,
      action: "Receipt",
      debitAmount: receipt.paidAmount || 0,
      creditAmount: 0,
      remark: receipt.note,
    };
  }

  // console.log("sale", sale.debitAmount,  sale.creditAmount);
  // console.log("customer", customer.debitAmount,  customer.creditAmount);
  // console.log("customerPaid", customerPaid.debitAmount,  customerPaid.creditAmount);
  // console.log("depositAccount", depositAccount.debitAmount,  depositAccount.creditAmount);

  // const  debitAmount =  sale.debitAmount  + customer.debitAmount + customerPaid.debitAmount +  depositAccount.debitAmount;
  // const  creditAmount = sale.creditAmount  + customer.creditAmount + customerPaid.creditAmount +  depositAccount.creditAmount ;

  // console.log("Total Debit Amount: ", debitAmount );
  // console.log("Total Credit Amount: ", creditAmount );

  const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
  const openingDate = generatedDateTime.dateTime; 

  createTrialEntry( customerPaid,openingDate )
  createTrialEntry( depositAccount,openingDate )
  

}




async function createTrialEntry( data,openingDate ) {
  const newTrialEntry = new TrialBalance({
      organizationId:data.organizationId,
      operationId:data.operationId,
      transactionId: data.transactionId,
      date:openingDate,
      accountId: data.accountId,
      action: data.action,
      debitAmount: data.debitAmount,
      creditAmount: data.creditAmount,
      remark: data.remark
});
    const trial =  await newTrialEntry.save();
    console.log('output:',trial); 
}