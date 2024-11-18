import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";


interface Account {
  _id: string;
  accountName: string;
  accountCode: string;
  accountSubhead: string;
  accountHead: string;
  description: string;
}

const CashAccountsTable = () => {
  const [accountData, setAccountData] = useState<Account[]>([
    {
        _id: "1",
        accountName: "Petty Cash",
        accountCode: "PC001",
        accountSubhead: "Cash",
        accountHead: "Assets",
        description: "Small cash amounts for day-to-day expenses.",
      },
    
  ]);
  const [searchValue, setSearchValue] = useState<string>("");




  const filteredAccounts = accountData.filter((account: Account) => {
    const searchValueLower = searchValue.toLowerCase();
    return (
      account.accountName.toLowerCase().startsWith(searchValueLower) ||
      account.accountCode.toLowerCase().startsWith(searchValueLower) ||
      account.accountSubhead.toLowerCase().startsWith(searchValueLower) ||
      account.accountHead.toLowerCase().startsWith(searchValueLower) ||
      account.description.toLowerCase().startsWith(searchValueLower)
    );
  });

  const tableHeaders = [
    "Account Name",
    "Account Code",
    "Account Type",
    "Documents",
    "Parent Account Type",
  ];

  return (
    <div>
      <SearchBar
        placeholder="Search"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <div className="max-h-[25rem] overflow-y-auto mt-3">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText sticky top-0 z-10">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">
                <input type="checkbox" className="form-checkbox w-4 h-4" />
              </th>
              {tableHeaders.map((heading, index) => (
                <th className="py-2 px-4 font-medium border-b border-tableBorder" key={index}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {filteredAccounts.map((item: Account) => (
              <tr key={item._id} className="relative">
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input type="checkbox" className="form-checkbox w-4 h-4" />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <Link
                    to={`/accountant/view/${item._id}?fromCash=true`}
                  >
                    {item.accountName}
                  </Link>
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.accountCode}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.accountSubhead}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.description}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item.accountHead}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashAccountsTable;
