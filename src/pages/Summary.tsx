import React from "react";

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
   <div> <div className="min-h-screen bg-gray-100 flex  justify-center p-2">
   <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
     <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">Summary</h2>

     {/* Summary Form */}
     <form className="space-y-4">
       {fields.map((field, index) => (
         <div
           key={index}
           className="flex justify-between items-center space-x-2"
         >
           <label
             className="text-gray-700 text-sm font-semibold flex-shrink-0 w-1/2"
           >
             {field}
           </label>
           <input
             type="number"
             value="20"
             readOnly
             className="flex-grow px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-center text-gray-700"
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
 </div></div>
  );
};

export default Summary;
