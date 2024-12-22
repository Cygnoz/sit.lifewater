const StockLoad = require('../Models/StockloadedSchema');
const Transfer = require('../Models/TransferSchema');
const WStock = require('../Models/WStockSchema');
const SubRoute = require('../Models/SubrouteSchema');
const MainRoute = require('../Models/MainRouteSchema');
const Warehouse = require('../Models/WarehouseSchema');
const Item = require('../Models/ItemSchema');
const TransferLog = require('../Models/TransferSchema');





// exports.addStock = async (req, res) => {
//   console.log("Add Stock Load:", req.body);

//   try {
//     const cleanedData = cleanCustomerData(req.body);
//     cleanedData.stock = (cleanedData.stock || [])
//       .map(item => cleanCustomerData(item))
//       .filter(item => item.itemId && item.itemId.trim() !== "");

//     // Validate required fields
//     if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Main Route' });
//     }
//     if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Sub Route' });
//     }
//     if (!cleanedData.warehouseId || !cleanedData.warehouseName) {
//       return res.status(400).json({ success: false, message: 'Select a Warehouse' });
//     }
//     if (!cleanedData.transferNumber) {
//       return res.status(400).json({ success: false, message: 'Enter Transfer Number' });
//     }
//     if (!cleanedData.stock || cleanedData.stock.length === 0) {
//       return res.status(400).json({ success: false, message: 'Select an item' });
//     }

//     // Fetch the warehouse and subroute
//     const warehouse = await Warehouse.findById(cleanedData.warehouseId);
//     if (!warehouse) {
//       return res.status(404).json({ success: false, message: 'Warehouse not found' });
//     }
//     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
//     if (!subRoute) {
//       return res.status(404).json({ success: false, message: 'Sub Route not found' });
//     }

//     console.log('SubRoute Before Update:', subRoute);

//     const warehouseStock = warehouse.stock || [];
//     const subRouteStock = subRoute.stock || [];

//     // Validate item availability in the warehouse stock
//     for (const item of cleanedData.stock) {
//       const warehouseItem = warehouseStock.find(stock => stock.itemId === item.itemId);

//       if (!warehouseItem) {
//         return res.status(400).json({
//           success: false,
//           message: `Item ${item.itemName} is not available in the warehouse`
//         });
//       }

//       if (item.quantity > warehouseItem.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient quantity for item ${item.itemName}. Available: ${warehouseItem.quantity}, Requested: ${item.quantity}`
//         });
//       }
//     }

//     // Update warehouse stock and decrement quantities
//     for (const item of cleanedData.stock) {
//       const warehouseItemIndex = warehouseStock.findIndex(stock => stock.itemId === item.itemId);

//       if (warehouseItemIndex >= 0) {
//         const warehouseItem = warehouseStock[warehouseItemIndex];

//         // Decrement quantity in warehouse
//         warehouseItem.quantity -= item.quantity;

//         // Remove the item from warehouse stock if quantity becomes 0
//         if (warehouseItem.quantity <= 0) {
//           warehouseStock.splice(warehouseItemIndex, 1);
//         }
//       }

//       // Add or update the item in the subroute stock
//       const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//       if (subRouteItemIndex >= 0) {
//         // If the item already exists in subroute stock, update its quantity
//         subRouteStock[subRouteItemIndex].quantity += item.quantity;
//       } else {
//         // Add new item to the subroute stock
//         subRouteStock.push({
//           itemId: item.itemId,
//           itemName: item.itemName,
//           quantity: item.quantity,
//           status: item.resaleable ? "Filled" : undefined, // Optional field based on your requirement
//         });
//       }
//     }

//     // Save the updated warehouse stock
//     warehouse.stock = warehouseStock;
//     await warehouse.save();

//     // Save the updated subroute stock
//     subRoute.stock = subRouteStock;
//     await subRoute.save();

//     // Create a stock load record for the transfer
//     const stockLoad = new StockLoad({ ...cleanedData });
//     await stockLoad.save();

//     // Send success response
//     res.status(200).json({ success: true, message: 'Stock transferred successfully',data:stockLoad });

//   } catch (error) {
//     console.log(error);

//     // Send error response
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while transferring stock"
//     });
//   }
// };


// exports.addStock = async (req, res) => {
//   console.log("Add Stock Load:", req.body);

//   try {
//     const cleanedData = cleanCustomerData(req.body);
//     cleanedData.stock = (cleanedData.stock || [])
//       .map(item => ({
//         ...cleanCustomerData(item),
//         status: item.resaleable === "true" ? "Filled" : undefined // Ensure status is explicitly set
//       }))
//       .filter(item => item.itemId && item.itemId.trim() !== "");

//     // Validate required fields
//     if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Main Route' });
//     }
//     if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Sub Route' });
//     }
//     if (!cleanedData.warehouseId || !cleanedData.warehouseName) {
//       return res.status(400).json({ success: false, message: 'Select a Warehouse' });
//     }
//     if (!cleanedData.transferNumber) {
//       return res.status(400).json({ success: false, message: 'Enter Transfer Number' });
//     }
//     if (!cleanedData.stock || cleanedData.stock.length === 0) {
//       return res.status(400).json({ success: false, message: 'Select an item' });
//     }

//     // Fetch the warehouse and subroute
//     const warehouse = await Warehouse.findById(cleanedData.warehouseId);
//     if (!warehouse) {
//       return res.status(404).json({ success: false, message: 'Warehouse not found' });
//     }
//     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
//     if (!subRoute) {
//       return res.status(404).json({ success: false, message: 'Sub Route not found' });
//     }

//     console.log('SubRoute Before Update:', subRoute);

//     const warehouseStock = warehouse.stock || [];
//     const subRouteStock = subRoute.stock || [];

//     // Validate item availability in the warehouse stock
//     for (const item of cleanedData.stock) {
//       const warehouseItem = warehouseStock.find(stock => stock.itemId === item.itemId);

//       if (!warehouseItem) {
//         return res.status(400).json({
//           success: false,
//           message: `Item ${item.itemName} is not available in the warehouse`
//         });
//       }

//       if (item.quantity > warehouseItem.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient quantity for item ${item.itemName}. Available: ${warehouseItem.quantity}, Requested: ${item.quantity}`
//         });
//       }
//     }

//     // Update warehouse stock and decrement quantities
//     for (const item of cleanedData.stock) {
//       const warehouseItemIndex = warehouseStock.findIndex(stock => stock.itemId === item.itemId);

//       if (warehouseItemIndex >= 0) {
//         const warehouseItem = warehouseStock[warehouseItemIndex];

//         // Decrement quantity in warehouse
//         warehouseItem.quantity -= item.quantity;

//         // Remove the item from warehouse stock if quantity becomes 0
//         if (warehouseItem.quantity <= 0) {
//           warehouseStock.splice(warehouseItemIndex, 1);
//         }
//       }

//       // Add or update the item in the subroute stock
//       const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//       const newStockItem = {
//         itemId: item.itemId,
//         itemName: item.itemName,
//         quantity: item.quantity,
//         status: item.resaleable === "true" ? "Filled" : undefined // Ensure correct assignment
//       };

//       console.log("New Stock Item Before Save:", newStockItem);

//       if (subRouteItemIndex >= 0) {
//         // If the item already exists in subroute stock, update its quantity
//         subRouteStock[subRouteItemIndex].quantity += item.quantity;
//       } else {
//         // Add new item to the subroute stock
//         subRouteStock.push(newStockItem);
//         console.log(newStockItem);
        
//       }
//     }

//     // Save the updated warehouse stock
//     warehouse.stock = warehouseStock;
//     await warehouse.save();

//     // Save the updated subroute stock
//     subRoute.stock = subRouteStock;
//     await subRoute.save();

//     // Create a stock load record for the transfer
//     const stockLoad = new StockLoad({ ...cleanedData });
//     await stockLoad.save();

//     console.log("Saved StockLoad:", stockLoad);

//     // Send success response
//     res.status(200).json({
//       success: true,
//       message: 'Stock transferred successfully',
//       data: stockLoad
//     });
//   } catch (error) {
//     console.error(error);

//     // Send error response
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while transferring stock"
//     });
//   }
// };







// exports.addStock = async (req, res) => {
//   console.log("Add Stock Load:", req.body);

//   try {
//     const cleanedData = cleanCustomerData(req.body);
//     cleanedData.stock = (cleanedData.stock || [])
//       .map(item => cleanCustomerData(item))
//       .filter(item => item.itemId && item.itemId.trim() !== "");

//     // Validate required fields
//     if (!cleanedData.mainRouteId || !cleanedData.mainRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Main Route' });
//     }
//     if (!cleanedData.subRouteId || !cleanedData.subRouteName) {
//       return res.status(400).json({ success: false, message: 'Select Sub Route' });
//     }
//     if (!cleanedData.warehouseId || !cleanedData.warehouseName) {
//       return res.status(400).json({ success: false, message: 'Select a Warehouse' });
//     }
//     if (!cleanedData.transferNumber) {
//       return res.status(400).json({ success: false, message: 'Enter Transfer Number' });
//     }
//     if (!cleanedData.stock || cleanedData.stock.length === 0) {
//       return res.status(400).json({ success: false, message: 'Select an item' });
//     }

//     // Fetch the warehouse and subroute
//     const warehouse = await Warehouse.findById(cleanedData.warehouseId);
//     if (!warehouse) {
//       return res.status(404).json({ success: false, message: 'Warehouse not found' });
//     }
//     const subRoute = await SubRoute.findById(cleanedData.subRouteId);
//     if (!subRoute) {
//       return res.status(404).json({ success: false, message: 'Sub Route not found' });
//     }

//     console.log('SubRoute Before Update:', subRoute);

//     const warehouseStock = warehouse.stock || [];
//     const subRouteStock = subRoute.stock || [];

//     // Validate item availability in the warehouse stock
//     for (const item of cleanedData.stock) {
//       const warehouseItem = warehouseStock.find(stock => stock.itemId === item.itemId);

//       if (!warehouseItem) {
//         return res.status(400).json({
//           success: false,
//           message: `Item ${item.itemName} is not available in the warehouse`
//         });
//       }

//       if (item.quantity > warehouseItem.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient quantity for item ${item.itemName}. Available: ${warehouseItem.quantity}, Requested: ${item.quantity}`
//         });
//       }
//     }

//     // Update warehouse stock and decrement quantities
//     for (const item of cleanedData.stock) {
//       const warehouseItemIndex = warehouseStock.findIndex(stock => stock.itemId === item.itemId);

//       if (warehouseItemIndex >= 0) {
//         const warehouseItem = warehouseStock[warehouseItemIndex];

//         // Decrement quantity in warehouse
//         warehouseItem.quantity -= item.quantity;

//         // Remove the item from warehouse stock if quantity becomes 0
//         if (warehouseItem.quantity <= 0) {
//           warehouseStock.splice(warehouseItemIndex, 1);
//         }
//       }

//       // Fetch item details from the Item schema to check if it's resaleable
//       const itemDetails = await Item.findById(item.itemId);
//       if (!itemDetails) {
//         return res.status(404).json({ success: false, message: `Item ${item.itemName} not found in inventory` });
//       }

//       const isResalable = itemDetails.resalable;

//       // Add or update the item in the subroute stock
//       const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

//       const newStockItem = {
//         itemId: item.itemId,
//         itemName: item.itemName,
//         quantity: item.quantity,
//         status: isResalable ? "Filled" : undefined // Set status based on resaleable property
//       };

//       console.log("New Stock Item Before Save:", newStockItem);

//       if (subRouteItemIndex >= 0) {
//         // If the item already exists in subroute stock, update its quantity and status
//         subRouteStock[subRouteItemIndex].quantity += item.quantity;
//         subRouteStock[subRouteItemIndex].status = isResalable ? "Filled" : "Unfilled"; // Update status accordingly
//       } else {
//         // Add new item to the subroute stock
//         subRouteStock.push(newStockItem);
//         console.log(newStockItem);
//       }
//     }

//     // Save the updated warehouse stock
//     warehouse.stock = warehouseStock;
//     await warehouse.save();

//     console.log("Updated Warehouse Stock:", warehouseStock);

//     // Save the updated subroute stock
//     subRoute.stock = subRouteStock;
//     await subRoute.save();

//     console.log("Updated Subroute Stock:", subRouteStock);

//     // Create a stock load record for the transfer
//     const stockLoad = new StockLoad({ ...cleanedData });
//     await stockLoad.save();

//     console.log("Saved StockLoad:", stockLoad);

//     // Send success response
//     res.status(200).json({
//       success: true,
//       message: 'Stock transferred successfully',
//       data: stockLoad
//     });
//   } catch (error) {
//     console.error(error);

//     // Send error response
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while transferring stock"
//     });
//   }
// };















 
exports.addStock = async (req, res) => {
  console.log("Add Stock Load:", req.body);

  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.stock = (cleanedData.stock || [])
      .map(item => cleanCustomerData(item))
      .filter(item => item.itemId && item.itemId.trim() !== "" && item.quantity > 0);

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
      return res.status(400).json({
        success: false,
        message: 'Stock must contain valid items with quantity greater than 0'
      });
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

    console.log('SubRoute Before Update:', subRoute);

    const warehouseStock = warehouse.stock || [];
    const subRouteStock = subRoute.stock || [];

    // Validate item availability in the warehouse stock
    for (const item of cleanedData.stock) {
      const warehouseItem = warehouseStock.find(stock => stock.itemId === item.itemId);

      if (!warehouseItem) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.itemName} is not available in the warehouse`
        });
      }

      if (item.quantity > warehouseItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for item ${item.itemName}. Available: ${warehouseItem.quantity}, Requested: ${item.quantity}`
        });
      }
    }

    // Update warehouse stock and decrement quantities
    for (const item of cleanedData.stock) {
      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot process item ${item.itemName} with quantity 0 or less`
        });
      }

      const warehouseItemIndex = warehouseStock.findIndex(stock => stock.itemId === item.itemId);

      if (warehouseItemIndex >= 0) {
        const warehouseItem = warehouseStock[warehouseItemIndex];

        // Decrement quantity in warehouse
        warehouseItem.quantity -= item.quantity;

        // Remove the item from warehouse stock if quantity becomes 0
        if (warehouseItem.quantity <= 0) {
          warehouseStock.splice(warehouseItemIndex, 1);
        }
      }

      // Fetch item details from the Item schema to check if it's resaleable
      const itemDetails = await Item.findById(item.itemId);
      if (!itemDetails) {
        return res.status(404).json({ success: false, message: `Item ${item.itemName} not found in inventory` });
      }

      const isResalable = itemDetails.resaleable;

      console.log(`Item Details for ${item.itemName}:`, itemDetails);
      console.log(`Is ${item.itemName} Resalable:`, isResalable);

      // Add or update the item in the subroute stock
      const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

      const newStockItem = {
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        status: isResalable ? "Filled" : undefined // Set status based on resaleable property
      };

      if (subRouteItemIndex >= 0) {
        // If the item already exists in subroute stock, update its quantity and status
        subRouteStock[subRouteItemIndex].quantity += item.quantity;
        subRouteStock[subRouteItemIndex].status = isResalable ? "Filled" : undefined;
      } else {
        // Add new item to the subroute stock
        subRouteStock.push(newStockItem);
        console.log("New Stock Item Added:", newStockItem);
      }
    }

    // Save the updated warehouse stock
    warehouse.stock = warehouseStock;
    await warehouse.save();

    console.log("Updated Warehouse Stock:", warehouseStock);

    // Save the updated subroute stock
    subRoute.stock = subRouteStock;
    await subRoute.save();

    console.log("Updated Subroute Stock:", subRouteStock);

    // Create a stock load record for the transfer
    const stockLoad = new StockLoad({ ...cleanedData });
    await stockLoad.save();

    console.log("Saved StockLoad:", stockLoad);

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Stock transferred successfully',
      data: stockLoad
    });
  } catch (error) {
    console.error(error);

    // Send error response
    res.status(500).json({
      success: false,
      message: "An error occurred while transferring stock"
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
  console.log("Internal Transfer:", req.body);

  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.stock = (cleanedData.stock || [])
      .map(item => cleanCustomerData(item))
      .filter(item => item.itemId && item.itemId.trim() !== "" && item.quantity > 0);

    // Validate required fields
    if (!cleanedData.fromRouteId || !cleanedData.fromRoute) {
      return res.status(400).json({ success: false, message: 'Select Source Sub Route' });
    }
    if (!cleanedData.toRouteId || !cleanedData.toRoute) {
      return res.status(400).json({ success: false, message: 'Select Destination Sub Route' });
    }
    if (!cleanedData.stock || cleanedData.stock.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must contain valid items with quantity greater than 0'
      });
    }

    // Fetch the source and destination subroutes
    const fromRoute = await SubRoute.findById(cleanedData.fromRouteId);
    if (!fromRoute) {
      return res.status(404).json({ success: false, message: 'Source Sub Route not found' });
    }
    const toRoute = await SubRoute.findById(cleanedData.toRouteId);
    if (!toRoute) {
      return res.status(404).json({ success: false, message: 'Destination Sub Route not found' });
    }

    console.log('Source SubRoute Before Update:', fromRoute);
    console.log('Destination SubRoute Before Update:', toRoute);

    const fromRouteStock = fromRoute.stock || [];
    const toRouteStock = toRoute.stock || [];

    // Validate item availability in the source subroute stock
    for (const item of cleanedData.stock) {
      const sourceItem = fromRouteStock.find(stock => stock.itemId === item.itemId);

      if (!sourceItem) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.itemName} is not available in the source subroute`
        });
      }

      if (item.quantity > sourceItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for item ${item.itemName}. Available: ${sourceItem.quantity}, Requested: ${item.quantity}`
        });
      }
    }

    // Update source subroute stock and decrement quantities
    for (const item of cleanedData.stock) {
      if (item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot process item ${item.itemName} with quantity 0 or less`
        });
      }

      const sourceItemIndex = fromRouteStock.findIndex(stock => stock.itemId === item.itemId);

      if (sourceItemIndex >= 0) {
        const sourceItem = fromRouteStock[sourceItemIndex];

        // Decrement quantity in source subroute
        sourceItem.quantity -= item.quantity;

        // Remove the item from source stock if quantity becomes 0
        if (sourceItem.quantity <= 0) {
          fromRouteStock.splice(sourceItemIndex, 1);
        }
      }

      // Fetch item details from the Item schema to check if it's resaleable
      const itemDetails = await Item.findById(item.itemId);
      if (!itemDetails) {
        return res.status(404).json({ success: false, message: `Item ${item.itemName} not found in inventory` });
      }

      const isResalable = itemDetails.resaleable;

      // Add or update the item in the destination subroute stock
      const destinationItemIndex = toRouteStock.findIndex(stock => stock.itemId === item.itemId);

      const newStockItem = {
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        status: isResalable ? "Filled" : undefined // Set status based on resaleable property
      };

      if (destinationItemIndex >= 0) {
        // If the item already exists in destination subroute stock, update its quantity and status
        toRouteStock[destinationItemIndex].quantity += item.quantity;
        toRouteStock[destinationItemIndex].status = isResalable ? "Filled" : undefined;
      } else {
        // Add new item to the destination subroute stock
        toRouteStock.push(newStockItem);
        console.log("New Stock Item Added:", newStockItem);
      }
    }

    // Save the updated source subroute stock
    fromRoute.stock = fromRouteStock;
    await fromRoute.save();

    console.log("Updated Source Subroute Stock:", fromRouteStock);

    // Save the updated destination subroute stock
    toRoute.stock = toRouteStock;
    await toRoute.save();

    console.log("Updated Destination Subroute Stock:", toRouteStock);

    // Log the transfer with stock details
    const transferLog = new TransferLog({
      fromRoute: cleanedData.fromRoute,
      fromRouteId: cleanedData.fromRouteId,
      toRoute: cleanedData.toRoute,
      toRouteId: cleanedData.toRouteId,
      filledBottlesTransferred: cleanedData.stock.reduce((sum, item) => sum + item.quantity, 0),
      stock: cleanedData.stock, // Include transferred stock details
      transferNumber: cleanedData.transferNumber, // Save transfer number
      notes: cleanedData.notes,
      termsAndConditions: cleanedData.termsAndConditions
    });
    await transferLog.save();

    console.log("Saved TransferLog:", transferLog);

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Internal transfer completed successfully',
      data: transferLog
    });
  } catch (error) {
    console.error(error);

    // Send error response
    res.status(500).json({
      success: false,
      message: "An error occurred during the internal transfer"
    });
  }
};





// const updateWarehouseStock = async ({ warehouseName, items }) => {
//   try {
//     // Find warehouse
//     const warehouse = await WarehouseStock.findOne({ warehouse: warehouseName });
    
//     if (!warehouse) {
//       console.error(`Warehouse not found....: ${warehouseName}`);
//       return { success: false, message: 'Warehouse not found' };
//     }

//     // Check and update each item
//     for (const item of items) {
//       const existingItem = warehouse.items.find(
//         stockItem => stockItem.itemName === item.itemName
//       );

//       if (!existingItem) {
//         return { 
//           success: false, 
//           message: `Item ${item.itemName} not found in warehouse stock` 
//         };
//       }
//     console.log(existingItem.itemName,existingItem.quantity);

//       if (existingItem.quantity < item.quantity) {
//         return { 
//           success: false, 
//           message: `Insufficient stock for ${item.itemName}. Available: ${existingItem.quantity}, Requested: ${item.quantity}` 
//         };
//       }

//       // Reduce the quantity
//       existingItem.quantity -= item.quantity;
//     }

//     // Update total quantity
//     // warehouse.totalQuantity = warehouse.items.reduce(
//     //   (sum, item) => sum + item.quantity, 
//     //   0
//     // );

//     // Save changes
//     await warehouse.save();
//     console.log(`Stock updated for warehouse: ${warehouseName}`);
    
//     return {
//       success: true,
//       message: 'Stock updated successfully',
//       data: warehouse
//     };

//   } catch (error) {
//     console.error('Error updating warehouse stock:', error);
//     throw error;
//   }
// };

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