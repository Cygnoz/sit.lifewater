import React, { useEffect, useState } from 'react';
import { getAllCustomersAPI } from '../services/customers/customers';

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  location: {
    address: string;
    coordinates:{
      coordinates:[number, number]// [longitude, latitude]
    } ;
}
}

const Maps: React.FC = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomersAPI();
        setCustomers(response.data);
        console.log('Fetched customers:', response.data); // Log the fetched customers
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = () => {
    if (customers && customers.length > 0) {
      const trimmedAddress = searchAddress.trim().toLowerCase();
      console.log('Search Address:', trimmedAddress);
      console.log('Customers:', customers.map(c => c.location.address.toLowerCase())); // Log addresses

      const foundCustomer = customers.find((customer) =>
        customer.location.address?.toLowerCase() === trimmedAddress
      );

      if (foundCustomer) {
        console.log('Found customer coordinates:', foundCustomer.location.coordinates.coordinates);
        setSelectedCoordinates(foundCustomer.location.coordinates.coordinates); // Set the coordinates
      } else {
        console.log("Address not found");
      }
    } else {
      console.warn("Customer data is not available or not defined");
    }
  };
  console.log(selectedCoordinates);
  

  return (
    <div className="flex flex-col items-center p-4">
      <div className='flex items-center justify-center w-full max-w-md mb-4'>
        <input
          type="text"
          placeholder="Search by address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)} // Update this to set searchAddress
          className="flex-1 border p-2 rounded-md"
        />
        <button onClick={handleSearch} className="bg-red-800 text-white p-2 rounded-md ml-2">
          Search
        </button>
      </div>

      {selectedCoordinates && (
  <div className="w-full max-w-xl aspect-w-16 aspect-h-9">
    <iframe
      key={`${selectedCoordinates[0]}-${selectedCoordinates[1]}`} 
      src={`https://www.google.com/maps?q=${selectedCoordinates[1]},${selectedCoordinates[0]}&output=embed`}
      className=" w-full min-h-screen"
      allowFullScreen
      loading="lazy"
    ></iframe>
  </div>
)}
    </div>
  );
};

export default Maps;
