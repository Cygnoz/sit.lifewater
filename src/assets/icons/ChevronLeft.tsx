
type Props = { color: string , className?:string ,strokeWidth?:string} ;

const ChevronLeft = ({ color , className ,strokeWidth}: Props) => {
  return (
    <div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M15 18L9 12L15 6"
          stroke={color}
          strokeWidth={strokeWidth ? strokeWidth : "1"}
          strokeLinecap="round"
        strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChevronLeft;
