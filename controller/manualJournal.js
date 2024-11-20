

const Journal = require("../Models/journal");
const Account = require("../Models/account")
const TrialBalance = require("../Models/trialBalance");
const moment = require('moment-timezone');



// Add Journal Entry
exports.addJournalEntry = async (req, res) => {
    console.log("Add journal Entry:", req.body);
    try {

        //Clean Data
        const cleanedData = cleanCustomerData(req.body);
        cleanedData.transaction = cleanedData.transaction?.map(acc => cleanCustomerData(acc)) || [];

        const { transaction, journalId } = cleanedData;

        const transactionIds = transaction.map(item => item.accountId);
        
        // Check for duplicate itemIds
        const uniqueItemIds = new Set(transactionIds);
        if (uniqueItemIds.size !== transactionIds.length) {            
          return res.status(400).json({ message: "Duplicate Accounts found" });
        }

        const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
        const entryDate = generatedDateTime.dateTime; 

        const existingJournalId = await Journal.find({ journalId: journalId });

          if (existingJournalId.length > 0) {
              return res.status(409).json({
                  message: "Journal ID is already present in records!"
              });
          }

        
  

        // Check if all accounts exist for the given organization
        const allAccountIds = transaction.map(trans => trans.accountId);
        const existingAccounts = await Account.find({
            _id: { $in: allAccountIds }            
        });

        if (existingAccounts.length !== allAccountIds.length) {
            return res.status(404).json({
                message: "One or more accounts not found for the given organization."
            });
        }

        //Validate Inputs  
        if (!validateInputs(cleanedData, res)) return;


        

        // Create a new journal entry
        const newJournalEntry = new Journal({ ...cleanedData, entryDate });


        
        const entry = await newJournalEntry.save();
        console.log("Journal entry",entry);

        

        // Insert data into TrialBalance collection and update account balances
        for (const trans of transaction) {
            const newTrialEntry = new TrialBalance({
                operationId:newJournalEntry._id,
                date:entryDate,
                accountId: trans.accountId,
                accountName: trans.accountName,
                action: "Journal",
                debitAmount: trans.debitAmount,
                creditAmount: trans.creditAmount,
                remark: cleanedData.note
            });

            const entry = await newTrialEntry.save();
            console.log("Trial entry",entry);

            
        }

        res.status(201).json({
            message: "Journal entry created successfully."
        });
        console.log("Journal entry created successfully:", newJournalEntry);
    } catch (error) {
        console.error("Error creating journal entry:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



// Get all Journal for a given 
exports.getAllJournal = async (req, res) => {
    try {

        // Find all accounts where  matches
        const journal = await Journal.find();

        if (!journal.length) {
            return res.status(404).json({
                message: "No Journal found for the provided organization ID.",
            });
        }

        res.status(200).json(journal);
    } catch (error) {
        console.error("Error fetching journals:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get one Journal by ID for a given 
exports.getOneJournal = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the journal where id and  matches
        const journal = await Journal.findOne({ _id: id });
        
        if (!journal) {
            return res.status(404).json({
                message: "Journal not found for the provided ID and organization ID.",
            });
        }

        res.status(200).json(journal);
    } catch (error) {
        console.error("Error fetching journal:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};












// Function to generate time and date for storing in the database
function generateTimeAndDateForDB(timeZone, dateFormat, dateSplit, baseTime = new Date(), timeFormat = 'HH:mm:ss', timeSplit = ':') {
    // Convert the base time to the desired time zone
    const localDate = moment.tz(baseTime, timeZone);
  
    // Format date and time according to the specified formats
    let formattedDate = localDate.format(dateFormat);
    
    // Handle date split if specified
    if (dateSplit) {
      // Replace default split characters with specified split characters
      formattedDate = formattedDate.replace(/[-/]/g, dateSplit); // Adjust regex based on your date format separators
    }
  
    const formattedTime = localDate.format(timeFormat);
    const timeZoneName = localDate.format('z'); // Get time zone abbreviation
  
    // Combine the formatted date and time with the split characters and time zone
    const dateTime = `${formattedDate} ${formattedTime.split(':').join(timeSplit)} (${timeZoneName})`;
  
    return {
      date: formattedDate,
      time: `${formattedTime} (${timeZoneName})`,
      dateTime: dateTime
    };
  }
  










  //Clean Data 
function cleanCustomerData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }







  //Validate inputs
  function validateInputs( data, res) {
    const validationErrors = validateAccountData( data );
  
    if (validationErrors.length > 0) {
      res.status(400).json({ message: validationErrors.join(", ") });
      return false;
    }
    return true;
  }




  //Validate Data
  function validateAccountData( data ) {
    const errors = [];

    //Basic Info
    validateReqFields( data,  errors);
    validTransaction ( data, data.transaction,  errors);
    
    
    
    return errors;
  }

// Field validation utility
function validateField(condition, errorMsg, errors) {
    if (condition) {errors.push(errorMsg);
    console.log(errorMsg);}
    
}
//Valid Req Fields
function validateReqFields( data, errors ) {
    validateField( typeof data.transaction === 'undefined', `Select an accounts`, errors );  
    validateField( typeof data.date === 'undefined', `Please select a date`, errors );  
}
// Function to Validate transaction
function validTransaction( data, transaction, errors ) {

    const calculatedTotalDebitAmount = transaction.reduce((sum, trans) => sum + trans.debitAmount, 0);
    const calculatedTotalCreditAmount = transaction.reduce((sum, trans) => sum + trans.creditAmount, 0);

    validateField( calculatedTotalDebitAmount !== calculatedTotalCreditAmount , `Calculated debit and credit amounts must be equal.`, errors );  

    validateField( data.totalDebitAmount !== calculatedTotalDebitAmount || data.totalCreditAmount !== calculatedTotalCreditAmount , `Provided total debit and credit amounts must match the calculated amounts.`, errors );  

    validateField( transaction.length <2 ,`Select two or more Accounts. ${transaction.length}`, errors );  
 
    transaction.forEach((transaction) => {        

        validateField( typeof transaction.debitAmount === 'undefined' && typeof transaction.creditAmount === 'undefined' , `Please enter debit or credit amount`, errors );  

        validateField( transaction.debitAmount === 0 &&  transaction.creditAmount === 0 , `Please enter debit or credit amount for account ${transaction.accountName}`, errors );  

        validateFloatFields(['debitAmount', 'creditAmount'], transaction, errors);
  
  
      });
  }
  //Valid Float Fields  
  function validateFloatFields(fields, data, errors) {
    fields.forEach((balance) => {
      validateField(data[balance] && !isFloat(data[balance]),
        "Invalid " + balance.replace(/([A-Z])/g, " $1") + ": " + data[balance], errors);
    });
  }
  function isFloat(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
  }














    // Function to generate time and date for storing in the database
function generateTimeAndDateForDB(
  timeZone,
  dateFormat,
  dateSplit,
  baseTime = new Date(),
  timeFormat = "HH:mm:ss",
  timeSplit = ":"
) {
  // Convert the base time to the desired time zone
  const localDate = moment.tz(baseTime, timeZone);

  // Format date and time according to the specified formats
  let formattedDate = localDate.format(dateFormat);

  // Handle date split if specified
  if (dateSplit) {
    // Replace default split characters with specified split characters
    formattedDate = formattedDate.replace(/[-/]/g, dateSplit); // Adjust regex based on your date format separators
  }

  const formattedTime = localDate.format(timeFormat);
  const timeZoneName = localDate.format("z"); // Get time zone abbreviation

  // Combine the formatted date and time with the split characters and time zone
  const dateTime = `${formattedDate} ${formattedTime
    .split(":")
    .join(timeSplit)}`;

  return {
    date: formattedDate,
    time: `${formattedTime} (${timeZoneName})`,
    dateTime: dateTime,
  };
}