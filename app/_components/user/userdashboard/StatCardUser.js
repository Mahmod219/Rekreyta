"use client";

export default function StatCardUser({ title, value, icon, subtitle }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className="text-[#2ecc91]">{icon}</div>
      </div>

      <h3 className="text-3xl font-black text-gray-900">{value}</h3>

      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
