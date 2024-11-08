import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import navlist from '../assets/constants/index';

interface SidebarProps {
  onSelect: (nav: string, subhead: any[]) => void; // Pass subhead array to the parent as well
  className:string
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const [selectedNav, setSelectedNav] = useState(''); // State for the selected nav

  const handleClick = (route: string, nav: string, subhead: any[]) => {
    setSelectedNav(nav); // Set the selected nav
    onSelect(nav, subhead); // Notify parent about the selected nav item and subhead
    navigate(route); // Navigate to the route
  };

  return (
    <div className="w-[76px] h-[1200px] pt-[50px] pb-[134px] bg-[#820000] flex-col justify-start items-center inline-flex">
      <div className="h-[860px] flex-col justify-center items-center gap-2 inline-flex">
        {navlist.map((item, index) => (
          <div
            key={index}
            className={`self-stretch h-[54px] flex-col justify-start items-center gap-1.5 flex rounded-lg p-2 cursor-pointer transition-all duration-200 ease-in-out ${
              selectedNav === item.nav ? 'bg-[#530015]' : 'hover:bg-[#530015]' // Apply background color for selected item
            }`}
            onClick={() => handleClick(item.route, item.nav, item.subhead || [])}
          >
            <div className="w-[42px] h-9 px-2.5 rounded-lg flex-col justify-center items-center gap-2 flex">
              <div className="justify-start items-center gap-2 inline-flex">
                <img src={item.icon} alt={item.nav} />
              </div>
            </div>
            <div className="self-stretch text-center text-[#f7e7ce] text-[10px] font-semibold">
              {item.nav}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
