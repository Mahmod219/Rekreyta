"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#f97316", "#EF4444", "#3498db", "#2ecc91"];

export default function ApplicationsPieChartAdmin({ data, count }) {
  // تصفية البيانات لإخفاء القيم الصفرية (اختياري، يجعل المخطط أجمل)
  const filteredData = data.filter((item) => item.value > 0);

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col items-center">
      {/* الـ Height هنا يجب أن يكون ثابتاً في الحاوية ليتمكن ResponsiveContainer من ملئه */}
      <div className="w-full h-75 sm:h-87.5">
        <h3 className="font-bold text-md text-gray-400 mb-4 text-center">
          <span className="text-4xl text-black font-bold"> {count} </span>
          Totalt Ansökningar
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={
                filteredData.length > 0
                  ? filteredData
                  : [{ name: "Ingen data", value: 1 }]
              }
              dataKey="value"
              nameKey="name"
              innerRadius="60%" // استخدام النسب المئوية أفضل للـ Responsive
              outerRadius="85%"
              paddingAngle={5}
              stroke="none"
            >
              {filteredData.length > 0 ? (
                filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))
              ) : (
                <Cell fill="#f3f4f6" /> // لون رمادي في حال عدم وجود بيانات
              )}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={80}
              iconType="circle"
              wrapperStyle={{ paddingTop: "5px", fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
