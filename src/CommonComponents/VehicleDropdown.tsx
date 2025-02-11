import { Card, CardContent, Input } from "@mui/material";
import { useState, useEffect } from "react";

interface Vehicle {
  _id: string;
  vehicleNo: string;
}

interface SearchDropdownProps {
  options: Vehicle[];
  onSelect: (value: { id: string; vehicleNo: string }) => void;
  placeholder?: string;
  label?: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  options,
  onSelect,
  placeholder = "Search vehicle...",
  label = "Select Vehicle",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Vehicle[]>(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
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
                  onSelect({ id: option._id, vehicleNo: option.vehicleNo });
                  setSearchTerm(option.vehicleNo);
                  setIsOpen(false);
                }}
              >
                {option.vehicleNo} 
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchDropdown;
