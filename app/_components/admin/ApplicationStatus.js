"use client";
export default function ApplicationStatus({ status }) {
  const statusConfig = {
    Inkommen: "bg-orange-50 text-orange-600 border-orange-100",
    Godkänd: "bg-green-50 text-green-600 border-green-100",
    Avböjd: "bg-red-50 text-red-600 border-red-100",
    Intervju: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusConfig[status] || statusConfig.pending}`}
    >
      {status}
    </span>
  );
}
