import CirclePlus from "../../assets/icons/CirclePlus";


const AddNewButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <button className="flex items-center gap-2 bg-[#820000] text-white px-5 py-2 rounded-md">
      <CirclePlus color="white" size="18"/>
      <p>{children}</p> {/* Display children inside the button */}
      
    </button>
  );
};

export default AddNewButton;
