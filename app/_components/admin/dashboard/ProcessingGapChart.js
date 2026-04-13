"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ProcessingGapChart({ data }) {
  return (
    <div className="lg:col-span-12 bg-white p-8 rounded-4xl shadow-xl border border-gray-50 h-112.5 flex flex-col">
      <div className="mb-6 px-2">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
          Arbetsbelastning & Svarsfrekvens
        </h2>
        <p className="text-[10px] text-gray-400 mt-1 italic">
          Jämförelse mellan mottagna ansökningar och hanterade ärenden (Senaste
          7 dagarna)
        </p>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />

            {/* خط الطلبات المستلمة */}
            <Line
              name="Mottagna"
              type="monotone"
              dataKey="received"
              stroke="#3b82f6" // أزرق
              strokeWidth={4}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8 }}
            />

            {/* خط الطلبات المعالجة */}
            <Line
              name="Hanterade"
              type="monotone"
              dataKey="processed"
              stroke="#10b981" // زمردي
              strokeWidth={4}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
