"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 20 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 35 },
  { name: "May", value: 50 },
  { name: "Jun", value: 65 },
  { name: "Jul", value: 60 },
  { name: "Aug", value: 78 },
  { name: "Sep", value: 72 },
  { name: "Oct", value: 68 },
  { name: "Nov", value: 80 },
  { name: "Dec", value: 85 },
]
   

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-[#4A5568] px-2 py-1">
        <p className="text-white text-sm">{`${payload[0].value}%`}</p>
      </div>
    )
  }
  return null
}

export default function Component() {
  return (
    <div className="bg-white rounded-lg w-full py-8">
      <h3 className="ms-10 mb-6 text-[16px] font-bold">
        Sales And Purchases
      </h3>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart width={300} data={data}>
          <XAxis
            dataKey="name"
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <CartesianGrid vertical={false} stroke="#E2E8F0" />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4A5568"
            isAnimationActive={true}       // Enables or disables animation
            animationDuration={1500}       // Sets the duration of the animation (in milliseconds)
            animationEasing="ease-in-out"  // Sets the easing function (options include "ease", "linear", "ease-in", etc.)
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}