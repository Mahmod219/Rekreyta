import CandidateCard from "@/app/_components/admin/CandidateCard";
import KandidatFilter from "@/app/_components/admin/KandidatFilter";
import PaginationControls from "@/app/_components/shared/PaginationControls";
import { getCandidate } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  UsersIcon,
  BriefcaseIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";

export default async function Page({ searchParams }) {
  const session = await getServerSession(authConfig);
  const adminId = session?.user?.id;
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const category = sParams?.category || "all";
  const page = Number(sParams?.page) || 1;
  const pageSize = 10;

  const { data: candidates, count } = await getCandidate({
    page,
    pageSize,
    query,
    category,
  });

  const totalPages = Math.ceil(count / pageSize);
  const showPagination = totalPages > 1;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* 1. قسم الترحيب والتعريف (Hero Section) */}
      <div className="relative overflow-hidden bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm">
        {/* خلفية جمالية خفيفة */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#2ecc91]/5 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2ecc91]/10 rounded-full">
              <SparklesIcon className="w-4 h-4 text-[#2ecc91]" />
              <span className="text-xs font-black text-[#2ecc91] uppercase tracking-wider">
                Smart Talent Search
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Kandidat<span className="text-[#2ecc91]">banken</span>
            </h1>

            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Välkommen till din centrala databas för talanger. Här kan du söka
              bland sparade profiler baserat på
              <span className="text-gray-900 font-bold"> kompetenser</span>,
              <span className="text-gray-900 font-bold"> branscher</span> eller
              <span className="text-gray-900 font-bold"> personnamn</span>.
              Hitta rätt person för nästa uppdrag snabbare än någonsin.
            </p>

            {/* أدلة البحث السريع */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                <HashtagIcon className="w-3 h-3" /> SÖK VIA TAGGAR
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                <BriefcaseIcon className="w-3 h-3" /> FILTERA BRANSCH
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                <UsersIcon className="w-3 h-3" /> DELAD DATABAS
              </div>
            </div>
          </div>

          {/* الإحصائية الكبيرة */}
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center min-w-45 shadow-2xl shadow-gray-900/20">
            <span className="text-sm font-bold text-[#2ecc91] uppercase tracking-widest mb-2">
              Totalt sparade
            </span>
            <span className="text-6xl font-black">{count}</span>
            <span className="text-xs text-gray-400 mt-2 font-medium">
              Talangfulla kandidater
            </span>
          </div>
        </div>
      </div>

      {/* 2. شريط البحث والفلترة (Smart Filter Bar) */}
      <div className="sticky top-4 z-10">
        <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white flex flex-col md:flex-row gap-3 items-center">
          <KandidatFilter />
        </div>
      </div>

      {/* 3. شبكة النتائج (Results Grid) */}
      <div className="min-h-100">
        {candidates && candidates.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center gap-4 px-6">
              <div className="h-px bg-gray-100 flex-1"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Visar matchningar
              </span>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>

            {candidates.map((can) => (
              <div key={can.id} className="group">
                <CandidateCard candidate={can} adminId={adminId} />
              </div>
            ))}
          </div>
        ) : (
          /* حالة عدم وجود نتائج */
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#2ecc91]/10 rounded-full blur-2xl"></div>
              <div className="relative bg-gray-50 p-6 rounded-full border border-gray-100">
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-300" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              Hoppsan! Inga träffar.
            </h3>
            <p className="text-gray-500 max-w-sm text-center mt-3 font-medium">
              Vi kunde inte hitta någon som matchar "
              <span className="text-gray-900 font-bold">{query}</span>" i
              kategorin{" "}
              <span className="text-gray-900 font-bold">{category}</span>. Prova
              att rensa filtren eller sök på en specifik kompetens.
            </p>
          </div>
        )}
      </div>

      {/* 4. التنقل بين الصفحات (Pagination) */}
      {showPagination && (
        <div className="flex justify-center pt-8">
          <PaginationControls currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
