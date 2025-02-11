import { Card, CardContent, Input } from "@mui/material";
import { useState, useEffect } from "react";


interface Staff {
  _id: string;
  firstname: string;
  lastname: string;
  designation: string;
}

interface SearchDropdownProps {
  options: Staff[];
  onSelect: (value: { id: string; name: string }) => void;
  placeholder?: string;
  label?: string;
}

const HelperSearchDropdown: React.FC<SearchDropdownProps> = ({
  options,
  onSelect,
  placeholder = "Search Helper...",
  label = "Select Helper",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Staff[]>(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          (option.firstname)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
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
                    id: option._id,
                    name: `${option.firstname} ${option.lastname}`,
                  });
                  setSearchTerm(`${option.firstname} ${option.lastname}`);
                  setIsOpen(false);
                }}
              >
                {option.firstname} 
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HelperSearchDropdown;
