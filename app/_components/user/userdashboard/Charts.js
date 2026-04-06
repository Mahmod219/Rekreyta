// app/_components/dashboard/NewChart.js
"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Chart({ chartData }) {
  return (
    <div className="h-87.5 w-full bg-white p-4 rounded-4xl shadow-sm border border-gray-100">
      <h3 className="text-gray-700 font-bold mb-4 px-2">
        Ansökningar per månad
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2ecc91" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2ecc91" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="Antal ansökningar"
            stroke="#2ecc91"
            strokeWidth={3}
            fill="url(#chartColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
