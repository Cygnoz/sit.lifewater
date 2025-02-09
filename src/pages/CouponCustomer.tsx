
import { useEffect, useState } from 'react';
import coupon from '../assets/images/Group.svg'
import circle from '../assets/images/circle-plus.png'
import search from '../assets/images/search.svg'


import { Link } from 'react-router-dom';
import { endpoints } from '../services/ApiEndpoint';
import useApi from '../Hook/UseApi';


interface CouponDetails {
  customerFullName: string;
  couponDetails: {
    couponName: string;
  };
  paidAmount: number;
  couponNumber: string;
  createdAt: string;
}
const CouponCustomer: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [couponCustomers, setCouponCustomers] = useState<CouponDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // get All Coupon customers
  const { request: getAllCouponcustomers } = useApi("get", 4000);
  const getAllCouponCustomers = async () => {
    setLoading(true);
    try {
      const url = `${endpoints.GET_ALL_COUPON_CUSTOMER_DETAILS}`;
      const { response, error } = await getAllCouponcustomers(url);

      console.log("get All Coupon customers:", response);
      if (!error && response) {
        const CouponCustomers = response?.data?.data.sort(
          (a: CouponDetails, b: CouponDetails) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setCouponCustomers(CouponCustomers)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getAllCouponCustomers();
  }, []);

  // Filter the list based on search input
  const filteredCoupons = couponCustomers.filter(
    (coupon) =>
      coupon.customerFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.couponDetails.couponName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      coupon.createdAt.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  <input
    type="text"
    placeholder="Search..."
    className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none focus:shadow-none"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-6 pt-6">


        {/* Search bar and Add button */}
        <div className="w-full flex items-center justify-between px-4 ">
          <div className="relative w-full flex items-center">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 text-sm w-full rounded-xl text-[#8F99A9] h-10 border-0 bg-[#FFFFFF] focus:ring-1 focus:ring-gray-100 focus:outline-none focus:shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img src={search} alt="Search Icon" className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <Link to="/CouponSale">
            <img className='m-2' src={circle} alt="" />
          </Link>
        </div>
        <div className='w-full px-5'>
          <div>
            {loading ? (
              <div className="p-2 text-center text-gray-500">Loading...</div>
            ) : couponCustomers?.length > 0 ? (
              filteredCoupons.map((coupon: any) => (
                <div
                  className="bg-gradient-to-l from-[#E3E6D5] to-[#F7E7CE] w-full my-3 p-5 rounded-xl"
                  key={coupon._id || Math.random()}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-[#303F58]">
                        <div className="flex text-[12px] gap-1">
                          <p>

                            {new Date(coupon?.createdAt).toLocaleDateString("en-GB")}
                          </p>
                          <p>
                            {new Date(coupon?.createdAt).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-[#303F58]">Customer</p>
                      </div>
                      <p className="text-[#303F58] text-[16px] font-bold ms-1">
                        {coupon.customerFullName || "NA"}
                      </p>
                    </div>

                  </div>
                  <div>
                    <p className="text-[#303F58]">Coupon</p>
                    <p className="text-[#303F58] font-semibold ms-1">
                      {coupon.couponDetails?.couponName || "NA"}
                    </p>
                  </div>
                  <div className="flex bg-[#FFFFFF] px-2 py-1 gap-2 mt-2 rounded-md items-center">
                    <p className="text-[12px] text-[#303F58]">Payment Mode</p>
                    <span className="h-3 w-[2px] bg-[#9EA9BB]"></span>
                    <p className="text-[12px] text-[#303F58] font-bold">
                      Cash : {coupon.couponDetails?.price || "NA"} AED
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center">
                {/* Illustration Image */}
                <img src={coupon} alt="Illustration" className="w-32 h-35 object-cover mb-5 mt-5" />

                {/* No Return Customers Text */}
                <span className="text-gray-500 text-sm">No Customers</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CouponCustomer;
