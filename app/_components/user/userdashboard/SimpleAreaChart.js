"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SimpleAreaChart = ({ chartData }) => {
  return (
    <div className="w-full h-full min-h-75 flex flex-col">
      {/* الـ ResponsiveContainer يحتاج حاوية لها طول محدد */}
      <div className="flex-1 w-full h-75 sm:h-87.5">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20, // إزاحة لتوفير مساحة في الموبايل
              bottom: 0,
            }}
          >
            {/* التدرج اللوني (Gradient) يعطي شكل احترافي جداً */}
            <defs>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ecc91" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2ecc91" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* شبكة خفيفة جداً (أفقية فقط أفضل للعين) */}
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
              dy={10} // دفع النص للأسفل قليلاً
            />

            {/* إخفاء المحور الرأسي للحصول على مظهر نظيف أو تركه مع تنسيق بسيط */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="Antal ansökningar"
              stroke="#2ecc91"
              strokeWidth={3} // خط أعرض قليلاً ليبرز
              fillOpacity={1}
              fill="url(#colorGreen)" // استخدام التدرج المعرف في الأعلى
              animationDuration={1500} // حركة دخول ناعمة
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleAreaChart;
