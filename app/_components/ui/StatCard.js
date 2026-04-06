export default function StatCard({ label, value, color, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1">
      <div
        className={`${bgColor} ${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl font-black`}
      >
        {value || 0}
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
  );
}
