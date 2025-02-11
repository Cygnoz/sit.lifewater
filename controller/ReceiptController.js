const Receipt = require('../Models/receiptSchema');
const Order = require('../Models/OrderSchema');
const Customer = require('../Models/CustomerSchema');
const TrialBalance = require('../Models/trialBalance');
const moment = require('moment-timezone');
const Account = require('../Models/account');
const { default: mongoose } = require('mongoose');


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



exports.getReceiptsBySalesmanId = async (req, res) => {
  try {
    const { salesmanId } = req.params;

    // Fetch receipts for the given salesmanId
    const receipts = await Receipt.find({ salesmanId }).sort({ createdAt: -1 });

    // Map through receipts to fetch customer full names
    const result = await Promise.all(
      receipts.map(async (receipt) => {
        const customer = await Customer.findById(receipt.customerId).select('fullName');
        return {
          ...receipt.toObject(),
          fullName: customer ? customer.fullName : 'Unknown Customer',
        };
      })
    );

    // Check if any receipts exist for the salesman
    if (!result.length) {
      return res.status(404).json({ message: 'No receipts found for the given salesman.' });
    }

    return res.status(200).json({
      message: 'Receipts retrieved successfully.',
      data: result,
    });
  } catch (error) {
    console.error('Error retrieving receipts by salesmanId:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



exports.getOneReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;

    // Validate receiptId
    if (!receiptId) {
      return res.status(400).json({ message: 'Receipt ID is required.' });
    }

    // Fetch the receipt by ID
    const receipt = await Receipt.findById(receiptId);
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found.' });
    }

    // Fetch the associated customer's full name
    const customer = await Customer.findById(receipt.customerId).select('fullName');

    const result = {
      ...receipt.toObject(),
      fullName: customer ? customer.fullName : 'Unknown Customer',
    };

    return res.status(200).json({
      message: 'Receipt retrieved successfully.',
      data: result,
    });

  } catch (error) {
    console.error('Error retrieving the receipt:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



exports.createReceipt = async (req, res) => {
  try {
    let { customerId, orderId, paidAmount, depositAccountId,salesmanId } = cleanData(req.body);

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
    order.balanceAmount -= Number(paidAmount) || 0;
    order.paidAmount += Number(paidAmount) || 0;

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
      salesmanId,
      receiptNumber:receiptNumber,
      orderNumber: order.orderNumber,
      depositAccountId,
      paidAmount: Number(paidAmount), // Ensure it's a number
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



// exports.updateReceipt = async (req, res) => {
//   try {
//     const receiptId = req.params.receiptId;
//     if (!receiptId) {
//       return res.status(400).json({ message: 'Receipt ID is required.' });
//     }

//     let { customerId, orderId, paidAmount, depositAccountId, salesmanId } = cleanData(req.body);

//     // Validate essential fields with specific error messages
//     if (!customerId) {
//       return res.status(400).json({ message: 'Customer ID is required.' });
//     }
//     if (!orderId) {
//       return res.status(400).json({ message: 'Order ID is required.' });
//     }
//     if (!paidAmount && paidAmount !== 0) {
//       return res.status(400).json({ message: 'Paid amount is required.' });
//     }
//     if (paidAmount <= 0) {
//       return res.status(400).json({ message: 'Paid amount must be greater than zero.' });
//     }
//     if (!depositAccountId) {
//       return res.status(400).json({ message: 'Deposit account ID is required.' });
//     }

//     // Check if receipt exists
//     const receipt = await Receipt.findById(receiptId);
//     if (!receipt) {
//       return res.status(404).json({ message: 'Receipt not found.' });
//     }

//     const { customerAccount, depositAccount } = await dataExist(customerId, depositAccountId);
//     if (!customerAccount) {
//       return res.status(404).json({ message: 'Customer Account not found' });
//     }
//     if (!depositAccount) {
//       return res.status(404).json({ message: 'Deposit Account not found' });
//     }

//     // Check if order exists
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found.' });
//     }

//     // Validate customer association with the order
//     if (order.customerId.toString() !== customerId) {
//       return res.status(400).json({ message: 'Order does not belong to the specified customer.' });
//     }

//     // Check if the paid amount exceeds the balance
//     if (paidAmount > order.balanceAmount) {
//       return res.status(400).json({ message: 'Paid amount exceeds the balance amount.' });
//     }

//     // Update order amounts
//     order.balanceAmount -= Number(paidAmount) || 0;
//     order.paidAmount += Number(paidAmount) || 0;
//     await order.save();

//     // Update receipt without changing receiptNumber and orderNumber
//     Object.assign(receipt, {
//       customerName: order.customerName,
//       customerId,
//       orderId,
//       salesmanId,
//       depositAccountId,
//       paidAmount: Number(paidAmount),
//     });

//     await receipt.save();

//     // Journal entry update
//     await journal(receipt, customerAccount, depositAccount);

//     return res.status(200).json({
//       message: 'Receipt updated successfully.',
//       receipt,
//     });
//   } catch (error) {
//     console.error('Error updating receipt:', error);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// };


     // Function to generate time and date for storing in the database
     
exports.updateReceipt = async (req, res) => {
      try {
        const { customerId, orderId, paidAmount, depositAccountId, salesmanId } = req.body;
        const receiptId = req.params.receiptId;
        console.log('Request body:', { customerId, orderId, paidAmount, depositAccountId, salesmanId, receiptId });
    
        // Field validations
        if (!receiptId || !customerId || !orderId || !depositAccountId || 
            paidAmount === undefined || paidAmount === null) {
          const error = { receiptId, customerId, orderId, depositAccountId, paidAmount };
          console.log('Validation failed:', error);
          return res.status(400).json({ message: 'All fields are required.', error });
        }
    
        const paidAmountNum = Number(paidAmount);
        if (isNaN(paidAmountNum) || paidAmountNum <= 0) {
          console.log('Invalid paid amount:', paidAmount);
          return res.status(400).json({ message: 'Paid amount must be a valid positive number' });
        }
    
        // Fetch existing receipt
        const receipt = await Receipt.findById(receiptId);
        if (!receipt) {
          console.log('Receipt not found:', receiptId);
          return res.status(404).json({ message: 'Receipt not found.' });
        }
        console.log('Existing receipt:', receipt);
    
        // Account validations
        const { customerAccount, depositAccount } = await dataExist(customerId, depositAccountId);
        if (!customerAccount || !depositAccount) {
          console.log('Account validation failed:', { customerAccount, depositAccount });
          return res.status(404).json({ message: 'Customer or Deposit Account not found' });
        }
    
        // Fetch order
        const order = await Order.findById(orderId);
        if (!order) {
          console.log('Order not found:', orderId);
          return res.status(404).json({ message: 'Order not found.' });
        }
    
        // Calculate total order amount from current state
        const originalTotalAmount = order.paidAmount + order.balanceAmount;
        const oldReceiptAmount = receipt.paidAmount;
        
        // Calculate the order's current paid amount excluding this receipt
        const orderPaidWithoutThisReceipt = order.paidAmount - oldReceiptAmount;
    
        console.log('Original state:', {
          totalAmount: originalTotalAmount,
          orderCurrentPaid: order.paidAmount,
          orderCurrentBalance: order.balanceAmount,
          oldReceiptAmount,
          orderPaidWithoutThisReceipt,
          newReceiptAmount: paidAmountNum
        });
    
        if (isNaN(originalTotalAmount) || originalTotalAmount <= 0) {
          console.log('Invalid order amounts:', { 
            paidAmount: order.paidAmount, 
            balanceAmount: order.balanceAmount 
          });
          return res.status(400).json({ 
            message: 'Cannot determine order total amount from existing values' 
          });
        }
    
        // Customer validation
        if (order.customerId.toString() !== customerId) {
          console.log('Customer mismatch:', { orderCustomerId: order.customerId, requestCustomerId: customerId });
          return res.status(400).json({ message: 'Order does not belong to the specified customer.' });
        }
    
        // Calculate new order paid amount by adding the new receipt amount to the order's paid amount (excluding this receipt)
        const newOrderPaidAmount = orderPaidWithoutThisReceipt + paidAmountNum;
    
        if (newOrderPaidAmount > originalTotalAmount) {
          console.log('Payment exceeds total:', { 
            calculatedNewPaid: newOrderPaidAmount, 
            totalAmount: originalTotalAmount 
          });
          return res.status(400).json({ 
            message: 'Paid amount exceeds the total order amount.',
            orderTotal: originalTotalAmount,
            currentPaid: orderPaidWithoutThisReceipt,
            attemptedNewTotal: newOrderPaidAmount
          });
        }
    
        // Update order amounts
        order.paidAmount = newOrderPaidAmount;
        order.balanceAmount = originalTotalAmount - newOrderPaidAmount;
    
        console.log('Updated order state:', {
          newPaidAmount: order.paidAmount,
          newBalanceAmount: order.balanceAmount,
          totalAmount: originalTotalAmount
        });
    
        await order.save();
    
        // Update receipt
        Object.assign(receipt, {
          customerName: order.customerName,
          customerId,
          orderId,
          salesmanId,
          depositAccountId,
          paidAmount: paidAmountNum,
        });
    
        await receipt.save();
        await editJournal(receipt, customerAccount, depositAccount);
    
        console.log('Update successful:', {
          receipt: receipt._id,
          order: order._id,
          finalBalance: order.balanceAmount,
          finalPaid: order.paidAmount
        });
    
        return res.status(200).json({
          message: 'Receipt updated successfully.',
          receipt,
          order: {
            balanceAmount: order.balanceAmount,
            paidAmount: order.paidAmount,
            totalAmount: originalTotalAmount
          }
        });
      } catch (error) {
        console.error('Error updating receipt:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }
    };
     
     


// Delete Sales Receipt
exports.deleteReceipt = async (req, res) => {
  console.log("Delete receipt request received:", req.params);

  try {
    const { receiptId } = req.params;

    // Validate receiptId
    if (!mongoose.Types.ObjectId.isValid(receiptId)) {
      return res.status(400).json({ message: `Invalid Receipt ID: ${receiptId}` });
    }

    // Fetch existing receipt
    const existingReceipt = await Receipt.findById(receiptId);
    if (!existingReceipt) {
      console.log("Receipt not found with ID:", receiptId);
      return res.status(404).json({ message: "Receipt not found" });
    }

    // Fetch the order associated with this receipt
    const order = await Order.findById(existingReceipt.orderId);
    if (!order) {
      console.log("Associated order not found:", existingReceipt.orderId);
      return res.status(404).json({ message: "Associated order not found" });
    }

    console.log('Current state before deletion:', {
      receiptAmount: existingReceipt.paidAmount,
      orderPaidAmount: order.paidAmount,
      orderBalanceAmount: order.balanceAmount,
      totalOrderAmount: order.paidAmount + order.balanceAmount
    });

    // Calculate new order amounts
    const totalOrderAmount = order.paidAmount + order.balanceAmount;
    const newPaidAmount = order.paidAmount - existingReceipt.paidAmount;
    const newBalanceAmount = totalOrderAmount - newPaidAmount;

    console.log('Calculated new amounts:', {
      totalOrderAmount,
      newPaidAmount,
      newBalanceAmount
    });

    // Validate calculations
    if (isNaN(newPaidAmount) || isNaN(newBalanceAmount) || newPaidAmount < 0) {
      console.error('Invalid calculation result:', {
        newPaidAmount,
        newBalanceAmount,
        totalOrderAmount
      });
      return res.status(400).json({
        message: 'Error calculating new order amounts',
        details: {
          currentPaid: order.paidAmount,
          receiptAmount: existingReceipt.paidAmount,
          totalAmount: totalOrderAmount
        }
      });
    }

    // Update order amounts
    order.paidAmount = newPaidAmount;
    order.balanceAmount = newBalanceAmount;

    // Save order changes
    await order.save();
    console.log('Updated order state:', {
      newPaidAmount: order.paidAmount,
      newBalanceAmount: order.balanceAmount,
      totalAmount: totalOrderAmount
    });

    // Fetch the latest receipt for validation
    const latestReceipt = await Receipt.findOne({
      customerId: existingReceipt.customerId,
      orderId: existingReceipt.orderId
    }).sort({ createdAt: -1 });

    // Check if attempting to delete a non-latest receipt
    if (latestReceipt && latestReceipt._id.toString() !== receiptId) {
      return res.status(400).json({
        message: "Only the latest receipt can be deleted."
      });
    }

    // Delete the receipt
    await existingReceipt.deleteOne();

    // Delete associated trial balance entries if they exist
    const existingTrialBalance = await TrialBalance.findOne({
      operationId: existingReceipt._id,
    });

    if (existingTrialBalance) {
      await TrialBalance.deleteMany({
        operationId: existingReceipt._id,
      });
      console.log(`Deleted existing TrialBalance entries for operationId: ${existingReceipt._id}`);
    }

    console.log('Delete operation successful:', {
      deletedReceiptId: receiptId,
      updatedOrderId: order._id,
      finalOrderState: {
        paidAmount: order.paidAmount,
        balanceAmount: order.balanceAmount,
        totalAmount: totalOrderAmount
      }
    });

    res.status(200).json({
      message: "Receipt deleted successfully",
      orderStatus: {
        paidAmount: order.paidAmount,
        balanceAmount: order.balanceAmount,
        totalAmount: totalOrderAmount
      }
    });

  } catch (error) {
    console.error("Error deleting receipt:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
     
     
     
     
     
     
     
     
     
     
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


  createTrialEntry( customerPaid )
  createTrialEntry( depositAccount )
  

}




async function createTrialEntry( data ) {
  const newTrialEntry = new TrialBalance({
      organizationId:data.organizationId,
      operationId:data.operationId,
      transactionId: data.transactionId,
      accountId: data.accountId,
      action: data.action,
      debitAmount: data.debitAmount,
      creditAmount: data.creditAmount,
      remark: data.remark
});
    const trial =  await newTrialEntry.save();
    console.log('output:',trial); 
}

















async function editJournal( receipt, customerAccount, depositAccounts ) { 
        
  const existingTrialBalance = await TrialBalance.findOne({
    operationId: receipt._id,
  });  

  const createdDateTime = existingTrialBalance ? existingTrialBalance.createdDateTime : null;

  // If there are existing entries, delete them
  if (existingTrialBalance) {
    await TrialBalance.deleteMany({
      operationId: receipt._id,
    });
    console.log(`Deleted existing TrialBalance entries for operationId: ${receipt._id}`);
  }

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

  editCreateTrialEntry( customerPaid,createdDateTime )
  editCreateTrialEntry( depositAccount,createdDateTime )

}





async function editCreateTrialEntry( data, createdDateTime ) {
  const newTrialEntry = new TrialBalance({
      organizationId:data.organizationId,
      operationId:data.operationId,
      transactionId: data.transactionId,
      date:data.date,
      accountId: data.accountId,
      action: data.action,
      debitAmount: data.debitAmount,
      creditAmount: data.creditAmount,
      remark: data.remark,
      createdDateTime: createdDateTime
  });
  
  await newTrialEntry.save();
}