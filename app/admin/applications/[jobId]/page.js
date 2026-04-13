import ApplicationsAdmin from "@/app/_components/admin/ApplicationsAdmin";
import { SearchBar } from "@/app/_components/shared";
import PaginationControls from "@/app/_components/shared/PaginationControls";
import Filter from "@/app/_components/ui/Filter";

import { getApplicationsByJob, getReview } from "@/app/_lib/data-service";

export default async function Page({ params, searchParams }) {
  const { jobId } = await params;
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const status = sParams?.status || "all";
  const match = sParams?.match || "all";
  const page = Number(sParams?.page) || 1;
  const pageSize = 10;

  const { data: allApps, count } = await getApplicationsByJob({
    jobId,
    query,
    status,
    match,
    page,
    pageSize,
  });

  const appIds = allApps.map((app) => app.id);
  const reviewsPromises = appIds.map((id) => getReview(id));
  const allReviews = await Promise.all(reviewsPromises);
  const reviewsMap = {};
  allReviews.forEach((reviews, index) => {
    reviewsMap[appIds[index]] = reviews;
  });

  const title = allApps[0]?.jobs?.title;
  const company = allApps[0]?.jobs?.company;

  const totalPages = Math.ceil(count / pageSize);

  return (
    // max-w-5xl ليعطي مساحة أكبر قليلاً للعرض إذا كان هناك جداول
    <div className="max-w-5xl mx-auto  space-y-10">
      {/* 1. رأس الصفحة - تحسين التباعد والخطوط */}
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
          Inkomna <span className="text-[#2ecc91]">Ansökningar</span> <br />
        </h1>
        <p className="text-xl text-gray-600 font-bold ">
          Till {title} på {company}
        </p>
        <p className="text-gray-500 font-medium my-2">
          Granska och hantera kandidater för denna tjänst. Filtrera baserat på
          status, namn eller email för att hålla koll på processen.
        </p>
      </header>

      {/* 2. شريط الأدوات (Filter Tool) */}
      {/* جعلت الحاوية أنيقة وبسيطة بدون ألوان خلفية قوية لتبرز العناصر */}
      <div className="flex flex-col flex-wrap lg:flex-row items-center gap-4 bg-white/80 backdrop-blur-md p-5 rounded-4xl shadow-md border border-gray-100">
        <div className="w-full lg:flex-2">
          <SearchBar placeholder="Sök namn eller email" />
        </div>
        <div className="w-full lg:flex-1">
          <Filter
            label="status"
            filterField="status"
            options={[
              { value: "all", label: "Alla" },
              { value: "inkommen", label: "Inkommen" },
              { value: "godkänd", label: "Godkänd" },
              { value: "avböjd", label: "Avböjd" },
              { value: "intervju", label: "Intervju" },
            ]}
          />
        </div>
        <div className="w-full lg:flex-1">
          <Filter
            label="AI-matchresultat"
            filterField="match"
            options={[
              { value: "all", label: "Alla" },
              { value: "75-100", label: "75% - 100%" },
              { value: "50-74", label: "50% - 74%" },
              { value: "0-49", label: "0% - 49%" },
            ]}
          />
        </div>
      </div>
      {/* إحصائية سريعة لعدد الطلبات المفلترة */}
      <div className="flex justify-between items-center px-2">
        <div className="text-sm font-bold text-gray-400">
          Visar {count} ansökningar
        </div>
      </div>

      {/* 3. قائمة المتقدمين */}
      <div className="space-y-4">
        {allApps && allApps.length > 0 ? (
          <div className="grid gap-4">
            {allApps.map((application) => (
              <ApplicationsAdmin
                application={application}
                rev={reviewsMap[application.id] || []}
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
                {status === "all"
                  ? "Det finns inga ansökningar för den här tjänsten än."
                  : `Inga kandidater har statusen "${status}" just nu.`}
              </p>
            </div>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <PaginationControls currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
