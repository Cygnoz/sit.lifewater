type Props = { color?: string ,height?:number,width?:number};

function Receipt_ndian_rupee({color,height,width}: Props) {
  return (
    <div><svg width={width?width:"16"}
    height={height?height:"16"} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.33329 4.66667H10.6666M7.99996 11.6667L5.33329 10H5.99996C6.7072 10 7.38548 9.71905 7.88558 9.21895C8.38567 8.71886 8.66663 8.04058 8.66663 7.33334C8.66663 6.62609 8.38567 5.94781 7.88558 5.44772C7.38548 4.94762 6.7072 4.66667 5.99996 4.66667M5.33329 7.33334H10.6666M2.66663 1.33334V14.6667L3.99996 14L5.33329 14.6667L6.66663 14L7.99996 14.6667L9.33329 14L10.6666 14.6667L12 14L13.3333 14.6667V1.33334L12 2L10.6666 1.33334L9.33329 2L7.99996 1.33334L6.66663 2L5.33329 1.33334L3.99996 2L2.66663 1.33334Z" stroke={color?color:"#4B5C79"}  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </div>
  )
}

export default Receipt_ndian_rupee