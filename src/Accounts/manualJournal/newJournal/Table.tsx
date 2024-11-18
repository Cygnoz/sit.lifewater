import { useState } from "react";
import Ellipsis from '../../../assets/icons/Ellipsis';
import SearchBar from '../../Components/Searchbar';
import { useNavigate } from "react-router-dom";

interface Journal {
  _id: string;
  date: string;
  journalId: string;
  reference: string;
  note: string;
  status: string;
  totalDebitAmount: string;
}

type Props = {};

function Table({}: Props) {
  const navigate = useNavigate();
  const [journalData, setJournalData] = useState<Journal[]>([
    {
      _id: "1",
      date: "2024-11-15",
      journalId: "JRN-001",
      reference: "REF-1234",
      note: "Monthly Expenses",
      status: "Approved",
      totalDebitAmount: "1200.50",
    },
    {
      _id: "2",
      date: "2024-11-14",
      journalId: "JRN-002",
      reference: "REF-5678",
      note: "Office Supplies",
      status: "Pending",
      totalDebitAmount: "450.00",
    },
    {
      _id: "3",
      date: "2024-11-13",
      journalId: "JRN-003",
      reference: "REF-9101",
      note: "Travel Expenses",
      status: "Rejected",
      totalDebitAmount: "800.75",
    },
    {
      _id: "4",
      date: "2024-11-12",
      journalId: "JRN-004",
      reference: "REF-1122",
      note: "Employee Benefits",
      status: "Approved",
      totalDebitAmount: "1500.00",
    },
  ]);
  const [searchValue, setSearchValue] = useState<string>("");

  const tableHeaders = [
    "Date",
    "Journal",
    "Reference Rating",
    "Notes",
    "Status",
    "Amount",
    "",
  ];

  const filteredJournals = journalData.filter((Journal) => {
    const searchValueLower = searchValue.toLowerCase().trim();
    return (
      Journal.date.toLowerCase().trim().startsWith(searchValueLower) ||
      Journal.journalId.toLowerCase().trim().startsWith(searchValueLower) ||
      Journal.note.toLowerCase().trim().startsWith(searchValueLower) ||
      Journal.reference.toLowerCase().trim().startsWith(searchValueLower) ||
      Journal.totalDebitAmount
        .toString()
        .trim()
        .toLowerCase()
        .startsWith(searchValueLower)
    );
  });

  return (
    <div className="overflow-x-auto my-1">
      <div className="mb-3">
        <SearchBar
          onSearchChange={setSearchValue}
          searchValue={searchValue}
          placeholder="Search Journals"
        />
      </div>
      <table className="min-w-full bg-white mb-5">
        <thead className="text-[12px] text-center text-dropdownText">
          <tr style={{ backgroundColor: "#F9F7F0" }}>
            <th className="py-3 px-4 border-b border-tableBorder">
              <input type="checkbox" className="form-checkbox w-4 h-4" />
            </th>
            {tableHeaders.map((heading, index) => (
              <th
                className="py-2 px-4 font-medium border-b border-tableBorder"
                key={index}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-dropdownText text-center text-[13px]">
          {filteredJournals && filteredJournals.length > 0 ? (
            filteredJournals.reverse().map((item) => (
              <tr
                onClick={() => navigate(`/viewjournal/${item._id}`)}
                key={item._id}
                className="relative"
              >
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input type="checkbox" className="form-checkbox w-4 h-4" />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.date}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.journalId}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.reference}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.note}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.status}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.totalDebitAmount}
                </td>
                <td className="cursor-pointer py-2.5 px-4 border-y border-tableBorder">
                  <div className="flex justify-end">
                    <Ellipsis height={17} />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeaders.length + 1} className="py-4 text-center">
                No journals found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
