import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import search from "../assets/images/headerassets/Search.svg";
import navlist from "../assets/constants";


const Header: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Filter main menu and subheads
    const filtered = navlist
      .flatMap((item) => [
        { name: item.nav, route: item.route },
        ...(item.subhead?.map((sub) => ({ name: sub.headName, route: sub.subRoute })) || []),
      ])
      .filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));

    setSuggestions(filtered);
  };

  const handleSelect = (route: string) => {
    navigate(route);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative w-[1380px] py-1 border-b border-[#1c1c1c]/10 justify-start items-center gap-6 inline-flex">
      {/* Search Input */}
      <div className="grow shrink basis-0 h-[39px] rounded-lg justify-start items-center gap-2 flex">
        <div className="grow shrink basis-0 h-5 rounded-lg items-center gap-2 flex relative">
          <input
            className="grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex w-full h-full px-8 py-4 bg-[#1c1c1c]/5 text-[#585953] placeholder-gray-300 focus:outline-none"
            type="text"
            placeholder="Search"
            value={query}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && suggestions.length > 0 && handleSelect(suggestions[0].route)}
          />
          <img src={search} alt="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-50">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(item.route)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Header;
