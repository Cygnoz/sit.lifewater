const Item = require('../Models/ItemSchema'); 

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
    if (typeof cleanedData.category ==='undefined') {
      return res.status(400).json({ message: 'Select a Category' }); 
    }

    if (cleanedData.category !=='Resaleable' && cleanedData.category !=='Non-Resaleable') {
      return res.status(400).json({ message: 'Select a valid category' }); 
    }


    if (cleanedData.category ==='Resaleable') {
      cleanedData.status=["Filled", "Empty", "Bottle leak", "Damage Bottle cap", "Other Damage reason"]
    }

    //Sku check
    const existSku = await Item.findOne({sku});
    if (existSku) {
      return res.status(400).json({ message: 'SKU exists in records' });
    }

    const newItem = new Item({ ...cleanedData });


    const savedItem = await newItem.save();
    console.log("Item Saved Successfully",savedItem);
    
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ 
      message: 'Error adding item', 
      error: error.message 
    });
  }
};

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Find all items in the database
    res.status(200).json(items);
    console.log(items);
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve items', error: error.message });
  }
};


// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id); // Find the item by ID

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json(item); // Return the found item
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve item', error: error.message });
  }
};


// Update an item by ID
exports.updateItem = async (req, res) => {
  console.log("Edit Item:", req.body);
  try {
      // Destructure data from req.body and check for uploaded file
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
    if (typeof cleanedData.category ==='undefined') {
      return res.status(400).json({ message: 'Select a Category' }); 
    }

    if (cleanedData.category !=='Resaleable' && cleanedData.category !=='Non-Resaleable') {
      return res.status(400).json({ message: 'Select a valid category' }); 
    }

    if (cleanedData.category ==='Resaleable') {
      cleanedData.status=["Filled", "Empty", "Bottle leak", "Damage Bottle cap", "Other Damage reason"]
    }
    if (cleanedData.category ==='Non-Resaleable') {
      cleanedData.status = undefined;
    }

    //Sku check
    const existSku = await Item.findOne({sku});
    if (existSku) {
      return res.status(400).json({ message: 'SKU exists in records' });
    }


      //const itemImage = req.file ? req.file.path : null; // Get the file path if a file was uploaded
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, cleanedData, { new: true, runValidators: true });

     

      if (!updatedItem) {
          return res.status(404).json({ message: 'Item not found' });
      }

      return res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
      console.error("Error updating item:", error);
      return res.status(500).json({ message: error.message || 'An unexpected error occurred.' });
  }
};



// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id); // Find and delete the item

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
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