import { SearchBar } from "@/app/_components/shared";
import { getApplicationsByJob } from "@/app/_lib/data-service";
import { ApplicationsAdmin } from "app/_components/admin";
import { Filter } from "app/_components/ui";

export default async function Page({ params, searchParams }) {
  const { jobId } = await params;
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const filterValue = sParams?.status || "all";

  const allApplications = await getApplicationsByJob(jobId);

  const jobTitle = allApplications?.[0]?.jobs?.title || "Tjänst";
  const jobCompany = allApplications?.[0]?.jobs?.company || "Företag";

  // دمج البحث وفلتر الحالة في عملية واحدة لضمان الدقة
  const filtered = allApplications.filter((app) => {
    const searchTerm = query.toLowerCase();

    // 1. شرط البحث (عن طريق الوصول لـ profiles)
    const matchesQuery =
      query === "" ||
      app.profiles?.firstname?.toLowerCase().includes(searchTerm) ||
      app.profiles?.lastname?.toLowerCase().includes(searchTerm) ||
      app.profiles?.email?.toLowerCase().includes(searchTerm);

    // 2. شرط الحالة
    const matchesStatus = filterValue === "all" || app.status === filterValue;

    return matchesQuery && matchesStatus;
  });

  return (
    // max-w-5xl ليعطي مساحة أكبر قليلاً للعرض إذا كان هناك جداول
    <div className="max-w-5xl mx-auto px-6 space-y-10">
      {/* 1. رأس الصفحة - تحسين التباعد والخطوط */}
      <header className="space-y-3">
        <h2 className="text-4xl font-black text-[#2d2e3e] tracking-tighter leading-tight">
          Inkomna <span className="text-[#2ecc91]">Ansökningar</span> <br />
          <span className="text-xl tracking-normal text-gray-500 font-bold">
            Till: {jobTitle} på {jobCompany}
          </span>
        </h2>

        <p className="text-gray-500 font-medium text-lg max-w-2xl leading-relaxed">
          Granska och hantera kandidater för denna tjänst. Filtrera baserat på
          status, namn eller email för att hålla koll på processen.
        </p>
      </header>

      {/* 2. شريط الأدوات (Filter Tool) */}
      {/* جعلت الحاوية أنيقة وبسيطة بدون ألوان خلفية قوية لتبرز العناصر */}
      <div className="flex flex-col flex-wrap lg:flex-row items-center gap-4 bg-white/80 backdrop-blur-md p-5 rounded-[2rem] shadow-md border border-gray-100">
        <div className="w-full lg:flex-2">
          <SearchBar placeholder="Sök namn eller email" />
        </div>
        <div className="w-full lg:flex-1">
          <Filter
            label="status"
            filterField="status"
            options={[
              { value: "all", label: "Alla" },
              { value: "Inkommen", label: "Inkommen" },
              { value: "Godkänd", label: "Godkänd" },
              { value: "Avböjd", label: "Avböjd" },
              { value: "Intervju", label: "Intervju" },
            ]}
          />
        </div>
      </div>
      {/* إحصائية سريعة لعدد الطلبات المفلترة */}
      <div className="flex justify-between items-center px-2">
        <div className="text-sm font-bold text-gray-400">
          Visar {filtered.length} ansökningar
        </div>
      </div>

      {/* 3. قائمة المتقدمين */}
      <div className="space-y-4">
        {filtered && filtered.length > 0 ? (
          <div className="grid gap-4">
            {filtered.map((application) => (
              <ApplicationsAdmin
                application={application}
                key={application.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-4">
            <div className="text-5xl">🔍</div>
            <div className="space-y-1">
              <p className="text-gray-900 font-black text-xl">
                Inga ansökningar hittades
              </p>
              <p className="text-gray-400 font-medium">
                {filterValue === "all"
                  ? "Det finns inga ansökningar för den här tjänsten än."
                  : `Inga kandidater har statusen "${filterValue}" just nu.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
