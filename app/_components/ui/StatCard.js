export default function StatCard({ label, value, color, bgColor }) {
  return (
    <div className="group bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-2 relative overflow-hidden">
      {/* خلفية جمالية خفيفة تظهر عند الهوفر */}
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* دائرة العدد */}
      <div
        className={`${bgColor} ${color} w-16 h-16 rounded-3xl flex items-center justify-center mb-5 text-2xl font-black shadow-inner transition-transform duration-500 group-hover:scale-110`}
      >
        {value || 0}
      </div>

      {/* النصوص */}
      <div className="space-y-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {label}
        </h3>
        {/* أضفت كلمة توضيحية صغيرة لتعطي شكل الـ Dashboard */}
        <p className="text-[10px] font-medium text-gray-300 italic">
          Totalt antal
        </p>
      </div>

      {/* خط ملون صغير في الأسفل يظهر عند الهوفر */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 ${color.replace("text-", "bg-")} transition-all duration-300 group-hover:w-1/3 rounded-t-full`}
      />
    </div>
  );
}
