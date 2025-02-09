import { useEffect } from "react";
import SearchDropdown from "./SearchDropdown";
import CehvronDown from "../../../assets/icons/cheveronDown";

interface AccountOption {
  _id: string;
  accountName: string;
}

interface AccountDropdownProps {
  index: number;
  account: string;
  accountOptions: AccountOption[];
  isDropdownOpen: boolean;
  search: string;
  onAccountSelect: (index: number, account: AccountOption) => void;
  onSearchChange: (index: number, value: string) => void;
  onDropdownToggle: (index: number, isOpen: boolean) => void;
  clearSearch: (index: number) => void;
}

const AccountDropdown = ({
  index,
  account,
  accountOptions = [], // Ensure a default empty array
  isDropdownOpen,
  search = "",
  onAccountSelect,
  onSearchChange,
  onDropdownToggle,
  clearSearch,
}: AccountDropdownProps) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (event.target instanceof Element && !event.target.closest(".dropdown-container")) {
      onDropdownToggle(index, false);
      clearSearch(index);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <td className="px-6 py-4 whitespace-nowrap relative dropdown-container">
      <div
        className="flex items-center border rounded-md border-inputBorder"
        onClick={() => onDropdownToggle(index, !isDropdownOpen)}
      >
        <input
          type="text"
          placeholder="Select Account"
          value={account || ""}
          readOnly
          className="rounded-md cursor-pointer text-sm p-2 w-full focus:outline-none"
        />
        <div className="-ms-8">
          <CehvronDown color="#818894" />
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 p-2 w-[102%] bg-white border border-tableBorder rounded-lg mt-1">
          <SearchDropdown
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(index, e.target.value)}
          />
          <ul className="overflow-y-auto text-start h-48">
  {(accountOptions || [])
    .filter((option) => option?.accountName?.toLowerCase().includes(search.toLowerCase()))
    .map((option) => (
      <li
        key={option._id}
        onClick={() => onAccountSelect(index, option)}
        className="p-2 cursor-pointer border text-sm border-dropdownBorder text-textColor font-semibold mt-2 rounded-lg bg-CreamBg"
      >
        {option.accountName}
      </li>
    ))}
</ul>

        </div>
      )}
    </td>
  );
};

export default AccountDropdown;
