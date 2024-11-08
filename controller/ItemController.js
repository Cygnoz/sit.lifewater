const Item = require('../Models/ItemSchema'); // Assuming you have an Item schema

// Create a new item
const addItem = async (req, res) => {
  try {
    const newItem = new Item({
      itemName: req.body.itemName,
      SKU: req.body.SKU,
      purchasePrice: req.body.purchasePrice,
      retailPrice: req.body.retailPrice,
      description: req.body.description,
      itemImage: req.file ? req.file.path : null // Handle file upload
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item', error });
  }
};

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find(); // Find all items in the database
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve items', error: error.message });
  }
};
// Get a single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id); // Find the item by ID

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json(item); // Return the found item
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve item', error: error.message });
  }
};

// Update an item by ID

const updateItem = async (req, res) => {
  try {
      // Destructure data from req.body and check for uploaded file
      const { itemName, SKU, purchasePrice, retailPrice, description } = req.body;
      const itemImage = req.file ? req.file.path : null; // Get the file path if a file was uploaded

      const updatedItem = await Item.findByIdAndUpdate(
          req.params.id,
          { itemName, SKU, purchasePrice, retailPrice, description, itemImage },
          { new: true, runValidators: true } // Returns the updated document
      );

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
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id); // Find and delete the item

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

// Export all controllers as an object
module.exports = {
  addItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
};
