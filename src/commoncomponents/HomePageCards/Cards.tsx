import React from "react";
import bgImag from "../../../src/assets/Mask group (1).png"

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
  count: number | string;
  isActive: boolean;
  onCardClick: () => void;
}

const Cards: React.FC<CardProps> = ({
  imageSrc,
  title,
  description,
  count,
  isActive,
  onCardClick,
}) => {
  return (
    <div
      className={`p-4 shadow-md rounded-lg cursor-pointer bg-white`}
      onClick={onCardClick}
    >
     <div className="flex"> <img className="w-[49px] h-[43px]" src={imageSrc} alt={title} />
{isActive && <div className="w-full flex items-center justify-center">
         <img src={bgImag} alt="" className="" />
    
</div>  }   </div>
      <div className={` font-bold leading-normal text-[#303F58] text-[17px]  relative ${isActive?'-mt-5':'mt-1.5'}`}>
        {title}
      </div>
      <p className="text-[#4B5C79]  text-[12px]">{description}</p>
      <div
        className={`font-bold leading-normal text-[18px] mt-3 ${
          isActive ? "text-[#820000]" : "text-[#303F58]"
        }`}
      >
        {count}
      </div>
    </div>
  );
};

export default Cards;
