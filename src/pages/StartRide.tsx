import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import arrow from '../assets/images/arrow.png'
import start from '../assets/images/start.png'
import { BASEURL } from '../services/BaseURL';


const StartRide: React.FC = () => {
  const [storedUsername, setStoredUsername] = useState<string | null>(null);
  const [storedProfile, setStoredProfile] = useState<string | null>(null);

  // Retrieve username from session storage on component load
  useEffect(() => {
    const savedUsername = localStorage.getItem("firstname");
    const storedProfile = localStorage.getItem("profile");
    if (savedUsername && storedProfile) {
      console.log(savedUsername , storedProfile);
      setStoredUsername(savedUsername);
      setStoredProfile(storedProfile)
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4">
      {/* Header */}
      <header className="w-full flex justify-end items-center p-4">
        <div className="flex items-center space-x-2">
        <div className="">
              <p className="text-[#000000] text-[14px] font-[700]">
                Hello,
                {storedUsername ? (
                 <span> {storedUsername}</span>
                ) : (
                  <span>User</span>
                )}
              </p>
              <p className="text-sm">Welcome</p>
            </div>
            {storedProfile ? (
    <img 
      className="object-cover w-11 h-11 rounded-full" 
      src={`${BASEURL}/uploads/${storedProfile}`} 
      alt="Profile"
    />
  ) : (
    <img 
      className="object-cover w-11 h-11 rounded-full" 
      src="path/to/default-image.jpg" 
      alt="Default Profile"
    />
  )}
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
          Lorem ipsum dolor sit amet consectetur. Vulputate phasellus condimentum.
          Cursus nisl quisque.
        </p>

        {/* Button */}
        <Link to={'/addstart'}>
        <button className="bg-[#820000] text-white px-6 py-3 rounded-lg shadow hover:bg-red-800 transition flex items-center gap-3">
          Start Your Ride <img src={arrow} alt="" width={15}/>
        </button>
        
        </Link>
        
      </main>
    </div>
  );
};

export default StartRide;
