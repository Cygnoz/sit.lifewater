
type Props = {size?: number}

const BackIcon = ({size}: Props) => {
  return (
    <div><svg   width={size || "40"}
    height={size || "40"} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="20" fill="white"/>
    <path d="M22.5 25L17.5 20L22.5 15" stroke="#303F58" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
  )
}

export default BackIcon