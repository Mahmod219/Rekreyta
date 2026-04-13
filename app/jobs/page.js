import jobsBg from "@/public/jobsBg.jpg";

import Image from "next/image";
import { getJobs } from "../_lib/data-service";
import { JobFilters } from "../_components/shared";
import JobCard from "../_components/user/JobCard";
import SortByUser from "../_components/ui/SortByUser";
import PaginationControls from "../_components/shared/PaginationControls";

export const metadata = {
  title: "Lediga Jobb",
  description:
    "Sök och filtrera bland hundratals lediga tjänster i hela Sverige.",
};

export default async function JobsPage({ searchParams }) {
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const category = sParams?.category || "all";
  const location = sParams?.location || "all";
  const type = sParams?.type || "all";
  const sortBy = sParams?.sortBy || "newest";
  const page = Number(sParams?.page) || 1;
  const pageSize = 10;

  const { data: allJobs, count } =
    (await getJobs({
      query,
      category,
      location,
      sortBy,
      type,
      page,
      pageSize,
    })) || [];

  const sortedJobs = allJobs.sort((a, b) => {
    if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at); // من الأقدم للأحدث
    } else if (sortBy === "numApp-asc") {
      return (a.applicantsCount || 0) - (b.applicantsCount || 0); // من الأقل عدداً للأكثر
    } else if (sortBy === "numApp-desc") {
      return (b.applicantsCount || 0) - (a.applicantsCount || 0); // من الأكثر عدداً للأقل
    } else {
      // الافتراضي: newest (الأحدث أولاً)
      return new Date(b.created_at) - new Date(a.created_at);
    }
  });
  const totalPages = Math.ceil(count / pageSize);
  return (
    <main className="min-h-screen">
      {/* Section Hero - تقليل الارتفاع في الموبايل */}
      <section className="relative min-h-[50vh] lg:min-h-[60vh] w-full flex items-center overflow-hidden py-12 lg:py-0">
        <div className="absolute inset-0 z-0">
          <Image
            src={jobsBg}
            alt="Hitta ditt drömjobb"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-black/50 md:bg-linear-to-r md:from-black/90 md:to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-4 tracking-tight">
              TA STEGET MOT DITT <br />
              <span className="text-[#2ecc91]">DRÖMJOBBET</span>
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-6 max-w-xl font-light">
              Upptäck jobb som matchar din potential och ambition.
            </p>

            {/* صندوق الفلاتر - جعل الحواف والبادينج أصغر في الموبايل */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-4xl lg:rounded-[3rem] shadow-2xl border border-white/20">
              <div className="bg-gray-50 p-3 md:p-5 rounded-[1.8rem] lg:rounded-[2.5rem] shadow-inner">
                <JobFilters />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم النتائج - تقليل المسافات العلوية */}
      <section className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* شريط الأدوات - Responsive Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
          <div className="space-y-0.5">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              {query ? `Resultat för: "${query}"` : "Lediga tjänster"}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Hitta din nästa utmaning
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* عدد النتائج - يظهر بشكل أنيق بجانب الترتيب في الموبايل */}
            <div className="flex flex-col items-start md:items-end md:mr-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                Hittade
              </span>
              <span className="text-lg font-black text-[#2ecc91] leading-none">
                {count}
              </span>
            </div>

            {/* مكون الفرز - عرض كامل في الموبايل */}
            <div className="flex-1 md:w-48 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <SortByUser />
            </div>
          </div>
        </div>

        {/* شبكة الوظائف - تقليل الجاب (Gap) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {sortedJobs.length > 0 ? (
            sortedJobs.map((job) => (
              <div
                key={job.id}
                className="transition-all duration-300 hover:translate-x-1"
              >
                <JobCard job={job} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200">
              <p className="text-lg text-gray-400 font-bold text-balance">
                Inga jobb matchar din sökning.
              </p>
              <a
                href="/jobs"
                className="mt-3 inline-block text-[#2ecc91] font-bold underline"
              >
                Visa alla jobb
              </a>
            </div>
          )}
        </div>

        {/* البجنيشن - تقليل المسافة العلوية */}
        <div className="mt-10 flex justify-center">
          <div>
            {totalPages > 1 && (
              <PaginationControls currentPage={page} totalPages={totalPages} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
