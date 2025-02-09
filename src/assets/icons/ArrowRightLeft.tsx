
type Props = {
    size:number,
    color:string
}

function ArrowRightLeft({size,color}: Props) {
  return (
    <>
    <svg width={size || "24"} height={size || "24"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M16 3L20 7M20 7L16 11M20 7H4M8 21L4 17M4 17L8 13M4 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
     </svg>
    </>
  )
}

export default ArrowRightLeft