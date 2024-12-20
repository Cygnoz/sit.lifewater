// import React, { useEffect, useRef, useState } from "react";
// import { Route } from "../Pages/Createroute";
// interface SortByProps {
//   onSortChange: (key: keyof Route, order: 'asc' | 'desc') => void;
// }


// const SortByMainRoute: React.FC<SortByProps> = ({ onSortChange }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSort = (key: keyof Route, order: 'asc' | 'desc') => {
//     onSortChange(key, order); // Notify parent
//     setIsDropdownOpen(false); // Close dropdown
//   };
  
//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Sort Button */}
//       <button
//         className="flex items-center border text-sm text-[#565148] font-medium border-[#565148] px-4 py-2 rounded-lg"
//         onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown
//       >
//         Sort By
//       </button>

//       {/* Dropdown */}
//       {isDropdownOpen && (
//         <ul className="absolute bg-white border border-gray-300 shadow-md rounded-md mt-2 w-48">
//         <li
//           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={() => handleSort("mainRouteName", "asc")}
//         >
//           Name (A-Z)
//         </li>
//         <li
//           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={() => handleSort("mainRouteName", "desc")}
//         >
//           Name (Z-A)
//         </li>
//         <li
//           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={() => handleSort("_id", "desc")}
//         >
//           Route Code (Latest Added)
//         </li>
//         <li
//           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//           onClick={() => handleSort("_id", "asc")}
//         >
//           Route Code (Earliest Added)
//         </li>
//       </ul>
      
//       )}
//     </div>
//   );
// };

// export default SortByMainRoute;
