import { useState } from "react";
import Ellipsis from "../../assets/icons/Ellipsis";
import SearchBar from '../../components/SearchBar';
import { Link } from "react-router-dom";

interface Account {
  _id: string;
  accountName: string;
  accountCode: string;
  accountSubhead: string;
  accountHead: string;
  description: string;
}

const Table = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [accountData, setAccountData] = useState<Account[]>([
    {
      _id: "1",
      accountName: "Cash Account",
      accountCode: "CA001",
      accountSubhead: "Assets",
      accountHead: "Current Assets",
      description: "Cash in hand and bank balances.",
    },
    {
      _id: "2",
      accountName: "Revenue Account",
      accountCode: "RA002",
      accountSubhead: "Income",
      accountHead: "Operating Income",
      description: "Revenue from sales and services.",
    },
    
  ]);

  const tableHeaders = [
    "Account Name",
    "Account Code",
    "Account Type",
    "Documents",
    "Parent Account Type",
    "",
  ];

  const filteredAccounts = accountData.filter((account) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    return (
      account.accountName.toLowerCase().trim().startsWith(searchValueLower) ||
      account.accountCode.toLowerCase().trim().startsWith(searchValueLower) ||
      account.accountSubhead.toLowerCase().trim().startsWith(searchValueLower) ||
      account.accountHead.toLowerCase().trim().startsWith(searchValueLower) ||
      account.description.toLowerCase().trim().startsWith(searchValueLower)
    );
  });

  return (
    <div className="overflow-x-auto my-3 mx-5">
      <div className="mt-6">
        <SearchBar
          placeholder="Search"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      </div>
      <div className="overflow-y-scroll max-h-[25rem]">
        <table className="min-w-full bg-white my-5">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b  border-tableBorder">
                <input type="checkbox" className="form-checkbox w-4 h-4" />
              </th>
              {tableHeaders.map((heading, index) => (
                <th
                  className="py-2 px-4 font-medium  border-b  border-tableBorder"
                  key={index}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {filteredAccounts.reverse().map((item) => (
              <tr key={item._id} className="relative">
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input type="checkbox" className="form-checkbox w-4 h-4" />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <Link to={`/accountant/view/${item._id}?fromBank=true`}>
                    {item.accountName}
                  </Link>
                </td>
                <td className="py-2.5 px-4  border-y border-tableBorder">
                  {item.accountCode}
                </td>
                <td className="py-2.5 px-4  border-y border-tableBorder">
                  {item.accountSubhead}
                </td>
                <td className="py-2.5 px-4  border-y border-tableBorder">
                  {item.description}
                </td>
                <td className="py-2.5 px-4  border-y border-tableBorder">
                  {item.accountHead}
                </td>
                <td className="cursor-pointer py-2.5 px-4 border-y border-tableBorder">
                  <div className="flex justify-end">
                    <Ellipsis height={17} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
