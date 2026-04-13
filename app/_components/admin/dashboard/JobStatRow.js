export default function JobStatRow({ job, index, type }) {
  const count = job.applications?.[0]?.count || 0;

  return (
    <div className="group flex items-center justify-between py-4 px-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all rounded-xl">
      <div className="flex items-center gap-4 min-w-0">
        {/* رقم الترتيب */}
        <span
          className={`text-xs font-black w-5 ${type === "top" ? "text-emerald-500" : "text-red-400"}`}
        >
          {index + 1}.
        </span>

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-gray-900">
            {job.title}
          </h4>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase ${
          type === "top"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-600"
        }`}
      >
        <span>{count}</span>
        <span className="opacity-70">Ansökningar</span>
      </div>
    </div>
  );
}
