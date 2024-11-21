import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import plus from "../../assets/circle-plus.svg";
import NewAccountModal from "./NewAccountModal";
import { getAllAccountsAPI } from "../../services/AccountsAPI/accounts";

const ChartOfAccounts = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const [accounts, setAccounts] = useState<Account[]>([]); // All accounts
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]); // Filtered accounts
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 5; // Items per page

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage); // Calculate total pages
  const currentAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); // Get accounts for the current page

  // Interface for account type
  interface Account {
    _id: string;
    accountName: string;
    accountId: string;
    accountSubhead: string;
    accountHead: string;
    accountGroup: string;
    description: string;
    __v: number;
  }

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      const accountsData = await getAllAccountsAPI(); // Fetch accounts
      setAccounts(accountsData); // Save accounts to state
      setFilteredAccounts(accountsData); // Initialize filtered accounts
    } catch (error: any) {
      console.error("Failed to fetch accounts:", error.message);
    }
  };

  // Update filtered accounts when searchQuery changes
  useEffect(() => {
    const filtered = accounts.filter((account) =>
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccounts(filtered);
    setCurrentPage(1); // Reset to the first page when search changes
  }, [searchQuery, accounts]);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Handle modal toggle
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle row click
  const handleRowClick = (id: string) => {
    navigate(`/accountant/view/${id}`);
  };

  // Handle pagination change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-2 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chart Of Accounts</h1>
          <p className="text-gray-600 mb-4">
            It serves as a framework for organizing financial data and helps ensure accurate and consistent reporting.
          </p>
        </div>
        <button
          onClick={handleModalToggle} // Toggle modal visibility
          className="bg-red-800 hover:bg-red-900 text-white px-2 py-3 text-sm rounded flex items-center"
        >
          <span className="mr-1">
            <img src={plus} alt="plus" />
          </span>
          New Account
        </button>
      </div>

      {/* Modal */}
      <NewAccountModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchAllAccounts={fetchAccounts}
      />

      <div className="bg-white rounded-lg shadow-lg p-2 w-full mx-auto">
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search accounts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            className="px-4 py-2 border w-full border-none rounded-lg focus:outline-none bg-gray-100"
          />
        </div>

        {/* Accounts Table */}
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#fdf8f0] font-semibold">
                <th className="py-3 px-6">Sl No</th>
                <th className="py-3 px-6">Account Name</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Account Type</th>
                <th className="py-3 px-6">Parent Account Type</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {currentAccounts.map((account, index) => (
                <tr
                  key={account._id}
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(account._id)} // Navigate to account details
                >
                  <td className="py-3 px-6">{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Generate Sl No */}
                  <td className="py-3 px-6">{account.accountName}</td>
                  <td className="py-3 px-6">{account.description || "No description"}</td>
                  <td className="py-3 px-6">{account.accountHead}</td>
                  <td className="py-3 px-6">{account.accountSubhead}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 mx-1 text-sm font-medium text-gray-700 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {"<"}
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-2 py-1 mx-1 text-sm font-medium border rounded ${
                currentPage === index + 1
                  ? "bg-red-800 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 mx-1 text-sm font-medium text-gray-700 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartOfAccounts;
