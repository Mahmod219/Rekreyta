import { JobListApplicatinAdmin } from "@/app/_components/admin";
import SortByAdmin from "@/app/_components/admin/SortByAdmin";
import { SearchBar } from "@/app/_components/shared";

export default async function Page({ searchParams }) {
  // ملاحظة: يفضل دائماً جعل الصفحة async لاستلام searchParams بشكل صحيح في Next.js 15
  const sParams = await searchParams;

  return (
    <div className="max-w-5xl mx-auto   space-y-10">
      {/* 1. رأس الصفحة (Header) - بنفس نمط الصفحة السابقة */}
      <header className="space-y-3">
        <h2 className="text-4xl font-black text-[#2d2e3e] tracking-tighter leading-tight">
          Hantera <span className="text-[#2ecc91]">Lediga Tjänster</span>
        </h2>
        <p className="text-gray-500 font-medium text-lg max-w-2xl leading-relaxed">
          Översikt över alla publicerade jobb. Här kan du söka, sortera och se
          hur många som har ansökt till varje tjänst.
        </p>
      </header>

      {/* 2. شريط الأدوات (Search & Sort) - بتنسيق الـ Glassmorphism الموحد */}
      <div className="flex flex-col lg:flex-row items-center gap-4 bg-white/80 backdrop-blur-md p-5 rounded-4xl shadow-md border border-gray-100">
        <div className="w-full lg:flex-2">
          <SearchBar placeholder="Sök på titel, företag eller stad..." />
        </div>
        <div className="w-full lg:flex-1">
          <SortByAdmin />
        </div>
      </div>

      {/* إحصائية بسيطة لتعزيز تجربة المستخدم */}
      <div className="flex justify-between items-center px-2">
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Aktiva Annonser
        </div>
      </div>

      {/* 3. قائمة الوظائف (List Area) */}
      <div className="space-y-4">
        <JobListApplicatinAdmin searchParams={sParams} />
      </div>
    </div>
  );
}
