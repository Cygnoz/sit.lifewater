import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../assets/images/home.svg';

interface SubHeaderProps {
  selectedNav: string; // Declare selectedNav as a prop
  subhead: { headName: string; subRoute: string }[]; // Receive subhead data
}

const SubHeader: React.FC<SubHeaderProps> = ({subhead}) => {
  const navigate = useNavigate();
  const [selectedSubhead, setSelectedSubhead] = useState(subhead.length > 0 ? subhead[0].headName : ''); // State for the selected subhead

  const handleSubheadClick = (subRoute: string, headName: string) => {
    setSelectedSubhead(headName); // Set the selected subhead
    navigate(subRoute); // Navigate to the selected subRoute
  };

  return (
    <>
    <div className="w-[1380px] h-[65px] px-8 py-[12px] bg-[#e3e6d5] rounded-[40px] flex items-center gap-4 mt-4">
      <div className="px-3 py-1 bg-white rounded-[30px] flex items-center">
        <div className="h-8 px-0.5 rounded-[56px] flex items-center">
          <img src={Home} alt="Home" />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* <div className="px-4 py-2 rounded-[30px] flex items-center gap-2.5">
          <div className="text-[#585953] text-base font-bold">
            {selectedNav} 
          
          </div>
        </div> */}

        {/* Render subhead items next to selected navigation */}
        {subhead.length > 0 && (
          <div className="flex gap-2">
            {subhead.map((subItem, index) => (
              <div
                key={index}
                className={`cursor-pointer text-[#585953] text-base font-bold p-2 rounded-full transition-all duration-300 ${
                  selectedSubhead === subItem.headName ? 'bg-[#FCFFED] text-[#000000]' : 'hover:bg-[#FCFFED]'
                }`}
                onClick={() => handleSubheadClick(subItem.subRoute, subItem.headName)}
              >
                {subItem.headName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Align the frame image to the end */}
      {/* <div className="ml-auto">
        <img src={frame} alt="Frame" />
      </div> */}
    </div>
    </>
  );
};

export default SubHeader;
