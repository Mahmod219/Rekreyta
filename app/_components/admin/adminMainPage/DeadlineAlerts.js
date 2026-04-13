import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function DeadlineAlerts({ expiringJobs }) {
  const { title } = expiringJobs;
  // الحماية من الأخطاء
  if (!expiringJobs || expiringJobs.length === 0) return null;

  // إذا كان هناك أكثر من وظيفة، ندمج أسماءهم بنص واحد أو نعرض أول واحدة مع إشارة للباقي

  return (
    <div className="bg-[#fff9f2] border border-[#ffecd1] rounded-2xl p-4 flex items-center justify-between group">
      {/* القسم الأيسر: الأيقونة + النص */}
      <div className="flex items-center gap-3 min-w-0">
        {/* gap-3 تعطي المسافة الصغيرة التي طلبتها بين الأيقونة والشغل */}
        <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 shrink-0" />

        <p className="text-sm font-bold text-gray-800 truncate">{title}</p>
      </div>

      {/* القسم الأيمن: السهم في الآخر */}
      <Link
        href="/admin/joboffers"
        className="p-1 hover:bg-orange-100 rounded-full transition-colors"
      >
        <ArrowRightIcon className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
