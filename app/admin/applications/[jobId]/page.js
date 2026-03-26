import ApplicationsAdmin from "@/app/_components/ApplicationsAdmin";
import Filter from "@/app/_components/Filter";
import { getApplicationsByJob } from "@/app/_lib/data-service";

export default async function page({ params, searchParams }) {
  // 1. يجب عمل await لكل من params و searchParams في Next.js 15
  const { jobId } = await params;
  const sParams = await searchParams; // أضف هذا السطر

  // 2. جلب البيانات الأساسية
  let applications = await getApplicationsByJob(jobId);

  // 3. استخراج قيمة الفلتر بأمان
  const filterValue = sParams?.status || "all";

  // 4. تطبيق الفلترة (استخدام let للمصفوفة للسماح بتعديلها)
  if (filterValue !== "all") {
    applications = applications.filter((app) => app.status === filterValue);
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-[#2d2e3e] tracking-tight">
          Received <span className="text-[#2ecc91]">Applications</span>
        </h2>
        <p className="text-gray-500 font-medium">
          Review and manage candidates for this position
        </p>
      </header>

      {/* إضافة مسافة سفلية للفلتر */}
      <div className="mb-8">
        <Filter
          label="Application Status"
          filterField="status"
          options={[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "accepted", label: "Accepted" },
            { value: "rejected", label: "Rejected" },
            { value: "interview", label: "Interview" },
          ]}
        />
      </div>

      {applications && applications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {" "}
          {/* أضفنا gap للتباعد بين الكروت */}
          {applications.map((application) => (
            <ApplicationsAdmin application={application} key={application.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">
            {filterValue === "all"
              ? "No applications yet for this job."
              : `No applications found with status: ${filterValue}`}
          </p>
        </div>
      )}
    </div>
  );
}
