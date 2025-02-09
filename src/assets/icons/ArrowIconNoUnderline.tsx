type Props = {
  size?: number;
  color?: string;
  className?: string;
  stroke?:number
};

function ArrowIconNoUnderline({ size = 24, color = "black", className = "",stroke }: Props) {
  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12L12 5M12 5L19 12M12 5V19"
          stroke={color}
          strokeWidth={stroke||"3"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default ArrowIconNoUnderline;
