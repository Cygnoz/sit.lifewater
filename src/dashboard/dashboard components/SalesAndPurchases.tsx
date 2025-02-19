"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { endpoints } from "../../services/ApiEndpoint";
import { useEffect, useState } from "react";
import useApi from "../../Hook/UseApi";

interface OrderDetails {
  _id: string;
  date: string;
  totalAmount: number;
}

export default function SalesChart() {
  const { request: getAllOrders } = useApi("get", 4001);
  const [chartData, setChartData] = useState<any[]>([]);
  const [month, setMonth] = useState<string>("");

  const getAllOrdersData = async () => {
    try {
      const url = `${endpoints.GET_ALL_ORDERS}`;
      const { response, error } = await getAllOrders(url);

      if (!error && response) {
        processData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const processData = (orders: OrderDetails[]) => {
    const dailySales: { [key: string]: number } = {};
    let currentMonth = "";

    orders.forEach((order) => {
      const date = new Date(order.date);
      const day = date.getDate();
      currentMonth = date.toLocaleString("default", { month: "long" });
      
      if (!dailySales[day]) {
        dailySales[day] = 0;
      }

      dailySales[day] += order.totalAmount || 0;
    });

    setMonth(currentMonth);
    
    const formattedData = Object.keys(dailySales).map((day) => ({
      name: `Day ${day}`,
      AED: dailySales[day],
    }));

    setChartData(formattedData);
  };

  useEffect(() => {
    getAllOrdersData();
  }, []);

  return (
    <div className="bg-white rounded-lg w-full py-8">
      <h3 className="ms-10 mb-6 text-[16px] font-bold">Total Sales/Day of {month}</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#A5578"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis stroke="#4A5568" fontSize={12} tick={{ fontSize: 12 }} />
            <CartesianGrid vertical={false} stroke="#E2E8F0" />
            <Tooltip cursor={false} />
            
            {/* Total Sales Line */}
            <Line type="monotone" dataKey="AED" stroke="hsl(210, 20%, 20%)" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">Loading data...</p>
      )}
    </div>
  );
}
