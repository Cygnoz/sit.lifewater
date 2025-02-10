import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TableResponseContext } from "../../../assets/Context/ContextShare";
import useApi from "../../../Hook/UseApi";
import { endpoints } from "../../../services/ApiEndpoint";
import { toast } from "react-toastify";
import SearchBar from "../../../commoncomponents/Searchbar";
import PencilEdit from "../../../assets/icons/PencilEdit";
import Eye from "../../../assets/icons/Eye";
import TrashCan from "../../../Accounts/Components/Trashcan";
import NoDataFoundTable from "../../../commoncomponents/Table/NoDataFoundTable";
import ConfirmModal from "../../../commoncomponents/ConfirmModal";

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
  const { loading, setLoading } = useContext(TableResponseContext)!;
  const [journalData, setJournalData] = useState<Journal[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setConfirmModalOpen(true);
  };

  const { request: AllJournals } = useApi("get", 4000);
  const { request: deleteJournal } = useApi("delete", 4000);

  const tableHeaders = ["Date", "Journal", "Reference#", "Notes", "Amount", "Actions"];

  const getAllJournals = async () => {
    try {
      const url = `${endpoints.GET_ALL_JOURNALS}`;
      setLoading({ ...loading, skeleton: true });
      const { response, error } = await AllJournals(url);

      if (error || !response) {
        setLoading({ ...loading, skeleton: false, noDataFound: true });
        return;
      }
      setJournalData(response.data);
      setLoading({ ...loading, skeleton: false });
    } catch (error) {
      console.error("Something went wrong:", error);
      setLoading({ ...loading, noDataFound: true, skeleton: false });
    }
  };

  useEffect(() => {
    getAllJournals();
  }, []);

  const filteredJournals = journalData.filter((journal) =>
    journal.journalId?.toLowerCase().startsWith(searchValue.toLowerCase().trim())
  );

  const handleEditClick = (id: any) => {
    navigate(`/editjornal/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const url = `${endpoints.DELET_JOURNAL_ENTRY}/${deleteId}`;
      const { response, error } = await deleteJournal(url);

      if (!error && response) {
        toast.success(response.data.message);
        setJournalData((prevData) => prevData.filter((journal) => journal._id !== deleteId));
        await getAllJournals();
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting the journal.");
    } finally {
      setConfirmModalOpen(false);
      setDeleteId(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJournals.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="overflow-x-auto my-1">
      <div className="mb-3">
        <SearchBar onSearchChange={setSearchValue} searchValue={searchValue} placeholder="Search Journals" />
      </div>
      <table className="min-w-full bg-white mb-5">
        <thead className="text-[12px] text-center text-dropdownText">
          <tr style={{ backgroundColor: "#F9F7F0" }}>
            <th className="py-3 px-4 border-b border-tableBorder">Sl No</th>
            {tableHeaders.map((heading, index) => (
              <th className="py-2 px-4 font-medium border-b border-tableBorder" key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-dropdownText text-center text-[13px]">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={item._id} className="relative">
                <td className="py-2.5 px-4 border-y border-tableBorder">{indexOfFirstItem + index + 1}</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">{item.date}</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">{item.journalId || "-"}</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">{item.reference || "-"}</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">{item.note || "-"}</td>
                <td className="py-2.5 px-4 border-y border-tableBorder">{item.totalDebitAmount || "-"}</td>
                <td className="py-2.5 px-4 border-y border-tableBorder gap-3 flex justify-center items-center">
                  <div onClick={() => handleEditClick(item._id)}><PencilEdit color="#0B9C56" className="cursor-pointer" /></div>
                  <div onClick={() => navigate(`/accountant/manualjournal/view/${item._id}`)}><Eye color="#569FBC" className="cursor-pointer" /></div>
                  <div onClick={() => confirmDelete(item._id)}><TrashCan color="red" /></div>
                </td>
              </tr>
            ))
          ) : (
            <NoDataFoundTable columns={[...tableHeaders, "rr"]} />
          )}
        </tbody>
      </table>
      <div className="flex justify-center space-x-2">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="bg-red-900 text-white px-5 py-2 rounded-lg">Prev</button>
        <span className="text-sm text-gray-600">Page {currentPage}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastItem >= filteredJournals.length} className="bg-red-900 text-white px-5 py-2 rounded-lg">Next</button>
      </div>
      <ConfirmModal open={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={handleDelete} message="Are you sure you want to delete?" />
    </div>
  );
}

export default Table;
