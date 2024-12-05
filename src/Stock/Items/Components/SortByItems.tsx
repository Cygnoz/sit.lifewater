import React, { useEffect, useRef, useState } from "react";

interface SortByProps {
  onSortChange: (key: string, order: string) => void; // Callback to notify parent
}

const SortBy: React.FC<SortByProps> = ({ onSortChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (key: string, order: string) => {
    onSortChange(key, order); // Notify parent of the selected sort method
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative" ref={dropdownRef}>
    {/* Sort Button */}
    <button
      className="flex items-center border text-sm text-[#565148] font-medium border-[#565148] px-4 py-2 rounded-lg"
      onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown
    >
      Sort By
    </button>

    {/* Dropdown */}
    {isDropdownOpen && (
      <ul className="absolute bg-white border border-gray-300 shadow-md rounded-md mt-2 w-48">
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleSort("itemName", "asc")}
        >
          Name (A-Z)
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleSort("itemName", "desc")}
        >
          Name (Z-A)
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleSort("costPrice", "asc")}
        >
          Cost Price (Low-High)
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleSort("costPrice", "desc")}
        >
          Cost Price (High-Low)
        </li>
      </ul>
    )}
  </div>
  );
};

export default SortBy;
