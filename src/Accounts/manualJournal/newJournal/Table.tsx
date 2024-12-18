import { useContext, useEffect, useMemo, useState } from "react";
import { endpoints } from "../../../services/ApiEndpoint";
import useApi from "../../../Hook/UseApi";
import { useNavigate } from "react-router-dom";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import SearchBar from "../../Components/SearchBar";

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
  const [journalData, setJournalData] = useState<Journal[]>([]);
  const [searchValue, setSearchValue] = useState<string>(""); // For search input
  const { request: AllJournals } = useApi("get", 4000);
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagination state
  const itemsPerPage = 7; // Number of items per page

  const getAllJournals = async () => {
    try {
      setLoading({ ...loading, skeleton: true, noDataFound: false });
      const url = `${endpoints.GET_ALL_JOURNALS}`;
      const { response, error } = await AllJournals(url);
      if (error || !response) {
        setLoading({ ...loading, skeleton: false, noDataFound: true });
        return;
      }
      setJournalData(response.data);
      setLoading({ ...loading, skeleton: false });
    } catch (error) {
      console.error("Something went wrong:", error);
      setLoading({ ...loading, skeleton: false, noDataFound: true });
    }
  };

  useEffect(() => {
    getAllJournals();
  }, []);

  const tableHeaders = ["Date","Journal ID", "Reference Rating", "Notes", "Amount", ""];

  // Filter journals based on the search value
  const filteredJournals = useMemo(() => {
    return journalData.filter((Journal) => {
      const searchValueLower = searchValue.toLowerCase().trim();
      return (
        (Journal.date?.toLowerCase()?.trim() || "").startsWith(searchValueLower) ||
        (Journal.journalId?.toLowerCase()?.trim() || "").startsWith(searchValueLower) ||
        (Journal.note?.toLowerCase()?.trim() || "").startsWith(searchValueLower) ||
        (Journal.reference?.toLowerCase()?.trim() || "").startsWith(searchValueLower) ||
        (Journal.totalDebitAmount?.toString()?.trim()?.toLowerCase() || "").startsWith(searchValueLower)
      );
    });
  }, [journalData, searchValue]);

  // Pagination logic
  const totalItems = filteredJournals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedJournals = useMemo(() => {
    return filteredJournals.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredJournals, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="overflow-x-auto my-1">
      {/* Search Bar */}
      <div className="mb-3">
        <SearchBar
          onSearchChange={handleSearchChange} // Update search filter
          searchValue={searchValue}
          placeholder="Search Journals"
        />
      </div>

      {/* Table */}
      <table className="min-w-full bg-white mb-5">
        <thead className="text-[12px] text-center text-dropdownText">
          <tr style={{ backgroundColor: "#F9F7F0" }}>
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
          {paginatedJournals.length > 0 ? (
            paginatedJournals.map((item) => (
              <tr
                onClick={() => navigate(`/viewjournal/${item._id}`)}
                key={item._id}
                className="relative cursor-pointer hover:bg-slate-50"
              >
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
                  {item?.totalDebitAmount}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeaders.length} className="py-4 text-center">
                {loading.skeleton ? "Loading..." : "No journals found."}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1 ? "bg-gray-300" : "bg-gray-200"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-red-800 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages ? "bg-gray-300" : "bg-gray-200"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
