import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import trash from '../../assets/images/trash.svg'
import circleplus from '../../assets/images/Icon.svg'
import printer from '../../assets/images/printer.svg'
import back from '../../assets/images/backbutton.svg'
import { Link } from 'react-router-dom';
import copy from '../../assets/images/copy.svg'
import upload from '../../assets/images/upload icon.svg'
import cimage from '../../assets/images/Ellipse 43.svg'
import icondown from '../../assets/images/Icon down.svg'

const AddPurchaseOrder: React.FC = () => {

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
      
            // const [searchValue, setSearchValue] = useState<string>("");
            const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
              null
            );
            const dropdownRef = useRef<HTMLDivElement | null>(null);
           
            const toggleDropdown = (key: string | null) => {
              setOpenDropdownIndex(key === openDropdownIndex ? null : key);
            };
           
            const handleClickOutside = (event: MouseEvent) => {
              if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
              ) {
                setOpenDropdownIndex(null);
              }
            };
           
            useEffect(() => {
              if (openDropdownIndex !== null) {
                document.addEventListener("mousedown", handleClickOutside);
              } else {
                document.removeEventListener("mousedown", handleClickOutside);
              }
           
              return () => {
                document.removeEventListener("mousedown", handleClickOutside);
              };
            }, [openDropdownIndex]);
      
    return (
  <div>
          <div className='flex bg-gray-50'>

<div className="max-h-screen w-[70%]">
 

 {/* Main content */}
 <div className="flex-1 min-h-screen">
 <div className="flex gap-3 items-center w-full max-w-8xl ms-1 mt-2">
  <Link to="/purchaseorder">
    <img className="bg-gray-200 rounded-full p-2" src={back} alt="Back" />
  </Link>
  <h3 className="text-[20px] text-[#303F58] font-bold ms-1">Add Purchase Order</h3>
</div>
   <div className="container mx-auto p-4">
     <div className="bg-white p-4 -mt-1 -ms-2 rounded-lg shadow-md">
       {/* Customer and Salesman Selection */}
       <div className="grid grid-cols-2 gap-4 mb-4">
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Supplier</label>
           {/* <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select Supplier</option>
           </select> */}

            <div className="relative w-full" onClick={() => toggleDropdown("customer")}>
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <span className='font-normal'>Select Supplier</span>
                    </div>
                    <img className='ms-96 -mt-6 w-[11px] h-[11px] text-[#495160]' src={icondown} alt="" />

                    {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    </div> */}
                   
                  </div>
                  {openDropdownIndex === "customer" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white rounded-md mt-1 p-2 w-[326px] h-[52px] space-y-1"
                    >
                      <div className="grid grid-cols-12 gap-1 p-2 bg-[#FDF8F0] cursor-pointer border border-slate-400 rounded-lg bg-lightPink">
                        <div className="col-span-2 flex items-center justify-center">
                          <img
                            src={cimage}
                            alt=""
                          />
                        </div>
                        <div className="col-span-10 flex">
                          <div>
                            <p className="font-semibold text-[14px] text-[#0B1320]">Smart Phone</p>
                            <p className="text-[12px] font-normal text-[#495160]">
                              Phone: 9643287899
                            </p>
                          </div>
                          <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
                            &times;
                          </div>
                        </div>
                      </div>
                      <div className="hover:bg-gray-100 grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
                        <img className='mt-2 ms-3' src={circleplus} alt="" />
                        <span className='text-[#820000] ms-8 -mt-10'>Add New Supplier</span>
                      </div>
                    </div>
                  )}

         </div>


           {/* <div className="col-span-7 relative">
                  <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">
                    Customer Name
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("customer")}
                  >
                    <div className="items-center flex appearance-none w-[135px] h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <p>Select Customer</p>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    </div>
                   
                  </div>
                  {openDropdownIndex === "customer" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[326px] h-[52px] space-y-1"
                    >
                        <img src={search} 
                         alt="" />
                      <div className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink">
                        <div className="col-span-2 flex items-center justify-center">
                          <img
                            src={cimage}
                            alt=""
                          />
                        </div>
                        <div className="col-span-10 flex">
                          <div>
                            <p className="font-bold text-sm">Smart Phone</p>
                            <p className="text-xs text-gray-500">
                              Phone: 9643287899
                            </p>
                          </div>
                          <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">
                            &times;
                          </div>
                        </div>
                      </div>
                      <div className="hover:bg-gray-100 grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
                        <img className='mt-2 ms-3' src={circleplus} alt="" />
                        <span className='text-[#820000] ms-8 -mt-10'>Add New Supplier</span>
                      </div>
                    </div>
                  )}
                </div> */}

                
         <div>
           <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Draft</label>
           <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Draft</option>
           </select>
         </div>
         
       </div>

       <div className="grid grid-cols-2 gap-4 mb-4">
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Purchase Order #</label>
           <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>POS 03</option>
           </select>
         </div>
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Zip Code</label>
           <input
             type="text"
             name="zip"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
             placeholder='Enter the zip code'
           />
         </div>
         
       </div>
       <div className="grid grid-cols-2 gap-4 mb-4">
       <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Purchase Order Date</label>
           <input
             type="date"
             name="date"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           />
         </div>
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Expiry Date</label>
           <input
             type="date"
             name="date"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           />
         </div>
         
       </div>

       <div className="grid grid-cols-2 gap-4 mb-4">
         <div className='flex'>
          <div>
          <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">State</label>
          <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-[219px] p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select State</option>
           </select>
          </div>
          <div className='ms-5'>
          <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">City</label>
          <select
             name="customer"
             value={orderDetails.customer}
             onChange={updateOrder}
             className="w-[219px] p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
           >
             <option value="" className='font-normal'>Select City</option>
           </select>
           </div>

         </div>
         <div>
           <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Contact Number</label>
           <input
             type="text"
             name="contact"
             value={orderDetails.date}
             onChange={updateOrder}
             className="w-full p-2 border rounded-md  text-[#8F99A9] text-[14px] font-normal"
             placeholder='12345678'
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
<Link to="/purchaseorder">
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
   
  export default AddPurchaseOrder;