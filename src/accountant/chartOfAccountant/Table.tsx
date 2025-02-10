import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchBar from "../../Accounts/Components/SearchBar";
import TableSkelton from "../../commoncomponents/Skelton/TableSkelton";
import TrashCan from "../../Accounts/Components/Trashcan";
import Eye from "../../assets/icons/Eye";
import NoDataFoundTable from "../../commoncomponents/Table/NoDataFoundTable";
import Pagination from "../../commoncomponents/Pagination/Pagination";
import NewAccountModal from "./NewAccountModal";
import ConfirmModal from "../../commoncomponents/ConfirmModal";

interface Account {
  _id: string;
  accountName: string;
  accountId: string;
  accountSubhead: string;
  accountHead: string;
  accountGroup: string;
  openingDate: string;
  description: string;
  createdDate?: string;
  createdTime?: string;
}

interface TableProps {
  accountData: any[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  loading: any;
  fetchAllAccounts: any;
}

const Table = ({
  accountData,
  searchValue,
  setSearchValue,
  loading,
  fetchAllAccounts,
}: TableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const maxVisiblePages = 5;

  // Process account data properly
  const processedAccounts = accountData.map((item) =>
    item?._doc
      ? {
          ...item._doc,
          createdDate: item.createdDate,
          createdTime: item.createdTime,
        }
      : item
  );

  // Filter accounts
  const filteredAccounts = processedAccounts
    .filter((account) => {
      const searchValueLower = searchValue.toLowerCase();
      return (
        account.accountName?.toLowerCase()?.includes(searchValueLower) ||
        account.accountSubhead?.toLowerCase()?.includes(searchValueLower) ||
        account.accountHead?.toLowerCase()?.includes(searchValueLower) ||
        account.description?.toLowerCase()?.includes(searchValueLower)
      );
    })
    .reverse();

  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage);
  const paginatedData = filteredAccounts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const [oneAccountData, setOneAccountData] = useState<any>({});

  console.log(oneAccountData, "oneAccountData");

  const { request: fetchOneItem } = useApi("get", 4000);
  const { request: deleteAccount } = useApi("delete", 4000);

  // Fetch one item details
  const getOneItem = async (item: Account) => {
    try {
      console.log("Fetching item:", item);
      const url = `${endpoints.GET_ONE_ACCOUNT}/${item._id}`;
      const { response, error } = await fetchOneItem(url);

      if (!error && response) {
        const formattedData = Array.isArray(response.data)
          ? response.data.map((item: any) => item._doc)
          : response.data?._doc
          ? [response.data._doc]
          : [];

        setOneAccountData(formattedData);
        console.log("Fetched and formatted data:", formattedData);
      } else {
        console.error("Failed to fetch one item data.");
      }
    } catch (error) {
      toast.error("Error fetching account details.");
      console.error("Error fetching account details", error);
    }
  };

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = `${endpoints.DELETE_ACCONUT}/${deleteId}`;
      const { response, error } = await deleteAccount(url);
  
      console.log("Delete Response:", response);
      console.log("Delete Error:", error);
  
      if (!error && response) {
        toast.success(response?.data?.message || "Account deleted successfully!");
  
        // Delay state updates to allow the toast to be displayed
        setTimeout(() => {
          fetchAllAccounts();
          setConfirmModalOpen(false);
          setDeleteId(null);
        }, 1000); // Adjust delay if necessary
      } else {
        toast.error(error?.response?.data?.message || "Error deleting account.");
      }
    } catch (error) {
      toast.error("Error deleting account.");
      console.error("Error deleting account", error);
    }
  };
  
  

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const tableHeaders = [
    "Sl.No",
    "Opening Date",
    "Account Name",
    "Account Type",
    "Parent Account Type",
    "Actions",
    "",
  ];

  return (
    <div>
      <SearchBar
        placeholder="Search"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <div className="min-h-[25rem] overflow-y-auto mt-1">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText sticky top-0 z-10">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              {tableHeaders.map((heading, index) => (
                <th
                  key={index}
                  className="py-3 px-4 font-medium border-b border-tableBorder"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px]">
            {loading.skeleton ? (
              [...Array(5)].map((_, idx) => (
                <TableSkelton key={idx} columns={tableHeaders} />
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item._id} className="relative">
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {new Date(item.createdDateTime).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountName}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountSubhead}
                  </td>
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {item.accountHead}
                  </td>
                  <td className="py-3 px-4 border-b border-tableBorder flex justify-center items-center gap-3">
                  <div onClick={() => getOneItem(item)}>
                      <NewAccountModal
                        page="Edit"
                        fetchAllAccounts={fetchAllAccounts}
                        accountData={oneAccountData}
                      />
                    </div>
                   

                   
                    <div
                      onClick={() => navigate(`/accountant/view/${item._id}`)}
                      className="cursor-pointer"
                    >
                      <Eye color="#569FBC" />
                    </div>
                    <div onClick={() => confirmDelete(item._id)}>
                      <TrashCan color="red" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={tableHeaders} />
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          maxVisiblePages={maxVisiblePages}
        />
      )}
      <ConfirmModal
  open={isConfirmModalOpen}
  onClose={() => setConfirmModalOpen(false)}
  onConfirm={handleDelete}
  message="Are you sure you want to delete this account?"
/>

    </div>
  );
};

export default Table;
