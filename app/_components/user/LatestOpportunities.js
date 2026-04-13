import { getRecentJobs } from "@/app/_lib/data-service";
import JobCard from "./JobCard";
import Link from "next/link";

export default async function LatestOpportunities() {
  const recentJobs = await getRecentJobs();

  return (
    // نستخدم w-full لضمان ملء المساحة و px-4 للموبايل لترك مسافة عن الحافة
    <section className="relative z-20 w-full px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* التعديل الجوهري: استخدام -translate-y بدلاً من -mt */}
        <div className="relative -translate-y-20 md:-translate-y-28 bg-white/90 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] border border-white shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-gray-800 ">
                SENASTE <span className="text-[#2ecc91]">MÖJLIGHETER</span>
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                Hitta ditt nästa drömjobb bland våra senaste annonser
              </p>
            </div>

            <Link
              href="/jobs"
              className="hidden md:flex items-center gap-2 text-gray-600 font-bold hover:gap-3 transition-all"
            >
              Visa alla tjänster <span>→</span>
            </Link>
          </div>

          {/* الـ Grid: تأكد أن الـ JobCard داخله لا يملك عرضاً ثابتاً (fixed width) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {recentJobs.map((job) => (
              <JobCard job={job} key={job.id} />
            ))}
          </div>

          {/* زر عرض الكل للموبايل فقط */}
          <div className="mt-10 md:hidden">
            <Link
              className="block w-full text-center bg-[#2ecc91] text-white rounded-2xl py-4 font-bold shadow-lg shadow-[#2ecc91]/20 active:scale-95 transition-transform"
              href="/jobs"
            >
              Visa alla tjänster
            </Link>
          </div>

          {/* رابط عرض الكل للـ Desktop (اختياري بالأسفل أيضاً) */}
          <Link
            className="hidden md:block w-full text-center bg-gray-50 rounded-2xl py-4 mt-12 font-bold text-gray-600 hover:bg-[#2ecc91] hover:text-white transition-all shadow-sm"
            href="/jobs"
          >
            Utforska alla lediga tjänster
          </Link>
        </div>
      </div>
    </section>
  );
}
