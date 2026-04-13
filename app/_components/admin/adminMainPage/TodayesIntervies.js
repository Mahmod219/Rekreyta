import {
  VideoCameraIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function TodayesIntervies({ interviews }) {
  const { start_time, type, location_or_link, applications } = interviews;
  const profile = applications?.profiles;
  const fullname = `${profile?.firstname || "Okänd"} ${profile?.lastname || ""}`;

  const time = new Date(start_time).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex items-center justify-between py-4 px-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all">
      <div className="flex items-center gap-4 min-w-0">
        {/* الوقت بشكل مبسط */}
        <div className="flex flex-col items-center justify-center min-w-12 h-12 bg-gray-50 rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Tid
          </span>
          <span className="text-xs font-black text-gray-800">{time}</span>
        </div>

        {/* معلومات الشخص ونوع المقابلة */}
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-gray-900 truncate">
            {fullname}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
                type === "online" ? "text-emerald-500" : "text-indigo-500"
              }`}
            >
              {type === "online" ? (
                <VideoCameraIcon className="w-3 h-3" />
              ) : (
                <MapPinIcon className="w-3 h-3" />
              )}
              {type === "online" ? "Online" : "På plats"}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-[9px] text-gray-400 font-medium truncate max-w-37.5">
              {location_or_link || "Ingen plats"}
            </span>
          </div>
        </div>
      </div>

      {/* زر الانتقال */}
      <Link
        href={`/admin/interviews`}
        className="ml-4 p-2 bg-gray-50 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-900 hover:text-white"
      >
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </div>
  );
}
