const WStock = require("../Models/WStockSchema")
const Warehouse = require("../Models/WarehouseSchema")
const Account = require("../Models/account")
const TrialBalance = require("../Models/trialBalance")
const moment = require("moment-timezone");



const dataExist = async (supplierId, paidThroughAccountId) => {
  const [supplierAccount, purchaseAccount, paidThroughAccount] = await Promise.all([Account.findOne({ accountId: supplierId }), Account.findOne({ accountName: "Cost of Goods Sold" }), Account.findOne({ _id: paidThroughAccountId })])
  return { supplierAccount, purchaseAccount, paidThroughAccount }
}

// Add stock to warehouse
exports.createStock = async (req, res) => {
  console.log("Add Warehouse Stock:", req.body)
  try {
    const cleanedData = cleanCustomerData(req.body)
    cleanedData.items = (cleanedData.items || []).map((item) => cleanCustomerData(item)).filter((item) => item.itemName && item.itemName.trim() !== "")

    const { warehouse, transferNumber, items } = cleanedData
    console.log("cleanedData", cleanedData)

    // Validate required fields
    if (!transferNumber) {
      return res.status(400).json({
        success: false,
        message: "Transfer Number required",
      })
    }
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Select an item",
      })
    }
    if (!warehouse) {
      return res.status(400).json({
        success: false,
        message: "Select a warehouse",
      })
    }

    const { supplierAccount, purchaseAccount, paidThroughAccount } = await dataExist(cleanedData.supplierId, cleanedData.paidThroughAccountId)

    if (!supplierAccount) {
      return res.status(404).json({ message: "Supplier Account not found" })
    }

    if (cleanedData.paidAmount > cleanedData.totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Paid amount cannot be greater than total amount",
      })
    }

    // Check for invalid item quantities
    const invalidItem = items.find((item) => item.quantity < 1)
    if (invalidItem) {
      return res.status(400).json({
        success: false,
        message: `Item '${invalidItem.itemName}' has an invalid quantity of ${invalidItem.quantity}. Quantity must be at least 1.`,
      })
    }

    // Check for duplicate transferNumber
    const existingStock = await WStock.findOne({ transferNumber })
    if (existingStock) {
      console.log(`Stock with transfer number ${transferNumber} already exists.`)
      return res.status(400).json({
        success: false,
        message: `Stock with transfer number ${transferNumber} already exists.`,
      })
    }

    // Check if the warehouse exists
    const warehouseExists = await Warehouse.findOne({ warehouseName: warehouse })
    if (!warehouseExists) {
      return res.status(400).json({
        success: false,
        message: "Warehouse not found",
      })
    }

    console.log("Warehouse exists:", warehouseExists)

    // Add stock items to the warehouse's existing stock
    items.forEach((item) => {
      const existingItemIndex = warehouseExists.stock.findIndex((stockItem) => stockItem.itemId === item.itemId)

      if (existingItemIndex > -1) {
        // If the item already exists in the stock, update its quantity and other fields
        warehouseExists.stock[existingItemIndex].quantity += item.quantity
        warehouseExists.stock[existingItemIndex].costPrice = item.costPrice
        warehouseExists.stock[existingItemIndex].amount = warehouseExists.stock[existingItemIndex].quantity * item.sellingPrice
        warehouseExists.stock[existingItemIndex].status = item.resaleable ? "Filled" : undefined
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
          sellingPrice: item.sellingPrice,
        })
      }
    })

    // Save the updated warehouse document
    await warehouseExists.save()
    console.log("Warehouse updated with new stock:", warehouseExists)

    // Create a new warehouse stock record (if required separately)
    const wStock = new WStock({ ...cleanedData })
    await wStock.save()
    console.log("Stock record created:", wStock)

    await journal(wStock, supplierAccount, purchaseAccount, paidThroughAccount)

    res.status(201).json({
      message: "Stock added to warehouse successfully",
      data: warehouseExists,
    })
  } catch (error) {
    console.error("Error creating stock:", error.message)
    res.status(500).json({
      message: "Internal server error.",
    })
  }
}




// Get all stock entries
exports.getAllStock = async (req, res) => {
  try {
    const stocks = await WStock.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: stocks,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}



//viewoneWarehouseStock
exports.getOneWStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await WStock.findById(id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//deleteWarehouseStock
exports.deleteWStock = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the stock entry to be deleted
    const stock = await WStock.findById(id);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }

    // Find the associated warehouse
    const warehouse = await Warehouse.findOne({ warehouseName: stock.warehouse });
    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Warehouse not found",
      });
    }

    // Remove the stock items from the warehouse stock
    stock.items.forEach((item) => {
      const existingItemIndex = warehouse.stock.findIndex((stockItem) => stockItem.itemId === item.itemId);

      if (existingItemIndex > -1) {
        if (warehouse.stock[existingItemIndex].quantity > item.quantity) {
          // Reduce the quantity if more remains
          warehouse.stock[existingItemIndex].quantity -= item.quantity;
          warehouse.stock[existingItemIndex].amount = warehouse.stock[existingItemIndex].quantity * warehouse.stock[existingItemIndex].sellingPrice;
        } else {
          // Remove the item completely if quantity matches or is less
          warehouse.stock.splice(existingItemIndex, 1);
        }
      }
    });

    // Save the updated warehouse document
    await warehouse.save();
    console.log("Warehouse stock updated after deletion:", warehouse);

    // Delete associated trial entries
    const existingJournal = await TrialBalance.find({ operationId: stock._id });
    if (existingJournal.length) {
      await TrialBalance.deleteMany({ operationId: stock._id });
      console.log(`Deleted existing Journal entries for operationId: ${stock._id}`);
    }

    // Delete the stock entry from WStock
    await WStock.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Stock and associated trial entries deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting stock:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};










async function journal(wStock, supplierAccount, purchaseAccount, paidThroughAccount) {
  console.log("supplierAccount:", supplierAccount)
  console.log("paidthroughAcc:", paidThroughAccount)
  console.log("wStock:", wStock)
  console.log("purchaseAccount:", purchaseAccount)

  const purchase = {
    operationId: wStock._id,
    transactionId: wStock.transferNumber,
    date: wStock.createdDate,
    accountId: purchaseAccount._id || undefined,
    action: "Purchase Bill",
    debitAmount: wStock.totalAmount || 0,
    creditAmount: 0,
    remark: wStock.note,
  }

  const supplier = {
    operationId: wStock._id,
    transactionId: wStock.transferNumber,
    date: wStock.createdDate,
    accountId: supplierAccount._id || undefined,
    action: "Purchase Bill",
    debitAmount: 0,
    creditAmount: wStock.totalAmount || 0,
    remark: wStock.note,
  }
  const supplierPaid = {
    operationId: wStock._id,
    transactionId: wStock.transferNumber,
    date: wStock.createdDate,
    accountId: supplierAccount._id || undefined,
    action: "Payment",
    debitAmount: wStock.paidAmount || 0,
    creditAmount: 0,
    remark: wStock.note,
  }

  let paidThroughAccounts

  if (paidThroughAccount) {
    paidThroughAccounts = {
      operationId: wStock._id,
      transactionId: wStock.transferNumber,
      date: wStock.createdDate,
      accountId: paidThroughAccount._id || undefined,
      action: "Payment",
      debitAmount: 0,
      creditAmount: wStock.paidAmount || 0,
      remark: wStock.note,
    }
  }



  const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai", "DD/MM/YY", "/")
  const openingDate = generatedDateTime.dateTime

  //credit

if (wStock.paymentMode === "Cash") {
  createTrialEntry(purchase, openingDate); // Ensure purchase entry is made
  createTrialEntry(supplier, openingDate);
  createTrialEntry(supplierPaid, openingDate);
  if (paidThroughAccounts) {
    createTrialEntry(paidThroughAccounts, openingDate); // Ensure paidThroughAccount is recorded
  }
}

if (wStock.paymentMode === "Credit") {
  createTrialEntry(purchase, openingDate); // Ensure purchase entry is made
  createTrialEntry(supplier, openingDate);
}
}

function generateTimeAndDateForDB(timeZone, dateFormat, dateSplit, baseTime = new Date(), timeFormat = "HH:mm:ss", timeSplit = ":") {
  // Convert the base time to the desired time zone
  const localDate = moment.tz(baseTime, timeZone)

  // Format date and time according to the specified formats
  let formattedDate = localDate.format(dateFormat)

  // Handle date split if specified
  if (dateSplit) {
    // Replace default split characters with specified split characters
    formattedDate = formattedDate.replace(/[-/]/g, dateSplit) // Adjust regex based on your date format separators
  }

  const formattedTime = localDate.format(timeFormat)
  const timeZoneName = localDate.format("z") // Get time zone abbreviation

  // Combine the formatted date and time with the split characters and time zone
  const dateTime = `${formattedDate} ${formattedTime.split(":").join(timeSplit)}`

  return {
    date: formattedDate,
    time: `${formattedTime} (${timeZoneName})`,
    dateTime: dateTime,
  }
}



async function createTrialEntry(data, openingDate) {
  const newTrialEntry = new TrialBalance({
    organizationId: data.organizationId,
    operationId: data.operationId,
    createDateTime: openingDate,
    transactionId: data.transactionId,
    accountId: data.accountId,
    action: data.action,
    debitAmount: data.debitAmount,
    creditAmount: data.creditAmount,
    remark: data.remark,
  })
  const trial = await newTrialEntry.save()

  console.log("output:", trial)
}

//Clean Data
function cleanCustomerData(data) {
  const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value)
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = cleanData(data[key])
    return acc
  }, {})
}
