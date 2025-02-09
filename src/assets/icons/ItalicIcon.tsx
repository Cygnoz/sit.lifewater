type Props = {color:string}

function ItalicIcon({color}: Props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H10M14 20H5M15 4L9 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>
  )
}

export default ItalicIcon