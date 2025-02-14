const Unload = require('../Models/UnloadedSchema');
const { updateWarehouseStock } = require('../controller/WarehouseController');
const Warehouse = require('../Models/WarehouseSchema');
const Item = require('../Models/ItemSchema');
const SubRoute = require('../Models/SubrouteSchema');


 
// Function to add a new unload document
exports.unloadStock = async (req, res) => {
  console.log("Unload Stock:", req.body);

  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.stock = (cleanedData.stock || [])
      .map(item => cleanCustomerData(item))
      .filter(item => item.itemId && item.itemId.trim() !== "" && item.quantity > 0);

    // Validate required fields
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

    // Validate item availability in the subroute stock
    for (const item of cleanedData.stock) {
      const subRouteItem = subRouteStock.find(stock => stock.itemId === item.itemId);

      if (!subRouteItem) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.itemName} is not available in the subroute`
        });
      }

      if (item.quantity > subRouteItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for item ${item.itemName}. Available: ${subRouteItem.quantity}, Requested: ${item.quantity}`
        });
      }
    }

    // Update subroute stock and decrement quantities
    for (const item of cleanedData.stock) {
      const subRouteItemIndex = subRouteStock.findIndex(stock => stock.itemId === item.itemId);

      if (subRouteItemIndex >= 0) {
        const subRouteItem = subRouteStock[subRouteItemIndex];

        // Decrement quantity in subroute
        subRouteItem.quantity -= item.quantity;

        // Remove the item from subroute stock if quantity becomes 0
        if (subRouteItem.quantity <= 0) {
          subRouteStock.splice(subRouteItemIndex, 1);
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

      // Add or update the item in the warehouse stock
      const warehouseItemIndex = warehouseStock.findIndex(stock => stock.itemId === item.itemId);

      const newStockItem = {
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        status: isResalable ? "Filled" : undefined // Set status based on resaleable property
      };

      if (warehouseItemIndex >= 0) {
        // If the item already exists in warehouse stock, update its quantity and status
        warehouseStock[warehouseItemIndex].quantity += item.quantity;
        warehouseStock[warehouseItemIndex].status = isResalable ? "Filled" : undefined;
      } else {
        // Add new item to the warehouse stock
        warehouseStock.push(newStockItem);
        console.log("New Stock Item Added to Warehouse:", newStockItem);
      }
    }

    // Save the updated subroute stock
    subRoute.stock = subRouteStock;
    await subRoute.save();

    console.log("Updated Subroute Stock:", subRouteStock);

    // Save the updated warehouse stock
    warehouse.stock = warehouseStock;
    await warehouse.save();

    console.log("Updated Warehouse Stock:", warehouseStock);

    // Create an unload record for the transfer
    const unload = new Unload({ ...cleanedData });
    await unload.save();

    console.log("Saved Unload Record:", unload);

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Stock unloaded successfully',
      data: unload
    });
  } catch (error) {
    console.error(error);

    // Send error response
    res.status(500).json({
      success: false,
      message: "An error occurred while unloading stock"
    });
  }
};



  
  // Function to get all unload documents
exports.getAllUnloads = async (req, res) => {
    try {
      const unloads = await Unload.find();
      res.status(200).json(unloads);
    } catch (error) {
      console.error('Error fetching unloads:', error);
      res.status(500).json({ message: 'Failed to fetch unloads', error });
    }
  };
  













  //Clean Data 
  function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }