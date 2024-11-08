import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updateItemAPI, getItemByIdAPI } from '../../../services/StockAPI/StockAPI';
import back from '../../../assets/images/backbutton.svg';
import { toast, ToastContainer } from 'react-toastify';

const EditItem: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [itemName, setItemName] = useState('');
    const [SKU, setSKU] = useState('');
    const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
    const [retailPrice, setRetailPrice] = useState<number | ''>('');
    const [description, setDescription] = useState('');
    const [profile, setProfile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()
    // Fetch item details on mount
    useEffect(() => {
      const fetchItemDetails = async () => {
        if (!id) return; // Guard against missing ID
    
        try {
            const response = await getItemByIdAPI(id);
            console.log("API Response:", response); // Log the API response
    
            // Check if the response is a valid JSON object
            if (response && response.itemName) {
                setItemName(response.itemName);
                setSKU(response.SKU);
                setPurchasePrice(response.purchasePrice);
                setRetailPrice(response.retailPrice);
                setDescription(response.description);
            } else {
                console.error("Failed to fetch item details:", response);
            }
        } catch (error) {
            console.error("Error fetching item details:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    
      fetchItemDetails();
    }, [id]);

    // Handle file change
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setProfile(file);
    };

    // Handle form submission
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
    
        setLoading(true);
        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('SKU', SKU);
        formData.append('purchasePrice', String(purchasePrice));
        formData.append('retailPrice', String(retailPrice));
        formData.append('description', description);
        if (profile) formData.append('itemImage', profile);
    
        try {
            console.log("Before Submission:", {
                itemName,
                SKU,
                purchasePrice,
                retailPrice,
                description,
                profile,
            });
    
            const response = await updateItemAPI(id, formData);
            console.log("Update Response:", response);
            if (response.message === 'Item updated successfully') {
                toast.success('Item updated successfully');
                setTimeout(() => {
                  // Replace '/items' with the actual path to your items page
                  navigate('/item'); 
              }, 2000); // Delay for 2000 milliseconds (2 seconds)
            } else {
                toast.error(`Failed to update item: ${response.message}`);
            }
        } catch (error) {
            console.error("Error updating item:", error);
            toast.error(`Error updating item: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };
    

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className='p-2'>
           <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
         // optional CSS class for further styling
      />
            <div className="flex gap-3 items-center w-full max-w-8xl mb-4 ms-1">
                <Link to={'/item'}>
                    <div className="icon-placeholder">
                        <img className='bg-gray-200 rounded-full p-2' src={back} alt="Back" />
                    </div>
                </Link>
                <h2 className="text-[20px] text-[#303F58] font-bold">Edit Item</h2>
            </div>

            <div className="w-full mx-auto p-5 bg-white rounded-lg shadow-md">
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-1 gap-x-5">
                    {/* Item Name */}
                    <div>
                        <label className="block text-[#303F58] font-[14px] mb-1 mt-5">Item Name</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="Enter Item Name"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="flex">
                        <div className="w-[84px] h-[70px] bg-[#F7E7CE] rounded-lg overflow-hidden">
                            <img src={profile ? URL.createObjectURL(profile) : "placeholder_image_url"} alt="" className="object-cover w-24" />
                        </div>
                        <div className="mx-5">
                            <h2 className="font-bold mb-4 text-[#303F58]">Upload Item Image</h2>
                            <label className="mt-4 p-2 border text-[#8F99A9] text-base font-[14px] rounded-lg cursor-pointer">
                                Upload Item Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfileChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* SKU */}
                    <div>
                        <label className="block text-[#303F58] font-[14px] mb-1">SKU</label>
                        <input
                            type="text"
                            value={SKU}
                            onChange={(e) => setSKU(e.target.value)}
                            placeholder="Enter SKU"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Retail Price */}
                    <div>
                        <label className="block text-[#303F58] font-[14px] mb-1">Retail Price</label>
                        <input
                            type="number"
                            value={retailPrice}
                            onChange={(e) => setRetailPrice(Number(e.target.value))}
                            placeholder="Enter Retail Price"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Purchase Price */}
                    <div>
                        <label className="block text-[#303F58] font-[14px] mb-1">Purchase Price</label>
                        <input
                            type="number"
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(Number(e.target.value))}
                            placeholder="Enter Purchase Price"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[#303F58] font-[14px] mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Description"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-span-2 flex justify-end mt-6">
                        <button
                            className="px-3 py-1 bg-[#FEFDFA] text-[#565148] font-[14px] rounded-md mr-2 border-2 border-[#565148] w-[74px] h-[38px]"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-3 py-1 bg-[#820000] text-[#FEFDF9] font-[14px] rounded-md w-[142px] h-[38px]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditItem;
