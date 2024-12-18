const Unload = require('../Models/UnloadedSchema');
const { updateWarehouseStock } = require('../controller/WarehouseController');
const Warehouse = require('../Models/WarehouseSchema');
const Item = require('../Models/ItemSchema'); 
 
// Function to add a new unload document
exports.addUnload = async (req, res) => {
  console.log("Unload Item:", req.body);
  try { 
    const cleanedData = cleanCustomerData(req.body);
    const { mainRoute, warehouseName, date, transferNumber, items, autoNotes, termsAndConditions } = cleanedData;


    
    // Check if the warehouse exists in the database
    const warehouseExists = await Warehouse.findOne({ warehouseName });
    if (!warehouseExists) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    // Validate items
    const validItems = await Promise.all(
      items.map(async (item) => {
        const foundItem = await Item.findById(item._id); // Use the imported Item model
        if (!foundItem) {
          throw new Error(`Item not found: ${item._id}`);
        }
        return {
          _id: foundItem._id, // Use the found _id
          quantity: item.quantity,
          rate: item.rate,
          itemName: foundItem.product,
          amount: item.amount,
        };
      })
    );

    const newUnload = new Unload({
      mainRoute,
      warehouseName,
      date,
      transferNumber,
      items: validItems, // Ensure this is an array of valid items
      autoNotes,
      termsAndConditions,
    });

    const savedUnload = await newUnload.save();
    console.log("Adding items", newUnload);

    // Update warehouse stock
    await updateWarehouseStock({ warehouseName, items: validItems });

    // Return the saved unload with status 201
    return res.status(201).json(savedUnload); // Removed the second parameter
  } catch (error) {
    console.error('Error adding unload:', error);
    res.status(500).json({ message: 'Failed to add unload', error: error.message });
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