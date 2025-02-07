// v1.0

const Account = require("../../Models/account")
const TrialBalance = require("../../Models/trialBalance")
const moment = require('moment-timezone');
const { cleanData } = require("../../services/cleanData");




//Add Account
exports.addAccount = async (req, res) => {
    const startTime = Date.now();
    console.log("Add Account:", req.body);

    try {

      const cleanedData = cleanCustomerData(req.body);
  

     //Validate Inputs  
     if (!validateInputs( cleanedData, res )) return;
    

     const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
     const openingDate = generatedDateTime.dateTime; 
  
      // Check if an accounts with the same name already exists
      const existingAccount = await Account.findOne({
        accountName: cleanedData.accountName,
        });  
      if (existingAccount) {
        console.log("Account with the provided Account Name already exists");
        return res.status(409).json({
          message: "Account with the provided Account Name already exists.",
        });        
      }
      

     

      const newAccount = new Account({ ...cleanedData, openingDate });      
      await newAccount.save();

      const trialEntry = new TrialBalance({
        operationId: newAccount._id,
        date: openingDate,
        accountId: newAccount._id,
        accountName: newAccount.accountName,
        action: "Opening Balance",
        debitAmount: cleanedData.debitOpeningBalance,
        creditAmount: cleanedData.creditOpeningBalance,
        remark: newAccount.remark,
      });
      await trialEntry.save();
  
      
      res.status(201).json({ message: "Account created successfully.", data: newAccount });
      console.log("Account created successfully",newAccount,trialEntry);
    } catch (error) {
      console.error("Error creating Account:", error);
      res.status(500).json({ message: "Internal server error." });
    } 
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(`Response time: ${responseTime} ms`); 
};


//Edit account
exports.editAccount = async (req, res) => {
  console.log("Edit Account Request Received:", req.body);
  try {
    const { accountId } = req.params;
    console.log(`Editing account with ID: ${accountId}`);

    // Fetch existing account
    const existingAccount = await Account.findOne({ _id: accountId });
    if (!existingAccount) {
      console.log(`Account not found with ID: ${accountId}`);
      return res.status(404).json({ message: "Account not found!" });
    }
    console.log("Existing account data:", existingAccount);

    // Clean incoming data
    const cleanedData = cleanData(req.body);
    console.log("Cleaned data for update:", cleanedData);

    // (Optional) Check trial balance count and handle early return
    const trialBalanceResult = await trialBalanceCount(existingAccount, res);
    if (trialBalanceResult) {
      console.log("Trial balance count check failed.");
      return;
    }

    // Prevent editing system accounts
    if (cleanedData.systemAccounts === true) {
      console.log(`Attempted edit on system account ID: ${accountId}`);
      return res.status(404).json({ message: "This account cannot be edited!" });
    }

    // Validate inputs
    if (!validateInputs(cleanedData, res)) {
      console.log("Input validation failed for data:", cleanedData);
      return;
    }

    // Check if an account with the same name already exists
    const existingAccountName = await Account.findOne({
      accountName: cleanedData.accountName,
      _id: { $ne: accountId },
    });
    if (existingAccountName) {
      console.log(`Duplicate account name found: ${cleanedData.accountName}`);
      return res.status(409).json({
        message: "Account with the provided Account Name already exists.",
      });
    }

    // Encrypt bankAccNum if present
    if (cleanedData.bankAccNum) {
      cleanedData.bankAccNum = encrypt(cleanedData.bankAccNum);
      console.log("Bank account number encrypted.");
    }

    // Update and save the account
    const mongooseDocument = Account.hydrate(existingAccount);
    Object.assign(mongooseDocument, cleanedData);
    const savedAccount = await mongooseDocument.save();
    if (!savedAccount) {
      console.log("Failed to save updated account.");
      return res.status(500).json({ message: "Failed to update account!" });
    }
    console.log("Account updated successfully:", savedAccount);

    // Remove any existing TrialBalance entry
    const existingTrialBalance = await TrialBalance.findOne({
      operationId: savedAccount._id,
    });
    const trialDate = existingTrialBalance ? existingTrialBalance.date : undefined;
    if (existingTrialBalance) {
      await TrialBalance.deleteOne({ accountId: savedAccount._id });
      console.log(`Deleted existing trial balance for account ID: ${savedAccount._id}`);
    }

    // Create a new TrialBalance entry
    const trialEntry = new TrialBalance({
      operationId: savedAccount._id,
      date: trialDate,
      accountId: savedAccount._id,
      accountName: savedAccount.accountName,
      action: "Opening Balance",
      debitAmount: cleanedData.debitOpeningBalance || 0,
      creditAmount: cleanedData.creditOpeningBalance || 0,
      remark: savedAccount.remark,
    });
    await trialEntry.save();
    console.log("New trial balance entry created:", trialEntry);

    res.status(200).json({ message: "Account updated successfully." });
  } catch (error) {
    console.error("Error updating Account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};




// Get all accounts for a given 
exports.getAllAccount = async (req, res) => {
    try {

        // Find all accounts where  matches
        const accounts = await Account.find( );

    if (!accounts.length) {
      return res.status(404).json({
        message: "No accounts found for the provided organization ID.",
      });
    }

    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


//Get one Account for a given 
exports.getOneAccount = async (req, res) => {
  try {
    const { accountId } = req.params;


    // Find the account by accountId and 
    const account = await Account.findOne({ _id: accountId });

    if (!account) {
      return res.status(404).json({
        message:
          "Account not found for the provided Organization ID and Account ID.",
      });
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};





//Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    // Check if an account with the given  and accountId exists
    const account = await Account.findOne({
      _id: accountId,
    });

    if (!account) {
      return res.status(404).json({
        message:
          "Account not found for the provided Organization ID and Account ID.",
      });
    }

    // Delete the account
    await account.delete();

    res.status(200).json({
      message: "Account deleted successfully.",
      deletedAccount: account,
    });
    console.log("Account deleted successfully:", account);
  } catch (error) {
    console.error("Error deleting Account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


//Get one Account for a given 
exports.getOneTrailBalance = async (req, res) => {
  try {
      const { accountId } = req.params;

      // Find the TrialBalance by accountId and 
      const trialBalance = await TrialBalance.find({
          accountId: accountId,
      });

      if (!trialBalance) {
          return res.status(404).json({
              message: "Trial Balance not found.",
          });
      }

      res.status(200).json(trialBalance);
      console.log(trialBalance);
      
  } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};


//Auoto generate
exports.autoGenerateAccount = async (req, res) => {
    try {

      const generatedDateTime = generateTimeAndDateForDB("Asia/Dubai","DD/MM/YY","/");
      const openingDate = generatedDateTime.dateTime; 
      
    
        insertAccounts( accounts, openingDate );

        res.status(201).json({ message: "Account created successfully." });
        console.log("Account created successfully");    

      } catch (error) {
        console.error("Error creating Account:", error);
        res.status(500).json({ message: "Internal server error." });
      }
};





//Account Structure
const validStructure = {
  Asset: {
    Asset: [
      "Asset",
      "Current asset",
      "Cash",
      "Bank",
      "Fixed asset",
      "Stock",
      "Payment Clearing",
      "Sundry Debtors",
    ],
    Equity: ["Equity"],
    Income: ["Income", "Other Income"],
  },
  Liability: {
    Liabilities: [
      "Current Liability",
      "Credit Card",
      "Long Term Liability",
      "Other Liability",
      "Overseas Tax Payable",
      "Sundry Creditors",
    ],
    Expenses: ["Expense", "Cost of Goods Sold", "Other Expense"],
  },
};






//Clean Data 
function cleanCustomerData(data) {
  const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = cleanData(data[key]);
    return acc;
  }, {});
}





// Validation function for account structure
function validateAccountStructure(accountGroup, accountHead, accountSubhead) {
  return (
    validStructure[accountGroup]?.[accountHead]?.includes(accountSubhead) ||
    false
  );
}

// Validation function for bank details
function validateBankDetails(accountSubhead, bankDetails) {
  if (accountSubhead === "Bank") {
    // Validate if all bank details are present
    return bankDetails.bankAccNum && bankDetails.bankIfsc && bankDetails.bankCurrency;
  }

  // Set bank details to undefined if not "Bank"
  bankDetails.bankAccNum = bankDetails.bankIfsc = bankDetails.bankCurrency = undefined;
  return true;
}


  





























//Validate inputs
function validateInputs( data, res ) {
  const validationErrors = validateItemData( data );

 if (validationErrors.length > 0) {
   res.status(400).json({ message: validationErrors.join(", ") });
   return false;
 }
 return true;
}


// Field validation utility
function validateField(condition, errorMsg, errors) {
  if (condition) {
    console.log(errorMsg);      
    errors.push(errorMsg)};
}



//Validate Data
function validateItemData( data ) {  
  
  const errors = [];

  //Basic Info

  //OtherDetails
  validateReqFields( data, errors);
  validateAccountStructure(data.accountGroup, data.accountHead, data.accountSubhead, errors);

  //validateFloatFields([''], data, errors);
  //validateAlphabetsFields([''], data, errors);



  return errors;
}






//Valid Req Fields
function validateReqFields( data, errors ) { 
  if (typeof data.accountName === 'undefined' ) {
    errors.push("Account Name required");
  }
  if (typeof data.accountSubhead === 'undefined' ) {
  errors.push(" Account Subhead required");
  }
  if (typeof data.accountHead === 'undefined' ) {
  errors.push("Account Head required");
  }
  if (typeof data.accountGroup === 'undefined' ) {
    errors.push("Account Group required");
  }
  if (typeof data.accountHead === 'undefined' ) {
    errors.push("Account Head required");
  }
  if (typeof data.debitOpeningBalance === 'undefined' && typeof data.creditOpeningBalance === 'undefined') {
    errors.push("Opening Balance required");
  }
  if (typeof data.debitOpeningBalance !== 'undefined' && typeof data.creditOpeningBalance !== 'undefined') {
    errors.push("Select Credit or Debit Opening Balance");
  }

  
}


// Validation function for account structure
function validateAccountStructure(accountGroup, accountHead, accountSubhead, errors) {
  validateField(!validStructure[accountGroup]?.[accountHead]?.includes(accountSubhead) || false,
    "Invalid Account Group, Head, or Subhead.", errors);
}


//Valid Alphanumeric Fields
function validateAlphanumericFields(fields, data, errors) {
  fields.forEach((field) => {
    validateField(data[field] && !isAlphanumeric(data[field]), "Invalid " + field + ": " + data[field], errors);
  });
}

// Validate Integer Fields
function validateIntegerFields(fields, data, errors) {
fields.forEach(field => {
  validateField(data[field] && !isInteger(data[field]), `Invalid ${field}: ${data[field]}`, errors);
});
}

//Valid Float Fields  
function validateFloatFields(fields, data, errors) {
  fields.forEach((balance) => {
    validateField(data[balance] && !isFloat(data[balance]),
      "Invalid " + balance.replace(/([A-Z])/g, " $1") + ": " + data[balance], errors);
  });
}

//Valid Alphabets Fields 
function validateAlphabetsFields(fields, data, errors) {
  fields.forEach((field) => {
    if (data[field] !== undefined) {
      validateField(!isAlphabets(data[field]),
        field.charAt(0).toUpperCase() + field.slice(1) + " should contain only alphabets.", errors);
    }
  });
}















// Validation helpers
function isAlphabets(value) {
  return /^[A-Za-z\s]+$/.test(value);
}

function isFloat(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}

function isInteger(value) {
  return /^\d+$/.test(value);
}

function isAlphanumeric(value) {
  return /^[A-Za-z0-9]+$/.test(value);
}





async function trialBalanceCount(existingAccount, res) {
  // Check if there are more than one TrialBalance entries for the account
  const trialBalanceCount = await TrialBalance.countDocuments({
    accountId: existingAccount._id,
  });

  // If there is more than one TrialBalance entry, account cannot be changed
  if (trialBalanceCount > 1) {
    console.log("Account cannot be changed as it exists in TrialBalance");
    res.status(400).json({ message: "Account cannot be changed as it is referenced in TrialBalance!" });
    return true; // Indicate that a response was sent
  }

  return false; // Indicate that no response was sent
}



























async function insertAccounts(accounts,openingDate) {

    const accountDocuments = accounts.map(account => {
        return {
            accountName: account.accountName,
            accountCode: account.accountCode, 
  
            accountSubhead: account.accountSubhead,
            accountHead: account.accountHead,
            accountGroup: account.accountGroup,
            openingDate:openingDate,
  
            description: account.description
        };});
  
      try {
          const autoAccountCreation = await Account.insertMany(accountDocuments);
          console.log('Accounts created successfully');
  
           // Loop through the created accounts and add a trial balance entry for each one
    for (const savedAccount of autoAccountCreation) {
      const debitOpeningBalance = undefined;  
      const creditOpeningBalance = undefined; 
  
  
      const newTrialEntry = new TrialBalance({
          operationId: savedAccount._id,
          date: savedAccount.openingDate,
          accountId: savedAccount._id,
          accountName: savedAccount.accountName,
          action: "Opening Balance",
          debitAmount: debitOpeningBalance,
          creditAmount: creditOpeningBalance,
          remark: 'Opening Balance'
      });
  
      await newTrialEntry.save();
  }
  
  console.log('Trial balance entries created successfully');
          
          
          
      } catch (error) {
          console.error('Error inserting accounts:', error);
      }
  }
  
  
  const accounts = [
    //Current Asset
    { accountName: "Advance Tax", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-01",systemAccounts: true,description: "Any tax which is paid in advance is recorded into the advance tax account. This advance tax payment could be a quarterly, half yearly or yearly payment." },
    { accountName: "Employee Advance", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-02",systemAccounts: true,description: "Money paid out to an employee in advance can be tracked here till it's repaid or shown to be spent for company purposes." },
    { accountName: "Input Tax Credit", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-03",systemAccounts: true,description: "Input Tax Credits" },
    { accountName: "Prepaid Expense", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-04",systemAccounts: false,description: "An asset account that reports amounts paid in advance while purchasing goods or services from a vendor." },
    { accountName: "Reverse Charge Tax Input but not due", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-05",systemAccounts: true,description: "The amount of tax payable for your reverse charge purchases can be tracked here." },
    { accountName: "Sales to Customers (Cash)", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-06",systemAccounts: true,description: "Sales to Customers (Cash)." },
    { accountName: "TDS Receivable", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-07" ,systemAccounts: false,description: "TDS Receivable."},
  
    //Fixed Asset
    { accountName: "Furniture and Equipment", accountSubhead: "Fixed Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-08",systemAccounts: false,description: "Purchases of furniture and equipment for your office that can be used for a long period of time usually exceeding one year can be tracked with this account." },
    
    //Stock
    { accountName: "Inventory Asset", accountSubhead: "Stock", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-09",systemAccounts: true,description: "An account which tracks the value of goods in your inventory.." },
    
    //Cash
    { accountName: "Petty Cash", accountSubhead: "Cash", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-10",systemAccounts: true,description: "It is a small amount of cash that is used to pay your minor or casual expenses rather than writing a check." },
    { accountName: "Undeposited Funds", accountSubhead: "Cash", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-11" ,systemAccounts: true,description: "Record funds received by your company yet to be deposited in a bank as undeposited funds and group them as a current asset in your balance sheet."},
  
    //Equity
    { accountName: "Capital Stock", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-12" ,systemAccounts: false,description: "An equity account that tracks the capital introduced when a business is operated through a company or corporation."},
    { accountName: "Distribution", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-13",systemAccounts: false,description: "An equity account that tracks the payment of stock, cash or physical products to its shareholders." },
    { accountName: "Dividends Paid", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-14",systemAccounts: false,description: "An equity account to track the dividends paid when a corporation declares dividend on its common stock." },
    { accountName: "Drawings", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-15",systemAccounts: true,description: "The money withdrawn from a business by its owner can be tracked with this account." },
    { accountName: "Investments", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-16" ,systemAccounts: false,description: "An equity account used to track the amount that you invest."},
    { accountName: "Opening Balance Offset", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-17",systemAccounts: true,description: "This is an account where you can record the balance from your previous years earning or the amount set aside for some activities. It is like a buffer account for your funds." },
    { accountName: "Owner's Equity", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-18",systemAccounts: true,description: "The owners rights to the assets of a company can be quantified in the owner''s equity account." },
    { accountName: "Retained Earning", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-19",systemAccounts: true,description: "Retained Earnings." },
  
    //Income
    { accountName: "Discount", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-20",systemAccounts: true,description: "Any reduction on your selling price as a discount can be recorded into the discount account."},
    { accountName: "General Income", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-21",systemAccounts: true,description: "A general category of account where you can record any income which cannot be recorded into any other category." },
    { accountName: "Interest Income", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-22",systemAccounts: true,description: "A percentage of your balances and deposits are given as interest to you by your banks and financial institutions. This interest is recorded into the interest income account." },
    { accountName: "Late Fee Income", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-23",systemAccounts: true,description: "Any late fee income is recorded into the late fee income account. The late fee is levied when the payment for an invoice is not received by the due date."},
    { accountName: "Other Charges", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-24",systemAccounts: true,description: "Miscellaneous charges like adjustments made to the invoice can be recorded in this account."},
    { accountName: "Shipping Charge", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-25",systemAccounts: true,description: "Shipping charges made to the invoice will be recorded in this account."},
    
    //Sales
    { accountName: "Sales", accountSubhead: "Sales", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-26",systemAccounts: true,description: "The income from the sales in your business is recorded under the sales account."},
  
    //Current Liability
    { accountName: "Employee Reimbursements", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-27",systemAccounts: true,description: "This account can be used to track the reimbursements that are due to be paid out to employees." },
    { accountName: "Output Tax Credit", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-28",systemAccounts: true,description: "Output Tax Credit" },
    { accountName: "Opening Balance Adjustments", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-29" ,systemAccounts: true,description: "This account will hold the difference in the debits and credits entered during the opening balance."},
    { accountName: "Tax Payable", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-30" ,systemAccounts: true,description: "The amount of money which you owe to your tax authority is recorded under the tax payable account. This amount is a sum of your outstanding in taxes and the tax charged on sales."},
    { accountName: "TDS Payable", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-31",systemAccounts: false,description: "TDS Payable" },
    { accountName: "Unearned Revenue", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-32" ,systemAccounts: true,description: "A liability account that reports amounts received in advance of providing goods or services. When the goods or services are provided, this account balance is decreased and a revenue account is increased."},
    
    //Long Term Liability
    { accountName: "Construction Loan", accountSubhead: "Long Term Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-33",systemAccounts: false,description: "An expense account that tracks the amount you repay for construction loans." },
    { accountName: "Mortgages", accountSubhead: "Long Term Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-34" ,systemAccounts: false,description: "An expense account that tracks the amounts you pay for the mortgage loan."},
    
    //Other Liability
    { accountName: "Dimension Adjustments", accountSubhead: "Other Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-35" ,systemAccounts: false,description: "This adjustment account tracks the transfers between different dimensions like tags, branches."},
    
    //Expense
    { accountName: "Advertising and Marketing", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-36",systemAccounts: false,description: "Your expenses on promotional, marketing and advertising activities like banners, web-adds, trade shows, etc. are recorded in advertising and marketing account." },
    { accountName: "Automobile Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-37" ,systemAccounts: false,description: "Transportation related expenses like fuel charges and maintenance charges for automobiles, are included to the automobile expense account."},
    { accountName: "Bad Debt", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-38" ,systemAccounts: true,description: "Any amount which is lost and is unrecoverable is recorded into the bad debt account."},
    { accountName: "Bank Fees and Charges", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-39" ,systemAccounts: true,description: "Any bank fees levied is recorded into the bank fees and charges account. A bank account maintenance fee, transaction charges, a late payment fee are some examples."},
    { accountName: "Consultant Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-40" ,systemAccounts: false,description: "Charges for availing the services of a consultant is recorded as a consultant expenses. The fees paid to a soft skills consultant to impart personality development training for your employees is a good example."},
    { accountName: "Contract Assets", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-41" ,systemAccounts: false,description: " An asset account to track the amount that you receive from your customers while you're yet to complete rendering the services."},
    { accountName: "Credit Card Charges", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-42" ,systemAccounts: false,description: " Service fees for transactions , balance transfer fees, annual credit fees and other charges levied on a credit card are recorded into the credit card account."},
    { accountName: "Depreciation and Amortisation", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-43",systemAccounts: false,description: "An expense account that is used to track the depreciation of tangible assets and intangible assets, which is amortization." },
    { accountName: "Depreciation Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-44",systemAccounts: false,description: "Any depreciation in value of your assets can be captured as a depreciation expense." },
    { accountName: "Fuel/Mileage Expenses", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-45",systemAccounts: false,description: "Fuel/Mileage Expenses" },
    { accountName: "IT and Internet Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-46",systemAccounts: false,description: "Money spent on your IT infrastructure and usage like internet connection, purchasing computer equipment etc is recorded as an IT and Computer Expense." },
    { accountName: "Janitorial Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-47" ,systemAccounts: false,description: "All your janitorial and cleaning expenses are recorded into the janitorial expenses account."},
    { accountName: "Lodging", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-48" ,systemAccounts: true,description: "Any expense related to putting up at motels etc while on business travel can be entered here."},
    { accountName: "Meals and Entertainment", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-49",systemAccounts: false,description: "Expenses on food and entertainment are recorded into this account." },
    { accountName: "Merchandise", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-50" ,systemAccounts: false,description: "An expense account to track the amount spent on purchasing merchandise."},
    { accountName: "Office Supplies", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-51",systemAccounts: false,description: "All expenses on purchasing office supplies like stationery are recorded into the office supplies account." },
    { accountName: "Other Expenses", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-52",systemAccounts: true,description: "Any minor expense on activities unrelated to primary business operations is recorded under the other expense account." },
    { accountName: "Parking", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-53",systemAccounts: true,description: "The parking fares you pay while on business trips can be recorded under this expense category." },
    { accountName: "Postage", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability" ,accountCode:"AC-54",systemAccounts: false,description: "Your expenses on ground mails, shipping and air mails can be recorded under the postage account."},
    { accountName: "Printing and Stationary", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-55",systemAccounts: false,description: "Expenses incurred by the organization towards printing and stationery." },
    { accountName: "Purchase Discounts", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-56",systemAccounts: true,description: "Tracks any reduction that your vendor offers on your purchases. Some vendors also provide them to encourage quick payment settlement." },
    { accountName: "Raw Material and Consumables", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-57" ,systemAccounts: false,description: "An expense account to track the amount spent on purchasing raw materials and consumables."},
    { accountName: "Rent Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-58",systemAccounts: false,description: "The rent paid for your office or any space related to your business can be recorded as a rental expense." },
    { accountName: "Repairs and Maintenance", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-59",systemAccounts: false,description: "The costs involved in maintenance and repair of assets is recorded under this account." },
    { accountName: "Salaries and Employee Wages", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-60",systemAccounts: false,description: "Salaries for your employees and the wages paid to workers are recorded under the salaries and wages account." },
    { accountName: "Telephone Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-61",systemAccounts: false,description: "The expenses on your telephone, mobile and fax usage are accounted as telephone expenses." },
    { accountName: "Transportation Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-62" ,systemAccounts: false,description: "An expense account to track the amount spent on transporting goods or providing services."},
    { accountName: "Travel Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-63",systemAccounts: false,description: "Expenses on business travels like hotel bookings, flight charges, etc. are recorded as travel expenses." },
    { accountName: "Uncategorized", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-64",systemAccounts: true,description: "This account can be used to temporarily track expenses that are yet to be identified and classified into a particular category." },
    
    //Cost of Goods Sold
    { accountName: "Cost of Goods Sold", accountSubhead: "Cost of Goods Sold", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-65" ,systemAccounts: true,description: "An expense account which tracks the value of the goods sold."},
    
    //Other Expense
    { accountName: "Exchange Gain or Loss", accountSubhead: "Other Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-66" ,systemAccounts: true,description: "Changing the conversion rate can result in a gain or a loss. You can record this into the exchange gain or loss account."},

    //inputvat
    { accountName: "Input VAT", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset", accountCode: "TX-01", description: "Input VAT"},

    //outputvat
    { accountName: "Output VAT", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability", accountCode: "TX-02", description: "Output VAT"},

  ];



























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