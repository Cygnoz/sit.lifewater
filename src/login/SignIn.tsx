import water from "../assets/images/water.svg";

const SignIn: React.FC = () => {
  return (
    <div className="bg-[#F6F4F4] w-full ">
      <div className="mx-3 mb-60">
        <h1 className="text-[#820000] text-[32px] font-[800]">Life Water</h1>
      </div>
      <div>
        <div className="flex gap-2">
          <h1 className="text-[36px] px-1 font-[700]">Thirsty ?</h1>
          <img src={water} alt="" />
        </div>
        <div>
          
            <h1 className="text-[33px] px-1 font-[700]">
            <span className="me-2 text-[#C3C3C3] ">
                We've got  
            </span>
               you covered.

            </h1>
        </div>
        <div className="m-4">
        <button className="w-full  my-14  bg-gradient-to-r  from-[#2A2B2F] to-[#28292D] bg-black text-white py-3 rounded-lg text-lg shadow-lg hover:bg-gray-900 transition duration-300">
          Sign In
        </button>
        <p className="text-xs text-gray-500 mt-9 pb-14 text-center">
        For security purposes: "We take your security seriously. Your login information is encrypted for your protection."        </p>
     
        </div>
      </div>
    </div>
  );
};

export default SignIn;
