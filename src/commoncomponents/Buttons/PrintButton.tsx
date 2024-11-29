import PrinterIcon from "../../assets/icons/PrinterIcon";


const PrintButton = () => {

  return (
    <button className="p-2 gap-2 text-sm flex items-center justify-center border border-gray-500 rounded-lg text-gray-500 h-[35px]">
      <PrinterIcon color="#565148" height={20} width={20} /> <p className="font-medium">Print</p>
    </button>
  );
};

export default PrintButton;
