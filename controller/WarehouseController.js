const WStock = require('../Models/WStockSchema');
const Warehouse = require('../Models/WarehouseSchema');


 




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

    // Check if the warehouse exists
    const warehouseExists = await Warehouse.findOne({ warehouseName: warehouse });
    if (warehouseExists) {
      return res.status(400).json({
        success: false,
        message: 'Warehouse with the name exist',
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






//Clean Data 
function cleanCustomerData(data) {
  const cleanData = (value) => (value === null || value === undefined || value === ""  ? undefined : value);
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = cleanData(data[key]);
    return acc;
  }, {});
}