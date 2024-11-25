import { useState } from "react";
import SearchBar from "../Searchbar";
import NoDataFoundTable from "./NoDataFoundTable";
import Eye from "../../assets/icons/Eye";
import Pen from "../../assets/icons/Pen";
import Trash2 from "../../assets/icons/Trash2";
import TableSkelton from "../Skelton/TableSkelton";
import PrintButton from "../Buttons/PrintButton";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (id: string) => void;
  renderColumnContent?: (colId: string, item: any) => JSX.Element;
  searchPlaceholder: string;
  loading: boolean;
  searchableFields: string[];
  setColumns?: any;
}

const PurchaseTable: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  renderColumnContent,
  searchPlaceholder,
  loading,
  searchableFields,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;

  const filteredData = data?.filter((item) => {
    return searchableFields
      .map((field) => item[field]?.toString().trim().toLowerCase())
      .some((fieldValue) =>
        fieldValue?.includes(searchValue.toLowerCase().trim())
      );
  });



  const visibleColumns = columns.filter((col) => col.visible);
  const skeletonColumns = [...visibleColumns, {}, {}, {}];

  return (
    <div>
      <div className="flex items-center gap-4 justify-between">
        <SearchBar
          placeholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={(value) => {
            setSearchValue(value);
            setCurrentPage(1);
          }}
        />
        <PrintButton />
      </div>

      <div className="overflow-x-auto mt-3  max-h-[25rem] text-">
        <table className="min-w-full bg-white mb-5">
          <thead className="text-[12px] text-center text-dropdownText text-Text">
            <tr style={{ backgroundColor: "#F9F7F0" }}>
              <th className="py-3 px-4 border-b border-tableBorder">SL No.</th>
              {columns.map(
                (col) =>
                  col.visible && (
                    <th
                      key={col.id}
                      className="py-2 px-4 font-medium border-b border-tableBorder"
                    >
                      {col.label}
                    </th>
                  )
              )}
              <th className="py-3 px-2 font-medium border-b border-tableBorder">
                Action
              </th>
              <th className="py-3 px-2 font-medium border-b border-tableBorder">
                {/* <CustomiseColmn columns={columns} setColumns={setColumns} /> */}
              </th>
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px] text-Text_2">
            {loading ? (
              [...Array(rowsPerPage)].map((_, idx) => (
                <TableSkelton key={idx} columns={skeletonColumns} />
              ))
            ) : filteredData && filteredData.length > 0 ? (
              filteredData.map((item, rowIndex) => (
                <tr
                  key={item.id}
                  className="relative cursor-pointer"
                >
                  <td className="py-2.5 px-4 border-y border-tableBorder">
                    {(currentPage - 1) * rowsPerPage + rowIndex + 1}
                  </td>
                  {columns.map(
                    (col) =>
                      col.visible && (
                        <td
                          key={col.id}
                          className="py-2.5 px-4 border-y border-tableBorder text-center"
                        >
                          {renderColumnContent
                            ? renderColumnContent(col.id, item) || "-"
                            : item[col.id] !== undefined &&
                              item[col.id] !== null
                            ? item[col.id]
                            : "-"}
                        </td>
                      )
                  )}
                  <td className="py-3 px-4 border-b border-tableBorder flex items-center justify-center gap-2">
                    <Pen color="#0B9C56" size={18} />
                   <button                   onClick={() => onRowClick && onRowClick(item._id)}
                   > <Eye color={"#569FBC"} />{" "}</button>
                    <Trash2 color="#EA1E4F" size={18} />{" "}
                  </td>

                  <td className="py-3 px-4 border-b border-tableBorder"></td>
                </tr>
              ))
            ) : (
              <NoDataFoundTable columns={skeletonColumns} />
            )}
          </tbody>
        </table>
      </div>

   
    </div>
  );
};

export default PurchaseTable;
