import { JobsListAdmin } from "app/_components/admin";
import { JobFilters, Spinner } from "app/_components/shared";
import { AddJobButton } from "app/_components/ui";
import { Suspense } from "react";

export default async function Page({ searchParams }) {
  const sParams = await searchParams;

  return (
    <div className="max-w-6xl mx-auto  px-6 space-y-10">
      {/* 1. الهيدر مع زر الإضافة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-[#2d2e3e] tracking-tighter">
            Jobb <span className="text-[#2ecc91]">Annonser</span>
          </h2>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Hantera, redigera och publicera dina tjänster härifrån.
          </p>
        </div>
        <div className="shrink-0">
          <AddJobButton />
        </div>
      </div>

      {/* 3. أدوات الفلترة والبحث */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-4xl shadow-md border border-gray-100">
        <JobFilters />
      </div>

      {/* 4. قائمة الوظائف مع Suspense */}
      <div className="space-y-4">
        <div className="px-2">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Lista över annonser
          </h3>
        </div>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-gray-100">
              <Spinner />
              <p className="mt-4 text-gray-400 font-medium">
                Laddar annonser...
              </p>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <JobsListAdmin searchParams={sParams} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1">
      <div
        className={`${bgColor} ${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl font-black`}
      >
        {value}
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
  );
}
