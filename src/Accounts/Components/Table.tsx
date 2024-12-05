// import { useNavigate } from "react-router-dom";
// import Ellipsis from "../../assets/icons/Ellipse";
// import SearchBar from "../../commoncomponents/Searchbar";
// import { useContext } from "react";
// import { TableResponseContext } from "../../assets/Context/ContextShare";

// interface Account {
//   _id: string;
//   accountName: string;
//   accountCode: string;
//   accountSubhead: string;
//   accountHead: string;
//   description: string;
// }

// interface TableProps {
//   accountData: Account[];
//   searchValue: string;
//   setSearchValue: (value: string) => void;
// }

// const Table = ({ accountData, searchValue, setSearchValue }: TableProps) => {
//   const navigate = useNavigate();
//   const { loading, setLoading } = useContext(TableResponseContext)!;
//   const filteredAccounts = accountData.filter((account) => {
//     const searchValueLower = searchValue.toLowerCase();
//     return (
//       account.accountName?.toLowerCase()?.startsWith(searchValueLower) ||
//       account.accountCode?.toLowerCase()?.startsWith(searchValueLower) ||
//       account.accountSubhead?.toLowerCase()?.startsWith(searchValueLower) ||
//       account.accountHead?.toLowerCase()?.startsWith(searchValueLower) ||
//       account.description?.toLowerCase()?.startsWith(searchValueLower)
//     );
//   });

//   const tableHeaders = [
//     "Account Name",
//     "Account Code",
//     "Account Type",
//     "Documents",
//     "Parent Account Type",
//     "",
//   ];

//   return (
//     <div>
//       <SearchBar
//         placeholder="Search"
//         searchValue={searchValue}
//         onSearchChange={setSearchValue}
//       />
//       <div className="max-h-[25rem] overflow-y-auto mt-1">
//         <table className="min-w-full bg-white mb-5">
//           <thead className="text-[12px] text-center text-dropdownText sticky top-0 z-10">
//             <tr style={{ backgroundColor: "#F9F7F0" }}>
//               {tableHeaders.map((heading, index) => (
//                 <th
//                   className="font-medium border-b border-tableBorder"
//                   key={index}
//                 >
//                   {heading}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="text-dropdownText text-center ">
//             {filteredAccounts.length > 0 ? (
//               filteredAccounts.reverse().map((item) => (
//                 <tr
//                   onClick={() => navigate(`/accountant/view/${item._id}`)}
//                   key={item._id}
//                   className="relative cursor-pointer hover:bg-slate-50"
//                 >
//                   <td className=" border-y border-tableBorder">
//                     {item.accountName}
//                   </td>
//                   <td className=" border-y border-tableBorder">
//                     {item.accountCode}
//                   </td>
//                   <td className=" border-y border-tableBorder">
//                     {item.accountSubhead}
//                   </td>
//                   <td className=" border-y border-tableBorder">
//                     {item.description}
//                   </td>
//                   <td className=" border-y border-tableBorder">
//                     {item.accountHead}
//                   </td>
//                   <td className="cursor-pointer  border-y border-tableBorder">
//                     <div className="flex justify-end">
//                       <Ellipsis height={17} />
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={tableHeaders.length} className="py-4 text-center">
//                   {loading.skeleton ? "Loading..." : "No accounts found."}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Table;
