

import React, { useState, ChangeEvent } from 'react';
import trash from '../../../assets/images/trash.svg'
import circleplus from '../../../assets/images/Icon.svg'
import printer from '../../../assets/images/printer.svg'
import back from '../../../assets/images/backbutton.svg'
import { Link } from 'react-router-dom';


interface Item {
  product: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface OrderDetails {
  customer: string;
  salesman: string;
  date: string;
  orderNumber: string;
  paymentMode: string;
  items: Item[];
  notes: string;
  terms: string;
}

const AddInternalStock: React.FC = () => {

    const [orderDetails, setOrderDetails] = useState<OrderDetails>({
        customer: '',
        salesman: '',
        date: '',
        orderNumber: 'IN-3748',
        paymentMode: '',
        items: [{ product: '', quantity: 0, rate: 0, amount: 0 }],
        notes: '',
        terms: '',
      });
    
      // Update order details
      const updateOrder = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOrderDetails({ ...orderDetails, [name]: value });
      };
    
      // Add a new item row
      const addItem = () => {
        setOrderDetails({
          ...orderDetails,
          items: [...orderDetails.items, { product: '', quantity: 0, rate: 0, amount: 0 }],
        });
      };


    return (
  <div>
      <div className='flex bg-gray-50'>

<div className="max-h-screen w-[70%]">
 

 {/* Main content */}
 <div className="flex-1 min-h-screen">
 <div className="flex gap-3 items-center w-full max-w-8xl ms-1 mt-2">
  <Link to="">
    <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
  </Link>
  <h3 className="text-[20px] text-[#303F58] font-bold ms-1">Add New Internal Stock</h3>
</div>
   <div className="container mx-auto p-4">
     <div className="bg-white p-4 -mt-1 -ms-2 rounded-lg shadow-md">
       {/* Customer and Salesman Selection */}
       <div className="grid grid-cols-2 gap-4 mb-4">
         <div>
           <label className="block mb-2 font-normal text-[#303F58] text-[14px]">From</label>
           <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select Main Route</option>
             {/* Add customer options */}
           </select>
         </div>
         <div>
           <label className="block mb-2 font-normal text-[#303F58] text-[14px]">To</label>
           <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select Main Route</option>
             {/* Add customer options */}
           </select>
         </div>
       </div>

       {/* Date and Order Number */}
       <div className="grid grid-cols-2 gap-4 mb-4">
       <div>
           <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Date</label>
           <input
             type="date"
             name="date"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           />
         </div>

         <div>
           <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Transfer Number</label>
           <input
             type="text"
             name="orderNumber"
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
             placeholder='123'
           />
         </div>
       </div>


       {/* Add Item Section */}
       <div className="mb-4">
         <h5 className="font-bold mb-2 text-[#202224] text-[16px]">Add Item</h5>
         {/* {orderDetails.items.map((item, index) => (
           <div key={index} className="grid grid-cols-5 gap-2 mb-2">
             <input
               type="text"
               placeholder="Product"
               value={item.product}
               onChange={(e) => {
                 const updatedItems = [...orderDetails.items];
                 updatedItems[index].product = e.target.value;
                 setOrderDetails({ ...orderDetails, items: updatedItems });
               }}
               className="col-span-2 p-2 border rounded-md"
             />
             <input
               type="number"
               placeholder="Quantity"
               value={item.quantity}
               onChange={(e) => {
                 const updatedItems = [...orderDetails.items];
                 updatedItems[index].quantity = parseInt(e.target.value) || 0;
                 setOrderDetails({ ...orderDetails, items: updatedItems });
               }}
               className="p-2 border rounded-md"
             />
             <input
               type="number"
               placeholder="Rate"
               value={item.rate}
               onChange={(e) => {
                 const updatedItems = [...orderDetails.items];
                 updatedItems[index].rate = parseFloat(e.target.value) || 0;
                 setOrderDetails({ ...orderDetails, items: updatedItems });
               }}
               className="p-2 border rounded-md"
             />
             <input
               type="number"
               placeholder="Amount"
               value={item.quantity * item.rate}
               readOnly
               className="p-2 border rounded-md bg-gray-100"
             />
           </div>
         ))} */}

<table className="w-full text-left">
        <thead className=' bg-[#fdf8f0]'>
          <tr className="border-b">
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Item Details</th>
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Quantity</th>
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Total Quantity</th>
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2 text-center">
              <label className='text-[#8F99A9] text-[14px] font-normal'>Type or Click</label>
              <select name="" id="" className='text-gray-400'>
                <option value=""></option>
              </select>
            </td>
            <td className="p-2 text-[#8F99A9] text-[14px] text-center font-normal">0</td>
            <td className="p-2 text-[#8F99A9] text-[14px] text-center font-normal">0.00</td>
            <td className="p-2 text-center">
              <button className="ml-2"><img src={trash} alt="" /></button>

            </td>
          </tr>

        </tbody>
      </table>

         <button
           onClick={addItem}
           className="mt-3 flex text-[#820000]"
           type="button"
         >
           <img className='my-1 mx-1' src={circleplus} alt="" />
            Add Item
         </button>
       </div>

       {/* Notes and Terms */}
       <div className="mb-4">
         <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Add Notes</label>
         <textarea
           name="notes"
           value={orderDetails.notes}
           onChange={updateOrder}
           className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
           placeholder='Add a Note'
         ></textarea>
       </div>

       <div className="mb-4">
         <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Terms & Conditions</label>
         <textarea
           name="terms"
           value={orderDetails.terms}
           onChange={updateOrder}
           className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
           placeholder='Add Terms and Condition of Your Business'
         ></textarea>
         
       </div>

       {/* Total and Actions */}

     </div>
   </div>
 </div>
</div>



<div className="flex w-[30%] h-[250px] p-6 rounded-lg shadow-md mt-12 bg-white">

<div className='justify-center'>
  <div className='flex my-2'>
    <h3 className='text-[#4B5C79] text-[14px] font-normal'>Untaxed Amount</h3>
    <h4 className='text-[#303F58] text-[18px] font-bold ms-40'>Rs 0.00</h4>
  </div>
  <div className='flex my-1'>
  <h3 className='text-[#4B5C79] text-[14px] font-normal'>SGST</h3>
    <h1 className='text-[#4B5C79] text-[14px] ms-64 font-normal'>Rs 0.00</h1>
  </div>
  <div className='flex my-1'>
  <h3 className='text-[#4B5C79] text-[14px] font-normal'>CGST</h3>
    <h1 className='text-[#4B5C79] text-[14px] ms-64 font-normal'>Rs 0.00</h1>
  </div>
  <div className='flex my-1'>
  <h4 className='text-[#0B1320] text-[16px] font-bold'>Total</h4>
    <h4 className='text-[#303F58] text-[18px] font-bold ms-60'>Rs 0.00</h4>
  </div>

<div className='flex ms-24 mt-5'>
<div>
  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
    Cancel
  </button>

</div>
<div>
  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
  <img src={printer} className='me-1 mt-1 -ms-2'  alt="" />
  Print
  </button>
</div>
<div>
  <button className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]">
    Save
 </button>
</div>

</div>



</div>


         
         

       
</div>
</div>
  </div>
    );
  };
   
  export default AddInternalStock;