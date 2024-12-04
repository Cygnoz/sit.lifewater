// import rupee from '../assets/images/receipt-indian-rupee.svg';
// import dollar from '../assets/images/circle-dollar.svg';
import { Link } from 'react-router-dom';
import Button from '../CommonComponents/Button';
import Circle_dollar_sign from '../assets/images/Icons/Circle_dollar_sign';
// import Receipt_ndian_rupee from '../assets/images/Icons/receipt_ndian_rupee';
import Receipt_ndian_rupee from '../assets/images/Icons/Receipt_ndian_rupee';


const card = [
  {
    icon: <Receipt_ndian_rupee/>,
    title: "Cash Sale",
    amonut: "0"
  },
  {
    icon: <Circle_dollar_sign />,
    title: "Credit Sale",
    amonut: "0"
  },
]
// Define the props interface


const Customers: React.FC = () => {
  return (
    <div className="min-h-screen p-4 space-y-4 bg-[#F5F6FA] pb-64">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-4 bg-[#FFFFFF] rounded-lg shadow-md border border-gray-200 col-span-2">
          <div className="space-y-4">
            
            {
              card.map((item) => (
                <div className="flex justify-between items-center p-4 bg-[#F5F6FA] rounded-lg shadow-md border border-gray-200">

                  <div className="flex items-center">
                    <span className="bg-[#E3E6D5] p-2 rounded-full">
                      {item.icon}
                    </span>
                    <div className="ml-4">
                      <p className="text-xl font-bold text-[#820000]">{item.amonut} AED</p>
                      <p className="text-sm font-medium text-[#787A7D]">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))
            }

            {/* Membership Section */}
            <hr />
            <div className="flex justify-between items-center p-4 bg-[#F3E6E6] rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <span className="bg-[#FFFFFF] p-2 rounded-full">
                <Receipt_ndian_rupee/>                </span>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#787A7D]">Membership Customer</p>
                  <p className="text-xl font-bold  text-[#820000] mr-20">0 AED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Customers Button */}
      <div >
        <Link to={'/viewcustomers'}>
          <Button size='xl' variant='primary'>
            All Customers
          </Button>
        </Link>
      </div>
    </div>
  );
}


export default Customers;

