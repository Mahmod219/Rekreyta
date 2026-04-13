import Link from "next/link";

export default function StaleInterviewAlert({ stale }) {
  const { start_time, applications } = stale;
  const profile = applications?.profiles;
  const candidateName = `${profile?.firstname || "Okänd"} ${profile?.lastname || ""}`;
  const appId = applications?.job_id;
  const emailAddress = applications?.profiles?.email;
  // حسبة الأيام
  const diffInDays = Math.floor(
    (new Date() - new Date(start_time)) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="group flex items-center justify-between py-3 px-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {/* دائرة صغيرة لعدد الأيام */}
        <div className="shrink-0`w-8 h-8 p-3 rounded-full bg-indigo-50 flex items-center justify-center">
          <span className="text-[10px] font-black text-indigo-600">
            {diffInDays}d
          </span>
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-800 truncate">
            {candidateName}
          </h4>
          <p className="text-[10px] text-gray-400 font-medium truncate">
            {emailAddress}
          </p>
        </div>
      </div>

      {/* زر إجراء صغير وسريع */}
      <Link
        href={`/admin/applications/${appId}`}
        className="shrink-0` ml-4 text-[10px] font-black uppercase tracking-tighter text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        Svara nu
      </Link>
    </div>
  );
}
