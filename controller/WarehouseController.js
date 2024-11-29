const WStock = require('../Models/WStockSchema');
const Warehouse = require('../Models/WarehouseSchema');

// Create new stock entry
exports.createStock = async (req, res) => {
  console.log("Create Stock:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);
    cleanedData.items = cleanedData.items?.map(person => cleanCustomerData(person)) || [];
    const { warehouse, transferNumber, date, items, notes, termsAndConditions } = cleanedData;
    console.log("11",items);
    

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

    // console.log("Warehouse exists:", warehouseExists);

    // Add stock items to the warehouse's existing stock
    items.forEach(item => {
      const existingItemIndex = warehouseExists.stock.findIndex(stockItem => stockItem.itemId === item.itemName);

      if (existingItemIndex > -1) {
        // If the item already exists in the stock, update its quantity
        warehouseExists.stock[existingItemIndex].quantity += item.quantity;
      } else {
        // If the item does not exist in the stock, add it as a new stock entry
        warehouseExists.stock.push({
          itemId: item.itemName,
          quantity: item.quantity,
          status: item.resaleable ? "Filled" : undefined,
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

    res.status(201).json({
      success: true,
      message: 'Stock added to warehouse successfully',
      warehouse: warehouseExists,
    });
  } catch (error) {
    console.error("Error creating stock:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






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
 




// Function to add a new warehouse
exports.addWarehouse = async (req, res) => {
  console.log("Add Warehouse:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);
    const { warehouseName, contactNo, address } = cleanedData;

    // Validate required fields
    if (!warehouseName) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse Name required'
      });
    }
    if (!contactNo) {
      return res.status(400).json({
        success: false,
        message: 'Contact Number required'
      });
    }
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address required'
      });
    }

    if (warehouseName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse Name cannot exceed 50 characters'
      });
    }

    // Check if contactNo is a valid phone number (basic validation)
    // if (!/^\d{10}$/.test(contactNo)) { // Adjust regex based on your needs
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Contact Number must be a valid 10-digit number'
    //   });
    // }

    // Create new warehouse entry
    const warehouse = new Warehouse({ ...cleanedData });



    await warehouse.save();
    console.log("Warehouse Addded Successfully",warehouse);
    res.status(201).json({
      success: true,
      message: 'Warehouse created successfully',
      data: warehouse
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error adding warehouse:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the warehouse. Please try again.'
    });
  }
};


// Function to list all warehouses
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });

    res.status(200).json({ warehouses });
  } catch (error) {
    res.status(500).json({
      message:'Error fetching warehouses',error});
  }
};



// Function to delete an warehouse by ID
exports.deleteWarehouse = async (req, res) => {
  try {
    const deleteWarehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!deleteWarehouse) {
      return res.status(404).json({ message: 'warehouse not found' });
    }
    res.status(200).json({ message: 'warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting warehouse', error });
  }
};


// Function to update warehouse stock
const updateWarehouseStock = async ({ warehouseName, items }) => {
  try {
    console.log(`Updating stock for warehouse: ${warehouseName}`); // Debugging log

    // Find the warehouse document
    const warehouse = await Warehouse.findOne({ warehouseName });
    if (!warehouse) {
      console.error(`Warehouse not found: ${warehouseName}`);
      return { success: false, message: 'Warehouse not found' };
    }

    // Initialize stock if undefined
    if (!warehouse.stock) {
      warehouse.stock = [];
    }

    // Check if warehouse stock entry exists in WStock
    const wStock = await WStock.findOne({ warehouse: warehouseName });
    if (wStock) {
      // Update existing items or add new items
      items.forEach(item => {
        const existingItem = wStock.items.find(stockItem => stockItem.itemName === item.itemName);
        if (existingItem) {
          existingItem.quantity = Number(existingItem.quantity) + Number(item.quantity); // Ensure numeric addition
        } else {
          wStock.items.push({ itemName: item.itemName, quantity: Number(item.quantity) });
        }
      });
      await wStock.save();
      console.log(`Stock updated for warehouse in WStock: ${warehouseName}`);
    } else {
      // Insert a new document if the warehouse does not exist in WStock
      const newWStock = new WStock({
        warehouse: warehouseName,
        transferNumber: `TR-${Date.now()}`, // Generate a unique transfer number
        date: new Date(),
        items: items.map(item => ({
          itemName: item.itemName,
          quantity: Number(item.quantity)
        })),
        totalQuantity: items.reduce((sum, item) => sum + Number(item.quantity), 0),
        termsAndConditions: 'Default terms and conditions'
      });
      await newWStock.save();
      console.log(`New stock inserted for warehouse in WStock: ${warehouseName}`);
    }

    // Update the stock in the main Warehouse collection
    items.forEach(item => {
      const existingItem = warehouse.stock.find(stockItem => 
        stockItem.product === item.product && stockItem.itemName === item.itemName
      );
      if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity) + Number(item.quantity); // Ensure numeric addition
      } else {
        warehouse.stock.push({
          product: item.product,
          itemName: item.itemName,
          quantity: Number(item.quantity)
        });
      }
    });

    await warehouse.save();
    console.log(`Stock updated for warehouse: ${warehouseName}`);
    return { success: true, message: 'Stock updated successfully' };
  } catch (error) {
    console.error('Error updating warehouse stock:', error);
    throw error;
  }
};









//Clean Data 
function cleanCustomerData(data) {
  const cleanData = (value) => (value === null || value === undefined || value === "" || value === 0 ? undefined : value);
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = cleanData(data[key]);
    return acc;
  }, {});
}