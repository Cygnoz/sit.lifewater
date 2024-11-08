import React, { useState, ChangeEvent, useEffect, useRef } from "react"
import trash from "../assets/images/trash.svg"
import circleplus from "../assets/images/Icon.svg"
import printer from "../assets/images/printer.svg"
import back from "../assets/images/backbutton.svg"
import { Link } from "react-router-dom"
// import cimage from '../assets/images/Ellipse 43.svg'
import icondown from "../assets/images/Icon down.svg"
import search from "../assets/images/search.svg"
import { getAllCustomersAPI } from "../services/CustomerAPI/Customer"
import { BASEURL, STOCK_BASEURL } from "../services/Baseurl"
import { getAllStaffsAPI } from "../services/AllApi"
import { getItemsAPI } from "../services/StockAPI/StockAPI"
import downarrow from "../assets/images/Vector.png"
import { addOrderAPI } from "../services/OrderAPI/OrderAPI"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, toast } from "react-toastify"
import { getWarehouseAPI } from "../services/WarehouseAPI/WarehouseAPI"

interface Item {
  itemName: string
  quantity: number
  rate: number
  amount: number
  itemImage:string
}

interface OrderDetails {
  customer: string
  salesman: string
  warehouse: string
  date: string
  orderNumber: string
  paymentMode: string
  items: Item[]
  notes: string
  termsAndCondition: string
}

const NewOrder: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customer: "",
    salesman: "",
    warehouse: "",
    date: "",
    orderNumber: "",
    paymentMode: "",
    items: [{ itemName: "",itemImage: '', quantity: 0, rate: 0, amount: 0 }],
    notes: "",
    termsAndCondition: "",
  })
  console.log(orderDetails)

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState<string>("")

  const [rows, setRows] = useState<Item[]>([{ itemName: "",itemImage: '', quantity: 0, rate: 0, amount: 0 }])

  const addRow = () => {
    setRows([...rows, { itemName: "",itemImage: '', quantity: 0, rate: 0, amount: 0 }])
  }

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index))
    } else {
      setRows([{ itemName: "",itemImage: '', quantity: 0, rate: 0, amount: 0 }])
    }
  }

  const handleItemSelect = (item: any, index: number) => {
    const newRows = [...rows]

    const quantity = Number(item.quantity) || 1
    const rate = Number(item.purchasePrice) || 0

    newRows[index] = {
      itemName: item.itemName,
      itemImage: item.itemImage,
      quantity: quantity,
      rate: rate,
      amount: rate * quantity,
    }

    setRows(newRows)
    setOrderDetails({ ...orderDetails, items: newRows })
    setOpenDropdownId(null)
    setOpenDropdownType(null)
  }

  const handleRowChange = (index: number, field: keyof Item, value: string) => {
    const newRows = [...rows]
    newRows[index] = {
      ...newRows[index],
      [field]: value,
    }
    const quantity = Number(newRows[index].quantity) || 1
    const rate = Number(newRows[index].rate) || 0
    newRows[index].amount = rate * quantity

    setRows(newRows)
    setOrderDetails({ ...orderDetails, items: newRows })
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const toggleDropdown = (index: number, type: string) => {
    setOpenDropdownId(index === openDropdownId ? null : index)
    setOpenDropdownType(type)
  }

  const filteredItems = () => items.filter((item) => item.itemName.toLowerCase().includes(searchValue.toLowerCase()))

  // Update order details
  const updateOrder = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdownType(null) // Close whichever dropdown is open
    }
  }

  useEffect(() => {
    if (openDropdownType !== null) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownType])

  interface Customer {
    companyName: string
    firstName: string
    lastName: string
    logo: string
    mobileNo: string
  }

  // get customer
  const [customers, setCustomers] = useState<any[]>([]) // State for customer data
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("")

  const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"
  // Function to remove duplicates based on a unique field (like mobileNo or _id)
  const removeDuplicates = (array: Customer[]) => {
    const seen = new Set()
    return array.filter((customer) => {
      const duplicate = seen.has(customer.mobileNo) // Use a unique identifier here
      seen.add(customer.mobileNo)
      return !duplicate
    })
  }

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => `${customer.firstName} ${customer.lastName} ${customer.companyName}`.toLowerCase().includes(customerSearchTerm.toLowerCase()))

  // Step 3: Update the search term
  const handleCustomerSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerSearchTerm(e.target.value)
  }
  // Customer selection function
  const handleCustomerSelection = (customer: Customer) => {
    setSelectedCustomer(customer)
    setOrderDetails({ ...orderDetails, customer: `${customer.firstName} ${customer.lastName}` })
    setOpenDropdownType(null) // Close dropdown on selection
  }
  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomersAPI()
        const uniqueCustomers = removeDuplicates(response.data) // Filter out duplicates
        setCustomers(uniqueCustomers)
      } catch (error) {
        console.error("Error fetching customers:", error)
      }
    }

    fetchCustomers()
  }, [])

  const toggleCustomerDropdown = () => {
    setOpenDropdownType(openDropdownType === "customer" ? null : "customer")
  }

  interface Staff {
    firstname: string
    lastname: string
    designation: string
    profile: string // Add other fields as per your staff object structure
  }

  const [salesmanSearchTerm, setSalesmanSearchTerm] = useState<string>("")
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [filteredStaffList, setFilteredStaffList] = useState<Staff[]>([])
  const [selectedSalesman, setSelectedSalesman] = useState<Staff | null>(null)

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getAllStaffsAPI()
        const salesmanList = (response as Staff[]).filter((staff) => staff.designation.toLowerCase() === "sales") // Filter only salesmen
        setStaffList(salesmanList) // Store full list of salesmen
        setFilteredStaffList(salesmanList) // Initially, display all salesmen
      } catch (error) {
        console.error("Error fetching staff data:", error)
      }
    }

    fetchStaff()
  }, [])

  // Filter Salesman based on search term
  useEffect(() => {
    const filteredList = staffList.filter((staff) => `${staff.firstname} ${staff.lastname}`.toLowerCase().includes(salesmanSearchTerm.toLowerCase()))
    setFilteredStaffList(filteredList)
  }, [salesmanSearchTerm, staffList])

  // Handle Salesman Search Change
  const handleSalesmanSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalesmanSearchTerm(e.target.value)
  }

  const handleSalesmanSelection = (salesman: Staff) => {
    setSelectedSalesman(salesman)
    setOrderDetails({ ...orderDetails, salesman: `${salesman.firstname} ${salesman.lastname}` })
    setOpenDropdownType(null) // Close dropdown on selection
  }

  const toggleSalesmanDropdown = () => {
    setOpenDropdownType(openDropdownType === "salesman" ? null : "salesman")
  }

  const [items, setItems] = useState<any[]>([]) // State to store fetched items
  const [loading, setLoading] = useState(true) // State to manage loading state

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItemsAPI()
        setItems(data)
      } catch (error) {
        console.error("Error fetching items:", (error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])
  console.log(items, "items")

  // select warehouse
  interface WarehouseItem {
    _id: string
    warehouseName: string
  }

  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([])
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("")

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await getWarehouseAPI()
        setWarehouses(response.warehouses)
        console.log("Warehouses set:", response) // Verify the data
      } catch (error: any) {
        console.error("Failed to fetch warehouses:", error)
      }
    }
    fetchWarehouse()
  }, [])

  const handleWarehouseSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const warehouseValue = e.target.value
    setSelectedWarehouse(warehouseValue)
    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      warehouse: warehouseValue,
    }))
  }

  // const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // Create the request body as a JSON object
      const requestBody = {
        customer: orderDetails.customer,
        salesman: orderDetails.salesman,
        warehouse: orderDetails.warehouse,
        date: orderDetails.date, // Use the original date without formatting if your backend handles it
        orderNumber: orderDetails.orderNumber,
        paymentMode: orderDetails.paymentMode,
        notes: orderDetails.notes,
        termsAndCondition: orderDetails.termsAndCondition,
        items: orderDetails.items.map((item) => ({
          itemName: item.itemName,
          itemImage: item.itemImage,
          quantity: item.quantity,
          price: item.rate, // Ensure this matches your backend schema
          amount: item.amount,
        })),
      }

      console.log("Request Body to be sent:", requestBody)

      // Call the API function with the JSON body
      const response = await addOrderAPI(requestBody)

      // Assuming your response format has a success property
      if (response.success) {
        toast.success("Order added successfully!")
        // Reset the form or handle the response
        setOrderDetails({
          customer: "",
          salesman: "",
          warehouse: "",
          date: "",
          orderNumber: "",
          paymentMode: "",
          items: [{ itemName: "",itemImage: "", quantity: 0, rate: 0, amount: 0 }],
          notes: "",
          termsAndCondition: "",
        })
      } else {
        toast.error("Failed to add order: " + response.message)
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      toast.error("An error occurred while submitting the order.")
    } finally {
      setLoading(false)
    }
  }

  // const defaultImage = "https://cdn1.iconfinder.com/data/icons/avatar-3/512/Manager-512.png"
  return (
    <>
      {/* <div className='flex bg-gray-50 '> */}

     <form onSubmit={handleSubmit}>
        <div className=" flex max-h-screen ">
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
  
          {/* Main content */}
          <div className="flex-1 min-h-screen">
            <div className="flex gap-1 items-center w-full max-w-8xl ms-1 mt-1">
              <Link to="/orders">
                <img className="bg-gray-200 rounded-full p-1" src={back} alt="Back" />
              </Link>
              <h3 className="text-[20px] text-[#303F58] font-bold ms-1">New order</h3>
            </div>
            <div className="container mx-auto p-3">
              <div className="bg-white p-2 -mt-2 -ms-2 rounded-lg shadow-md">
                {/* Customer and Salesman Selection */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Customer Selection */}
                  <div className="mb-2">
                    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Customer</label>
                    <div className="relative w-full" onClick={toggleCustomerDropdown}>
                      <div className="items-center flex appearance-none w-full h-9  bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <span className="font-normal">{selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : "Select Customer"}</span>
                      </div>
                      <img className="ms-[435px] -mt-6 w-[11px] h-[11px] text-[#495160]" src={icondown} alt="" />
                    </div>
  
                    {openDropdownType === "customer" && (
                      <div ref={dropdownRef} className="absolute z-10 bg-white rounded-md mt-1 p-2 w-[326px] space-y-1">
                        {/* Search input for customers */}
                        <div className="grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
                          <input className="pl-9 text-sm w-full rounded-md text-start text-[#818894] h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400" placeholder="Search Customer" value={customerSearchTerm} onChange={handleCustomerSearchChange} />
                          <img className="ms-3 -mt-12 w-[15px] h-[15px]" src={search} alt="" />
                        </div>
  
                        {/* Filtered customer list */}
                        {filteredCustomers.map((customer) => (
                          <div
                            key={customer.mobileNo} // Make sure to use a unique key
                            onClick={() => handleCustomerSelection(customer)}
                            className="grid grid-cols-12 gap-1 p-2 bg-[#FDF8F0] cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                          >
                            <div className="col-span-2 flex items-center justify-center">
                              <img src={customer.logo ? `${BASEURL}/uploads/${customer.logo}` : defaultImage} alt={`${customer.firstName} ${customer.lastName}`} />
                            </div>
                            <div className="col-span-10 flex">
                              <div>
                                <p className="font-semibold text-[14px] text-[#0B1320]">
                                  {" "}
                                  {customer.firstName} {customer.lastName}
                                </p>
                                <p className="text-[12px] font-normal text-[#495160]">Phone: {customer.workPhone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
  
                        {/* Add new customer option */}
                        <Link to="/addcustomer">
                          <div className="bg-white h-12 flex justify-center items-center cursor-pointer border border-slate-400 rounded-lg">
                            <div className="flex justify-center items-center">
                              <img className="" src={circleplus} alt="" /> &nbsp; &nbsp;
                              <span className="text-[#820000]">Add New Customer</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
  
                  {/* Salesman Selection */}
                  <div>
                    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Salesman</label>
                    <div className="relative w-full" onClick={toggleSalesmanDropdown}>
                      <div className="items-center flex appearance-none w-full h-9  bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <span className="font-normal">{selectedSalesman ? `${selectedSalesman.firstname} ${selectedSalesman.lastname}` : "Select Salesman"}</span>
                      </div>
                      <img className="ms-[435px] -mt-6 w-[11px] h-[11px] text-[#495160]" src={icondown} alt="" />
                    </div>
  
                    {openDropdownType === "salesman" && (
                      <div ref={dropdownRef} className="absolute z-10 bg-white rounded-md mt-1 p-2 w-[326px] h-auto space-y-1">
                        {/* Search input */}
                        <div className="grid grid-col-12 h-12 items-center cursor-pointer border border-slate-400 rounded-lg">
                          <input className="pl-9 text-sm w-full rounded-md text-start text-[#818894] h-10 p-2 border-0 focus:ring-1 focus:ring-gray-400" placeholder="Search Salesman" value={salesmanSearchTerm} onChange={handleSalesmanSearchChange} />
                          <img className="ms-3 -mt-12 w-[15px] h-[15px]" src={search} alt="" />
                        </div>
  
                        {/* Filtered salesman list */}
                        {filteredStaffList.map((staff, index) => (
                          <div key={index} onClick={() => handleSalesmanSelection(staff)} className="grid grid-cols-12 gap-1 p-2 bg-[#FDF8F0] cursor-pointer border border-slate-400 rounded-lg bg-lightPink">
                            <div className="col-span-2 flex items-center justify-center">
                              <img src={staff.profile ? `${BASEURL}/uploads/${staff.profile}` : defaultImage} alt={`${staff.firstname} ${staff.lastname}`} />
                            </div>
                            <div className="col-span-10 flex">
                              <div>
                                <p className="font-semibold text-[14px] text-[#0B1320]">
                                  {staff.firstname} {staff.lastname}
                                </p>
                                <p className="text-[12px] font-normal text-[#495160]">Designation: {staff.designation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
  
                        <Link to="/addstaff">
                          <div className="bg-white h-12 flex justify-center items-center cursor-pointer border border-slate-400 rounded-lg">
                            <div className="flex justify-center items-center">
                              <img className="" src={circleplus} alt="" /> &nbsp; &nbsp;
                              <span className="text-[#820000]">Add New Salesman</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
  
                {/* Warehouse selection */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="">
                    <label className="block mb-2 font-[400px] text-[#303F58] text-[14px]">Warehouse</label>
                    <select name="warehouse" value={selectedWarehouse} onChange={handleWarehouseSelection} className="w-full p-2 border rounded-md text-[14px] font-normal">
                      <option value="" className="font-normal text-[#8F99A9]">
                        Select Warehouse
                      </option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse._id} className="font-normal">
                          {warehouse.warehouseName}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  <div>
                    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Order Number</label>
                    <input
                      type="text"
                      name="orderNumber"
                      onChange={updateOrder}
                      value={orderDetails.orderNumber}
                      className="w-full p-2 border rounded-md text-[14px] font-normal"
                      // readOnly
                    />
                  </div>
                </div>
  
                {/* Date and Order Number */}
  
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Date</label>
                    <input type="date" name="date" value={orderDetails.date} onChange={updateOrder} className="w-full p-2 border rounded-md  text-[14px] font-normal" />
                  </div>
                </div>
  
                {/* Payment Mode Dropdown */}
                <div className="mb-4">
                  <label className="block mb-2 font-normal text-[#303F58] text-[14px]">Payment Mode</label>
                  <select name="paymentMode" value={orderDetails.paymentMode} onChange={updateOrder} className="w-full p-2 border rounded-md text-[14px] font-normal">
                    <option value="" className="font-normal">
                      Select payment mode
                    </option>
                    <option value="Cash" className="text-gray-800 font-normal">
                      Cash
                    </option>
                    <option value="Credit" className="text-gray-800 font-normal">
                      Credit
                    </option>
                    <option value="FOC" className="text-gray-800 font-normal">
                      FOC
                    </option>
                    {/* Add more payment options as needed */}
                  </select>
                </div>
  
                {/* Add Item Section */}
                <div className="rounded-lg border-2 border-tableBorder mt-5">
                  <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
                    <thead className="text-[12px] text-center bg-[#FDF8F0] text-dropdownText">
                      <tr className="bg-lightPink">
                        {["Product", "Quantity", "Rate", "Amount", "Actions"].map((item, index) => (
                          <th key={index} className="py-2 px-4 font-medium border-b border-tableBorder relative">
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-dropdownText text-center text-[13px]">
                      {rows.map((row, index) => (
                        <tr key={index}>
                          <td className="border-y py-3 px-2 border-tableBorder">
                            <div className="relative w-full" onClick={() => toggleDropdown(index, "searchProduct")}>
                              {row.itemName ? (
                                <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <div className="flex items-start col-span-4">
                                  <img 
  className="mx-auto object-cover w-11 h-11 rounded-full"
  src={row.itemImage ? `${STOCK_BASEURL}/${row.itemImage.replace(/\\/g, '/')}` : defaultImage} 
  alt={`${row.itemName}`} />
                                  </div>
                                  <div className="col-span-8 text-start">
                                    <p className="text-textColor">{row.itemName}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                                  <p>Type or click</p>&nbsp;&nbsp;
                                  <p>
                                    <img src={downarrow} alt="" width={12} />
                                  </p>
                                </div>
                              )}
                            </div>
                            {openDropdownId === index && openDropdownType === "searchProduct" && (
                              <div ref={dropdownRef} className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[40%] space-y-1">
                                <input type="text" value={searchValue} onChange={handleSearchChange} placeholder="Select Item" className="w-full p-2 border rounded-lg h-12  bg-[#F9F7F5]" />
                                {loading ? (
                                  <p>Loading...</p>
                                ) : filteredItems().length > 0 ? (
                                  filteredItems().map((item, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => handleItemSelect(item, index)}
                                      className="grid bg-[#FDF8F0] grid-cols-12 gap-1 p-2
                                       hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                                    >
                                      <div className="col-span-2 flex justify-center">
                                        <img className="rounded-full h-10"   src={item.itemImage ? `${STOCK_BASEURL}/${item.itemImage.replace(/\\/g, '/')}` : defaultImage} 
 alt="" />
                                      </div>
                                      <div className="col-span-10 flex">
                                        <div className="text-start">
                                          <p className="font-bold text-sm text-black">{item.itemName}</p>
                                          <p className="text-xs text-gray-500">Rate: RS.{item.purchasePrice}</p>
                                        </div>
                                        <div className="ms-auto text-2xl cursor-pointer relative -mt-2 pe-2">&times;</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center border-slate-400 border rounded-lg">
                                    <p className="text-[red] text-sm py-4">Items Not Found!</p>
                                  </div>
                                )}
                                <Link to="/additem">
                                  <button className="bg-darkGreen text-[#820000] mt-1 rounded-lg py-4 px-6 flex items-center text-sm font-bold border-slate-400 border gap-2 w-full hover:bg-lightRed">
                                    <img src={circleplus} alt="" /> <p>Add New Item</p>
                                  </button>
                                </Link>
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input value={row.quantity} onChange={(e) => handleRowChange(index, "quantity", e.target.value)} className=" text-center w-20" placeholder="0" />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input type="text" value={row.rate} disabled className="w-full text-center" placeholder="0" />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder">
                            <input value={row.amount} disabled className="w-full text-center" placeholder="0" />
                          </td>
                          <td className="py-2.5 px-4 border-y border-tableBorder text-center">
                            <button onClick={() => removeRow(index)} className="text-red-500">
                              <img src={trash} alt="" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button onClick={addRow} className="bg-darkGreen text-darkRed flex item-center  font-bold rounded-lg py-2 px-1 mt-4 text-[#820000]">
                  <img src={circleplus} alt="" className="mt-1 ms-1 h-4 w-5" /> Add Item
                </button>
  
                <br />
                <br />
  
                {/* Notes and Terms */}
                {/* <div className="mb-4 -mt-10">
                    <label className="block mb-2 font-normal">Add Notes</label>
                    <textarea
                      name="notes"
                      value={orderDetails.notes}
                      onChange={updateOrder}
                      className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
                      placeholder='Add a Note'
                    ></textarea>
                  </div>
  
                  <div className="mb-4 -mt-3">
                    <label className="block mb-1 font-normal">Terms & Conditions</label>
                    <textarea
                      name="terms"
                      value={orderDetails.terms}
                      onChange={updateOrder}
                      className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal"
                      placeholder='Add Terms and Condition of Your Business'
                    ></textarea>
                  </div> */}
  
                {/* <div className='flex justify-end mt-5'>
                <div>
                  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">
                    Cancel
                  </button>
  
                </div> */}
                {/* <div>
                  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
                    <img src={printer} className='me-1 mt-1 -ms-2' alt="" />
                    Print
                  </button>
                </div> */}
                {/* <div>
                  <button className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]">
                    Save
                  </button>
                </div>
  
              </div> */}
              </div>
            </div>
          </div>
          {/* </div> */}
  
          <div className="flex w-[30%] h-[370px] p-6 rounded-lg shadow-md mt-10 bg-white">
            <div className="justify-center">
              {/* <div className='flex my-2'>
                <h3 className='text-[#4B5C79] text-[14px] font-normal'>Untaxed Amount</h3>
                <h1 className='text-[#303F58] text-[18px] font-bold ms-40'>Rs 0.00</h1>
              </div>
              <div className='flex my-1'>
                <h3 className='text-[#4B5C79] text-[14px] font-normal'>SGST</h3>
                <h1 className='text-[#4B5C79] text-[14px] font-normal ms-64'>Rs 0.00</h1>
              </div>
              <div className='flex my-1'>
                <h3 className='text-[#4B5C79] text-[14px] font-normal'>CGST</h3>
                <h1 className='text-[#4B5C79] text-[14px] font-normal ms-64'>Rs 0.00</h1>
              </div> */}
              <div className="mb-4">
                <label className="block mb-2 font-normal">Add Notes</label>
                <textarea name="notes" value={orderDetails.notes} onChange={updateOrder} className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal" placeholder="Add a Note"></textarea>
              </div>
  
              <div className="mb-4">
                <label className="block mb-1 font-normal">Terms & Conditions</label>
                <textarea name="termsAndCondition" value={orderDetails.termsAndCondition} onChange={updateOrder} className="w-full p-2 border rounded-md text-[#8F99A9] text-[14px] font-normal" placeholder="Add Terms and Condition of Your Business"></textarea>
              </div>
              <hr className="my-4 text-[#CCCCCC] text-[10px] font-bold" />
  
              <div className="flex my-1 justify-between">
                <h3 className="text-[#0B1320] text-[16px] font-bold">Total</h3>
                <h1 className="text-[#303F58] text-[18px] font-bold"></h1>
              </div>
  
              <div className="flex ms-24 mt-5">
                <div>
                  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 w-[74px] h-[38px] border border-[#565148]">Cancel</button>
                </div>
                <div>
                  <button className="bg-[#FEFDFA] rounded-lg text-[#565148] text-[14px] py-2 px-4 mx-1 mt-2 flex items-center w-[74px] h-[38px] border border-[#565148]">
                    <img src={printer} className="me-1 mt-1 -ms-2" alt="" />
                    Print
                  </button>
                </div>
                <div>
                  <button type="submit"  className="bg-[#820000] rounded-lg text-[#FEFDF9] text-[14px] py-2 px-5 mx-1 mt-2 w-[108px] h-[38px]">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
     </form>
    </>
  )
}

export default NewOrder
