import { useState } from "react";
import back from '../../assets/images/backbutton.svg'

const CreateProfile: React.FC = () => {

    // const [whatsappSameAsMobile, setWhatsappSameAsMobile] = useState(false);
  
    // const handleWhatsappCheckbox = () => {
    //   setWhatsappSameAsMobile(!whatsappSameAsMobile);
    //   if (!whatsappSameAsMobile) {
    //     setWhatsappNumber(workPhone); // Set WhatsApp number to work phone if checkbox is checked
    //   } else {
    //     setWhatsappNumber(''); // Clear WhatsApp number if checkbox is unchecked
    //   }
    // };  
  
    const [profile, setProfile] = useState(null) // Local state for profile image

  
  
    const handleProfileChange = (e:any) => {
      const file = e.target.files[0] // Get the selected file
      if (file) {
        setProfile(file) // Update local state with the selected file
      }
    }

    return (
  <div>
    <div className="flex gap-3 items-center w-full max-w-8xl mb-4 ms-3 p-3">
     <div className="icon-placeholder">
         <img className='bg-gray-200 rounded-full p-2' src={back} alt="" />
        </div>
        <h2 className="text-[20px] text-[#303F58] font-bold">Create Profile</h2>
      </div>

      <div className="w-full mx-auto p-10 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer type */}
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Company Name</label>
          <input
            type="text"
            // value={insuranceStatus}
            // onChange={(e) => setInsuranceStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Life Water"
            required
          />
        </div>
        {/* Uploaded Image */}
        <div className="flex">
          <div className="w-[84px] h-[84px] bg-[#F7E7CE] rounded-lg overflow-hidden">
            <img src={profile? URL.createObjectURL(profile) :"nbvnb"} alt="" className="object-cover w-24" />
          </div>
          <div className="mx-5">
          <h2 className="font-bold mb-4 text-[#303F58]">Uploaded Company Logo</h2>
          {/* <p className="text-[#8F99A9] text-base font-[14px]">Upload company logo</p> */}
          <label className="mt-4 p-2 border text-[#8F99A9] text-base font-[14px] rounded-lg cursor-pointer">
                      Upload Company Logo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileChange} // Handle file change
                        required
                      />
                    </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
        {/* company name */}
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Industry</label>
          <select name="taxPreference" className="w-full text-[#303F58] text-[14px] font-normal h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-[#303F58] text-[14px]" value="">Sales</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>
        </div>
        {/* customer website */}
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Currency</label>
          <input
            type="text"
            // value={vehicleNumber}
            // onChange={(e) => setVehicleNumber(e.target.value)}
            className="w-[600px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="United Arab Emirates"
            required
          />
          <input
            type="text"
            // value={vehicleNumber}
            // onChange={(e) => setVehicleNumber(e.target.value)}
            className="w-[50px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="INR"
            required
          />
        </div>
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Building Address</label>
          <textarea className="w-full border border-gray-300 p-2 rounded-md h-[118px]" ></textarea>
        </div>
        {/* email, landmark */}
        <div>
        <div className="mt-6">
          <label className="block text-[#303F58] font-[14px] mb-2">Phone</label>
          <input
            type="text"
            // value={insuranceStatus}
            // onChange={(e) => setInsuranceStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=""
            required
          />
        </div>
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2"></label>
          <input
            type="text"
            // value={insuranceStatus}
            // onChange={(e) => setInsuranceStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Pin Code"
            required
          />
        </div>            
        </div>

        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Mobile</label>
          <input
            type="text"
            // value={insuranceStatus}
            // onChange={(e) => setInsuranceStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="12345678"
            required
          />
        </div>
        {/* customer website */}
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Website</label>
          <input
            type="text"
            // value={insuranceStatus}
            // onChange={(e) => setInsuranceStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="LifeWater@gmail.com"
            required
          />
        </div>

        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Date</label>
          <input
            type="date"
            // value={insuranceStatus}
            // onChange={(e) => setInsuranceStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Life Water"
            required
          />        </div>
        {/* customer website */}
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Financial Year</label>
          <select name="taxPreference" className="w-full text-[#303F58] text-[14px] font-normal h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-[#303F58] text-[14px]" value="">March-April</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>
        </div>

        <div className="flex mb-4">
            <div>
            <label className="block text-[#303F58] font-[14px] mb-2">Business Location</label>
            <select name="taxPreference" className="w-[393px] gap-[126px] text-[#303F58] text-[14px] font-normal h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-[#303F58] text-[14px]" value="">United Arab Emirates</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>
        </div>
        <div>
        <select name="taxPreference" className="w-[393px] ms-6 mt-8  text-[#303F58] text-[14px] font-normal h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-[#303F58] text-[14px]" value="">Abu Dhabi Emirates</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>
        </div>
        <div>
        <select name="taxPreference" className="w-[393px] ms-6 mt-8 text-[#303F58] text-[14px] font-normal h-[36px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-[#303F58] text-[14px]" value="">Abu Dhabi Muncipality</option>
                  <option value="exclusive">exclusive</option>
                  <option value="inclusive">inclusive</option>
                </select>

        </div>
        </div>
            
        </div>
        <div>
        <div>
          <label className="block text-[#303F58] font-[14px] mb-2">Bank Account Details</label>
          <textarea className="w-[650px] border border-gray-300 p-2 rounded-md h-[78px]" placeholder="Enter your bank accoun details" ></textarea>
        </div>
        </div>


      {/* Buttons */}
      <div className="flex justify-end mt-6">
        <button
          className="px-3 py-1 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]"
          type="button"
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]"
          type="submit"
        >
          Save
        </button>
      </div>
    </div>

  </div>
    );
  };
   
  export default CreateProfile;

