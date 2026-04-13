import CandidateCard from "@/app/_components/admin/CandidateCard";
import { SearchBar } from "@/app/_components/shared";
import PaginationControls from "@/app/_components/shared/PaginationControls";
import { getCandidate } from "@/app/_lib/data-service";
import { UsersIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default async function Page({ searchParams }) {
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const page = Number(sParams?.page) || 1;
  const pageSize = 10;

  const { data: candidates, count } = await getCandidate({
    page,
    pageSize,
    query,
  });

  const totalPages = Math.ceil(count / pageSize);
  const showPagination = totalPages > 1;

  return (
    <div className="max-w-6xl mx-auto space-y-8 4">
      {/* الرأس (Header) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[#2ecc91]">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
              Kandidat<span className="text-[#2ecc91]">bank</span>
            </h1>
          </div>
          <p className="text-gray-500 font-medium ml-1">
            Hantera och granska alla sparade talanger i systemet.
          </p>
        </div>

        {/* إحصائية سريعة */}
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Hittade kandidater
          </span>
          <span className="text-2xl font-black text-[#2ecc91] leading-none">
            {count}
          </span>
        </div>
      </div>

      {/* شريط البحث */}
      <div className="bg-white p-4 rounded-4xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <SearchBar placeholder="Sök på namn, e-post..." />
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="min-h-100">
        {candidates && candidates.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {candidates.map((can) => (
              <div key={can.id} className="transition-all hover:translate-x-1">
                <CandidateCard candidate={can} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Inga kandidater hittades
            </h3>
            <p className="text-gray-500 max-w-xs text-center mt-2">
              Vi kunde inte hitta några matchningar för din sökning just nu.
            </p>
          </div>
        )}
      </div>

      {/* البجنيشن - يظهر فقط إذا كان هناك أكثر من صفحة */}
      {showPagination && (
        <PaginationControls currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
