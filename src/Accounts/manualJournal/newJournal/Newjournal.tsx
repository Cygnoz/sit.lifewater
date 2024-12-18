import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountDropdown from "./AccountDropdown";

import CheveronLeftIcon from "../../../assets/icons/CheveronLeft";
import TrashCan from "../../Components/Trashcan";
import Button from "../../Components/Button";
import PlusIcon from "../../Components/PlusIcon";
import {  toast, ToastContainer } from "react-toastify";
// import { addJournalEntryAPI,  } from "../../../services/AccountsAPI/Journal";
// import { getAllAccountsAPI } from "../../../services/AccountsAPI/accounts";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";
type Props = {};

function NewJournal({ }: Props) {
  const navigate = useNavigate();
  const { request: NewJournalAdd } = useApi("post", 4000);
 
  // Initialize with two non-deletable rows
  const initialTransactions = [
    {
      accountId: "",
      accountCode: "",
      accountName: "",
      debitAmount: 0,
      creditAmount: 0,
      description: "",
     
    },
    {
      accountId: "",
      accountCode: "",
      accountName: "",
      debitAmount: 0,
      creditAmount: 0,
      description: "",
   
    },
  ];


  const [accountOptions, setAccountOptions] = useState(null);
  const [totalResult, setTotalResult] = useState({
    totalDebit: 0,
    totalCredit: 0,
    difference: 0,
    differencesLabel: "",
  });
  const [newJournalDatas, setNewJournelDatas] = useState({
    journalId: "",
    date: "",
    reference: "",
    note: "",
    cashBasedJournal: false,
    currency: "INR",
    transaction: initialTransactions,
    totalDebitAmount: 0,
    totalCreditAmount: 0,
  });

  const tableHeaders = [
    "Account",
    "Description",
    // "Contact (INR)",
    "Debits",
    "Credits",
    "Actions",
  ];

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState<boolean[]>(
    Array(initialTransactions.length).fill(false)
  );
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState<boolean[]>(
    Array(initialTransactions.length).fill(false)
  );
  const [accountSearch, setAccountSearch] = useState<string[]>(
    Array(initialTransactions.length).fill("")
  );
  const [contactSearch, setContactSearch] = useState<string[]>(
    Array(initialTransactions.length).fill("")
  );

  // Auto generate Journal id

const { request: getJournalData } = useApi("get", 4000);

useEffect(() => {
  const fetchAllJournals = async () => {
    try {
      const url = `${endpoints.GET_ALL_JOURNALS}`;
      const { response, error } = await getJournalData(url);

      if (!error && response) {
        const allJournals = response.data;
        console.log("here is:",allJournals);
        

        // Auto-generate the journalId
        const count = allJournals.length; // Current number of journals
        const newJournalId = `JN-${count + 1}`; // Auto-generate with prefix JN-

        // Update newJournalDatas with the generated journalId
        setNewJournelDatas((prev) => ({
          ...prev,
          journalId: newJournalId,
        }));
      } else {
        console.log("Error fetching journals:", error);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  fetchAllJournals();
}, []); // Add dependencies if necessary

  const addRow = () => {
    const newRow = {
      accountId: "",
      accountCode: "",
      accountName: "",
      debitAmount: 0,
      creditAmount: 0,
      description: "",
      contact: "",
    };

    setNewJournelDatas({
      ...newJournalDatas,
      transaction: [...newJournalDatas.transaction, newRow],
    });

    setIsAccountDropdownOpen([...isAccountDropdownOpen, false]);
    setIsContactDropdownOpen([...isContactDropdownOpen, false]);
    setAccountSearch([...accountSearch, ""]);
    setContactSearch([...contactSearch, ""]);
  };

  const deleteRow = (index: number) => {
    // Prevent deletion of rows at indices 0 and 1
    if (index < 2) return;

    setNewJournelDatas({
      ...newJournalDatas,
      transaction: newJournalDatas.transaction.filter(
        (_, rowIndex) => rowIndex !== index
      ),
    });

    setIsAccountDropdownOpen(
      isAccountDropdownOpen.filter((_, i) => i !== index)
    );
    setIsContactDropdownOpen(
      isContactDropdownOpen.filter((_, i) => i !== index)
    );
    setAccountSearch(accountSearch.filter((_, i) => i !== index));
    setContactSearch(contactSearch.filter((_, i) => i !== index));
  };

  // const contactOptions = ["John Doe", "Jane Smith", "Robert Brown"];

  const currencies = [
    { value: "INR", display: "INR - Indian Rupees" },
    { value: "USD", display: "USD - United States Dollar" },
    { value: "EUR", display: "EUR - Euro" },
    { value: "GBP", display: "GBP - British Pound Sterling" },
    { value: "JPY", display: "JPY - Japanese Yen" },
    { value: "AUD", display: "AUD - Australian Dollar" },
    { value: "CAD", display: "CAD - Canadian Dollar" },
    { value: "CHF", display: "CHF - Swiss Franc" },
    { value: "CNY", display: "CNY - Chinese Yuan" },
    { value: "NZD", display: "NZD - New Zealand Dollar" },
    { value: "SGD", display: "SGD - Singapore Dollar" },
    { value: "HKD", display: "HKD - Hong Kong Dollar" },
    { value: "KRW", display: "KRW - South Korean Won" },
    { value: "SEK", display: "SEK - Swedish Krona" },
    { value: "NOK", display: "NOK - Norwegian Krone" },
  ];

  // const getLastJournelsPrefix = async () => {
  //   try {
  //     const url = `${endponits.Get_LAST_Journel_Prefix}`;
  //     const { response, error } = await GetLastJournelPrefix(url);
  //     if (!error && response) {
  //       console.log("response", response);
  //       setNewJournelDatas({ ...newJournalDatas, journel: response?.data });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching accounts:", error);
  //   }
  // };

 // Fetch accounts from the API
 const [loading, setLoading] = useState(false);
 const { request: getallaccounts } = useApi("get", 4000)
 const fetchAccounts = async () => {
   try {
     const url = `${endpoints.GET_ALL_ACCOUNTS}`
     const { response, error } = await getallaccounts(url)
     console.log("API RESPONSE :",response)

     if (!error && response) {
       setLoading(false)
       console.log(loading);
       
       setAccountOptions(response.data)
     
     }
   } catch (error) {
     console.log(error)
   }
 }
 useEffect(() => {
   fetchAccounts()
 }, [])


  useEffect(() => {
    if (!Array.isArray(newJournalDatas.transaction)) {
      // Ensure transaction is always an array
      return;
    }

    const totalDebit = newJournalDatas.transaction.reduce(
      (total, transaction) => {
        // Check if transaction is valid and has a debitAmount
        const debitAmount =
          typeof transaction.debitAmount === "string"
            ? parseFloat(transaction.debitAmount)
            : typeof transaction.debitAmount === "number"
              ? transaction.debitAmount
              : 0;
        return total + (isNaN(debitAmount) ? 0 : debitAmount);
      },
      0
    );

    const totalCredit = newJournalDatas.transaction.reduce(
      (total, transaction) => {
        // Check if transaction is valid and has a creditAmount
        const creditAmount =
          typeof transaction.creditAmount === "string"
            ? parseFloat(transaction.creditAmount)
            : typeof transaction.creditAmount === "number"
              ? transaction.creditAmount
              : 0;
        return total + (isNaN(creditAmount) ? 0 : creditAmount);
      },
      0
    );

    const difference = totalDebit - totalCredit;

    setTotalResult({
      totalDebit,
      totalCredit,
      difference,
      differencesLabel: difference < 0 ? "(Debit)" : "(Credit)",
    });

    setNewJournelDatas({
      ...newJournalDatas,
      totalCreditAmount: parseFloat(totalCredit.toFixed(2)),
      totalDebitAmount: parseFloat(totalDebit.toFixed(2)),
    });
  }, [newJournalDatas.transaction]);

  const handleAddNewJournel = async () => {
    const {
      journalId,
     
      date,
      reference,
      note,
      currency,
      transaction,
      totalDebitAmount,
      totalCreditAmount,
    } = newJournalDatas;
  
    console.log(newJournalDatas);
  
    let errors = [];
  
    // Validate required fields
    if (!journalId) errors.push("Journal");
    if (!date) errors.push("Date");
    if (!reference) errors.push("Reference");
    if (!note) errors.push("Note");
    if (!currency) errors.push("Currency");
    if (totalDebitAmount === undefined || totalCreditAmount === undefined) {
      errors.push("Total Debit and Credit Amounts");
    }
    if (totalResult && totalResult.difference) {
      errors.push("Ensure that the debit and credits are equal!");
    }
    
  
    // Validate minimum two transactions and fields in transactions
    if (transaction.length < 2) {
      errors.push("At least two transactions");
    }
  
    transaction.forEach((txn, index) => {
      if (!txn.accountId) errors.push(`Transaction ${index + 1}: Account ID`);
      if (txn.debitAmount === undefined && txn.creditAmount === undefined) {
        errors.push(`Transaction ${index + 1}: Debit or Credit Amount`);
      }
      
    });
  
    // Show detailed toast message if there are errors
    console.log(errors); // Check the content of errors
if (errors.length > 0) {
  toast.error(`Please fill the following fields: ${errors.join(", ")}`, {
    position: "top-right",
    autoClose: 5000,
  });
}
 else {
  try {
        const url = `${endpoints.ADD_NEW_JOURNEL_ENTRY}`;
        const apiResponse = await NewJournalAdd(url, newJournalDatas);
        console.log("api response", apiResponse);
        const { response, error } = apiResponse;
        if (!error && response) {
          toast.success(response.data.message);
          setNewJournelDatas({
            journalId: "",
            date: "",
            reference: "",
            note: "",
            cashBasedJournal: false,
            currency: "INR",
            transaction: initialTransactions,
            totalDebitAmount: 0,
            totalCreditAmount: 0,
          });
          setTimeout(() => {
            navigate("/journals");
          }, 2000);
        } else {
          toast.error(error?.response.data.message);
          console.log("error", error);
        }
      } catch (error) {
        console.log("Error during API call", error);
      }
 }  
  }

  const handleAccountSelect = (index: number, account: any) => {
    const newTransaction = [...newJournalDatas.transaction];

    // Set both accountName and accountId
    newTransaction[index].accountName = account.accountName;
    newTransaction[index].accountId = account._id; // Set accountId
    newTransaction[index].accountCode = account.accountCode;
    setNewJournelDatas({
      ...newJournalDatas,
      transaction: newTransaction,
    });
    setIsAccountDropdownOpen(
      isAccountDropdownOpen.map((open, i) => (i === index ? false : open))
    );
  };
  // const handleContactSelect = (index: number, contact: string) => {
  //   const newTransaction = [...newJournalDatas.transaction];
  //   newTransaction[index].contact = contact;
  //   setNewJournelDatas({
  //     ...newJournalDatas,
  //     transaction: newTransaction,
  //   });
  //   setIsContactDropdownOpen(
  //     isContactDropdownOpen.map((open, i) => (i === index ? false : open))
  //   );
  // };

  const handleAccountSearchChange = (index: number, value: string) => {
    const newSearch = [...accountSearch];
    newSearch[index] = value;
    setAccountSearch(newSearch);
  };

  // const handleContactSearchChange = (index: number, value: string) => {
  //   const newSearch = [...contactSearch];
  //   newSearch[index] = value;
  //   setContactSearch(newSearch);
  // };

  const handleAccountDropdownToggle = (index: number, isOpen: boolean) => {
    setIsAccountDropdownOpen(
      isAccountDropdownOpen.map((open, i) => (i === index ? isOpen : open))
    );
  };

  // const handleContactDropdownToggle = (index: number, isOpen: boolean) => {
  //   setIsContactDropdownOpen(
  //     isContactDropdownOpen.map((open, i) => (i === index ? isOpen : open))
  //   );
  // };

  const clearAccountSearch = (index: number) => {
    const newSearch = [...accountSearch];
    newSearch[index] = "";
    setAccountSearch(newSearch);
  };

  // const clearContactSearch = (index: number) => {
  //   const newSearch = [...contactSearch];
  //   newSearch[index] = "";
  //   setContactSearch(newSearch);
  // };

  const handleInputChange = (index: number, field: string, value: any) => {
    const newTransaction = [...newJournalDatas.transaction];

    if (field === "creditAmount" || field === "debitAmount") {
      // If the value is empty, set it to "0.00"
      if (value === "") {
        (newTransaction[index] as any)[field] = 0;
      } else {
        // Convert the value to a number and format it to 2 decimal places
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          (newTransaction[index] as any)[field] = parseFloat(
            numericValue.toFixed(2)
          );
        } else {
          (newTransaction[index] as any)[field] = 0;
        }
      }
    } else {
      (newTransaction[index] as any)[field] = value;
    }

    setNewJournelDatas({
      ...newJournalDatas,
      transaction: newTransaction,
    });
  };

  console.log("new", newJournalDatas);

  return (
    <div className="p-2">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} theme="colored" />

      <div className="flex items-center gap-5">
        <Link to={"/journals"}>
          <div
            style={{ borderRadius: "50%" }}
            className="w-[40px] h-[40px] flex items-center justify-center bg-white"
          >
            <CheveronLeftIcon />
          </div>
        </Link>
        <p className="text-textColor text-xl font-bold">Create New Journal</p>
      </div>

      <div className="mt-1 p-3 pb-5 rounded-md bg-white">
        <div className="grid gap-5 p-4">
          <div className="flex items-center justify-between w-full gap-9">
            <div className="w-[40%]">
              <label className="block text-sm text-textColor">Date</label>
              <input
                type="date"
                className="mt-1 w-full border border-inputBorder rounded-md text-sm p-2"
                placeholder="25/06/24"
                value={newJournalDatas.date}
                onChange={(e) =>
                  setNewJournelDatas({
                    ...newJournalDatas,
                    date: e.target.value,
                  })
                }
              />
            </div>
            {/* <div className="w-[26%]">
              <label className="block text-sm text-textColor">Journal#</label>
              <input
                
                type="text"
                className="mt-1 w-full border border-inputBorder rounded-md text-sm p-2"
                placeholder=""
                value={newJournalDatas.journalId}
                onChange={(e) =>
                  setNewJournelDatas({
                    ...newJournalDatas,
                    journalId: e.target.value,
                  })
                }
              />
            </div> */}
             <div className="w-[26%]">
              <label className="block text-sm text-textColor">
                Journal Type
              </label>
              <div className="flex items-center justify-start mt-3">
                <input
                  type="checkbox"
                  className="h-[16px] w-[16px]"
                  checked={newJournalDatas.cashBasedJournal}
                  onChange={(e) =>
                    setNewJournelDatas({
                      ...newJournalDatas,
                      cashBasedJournal: e.target.checked,
                    })
                  }
                />
                <label className="text-sm font-medium text-textColor ms-3">
                  Cash based journal ?
                </label>
              </div>
            </div>
            
            <div className="w-[40%]">
              <label className="block text-sm text-textColor">Reference#</label>
              <input
                type="text"
                className="mt-1 w-full border border-inputBorder rounded-md text-sm p-2"
                placeholder="Value"
                value={newJournalDatas.reference}
                onChange={(e) =>
                  setNewJournelDatas({
                    ...newJournalDatas,
                    reference: e.target.value,
                  })
                }
              />
            </div>
          </div>
         
          

          <div className="flex items-center justify-between w-full gap-9">
            <div className="w-[72%]">
              <label className="block text-sm text-textColor">Notes</label>
              <input
                type="text"
                className="mt-1 w-full border border-inputBorder rounded-md text-sm p-2"
                placeholder="Value"
                value={newJournalDatas.note}
                onChange={(e) =>
                  setNewJournelDatas({
                    ...newJournalDatas,
                    note: e.target.value,
                  })
                }
              />
            </div>
           
            <div className="w-[50%]">
              <label className="block text-sm text-textColor">Currency</label>
              <select
                className="mt-1 w-full border border-inputBorder bg-white rounded-md text-sm p-2"
                value={newJournalDatas.currency}
                onChange={(e) =>
                  setNewJournelDatas({
                    ...newJournalDatas,
                    currency: e.target.value,
                  })
                }
              >
                {currencies.map((currency) => (
                  <option value={currency.value}>{currency.display}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="-mt-2 p-4">
          <div className="border rounded-md border-tableBorder">
            <table className="min-w-full bg-white rounded-md">
              <thead className="text-[12px] text-center text-dropdownText">
                <tr style={{ backgroundColor: "#F9F7F0" }}>
                  {tableHeaders.map((heading, index) => (
                    <th
                      className="py-3 px-8 font-medium border-b border-tableBorder"
                      key={index}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-center text-dropdownText">
                {newJournalDatas.transaction.map((row, index) => (
                  <tr className="border-b border-tableBorder" key={index}>
                    <AccountDropdown
                      index={index}
                      account={row.accountName}
                      accountOptions={accountOptions}
                      isDropdownOpen={isAccountDropdownOpen[index]}
                      search={accountSearch[index]}
                      onAccountSelect={handleAccountSelect}
                      onSearchChange={handleAccountSearchChange}
                      onDropdownToggle={handleAccountDropdownToggle}
                      clearSearch={clearAccountSearch}
                    />
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <textarea
                        className="w-full border border-inputBorder rounded-md text-sm p-2 "
                        placeholder="Description"
                        style={{ height: "2.5rem" }}
                        value={row.description}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    {/* <ContactDropdown
                      index={index}
                      contact={row.contact}
                      contactOptions={contactOptions}
                      isDropdownOpen={isContactDropdownOpen[index]}
                      search={contactSearch[index]}
                      onContactSelect={handleContactSelect}
                      onSearchChange={handleContactSearchChange}
                      onDropdownToggle={handleContactDropdownToggle}
                      clearSearch={clearContactSearch}
                    /> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input
                        type="number"
                        min={0}
                        style={{
                          margin: "0 !important", // Remove margins
                          paddingRight: "0 !important", // Remove extra padding
                        }}
                        className="mt-1 w-[150px] border border-inputBorder rounded-md text-sm p-2"
                        placeholder="0.00"
                        onChange={(e) => {
                          let value = parseFloat(e.target.value);

                          // If the entered value is negative, reset it to 0
                          if (value < 0) {
                            value = 0;
                            e.target.value = "0"; // Update the displayed value to 0
                          }

                          if (!row.creditAmount) {
                            handleInputChange(index, "debitAmount", value);
                          } else {
                            toast.error("Clear credit before entering debit; both can’t be in one row.");
                          }
                        }}
                      />


                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <input
                        type="number"
                        min={0}
                        style={{
                          margin: "0 !important", // Remove margins
                          paddingRight: "0 !important", // Remove extra padding
                        }}
                        className="mt-1 w-[130px] border border-inputBorder rounded-md text-sm p-2"
                        placeholder="0.00"
                        onChange={(e) => {
                          let value = parseFloat(e.target.value);

                          // If the entered value is negative, reset it to 0
                          if (value < 0) {
                            value = 0;
                            e.target.value = "0"; // Update the displayed value to 0
                          }

                          if (!row.debitAmount) {
                            handleInputChange(index, "creditAmount", value);
                          } else {
                            toast.error("Clear debit before entering credit; both can’t be in one row.");
                          }
                        }}
                      />

                    </td>
                    <td
                      onClick={() => deleteRow(index)}
                      className={`px-6 py-6 items-center whitespace-nowrap text-sm flex justify-center cursor-pointer ${index < 2 ? "cursor-not-allowed text-gray-400" : ""
                        }`}
                    >
                      <TrashCan color={index < 2 ? "gray" : "red"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pl-5">
          <button onClick={addRow} className="flex justify-center gap-1 ">
            <PlusIcon color="#820000" />{" "}
            <span className="text-sm text-maroon font-semibold">
              Add New Row
            </span>
          </button>
        </div>
      </div>

      <div className="mt-3 p-5 rounded-md bg-white w-[55%] ms-auto">
        <div className="grid grid-cols-12">
          <div className="col-span-4 flex flex-col gap-3">
            <p className="text-[14px] text-[#4B5C79]">Sub Total</p>
            <span className="text-xl font-bold text-textColor">Total</span>
          </div>
          <div className="col-span-3 flex flex-col gap-3">
            <h4 className="text-[14px] text-[#4B5C79]">
              {totalResult.totalDebit.toFixed(2)}
            </h4>
            <span className="text-textColor font-bold text-xl">
              {" "}{totalResult.totalDebit.toFixed(2)}
            </span>
          </div>

          <div className="col-span-3 flex flex-col w-[130px]  gap-3 me-5">
            <h4 className="text-[14px] text-[#4B5C79] text-end">
               {totalResult.totalCredit.toFixed(2)}
            </h4>
            <span className="text-textColor font-bold text-xl text-end">
               {totalResult.totalCredit.toFixed(2)}
            </span>
          </div>
          <div className="col-span-2 flex flex-col gap-1 bg-[#FEF7F7] py-[4px] px-[14px]">
            <h4 className="text-[12px] text-[#820000]">Difference</h4>
            <h2 className="text-[#820000] font-bold text-[18px]">
              {Math.abs(totalResult.difference).toFixed(2)}
            </h2>
            <h4 className="text-[12px] text-[#820000]">
              {totalResult.difference ? totalResult.differencesLabel : ""}
            </h4>
          </div>
        </div>

        <hr className="mt-3 border-t border-hr" />
        <br />
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button variant="secondary" size="sm">
            Save as Draft
          </Button>
          <Button onClick={handleAddNewJournel} variant="primary" size="sm">
            Save & Publish
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewJournal;
