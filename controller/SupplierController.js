const Supplier = require('../Models/supplierSchema');
const Account = require('../Models/account');
const TrialBalance = require('../Models/trialBalance');

exports.createSupplier = async (req, res) => {
  console.log("Add Supplier:", req.body);
  try {
    const cleanedData = cleanCustomerData(req.body);
    console.log('cleaned data:', cleanedData);
    
    // Validate required fields
    if (!cleanedData.fullName) {
      return res.status(400).json({ message: 'Supplier Name is required.' });
    }

    // Check if email already exists
    if (cleanedData.vendorEmail) {
      const existingEmail = await Supplier.findOne({ vendorEmail: cleanedData.vendorEmail });
      if (existingEmail) {      
        return res.status(400).json({ message: 'A supplier with this email already exists.' });
      }
    }

    // Create new supplier
    const newSupplier = new Supplier({
      fullName: cleanedData.fullName,
      customerType: cleanedData.customerType,
      companyName: cleanedData.companyName,
      vendorWebsite: cleanedData.vendorWebsite,
      paymentTerms: cleanedData.paymentTerms,
      primaryContact: cleanedData.primaryContact,
      mobileNumber: cleanedData.mobileNumber,
      customerPhone: cleanedData.customerPhone,
      currency: cleanedData.currency || "AED",
      state: cleanedData.state,
      city: cleanedData.city,
      vendorEmail: cleanedData.vendorEmail,
      taxPreference: cleanedData.taxPreference,
      zipPostalCode: cleanedData.zipPostalCode,
      placeOfSupply: cleanedData.placeOfSupply,
      billingAddress: cleanedData.billingAddress,
      area: cleanedData.area,
      contactNumber: cleanedData.contactNumber,
    });

    const savedSupplier = await newSupplier.save();

    // Create a new account for the supplier
    const newAccount = new Account({
      accountName: savedSupplier.companyName,
      accountId: savedSupplier._id,
      accountSubhead: "Sundry Creditors",
      accountHead: "Liabilities",
      accountGroup: "Liability",
      description: "Suppliers",
    });

    const savedAccount = await newAccount.save();

    // Create trial balance entry
    const trialEntry = new TrialBalance({
      operationId: savedSupplier._id,
      date: savedSupplier.createdAt,
      accountId: savedAccount._id,
      accountName: savedAccount.accountName,
      action: "Opening Balance",
      creditAmount: 0,
      debitAmount: 0,
    });
    await trialEntry.save();
    
    return res.status(201).json({
      message: 'Supplier created successfully!',
      data: savedSupplier
    });
    
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ message: "Internal server error." });
  }
};



exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find(); // Fetch all suppliers
    return res.status(200).json({
      message: "Suppliers retrieved successfully!",
      data: suppliers
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update supplier by ID
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanedData = cleanCustomerData(req.body);

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, cleanedData, { new: true });

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    return res.status(200).json({
      message: "Supplier updated successfully!",
      data: updatedSupplier
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};



exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    // Optionally, delete related accounts and trial balance entries
    await Account.deleteOne({ accountId: id });
    await TrialBalance.deleteMany({ operationId: id });

    return res.status(200).json({ message: "Supplier deleted successfully!" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params; // Get supplier ID from request params

    const supplier = await Supplier.findById(id); // Find supplier by ID
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found." });
    }

    return res.status(200).json({
      message: "Supplier retrieved successfully!",
      data: supplier
    });
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};














//VALIDATION FUNCTIONS
function cleanCustomerData(data) {
  const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = cleanData(data[key]);
    return acc;
  }, {});
}