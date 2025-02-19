const WStock = require('../Models/WStockSchema');
const Warehouse = require('../Models/WarehouseSchema');
const Account = require("../Models/account");
const TrialBalance = require("../Models/trialBalance");



const dataExist = async (supplierId, paidThroughAccountId) => {
  const [customerAccount, purchaseAccount, depositAccount] = await Promise.all([
    Account.findOne({ accountId: supplierId }),
    Account.findOne({ accountName: "Cost of Goods Sold" }),
    Account.findOne({ _id: paidThroughAccountId }),
  ]);
  return { customerAccount, purchaseAccount, depositAccount };
};
 


// Add stock to warehouse
exports.createStock = async (req, res) => {
  console.log("Add Warehouse Stock:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.items = (cleanedData.items || [])
      .map(item => cleanCustomerData(item))
      .filter(item => item.itemName && item.itemName.trim() !== "");

    const { warehouse, transferNumber, items } = cleanedData;
    console.log("cleanedData",cleanedData);
   
    // Validate required fields
    if (!transferNumber) {
      return res.status(400).json({
        success: false,
        message: 'Transfer Number required',
      });
    }
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Select an item',
      });
    }
    if (!warehouse) {
      return res.status(400).json({
        success: false,
        message: 'Select a warehouse',
      });
    }


    const { supplierAccount } = await dataExist(
      cleanedData.supplierId,
      cleanedData.paidThroughAccountId
    );
    if (!supplierAccount) {
      return res.status(404).json({ message: "Customer Account not found" });
    }

    if(cleanedData.paidAmount > cleanedData.totalAmount){
      return res.status(400).json({
        success: false,
        message: 'Paid amount cannot be greater than total amount',
      });
    }

    // Check for invalid item quantities
    const invalidItem = items.find(item => item.quantity < 1);
    if (invalidItem) {
        return res.status(400).json({
            success: false,
            message: `Item '${invalidItem.itemName}' has an invalid quantity of ${invalidItem.quantity}. Quantity must be at least 1.`,
        });
    }


    // Check for duplicate transferNumber
    const existingStock = await WStock.findOne({ transferNumber });
    if (existingStock) {
      console.log(`Stock with transfer number ${transferNumber} already exists.`);      
      return res.status(400).json({
        success: false,
        message: `Stock with transfer number ${transferNumber} already exists.`,
      });
    }

    // Check if the warehouse exists
    const warehouseExists = await Warehouse.findOne({ warehouseName: warehouse });
    if (!warehouseExists) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse not found',
      });
    }

    console.log("Warehouse exists:", warehouseExists);

    // Add stock items to the warehouse's existing stock
    items.forEach((item) => {
      const existingItemIndex = warehouseExists.stock.findIndex(
        (stockItem) => stockItem.itemId === item.itemId
      );
    
      if (existingItemIndex > -1) {
        // If the item already exists in the stock, update its quantity and other fields
        warehouseExists.stock[existingItemIndex].quantity += item.quantity;
        warehouseExists.stock[existingItemIndex].costPrice = item.costPrice;
        warehouseExists.stock[existingItemIndex].amount =
        warehouseExists.stock[existingItemIndex].quantity * item.sellingPrice;
        warehouseExists.stock[existingItemIndex].status = item.resaleable ? "Filled" : undefined;
      } else {
        // If the item does not exist in the stock, add it as a new stock entry
        warehouseExists.stock.push({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          costPrice: item.costPrice,
          serialNumber: item.serialNumber,
          amount: item.quantity * item.sellingPrice,
          status: item.resaleable ? "Filled" : undefined,
          sellingPrice: item.sellingPrice
        });
      }
    });
    

    // Save the updated warehouse document
    await warehouseExists.save();
    console.log("Warehouse updated with new stock:", warehouseExists);


    
    // Create a new warehouse stock record (if required separately)
    const wStock = new WStock({ ...cleanedData });
    await wStock.save();
    console.log("Stock record created:", wStock);
    
    await journal(supplierAccount, purchaseAccount, depositAccount);



    res.status(201).json({
      message: 'Stock added to warehouse successfully',
      data: warehouseExists
    });
  } catch (error) {
    console.error("Error creating stock:", error.message);
    res.status(500).json({
      message: "Internal server error."
    });
  }
};


async function journal( wStock, customerAccount, purchaseAccount, depositAccounts ) {

    console.log('customeracc:',customerAccount);
    console.log('wStockdepositid:',wStock.depositAccountId);
    console.log('purchaseAccount:',purchaseAccount);
    console.log('depositacc:',depositAccounts);

    const sale = {
      operationId: wStock._id,
      transactionId: wStock.transferNumber,
      date: wStock.createdDate,
      accountId: purchaseAccount._id || undefined,
      action: "Sales Invoice",
      debitAmount: 0,
      creditAmount: wStock.totalAmount,
      remark: wStock.note,
    };

    const supplier = {
      operationId: wStock._id,
      transactionId: wStock.transferNumber,
      date: wStock.createdDate,
      accountId: customerAccount._id || undefined,
      action: "Sales Invoice",
      debitAmount: wStock.totalAmount || 0,
      creditAmount: 0,
      remark: wStock.note,
    };
    const supplierPaid = {
      operationId: wStock._id,
      transactionId: wStock.transferNumber,
      date: wStock.createdDate,
      accountId: customerAccount._id || undefined,
      action: "Receipt",
      debitAmount: 0,
      creditAmount: wStock.paidAmount || 0,
      remark: wStock.note,
    };
    let depositAccount

    if(depositAccounts){
       depositAccount = {
        operationId: wStock._id,
        transactionId: wStock.transferNumber,
        date: wStock.createdDate,
        accountId: depositAccounts._id || undefined,
        action: "Receipt",
        debitAmount: wStock.paidAmount || 0,
        creditAmount: 0,
        remark: wStock.note,
      };
    }

    // console.log("sale", sale.debitAmount,  sale.creditAmount);
    // console.log("supplier", supplier.debitAmount,  supplier.creditAmount);
    // console.log("supplierPaid", supplierPaid.debitAmount,  supplierPaid.creditAmount);
    // console.log("depositAccount", depositAccount.debitAmount,  depositAccount.creditAmount);

    // const  debitAmount =  sale.debitAmount  + supplier.debitAmount + supplierPaid.debitAmount +  depositAccount.debitAmount;
    // const  creditAmount = sale.creditAmount  + supplier.creditAmount + supplierPaid.creditAmount +  depositAccount.creditAmount ;

    // console.log("Total Debit Amount: ", debitAmount );
    // console.log("Total Credit Amount: ", creditAmount );

   
   
   
    const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
    const openingDate = generatedDateTime.dateTime;

    //credit

    if(order.paymentMode === 'Cash'){
      createTrialEntry( sale ,openingDate )
      createTrialEntry( supplier,openingDate )
        createTrialEntry( supplierPaid,openingDate )
        createTrialEntry( depositAccount,openingDate )
    }
if(order.paymentMode === 'Credit'){
  createTrialEntry( sale ,openingDate )
  createTrialEntry( supplier,openingDate )
  }
}
  
  
  
  
  
  
  // Get all stock entries
exports.getAllStock = async (req, res) => {
    try {
      const stocks = await WStock.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        data: stocks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
};


async function createTrialEntry(data) {
  const newTrialEntry = new TrialBalance({
    organizationId: data.organizationId,
    operationId: data.operationId,
    transactionId: data.transactionId,
    accountId: data.accountId,
    action: data.action,
    debitAmount: data.debitAmount,
    creditAmount: data.creditAmount,
    remark: data.remark,
  });
  const trial = await newTrialEntry.save();

  console.log("output:", trial);
}




















  //Clean Data 
function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === ""  ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
}