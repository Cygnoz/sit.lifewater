import React from 'react';

type Props = {
  color: string;
  height?: number;
  width?: number;
  bold?:number;
  className?: string;
};

const CehvronDown: React.FC<Props> = ({ color, height, width,bold, className }) => {
  return (
    <div>
      <svg
        height={height ? height : 24}
        width={width ? width : 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M6 9L12 15L18 9"
          stroke={color}
          strokeWidth={bold||"2"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CehvronDown;
