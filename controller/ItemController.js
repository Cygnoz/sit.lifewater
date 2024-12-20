const Item = require('../Models/ItemSchema'); 
const Warehouse = require('../Models/WarehouseSchema');

// Create a new item
exports.addItem = async (req, res) => {
  console.log("Add Item:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);
    const { sku }=cleanedData;

    //Required check
    if ( typeof cleanedData.itemName ==='undefined' ) {
      return res.status(400).json({ message: 'Item Name Required ' });
    } 
    if ( typeof cleanedData.sku ==='undefined') {
      return res.status(400).json({ message: 'SKU Required' });
    }
    if (typeof cleanedData.costPrice ==='undefined') {
      return res.status(400).json({ message: 'Cost Price Required' });
    }
    if (typeof cleanedData.sellingPrice ==='undefined') {
      return res.status(400).json({ message: 'Selling Price Required' });
    }

    //Sku check
    const existSku = await Item.findOne({sku});
    if (existSku) {
      return res.status(400).json({ message: 'SKU exists in records' });
    }

    // If `default` is true, update other items' `default` field to false
    if (cleanedData.resaleable === true) {
      await Item.updateMany({ resaleable: true }, { resaleable: false });
    }

    const newItem = new Item({ ...cleanedData });


    const savedItem = await newItem.save();
    console.log("Item Saved Successfully",savedItem);

    res.status(200).json({ 
      message: 'Item added successfully',
      data: savedItem,
    });
    
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ 
      message: "Internal server error."
    });
  }
};




// Update an item by ID
exports.updateItem = async (req, res) => {
  console.log("Edit Item:", req.body);
  try {
      const { id } = req.params;
      const cleanedData = cleanCustomerData(req.body);
      const { sku } = req.body;

      //Required check
    if ( typeof cleanedData.itemName ==='undefined' ) {
      return res.status(400).json({ message: 'Item Name Required ' });
    }
    if ( typeof cleanedData.sku ==='undefined') {
      return res.status(400).json({ message: 'SKU Required' });
    }
    if (typeof cleanedData.costPrice ==='undefined') {
      return res.status(400).json({ message: 'Cost Price Required' });
    }
    if (typeof cleanedData.sellingPrice ==='undefined') {
      return res.status(400).json({ message: 'Selling Price Required' });
    }
    

    //Sku check
    const existSku = await Item.findOne({sku,_id: { $ne: id }});
    if (existSku) {
      return res.status(400).json({ message: 'SKU exists in records' });
    }

    // If `default` is true, update other items' `default` field to false
    if (cleanedData.resaleable === true) {
      await Item.updateMany({ resaleable: true }, { resaleable: false });
    }

      const updatedItem = await Item.findByIdAndUpdate(req.params.id, cleanedData, { new: true, runValidators: true });

      if (!updatedItem) {
          return res.status(404).json({ message: 'Item not found' });
      }

      res.status(200).json({ message: 'Item updated successfully', data: updatedItem });
  } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};



// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id); // Find and delete the item

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};



// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Find all items in the database
    res.status(200).json(items);
    
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};


// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    // Find the item by ID
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Fetch warehouses containing the item in stock
    const warehouses = await Warehouse.find({ "stock.itemId": req.params.id });

    // Calculate the total quantity of the item across all warehouses
    const totalQuantity = warehouses.reduce((sum, warehouse) => {
      const itemStock = warehouse.stock.find(stock => stock.itemId === req.params.id);
      return sum + (itemStock ? itemStock.quantity : 0);
    }, 0);

    // Prepare the response
    res.status(200).json({
      item: item,
      totalQuantity: totalQuantity,
      warehouses: warehouses.map(warehouse => ({
        warehouseId: warehouse._id,
        warehouseName: warehouse.warehouseName,
        stock: warehouse.stock.filter(stock => stock.itemId === req.params.id),
      })),
    });
  } catch (error) {
    console.error('Error fetching item details:', error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
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