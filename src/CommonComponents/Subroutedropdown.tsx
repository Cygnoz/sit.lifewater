import { Card, CardContent, Input } from "@mui/material";
import { useState, useEffect } from "react";

interface SubRoute {
    _id: string;
  subRouteName: string;
  stock: any[];
}

interface SearchDropdownProps {
  options: SubRoute[];
  onSelect: (value: { subRouteId: string; subRouteName: string; stock: any[] }) => void;
  placeholder?: string;
  label?: string;
}

const SubrouteSearchDropdown: React.FC<SearchDropdownProps> = ({
  options,
  onSelect,
  placeholder = "Search sub route...",
  label = "Select Sub Route",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<SubRoute[]>(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.subRouteName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  return (
    <div className="relative w-full sm:w-64">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring"
      />
      {isOpen && filteredOptions.length > 0 && (
        <Card className="absolute z-10 mt-1 w-full rounded-lg shadow-lg max-h-48 overflow-y-auto">
          <CardContent className="p-2">
            {filteredOptions.map((option) => (
              <div
                key={option._id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md"
                onMouseDown={() => {
                  onSelect({
                    subRouteId: option._id,
                    subRouteName: option.subRouteName,
                    stock: option.stock,
                  });
                  setSearchTerm(option.subRouteName);
                  setIsOpen(false);
                }}
              >
                {option.subRouteName} 
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubrouteSearchDropdown;
