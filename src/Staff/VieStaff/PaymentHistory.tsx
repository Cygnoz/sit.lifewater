import payment from '../../assets/images/delivery-man-with-water-payment.svg'
import plus from '../../assets/circle-plus.svg'

type Props = {}

const PaymentHistory = ({}: Props) => {
  return (
    <div className="w-ful mx-auto mb-5 pt-2 ps-5 pe-5 bg-white shadow-md rounded-lg "> <div className="p-4 text-center grid grid-cols-2 gap-4">
    <div>
      <img src={payment} alt="No Orders" className="w-[690px] h-[420px]  mb-10  rounded-md mx-auto" />
    </div>
    <div className='justify-center  mt-40'>
      <p className="text-[32px] text-[#303F58]  font-[400]">No Payment History Found</p>
      <p className="text-[16px] text-[#4B5C79]  font-[300]">
        Lorem ipsum dolor sit amet consectetur. Arcu porttitor lacus sit ut a sed gravida.
      </p>

      <button className="mt-4 px-4 py-2 bg-[#820000] text-[14] font-[400] text-white rounded-lg mx-5">
        <p className='flex'><img className='me-2' src={plus} alt="" />Go to Payment</p></button>

    </div>
  </div></div>
  )
}

export default PaymentHistory