
type Props = {
    size?:number,
}

function StarYellow({size}: Props) {
  return (
    <>
    <svg width={size||"18"} height={size||"18"} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2476_37850)">
<path d="M9 0L11.7811 5.92532L18 6.87539L13.5 11.4876L14.5622 18L9 14.9255L3.43757 18L4.5 11.4876L0 6.87539L6.21892 5.92532L9 0Z" fill="#F7D323"/>
</g>
<defs>
<clipPath id="clip0_2476_37850">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
    </>
  )
}

export default StarYellow