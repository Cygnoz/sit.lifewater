type Props = { color?: string ,height?:number,width?:number};

function Circle_dollar_sign({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"16"}
    height={height?height:"16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_6201_2831)">
    <path d="M10.6667 5.33333H6.66671C6.31309 5.33333 5.97395 5.47381 5.7239 5.72386C5.47385 5.97391 5.33337 6.31304 5.33337 6.66667C5.33337 7.02029 5.47385 7.35943 5.7239 7.60947C5.97395 7.85952 6.31309 8 6.66671 8H9.33337C9.687 8 10.0261 8.14047 10.2762 8.39052C10.5262 8.64057 10.6667 8.97971 10.6667 9.33333C10.6667 9.68695 10.5262 10.0261 10.2762 10.2761C10.0261 10.5262 9.687 10.6667 9.33337 10.6667H5.33337M8.00004 12V4M14.6667 8C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8C1.33337 4.3181 4.31814 1.33333 8.00004 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" stroke={color?color:"#4B5C79"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    {/* <defs>
    <clipPath id="clip0_6201_2831">
    <rect width={width?width:"16"}
    height={height?height:"16"} fill="white"/>
    </clipPath>
    </defs> */}
    </svg>
    </div>
  )
}

export default Circle_dollar_sign