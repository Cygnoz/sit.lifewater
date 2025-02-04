import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import arrow from "../assets/images/arrow.png";
import start from "../assets/images/start.png";

const StartRide: React.FC = () => {
  const [storedUsername, setStoredUsername] = useState<any | null>(null);
  const firstname = JSON.parse(localStorage.getItem("firstname") || "{}");
  // Fetch localStorage data on mount
  useEffect(() => {
    setStoredUsername(firstname);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4">
      {/* Header */}
      <header className="w-full flex justify-end items-center p-4">
        <div className="flex items-center space-x-2">
          <div className="">
            <p className="text-[#000000] text-[14px] font-[700]">
              Hello,
              {storedUsername?.data.firstname}
            </p>
            <p className="text-sm">Welcome</p>
          </div>
          <img
            src={storedUsername?.data.profile}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow ">
        {/* Illustration */}
        <div className="mb-8">
          <img
            src={start} // Placeholder, replace with actual image
            alt="Delivery Man"
            className="w-full max-w-md"
          />
        </div>

        {/* Text Content */}
        <p className="text-center text-gray-600 mb-6">
        Bringing Life, One Drop at a Time.  </p>

        {/* Button */}
        <Link to={"/addstart"}>
          <button className="bg-[#820000] text-white px-6 py-3 rounded-lg shadow hover:bg-red-800 transition flex items-center gap-3">
            Start Your Ride <img src={arrow} alt="" width={15} />
          </button>
        </Link>
      </main>
    </div>
  );
};

export default StartRide;
