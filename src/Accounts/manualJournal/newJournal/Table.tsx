import { useState, useEffect } from "react";

import SearchBar from '../../Components/SearchBar';
import { useNavigate } from "react-router-dom";
import { getAllJournalsAPI } from "../../../services/AccountsAPI/Journal";


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
  const [journalData, setJournalData] = useState<Journal[]>([]);  // Initialize empty array for journalData
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch journals on component mount
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const journals = await getAllJournalsAPI(); // Fetch data using the API function
        setJournalData(journals);  // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };
    fetchJournals();
  }, []);  // Empty dependency array to run only once when the component mounts

  const tableHeaders = [
    "Date",
    // "Journal",
    "Reference Rating",
    "Notes",
    // "Status",
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
            {/* <th className="py-3 px-4 border-b border-tableBorder">
              <input type="checkbox" className="form-checkbox w-4 h-4" />
            </th> */}
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
                className="relative cursor-pointer hover:bg-slate-50"
              >
                {/* <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input type="checkbox" className="form-checkbox w-4 h-4" />
                </td> */}
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.date}
                </td>
                {/* <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.journalId}
                </td> */}
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.reference}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.note}
                </td>
                {/* <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.status}
                </td> */}
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {item?.totalDebitAmount}
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
