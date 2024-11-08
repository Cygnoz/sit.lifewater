import React from 'react';

const fields: string[] = [
  "Opening",
  "Loaded from Plant",
  "Additional Adding",
  "Total",
  "Bottle Leak",
  "Cap Leak",
  "Water Damage",
  "FOC",
  "Net Total",
  "Empty Bottle",
  "Balance Stock",
];

const Summary: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-4">
      <div className="bg-white p-6 rounded-lg  shadow-lg w-96">
        <div className="flex items-center justify-between mb-6"></div>
        
        {/* Summary Form */}
        <form className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="flex justify-between items-center">
              <label className="text-gray-700 text-sm font-semibold">{field}</label>
              <input
                type="number"
                value="20"
                readOnly
                className="w-24 px-3 py-1 bg-gray-300 border rounded-lg text-center text-gray-700"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-red-800 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Summary;
