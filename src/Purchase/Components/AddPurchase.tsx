import React, { useState, ChangeEvent } from 'react';
import trash from '../../assets/images/trash.svg'
import circleplus from '../../assets/images/Icon.svg'
import printer from '../../assets/images/printer.svg'
import back from '../../assets/images/backbutton.svg'
import { Link } from 'react-router-dom';
import copy from '../../assets/images/copy.svg'
import upload from '../../assets/images/upload icon.svg'

const AddPurchase: React.FC = () => {

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
  <Link to="/purchase">
    <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
  </Link>
  <h3 className="text-[20px] text-[#303F58] font-bold ms-1">Add Purchase</h3>
</div>
   <div className="container mx-auto p-4">
     <div className="bg-white p-4 -mt-1 -ms-2 rounded-lg shadow-md">
       {/* Customer and Salesman Selection */}
       <div className="grid grid-cols-2 gap-4 mb-4">
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Supplier</label>
           <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select Supplier</option>
             {/* Add customer options */}
           </select>
         </div>
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Purchase #</label>
           <input
             type="text"
             name="zip"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
             placeholder='Bill 9'
           />
         </div>
         
       </div>

       <div className="grid grid-cols-2 gap-4 mb-4">
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">State</label>
           <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select State</option>
             {/* Add customer options */}
           </select>
         </div>
          <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">City</label>
           <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select City</option>
             {/* Add customer options */}
           </select>
         </div>

         
       </div>
       <div className="grid grid-cols-2 gap-4 mb-4">
       <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Zip Code</label>
           <input
             type="text"
             name="date"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           />
         </div>
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Contact Number</label>
           <input
             type="date"
             name="date"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           />
         </div>
         
       </div>

       {/* Date and Order Number */}
       <div className="grid grid-cols-2 gap-4 mb-4">
       <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Purchase Date</label>
           <input
             type="date"
             name="date"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           />
         </div>

         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Due Date</label>
           <input
             type="date"
             name="due"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           />
         </div>         
       </div>
       <div className="mb-4">
         <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Billing Address</label>
         <textarea
           name="terms"
           value={orderDetails.terms}
           onChange={updateOrder}
           className="w-full h-[91px] p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
         ></textarea>
         
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
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Product</th>
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Quantity</th>
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Rate</th>
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Amount</th>
            <th className="p-2 text-[#495160] text-[12px] text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2 text-[#8F99A9] text-[14px] text-center font-normal">
              <label className='text-[#8F99A9] text-[14px] font-normal'>Type or click</label>
              <select name="" id="" className='text-gray-400'>
                <option value=""></option>
              </select>
              {/* <img className='w-[24px] h-[24px] ms-10 items-center align-middle' src={airpod} alt="" />
              <span className='-mt-10'>Boat Airpodes</span> */}
            </td>
            <td className="p-2 text-[#8F99A9] text-[14px] text-center font-normal">0</td>
            <td className="p-2 text-[#8F99A9] text-[14px] text-center font-normal">0.00</td>
            <td className="p-2 text-[#8F99A9] text-[14px] text-center font-normal">0.00</td>
            <td className="p-2 text-center">
            <button className="ml-2"><img src={copy} alt="" /></button>
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
           <img className='mt-8' src={circleplus} alt="" />
           <span className='mt-7 ms-2'>Add New Line</span>
         </button>
       </div>

       {/* Notes and Terms */}

       <div className="mb-4">
         <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Notes or Terms</label>
         <textarea
           name="terms"
           value={orderDetails.terms}
           onChange={updateOrder}
           className="w-full h-[91px] p-2 border rounded-md text-[#CECECE] text-[14px] font-normal"
           placeholder=''
         ></textarea>
         
       </div>

       {/* Total and Actions */}

     </div>
   </div>
 </div>
</div>



<div>

  <div>
  <div className="mt-14">
              <label className="block mb-1 text-[14px] font-normal mt-1 text-[#4B5C79]">
                Attach files to Purchase Order
                <div className="border-dashed border-2 border-neutral-300 p-2 rounded  gap-2 text-center h-[68px] mt-2">
                  <div className="flex gap-1 justify-center">
                    <img className='text-[#4B5C79] w-[15px] h-[15px] mt-1' src={upload} alt="" />
                    <span className="text-[12px] font-semibold mt-1 text-[#4B5C79]">Upload File</span>
                  </div>
                  <p className="text-[10px] font-normal mt-1 text-[#4B5C79]">
                    Maximum File Size : 1MB
                  </p>
                </div>
                <input type="file" className="hidden" name="documents" />
              </label>
            </div>

  </div>

<div className='justify-center w-full h-[250px] p-6 rounded-lg shadow-md mt-5 bg-white'>
<div className='flex my-2'>
    <h3 className='text-[#4B5C79] text-[14px] font-normal'>Discount</h3>
    <h4 className='text-[#303F58] text-[14px] ms-56 font-normal'>Rs 0.00</h4>
  </div>
  <div className='flex my-1'>
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
<Link to="/purchase">
  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
    Cancel
  </button></Link>

</div>
<div>
  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
  <img src={printer} className='me-1 mt-1 -ms-2'  alt="" />
  Print
  </button>
</div>
<div>
  <button className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[119px] h-[38px]">
    Save & Send
 </button>
</div>

</div>



</div>


         
         

       
</div>
</div>


  </div>
    );
  };
   
  export default AddPurchase;