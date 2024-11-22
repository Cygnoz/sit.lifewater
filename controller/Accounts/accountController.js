// v1.0

const Account = require("../../Models/account")
const TrialBalance = require("../../Models/trialBalance")
const moment = require('moment-timezone');





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
  
      
      res.status(201).json({ message: "Account created successfully." });
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
  console.log("Edit Account:", req.body);
  try {
    const { accountId } = req.params;

    const cleanedData = cleanCustomerData(req.body);
  

    //Validate Inputs  
    if (!validateInputs( cleanedData, currencyExists, res )) return;
     
     

    // Check if an account with the given  and accountId exists
    const account = await Account.findOne({
      _id: accountId,
    });

    if (!account) {
      console.log("Account not found for the provided Account ID");
      return res.status(404).json({
        message:
          "Account not found for the provided Account ID",
      });
    }


    // Update account fields
    account.accountName = cleanedData.accountName;
    account.accountCode = cleanedData.accountCode;

    account.accountSubhead = cleanedData.accountSubhead;
    account.accountHead = cleanedData.accountHead;
    account.accountGroup = cleanedData.accountGroup;

    account.description = cleanedData.description;
    account.bankAccNum = cleanedData.bankAccNum;
    account.bankIfsc = cleanedData.bankIfsc;
    account.bankCurrency = cleanedData.bankCurrency;

    // Save updated account
    await account.save();

    res.status(200).json({
      message: "Account updated successfully.",
    });
    console.log("Account updated successfully:");
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
    { accountName: "Advance Tax", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-01",description: "Any tax which is paid in advance is recorded into the advance tax account. This advance tax payment could be a quarterly, half yearly or yearly payment." },
    { accountName: "Employee Advance", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-02",description: "Money paid out to an employee in advance can be tracked here till it's repaid or shown to be spent for company purposes." },
    { accountName: "Prepaid Expense", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-03",description: "An asset account that reports amounts paid in advance while purchasing goods or services from a vendor." },
    { accountName: "TDS Receivable", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-04" ,description: "TDS Receivable."},
    { accountName: "Sales to Customers (Cash)", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-05",description: "Sales to Customers (Cash)." },
    { accountName: "Reverse Charge Tax Input but not due", accountSubhead: "Current Asset", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-06",description: "The amount of tax payable for your reverse charge purchases can be tracked here." },
    
    // { accountName: "Accounts Receivable", accountSubhead: "Accounts Receivable", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-07",description: "The money that customers owe you becomes the accounts receivable. A good example of this is a payment expected from an invoice sent to your customer." },
    
    { accountName: "Inventory Asset", accountSubhead: "Stock", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-08",description: "An account which tracks the value of goods in your inventory.." },
    
    { accountName: "Petty Cash", accountSubhead: "Cash", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-09",description: "It is a small amount of cash that is used to pay your minor or casual expenses rather than writing a check." },
    { accountName: "Undeposited Funds", accountSubhead: "Cash", accountHead: "Asset", accountGroup: "Asset",accountCode:"AC-10" ,description: "Record funds received by your company yet to be deposited in a bank as undeposited funds and group them as a current asset in your balance sheet."},
  
    { accountName: "Capital Stock", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-11" ,description: "An equity account that tracks the capital introduced when a business is operated through a company or corporation."},
    { accountName: "Distribution", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-12",description: "An equity account that tracks the payment of stock, cash or physical products to its shareholders." },
    { accountName: "Dividends Paid", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-13",description: "An equity account to track the dividends paid when a corporation declares dividend on its common stock." },
    { accountName: "Drawings", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-14",description: "The money withdrawn from a business by its owner can be tracked with this account." },
    { accountName: "Investments", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-15" ,description: "An equity account used to track the amount that you invest."},
    { accountName: "Opening Balance Offset", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-16",description: "This is an account where you can record the balance from your previous years earning or the amount set aside for some activities. It is like a buffer account for your funds." },
    { accountName: "Owner's Equity", accountSubhead: "Equity", accountHead: "Equity", accountGroup: "Asset",accountCode:"AC-17",description: "The owners rights to the assets of a company can be quantified in the owner''s equity account." },
  
    
    { accountName: "General Income", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-18",description: "A general category of account where you can record any income which cannot be recorded into any other category." },
    { accountName: "Interest Income", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-19",description: "A percentage of your balances and deposits are given as interest to you by your banks and financial institutions. This interest is recorded into the interest income account." },
    { accountName: "Sales", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-20",description: "The income from the sales in your business is recorded under the sales account."},
    { accountName: "Other Charges", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-21",description: "Miscellaneous charges like adjustments made to the invoice can be recorded in this account."},
    { accountName: "Shipping Charge", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-22",description: "Shipping charges made to the invoice will be recorded in this account."},
    { accountName: "Late Fee Income", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-23",description: "Any late fee income is recorded into the late fee income account. The late fee is levied when the payment for an invoice is not received by the due date."},
    { accountName: "Discount", accountSubhead: "Income", accountHead: "Income", accountGroup: "Asset",accountCode:"AC-24",description: "Any reduction on your selling price as a discount can be recorded into the discount account."},
    
    { accountName: "Employee Reimbursements", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-25",description: "This account can be used to track the reimbursements that are due to be paid out to employees." },
    { accountName: "TDS Payable", accountSubhead: "Current Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-26",description: "TDS Payable" },
    
    // { accountName: "Accounts Payable", accountSubhead: "Accounts Payable", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-27",description: "This is an account of all the money which you owe to others like a pending bill payment to a vendor,etc." },
    
    { accountName: "Construction Loan", accountSubhead: "Long Term Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-28",description: "An expense account that tracks the amount you repay for construction loans." },
    { accountName: "Mortgages", accountSubhead: "Long Term Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-29" ,description: "An expense account that tracks the amounts you pay for the mortgage loan."},
    
    { accountName: "Opening Balance Adjustments", accountSubhead: "Other Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-30" ,description: "This account will hold the difference in the debits and credits entered during the opening balance."},
    { accountName: "Unearned Revenue", accountSubhead: "Other Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-31" ,description: "A liability account that reports amounts received in advance of providing goods or services. When the goods or services are provided, this account balance is decreased and a revenue account is increased."},
    { accountName: "Tax Payable", accountSubhead: "Other Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-32" ,description: "The amount of money which you owe to your tax authority is recorded under the tax payable account. This amount is a sum of your outstanding in taxes and the tax charged on sales."},
    { accountName: "Accounts Payable", accountSubhead: "Other Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-33" ,description: "This is an account of all the money which you owe to others like a pending bill payment to a vendor,etc."},
    { accountName: "Dimension Adjustments", accountSubhead: "Other Liability", accountHead: "Liabilities", accountGroup: "Liability",accountCode:"AC-34" ,description: "This adjustment account tracks the transfers between different dimensions like tags, branches."},
    
    { accountName: "Advertising and Marketing", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-35",description: "Your expenses on promotional, marketing and advertising activities like banners, web-adds, trade shows, etc. are recorded in advertising and marketing account." },
    { accountName: "Automobile Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-36" ,description: "Transportation related expenses like fuel charges and maintenance charges for automobiles, are included to the automobile expense account."},
    { accountName: "Bad Debt", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-37" ,description: "Any amount which is lost and is unrecoverable is recorded into the bad debt account."},
    { accountName: "Bank Fees and Charges", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-38" ,description: "Any bank fees levied is recorded into the bank fees and charges account. A bank account maintenance fee, transaction charges, a late payment fee are some examples."},
    { accountName: "Consultant Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-39" ,description: "Charges for availing the services of a consultant is recorded as a consultant expenses. The fees paid to a soft skills consultant to impart personality development training for your employees is a good example."},
    { accountName: "Contract Assets", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-40" ,description: " An asset account to track the amount that you receive from your customers while you're yet to complete rendering the services."},
    { accountName: "Credit Card Charges", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-41" ,description: " Service fees for transactions , balance transfer fees, annual credit fees and other charges levied on a credit card are recorded into the credit card account."},
    { accountName: "Depreciation and Amortisation", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-42",description: "An expense account that is used to track the depreciation of tangible assets and intangible assets, which is amortization." },
    { accountName: "Depreciation Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-43",description: "Any depreciation in value of your assets can be captured as a depreciation expense." },
    { accountName: "Fuel/Mileage Expenses", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-44",description: "Fuel/Mileage Expenses" },
    { accountName: "IT and Internet Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-45",description: "Money spent on your IT infrastructure and usage like internet connection, purchasing computer equipment etc is recorded as an IT and Computer Expense." },
    { accountName: "Janitorial Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-46" ,description: "All your janitorial and cleaning expenses are recorded into the janitorial expenses account."},
    { accountName: "Lodging", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-47" ,description: "Any expense related to putting up at motels etc while on business travel can be entered here."},
    { accountName: "Meals and Entertainment", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-48",description: "Expenses on food and entertainment are recorded into this account." },
    { accountName: "Merchandise", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-49" ,description: "An expense account to track the amount spent on purchasing merchandise."},
    { accountName: "Office Supplies", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-50",description: "All expenses on purchasing office supplies like stationery are recorded into the office supplies account." },
    { accountName: "Other Expenses", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-51",description: "Any minor expense on activities unrelated to primary business operations is recorded under the other expense account." },
    { accountName: "Postage", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability" ,accountCode:"AC-52",description: "Your expenses on ground mails, shipping and air mails can be recorded under the postage account."},
    { accountName: "Printing and Stationary", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-53",description: "Expenses incurred by the organization towards printing and stationery." },
    { accountName: "Parking", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-54",description: "The parking fares you pay while on business trips can be recorded under this expense category." },
    { accountName: "Purchase Discounts", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-55",description: "Tracks any reduction that your vendor offers on your purchases. Some vendors also provide them to encourage quick payment settlement." },
    { accountName: "Raw Material and Consumables", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-56" ,description: "An expense account to track the amount spent on purchasing raw materials and consumables."},
    { accountName: "Rent Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-57",description: "The rent paid for your office or any space related to your business can be recorded as a rental expense." },
    { accountName: "Repairs and Maintenance", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-58",description: "The costs involved in maintenance and repair of assets is recorded under this account." },
    { accountName: "Telephone Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-59",description: "The expenses on your telephone, mobile and fax usage are accounted as telephone expenses." },
    { accountName: "Transportation Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-60" ,description: "An expense account to track the amount spent on transporting goods or providing services."},
    { accountName: "Travel Expense", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-61",description: "Expenses on business travels like hotel bookings, flight charges, etc. are recorded as travel expenses." },
    { accountName: "Uncategorized", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-62",description: "This account can be used to temporarily track expenses that are yet to be identified and classified into a particular category." },
    { accountName: "Salaries and Employee Wages", accountSubhead: "Expense", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-63",description: "Salaries for your employees and the wages paid to workers are recorded under the salaries and wages account." },
    
    { accountName: "Cost of Goods Sold", accountSubhead: "Cost of Goods Sold", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-64" ,description: "An expense account which tracks the value of the goods sold."},
    { accountName: "Exchange Gain or Loss", accountSubhead: "Cost of Goods Sold", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-65" ,description: "Changing the conversion rate can result in a gain or a loss. You can record this into the exchange gain or loss account."},
    { accountName: "Job Costing", accountSubhead: "Cost of Goods Sold", accountHead: "Expenses", accountGroup: "Liability" ,accountCode:"AC-66",description: "An expense account to track the costs that you incur in performing a job or a task."},
    { accountName: "Labor", accountSubhead: "Cost of Goods Sold", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-67",description: " An expense account that tracks the amount that you pay as labor." },
    { accountName: "Materials", accountSubhead: "Cost of Goods Sold", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-68",description: "An expense account that tracks the amount you use in purchasing materials." },
    { accountName: "Subcontractor", accountSubhead: "Cost of Goods Sold", accountHead: "Expenses", accountGroup: "Liability",accountCode:"AC-69",description: "An expense account to track the amount that you pay subcontractors who provide service to you." }
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