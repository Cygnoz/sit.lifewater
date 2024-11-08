"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  Cell,
  ResponsiveContainer,
} from "recharts"
import Tooltips from "./Tooltip"

const colors = ["#f2c6b8", "#a72522", "#fbe6c3", "#eef1d6", "#e3e7e5"]

const data = [
  { name: "January", value: 150 },
  { name: "February", value: 200 },
  { name: "March", value: 300 },
  { name: "April", value: 250 },
  { name: "May", value: 320 },
  { name: "June", value: 280 },
  { name: "July", value: 350 },
  { name: "August", value: 400 },
  { name: "September", value: 370 },
  { name: "October", value: 450 },
  { name: "November", value: 420 },
  { name: "December", value: 500 },
]

const renderCustomTooltip = ({ payload }: any) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`AED ${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#000000"
        arrowColor="#000000"
        width="80px"
      />
    )
  }
  return null
}

const renderCustomizedLabel = (props: any) => {
  const { x, y, width } = props
  const radius = 10
  const spacing = -10
  return (
    <g transform={`translate(${x + width / 2}, ${y + spacing})`}>
      <circle cx={0} cy={-radius} r={radius} fill="none" strokeWidth={0} />
      <image x={-radius} y={-radius * 2} width={radius * 2} height={radius * 2} />
    </g>
  )
}

const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props
  const radius = 10

  return (
    <g>
      <path
        d={`M${x},${y + radius} 
           L${x},${y + height} 
           L${x + width},${y + height} 
           L${x + width},${y + radius} 
           Q${x + width},${y} ${x + width - radius},${y} 
           L${x + radius},${y} 
           Q${x},${y} ${x},${y + radius}`}
        fill={fill}
      />
    </g>
  )
}

export default function SalesbyPaymentMode() {
  return (
    <div className="w-full bg-white p-2 rounded-lg">
      <div className="px-10">
        <h3 className="text-[16px] font-bold">Top Sales by Payment Mode</h3>
        <h4 className="py-4 text-[10px] text-[#4A5568]">Payment mode Volume</h4>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={data}
          margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            dataKey="name"
          />
          <YAxis
            stroke="#4A5568"
            axisLine={false}
            tickLine={false}
            fontSize={10}
          />
          <Tooltip content={renderCustomTooltip} cursor={{ fill: "transparent" }} />
          <Bar 
            shape={<CustomBar />} 
            barSize={30} 
            dataKey="value" 
            fill="#8884d8"
          >
            <LabelList dataKey="name" content={renderCustomizedLabel} />
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}