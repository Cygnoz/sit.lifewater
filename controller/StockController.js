const StockLoad = require('../Models/StockloadedSchema');
const Transfer = require('../Models/TransferSchema');
const WStock = require('../Models/WStockSchema');
const SubRoute = require('../Models/SubrouteSchema');
const MainRoute = require('../Models/MainRouteSchema');
const Warehouse = require('../Models/WarehouseSchema');


//Load Stock from warehouse to subroute 
exports.addStock = async (req, res) => {
  console.log("Add Stock Load:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.stock = (cleanedData.stock || [])
        .map(item => cleanCustomerData(item)) 
        .filter(item => item.itemId && item.itemId.trim() !== "");

    // Validate required fields
    if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
      return res.status(400).json({ success: false, message: 'Select Main Route' });
    }
    if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
      return res.status(400).json({ success: false, message: 'Select Sub Route' });
    }
    if (!cleanedData.warehouseId || !cleanedData.warehouseName) {
      return res.status(400).json({ success: false, message: 'Select a Warehouse' });
    }
    if (!cleanedData.transferNumber) {
      return res.status(400).json({ success: false, message: 'Enter Transfer Number' });
    }
    if (!cleanedData.stock || cleanedData.stock.length === 0) {
      return res.status(400).json({ success: false, message: 'Select an item' });
    }


     // Fetch the warehouse and subroute
     const warehouse = await Warehouse.findById(cleanedData.warehouseId);
     if (!warehouse) {
       return res.status(404).json({ success: false, message: 'Warehouse not found' });
     }
     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
    if (!subRoute) {
      return res.status(404).json({ success: false, message: 'Sub Route not found' });
    }
     

     for (const item of cleanedData.stock) {
      const warehouseItem = warehouse.stock.find(stock => stock.itemId === item.itemId);

      if (!warehouseItem) {
        return res.status(400).json({ 
          success: false, 
          message: `Item ${item.itemName} is not available in the warehouse` 
        });
      }

      if (item.quantity > warehouseItem.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient quantity for item ${item.itemName}` 
        });
      }
    }

    // Update warehouse stock
    for (const item of cleanedData.stock) {
      const warehouseItemIndex = warehouse.stock.findIndex(stock => stock.itemId === item.itemId);

      if (warehouseItemIndex >= 0) {
        const warehouseItem = warehouse.stock[warehouseItemIndex];

        // Reduce the quantity
        warehouseItem.quantity -= item.quantity;

        // If quantity becomes 0, remove the item
        if (warehouseItem.quantity === 0) {
          warehouse.stock.splice(warehouseItemIndex, 1);
        }
      }
    }

    // Save the updated warehouse
    await warehouse.save();

    // Add stock to the subroute
    for (const item of cleanedData.stock) {
      const subRouteItem = subRoute.stock.find(stock => stock.itemId === item.itemId);

      if (subRouteItem) {
        // Update quantity if item already exists
        subRouteItem.quantity += item.quantity;
      } else {
        // Add new item to the stock
        subRoute.stock.push({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          status: item.resaleable ? "Filled" : undefined,
        });
      }
    }

    // Save the updated subroute
    await subRoute.save();     

    const stockLoad = new StockLoad({ ...cleanedData });
    await stockLoad.save();    
   
    res.status(200).json({ success: true, message: 'Stock transferred successfully' });   

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "iyyane preshnam"  
    
    });
  }
};




exports.getAllStock = async (req, res) => {
  try {
    const stocks = await StockLoad.find().sort({ date: -1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getStockStats = async (req, res) => {
  try {
    const totalStockLoad = await StockLoad.aggregate([
      {
        $group: {
          _id: {
            mainRoute: "$mainRoute",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
          },
          totalFilledBottles: { $sum: "$filledBottles" },
          totalEmptyBottles: { $sum: "$emptyBottles" }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ]);

    const result = totalStockLoad.map(item => ({
      route: item._id.mainRoute,
      date: item._id.date,
      totalFilledBottles: item.totalFilledBottles,
      totalEmptyBottles: item.totalEmptyBottles
    }));

    res.json({
      success: true,
      data: result
    }); 
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.internalTransfer = async (req, res) => {
  const { fromTransferNumber, toTransferNumber, filledBottles } = req.body;

  try {
    const fromStock = await StockLoad.findOne({ transferNumber: fromTransferNumber });
    if (!fromStock) {
      return res.status(404).json({ 
        success: false,
        message: 'From transfer number not found' 
      });
    }

    const toStock = await StockLoad.findOne({ transferNumber: toTransferNumber });
    if (!toStock) {
      return res.status(404).json({ 
        success: false,
        message: 'To transfer number not found' 
      });
    }

    if (fromStock.filledBottles < filledBottles) {
      return res.status(400).json({ 
        success: false,
        message: `Not enough filled bottles in transfer number ${fromTransferNumber} to transfer` 
      });
    }

    if (toStock.emptyBottles < filledBottles) {
      return res.status(400).json({ 
        success: false,
        message: `Not enough empty bottles in transfer number ${toTransferNumber} to return` 
      });
    }

    fromStock.filledBottles -= filledBottles;
    fromStock.emptyBottles += filledBottles;
    toStock.filledBottles += filledBottles;
    toStock.emptyBottles -= filledBottles;

    await fromStock.save();
    await toStock.save();

    const transferLog = new Transfer({
      fromRoute: fromStock.mainRoute,
      toRoute: toStock.mainRoute,
      filledBottlesTransferred: filledBottles,
      emptyBottlesReturned: filledBottles
    });
    await transferLog.save();

    res.status(200).json({ 
      success: true,
      message: 'Internal transfer completed successfully' 
    });
  } catch (error) {
    console.error('Error performing internal transfer:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const updateWarehouseStock = async ({ warehouseName, items }) => {
  try {
    // Find warehouse
    const warehouse = await WarehouseStock.findOne({ warehouse: warehouseName });
    
    if (!warehouse) {
      console.error(`Warehouse not found....: ${warehouseName}`);
      return { success: false, message: 'Warehouse not found' };
    }

    // Check and update each item
    for (const item of items) {
      const existingItem = warehouse.items.find(
        stockItem => stockItem.itemName === item.itemName
      );

      if (!existingItem) {
        return { 
          success: false, 
          message: `Item ${item.itemName} not found in warehouse stock` 
        };
      }
    console.log(existingItem.itemName,existingItem.quantity);

      if (existingItem.quantity < item.quantity) {
        return { 
          success: false, 
          message: `Insufficient stock for ${item.itemName}. Available: ${existingItem.quantity}, Requested: ${item.quantity}` 
        };
      }

      // Reduce the quantity
      existingItem.quantity -= item.quantity;
    }

    // Update total quantity
    // warehouse.totalQuantity = warehouse.items.reduce(
    //   (sum, item) => sum + item.quantity, 
    //   0
    // );

    // Save changes
    await warehouse.save();
    console.log(`Stock updated for warehouse: ${warehouseName}`);
    
    return {
      success: true,
      message: 'Stock updated successfully',
      data: warehouse
    };

  } catch (error) {
    console.error('Error updating warehouse stock:', error);
    throw error;
  }
};

// Function to update warehouse stock
// const updateWarehouseStock = async ({ warehouseName, items }) => {
//   try {
//     console.log(`Updating stock for warehouse: ${warehouseName}`); // Debugging log
//     const warehouse = await WarehouseStock.findOne({ warehouseName });
//     if (!warehouse) {
//       console.error(`Warehouse not found: ${warehouseName}`); // Debugging log
//       return { success: false, message: 'Warehouse not found' };
//     }

//     // Ensure stock field is initialized
//     if (!warehouse.stock) {
//       warehouse.stock = [];
//     }

//     // Check if warehouse exists in WStock
//     const wStock = await WarehouseStock.findOne({ warehouse: warehouseName });
//     if (wStock) {
//       // Warehouse exists, update existing items
//       items.forEach(item => {
//         const existingItem = wStock.items.find(stockItem => stockItem.itemName === item.itemName);
//         if (existingItem) {
//           existingItem.quantity -= item.quantity;
//         } else {
//             return { success: false, message: `Item ${item.itemName} not found in warehouse stock` };
//         }
//       });
//       await wStock.save();
//       console.log(`Stock updated for warehouse in WStock: ${warehouseName}`); // Debugging log
//     } else {
//       // Warehouse does not exist, insert new document
//       const newWStock = new WarehouseStock({
//         warehouse: warehouseName,
//         transferNumber: `TR-${Date.now()}`, // Generate a unique transfer number
//         date: new Date(),
//         items: items.map(item => ({
//           itemName: item.itemName,
//           quantity: item.quantity
//         })),
//         totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
//         termsAndConditions: 'Default terms and conditions' // You can customize this as needed
//       });
//       await newWStock.save();
//       console.log(`New stock inserted for warehouse in WStock: ${warehouseName}`); // Debugging log
//     }

//     // Update warehouse stock in Warehouse collection
//     items.forEach(item => {
//       const existingItem = warehouse.stock.find(stockItem => stockItem.product === item.product && stockItem.itemName === item.itemName);
//       if (existingItem) {
//         existingItem.quantity += item.quantity;
//       } else {
//         warehouse.stock.push({ product: item.product, itemName: item.itemName, quantity: item.quantity });
//       }
//     });

//     await warehouse.save();
//     console.log(`Stock updated for warehouse: ${warehouseName}`); // Debugging log
//   } catch (error) {
//     console.error('Error updating warehouse stock:', error);
//     throw error;
//   }
// };















  //Clean Data 
  function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }