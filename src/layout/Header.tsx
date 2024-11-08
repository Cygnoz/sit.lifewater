import React from "react";
import search from '../assets/images/headerassets/Search.svg';
import colors from '../assets/images/headerassets/colors.svg';
import profile from '../assets/images/headerassets/profile.svg';
import bell from '../assets/images/headerassets/bell.svg';
import settings from '../assets/images/headerassets/settings.svg';
import users from '../assets/images/headerassets/users.svg';
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate()

  const handleSettings = ()=>{
    navigate('/settings')
  }
  return (
    <div className="w-[1380px] py-1 border-b border-[#1c1c1c]/10 justify-start items-center gap-6 inline-flex">
      {/* Search Input */}
      <div className="grow shrink basis-0 h-[39px]  rounded-lg justify-start items-center gap-2 flex">
        <div className="grow shrink basis-0 h-5 rounded-lg items-center gap-2 flex relative">
          {/* Input with Icon */}
          <input
  className="grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex w-full h-full px-8 py-4 bg-[#1c1c1c]/5 text-[#585953] placeholder-gray-300 focus:outline-none"
  type="text"
  placeholder="Search"
/>


          <img
            src={search}
            alt="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        </div>
      </div>

      {/* Other Header Elements */}
      <div className="justify-start items-center gap-2 flex">
        <img src={colors} alt="View Apps" />
        <div className="text-[#4b5c79] text-xs font-semibold">View Apps</div>
      </div>
      
      {/* Company Select Dropdown */}
      {/* <div className="justify-start items-start flex">
        <div className="px-3 py-2.5 bg-[#f7e7ce] rounded-lg border border-[#585953] justify-center items-center gap-1 flex">
          
          <select id="company-select" className="ml-2 bg-[#f7e7ce] border-none text-[#585953]">
            <option value="company">Company</option>
            <option value="company">Company</option>
         
          </select>
        </div>
      </div> */}

      {/* Icons and Profile */}
      <div className="h-6 justify-start items-center gap-4 flex">
        <div className="rounded-lg justify-start items-center gap-2.5 flex">
          <img src={bell} alt="Notifications" />
          <img src={users} alt="Users" />
          <button onClick={handleSettings}><img  src={settings} alt="Settings" /></button>
          <img className="w-6 h-6 rounded-full" src={profile} alt="Profile" />
        </div>
      </div>
    </div>
  );
};

export default Header;
