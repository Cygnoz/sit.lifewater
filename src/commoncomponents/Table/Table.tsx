import React, { useState } from "react";
import SearchBar from "../Searchbar";
import NoDataFoundTable from "./NoDataFoundTable";
import Eye from "../../assets/icons/Eye";
import Pen from "../../assets/icons/Pen";
import Trash2 from "../../assets/icons/Trash2";
import TableSkelton from "../Skelton/TableSkelton";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (id: string) => void;
  onViewClick?: (id: string) => void;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  renderColumnContent?: (colId: string, item: any) => JSX.Element;
  searchPlaceholder: string;
  loading: boolean;
  searchableFields: string[];
  showAction?: boolean;
}

const PurchaseTable: React.FC<TableProps> = ({
  columns,
  data,
  onViewClick,
  onEditClick,
  onDeleteClick,
  renderColumnContent,
  searchPlaceholder,
  loading,
  searchableFields,
  showAction = true,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  const filteredData = data?.filter((item) =>
    searchableFields.some((field) =>
      item[field]?.toString().trim().toLowerCase().includes(searchValue.toLowerCase().trim())
    )
  );

  const visibleColumns = columns.filter((col) => col.visible);
  const skeletonColumns = showAction ? [...visibleColumns, {}, {}, {}] : [...visibleColumns];

  const totalPages = Math.ceil((filteredData?.length || 0) / rowsPerPage);
  const currentData = filteredData?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex items-center gap-4 justify-between">
        <SearchBar
          placeholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={(value) => {
            setSearchValue(value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-3 max-h-[34rem]">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText text-Text">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">SL No.</th>
              {visibleColumns.map((col) => (
                <th key={col.id} className="py-2 px-4 font-medium border-b border-tableBorder">
                  {col.label}
                </th>
              ))}
              {showAction && <th className="py-3 px-2 font-medium border-b border-tableBorder">Action</th>}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px] text-Text_2">
            {loading ? (
              [...Array(rowsPerPage)].map((_, idx) => <TableSkelton key={idx} columns={skeletonColumns} />)
            ) : currentData && currentData.length > 0 ? (
              currentData.map((item, rowIndex) => (
                <tr key={item._id || rowIndex} className="relative cursor-pointer hover:bg-[#F9F7F0]">
                  {/* Serial Number */}
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                  </td>

                  {/* Table Data */}
                  {visibleColumns.map((col) => (
                    <td key={col.id} className="py-2.5 px-4 border-y border-tableBorder text-center">
                      {renderColumnContent
                        ? renderColumnContent(col.id, item) || "-"
                        : item[col.id] !== undefined &&
                          item[col.id] !== null &&
                          item[col.id].toString().trim() !== ""
                        ? item[col.id]
                        : "-"}
                    </td>
                  ))}

                  {/* Actions */}
                  {showAction && (
                    <td className="py-3 px-4 border-b border-tableBorder flex items-center justify-center gap-2">
                      {onEditClick && (
                        <button onClick={() => onEditClick(item._id)} aria-label="Edit">
                          <Pen color="#0B9C56" size={18} />
                        </button>
                      )}
                      {onViewClick && (
                        <button onClick={() => onViewClick(item._id)} aria-label="View">
                          <Eye color="#569FBC" />
                        </button>
                      )}
                      {onDeleteClick && (
                        <button onClick={() => onDeleteClick(item._id)} aria-label="Delete">
                          <Trash2 color="#EA1E4F" size={18} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={skeletonColumns} />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PurchaseTable;
