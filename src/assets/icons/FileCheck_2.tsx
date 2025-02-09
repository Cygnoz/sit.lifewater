type Props = { color: string ,height?:number,width?:number};

function FileCheck_2({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"24"}
    height={height?height:"24"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66667 14.6663H12C12.3536 14.6663 12.6928 14.5259 12.9428 14.2758C13.1929 14.0258 13.3333 13.6866 13.3333 13.333V4.66634L10 1.33301H4C3.64638 1.33301 3.30724 1.47348 3.05719 1.72353C2.80714 1.97358 2.66667 2.31272 2.66667 2.66634V5.33301M9.33333 1.33301V3.99967C9.33333 4.3533 9.47381 4.69244 9.72386 4.94248C9.97391 5.19253 10.313 5.33301 10.6667 5.33301H13.3333M2 9.99967L3.33333 11.333L6 8.66634" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    </div>
  )
}

export default FileCheck_2