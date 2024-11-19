import Ellipsis from "../../assets/icons/Ellipsis";
import Button from "../Components/Button";
import PlusCircle from "../Components/PlusIcon";
import { Link } from "react-router-dom";
import Table from "../manualJournal/newJournal/Table";
import ArrowDownIcon from "../Components/ArrowDownIcon";
import ArrowUpIcon from "../Components/ArrowUpIcon";
import { useEffect, useRef, useState } from "react";

type Props = {};

function ManualHome({}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownItems = [
    {
      icon: <ArrowDownIcon />,
      text: "Import Journel",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Journel",
      onClick: () => {
        console.log("Export Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Manage Journel",
      onClick: () => {
        console.log("Export Current View clicked");
      },
    },
  ];
  return (
    <>
      <div className="p-2 bg-slate-50 h-[100vh]">
        <div className="flex items-center">
          <div>
            <h3 className="font-bold text-2xl text-textColor">
              Manual Journels
            </h3>
            <p className="text-sm text-gray mt-1">
              Lorem ipsum dolor sit amet consectetur. Commodo enim odio
              fringilla egestas consectetur amet.
            </p>
          </div>
          <div className="ml-auto gap-3 flex items-center">
            <Link to={"/newjournal"}>
              <Button variant="primary" size="xl">
                <PlusCircle color="white" />
                <p className="text-sm">New Journel</p>
              </Button>
            </Link>
            <div className="relative">
              
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl z-10"
                >
                  <ul className="py-1 text-dropdownText">
                    {dropdownItems.map((item, index) => (
                      <li
                        key={index}
                        onClick={item.onClick}
                        className="px-4 py-2 flex items-center gap-2 hover:bg-orange-100 rounded-md text-sm cursor-pointer"
                      >
                        {item.icon}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div></div>
        </div>

        <div className="mt-5 bg-white  p-5 rounded-xl">

        

          <div>
            <Table/>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManualHome;
