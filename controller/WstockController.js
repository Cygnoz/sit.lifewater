const WStock = require('../Models/WStockSchema');
const Warehouse = require('../Models/WarehouseSchema');



// Add stock to warehouse
exports.createStock = async (req, res) => {
    console.log("Add Warehouse Stock:", req.body);
    try {
      const cleanedData = cleanCustomerData(req.body);
      cleanedData.stock = (cleanedData.stock || [])
        .map(item => cleanCustomerData(item)) 
        .filter(item => item.itemName && item.itemName.trim() !== "");
  
      const { warehouse, transferNumber, date, stock, notes, termsAndConditions } = cleanedData;
    //   console.log("cleanedData",cleanedData);
      
  
      // Validate required fields
      if (!transferNumber) {
        return res.status(400).json({
          success: false,
          message: 'Transfer Number required',
        });
      }
      if (!stock || !stock.length) {
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

      // Check for invalid item quantities
      const invalidItem = stock.find(item => item.quantity < 1);
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
  
      // console.log("Warehouse exists:", warehouseExists);
  
      // Add stock items to the warehouse's existing stock
      stock.forEach(item => {
        const existingItemIndex = warehouseExists.stock.findIndex(stockItem => stockItem.itemId === item.itemId);
  
        if (existingItemIndex > -1) {
          // If the item already exists in the stock, update its quantity
          warehouseExists.stock[existingItemIndex].quantity += item.quantity;
        } else {
          // If the item does not exist in the stock, add it as a new stock entry
          warehouseExists.stock.push({
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            costPrice:item.costPrice,
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





















  //Clean Data 
function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === ""  ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
}