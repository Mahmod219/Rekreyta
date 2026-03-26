import AddJobButton from "@/app/_components/AddJobButton";
import JobFilters from "@/app/_components/JobFilters";
import JobsListAdmin from "@/app/_components/JobsListAdmin";
import Spinner from "@/app/_components/Spinner";
import { Suspense } from "react";

export default function Page({ searchParams }) {
  return (
    <div className="space-y-6">
      {/* 1. Header Section: العنوان وزر الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-[#2d2e3e] tracking-tight">
            Job <span className="text-[#2ecc91]">Postings</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Manage, edit, and publish your job offers from here.
          </p>
        </div>

        {/* زر الإضافة سيأخذ العرض الكامل في الموبايل */}
        <div className="w-full sm:w-auto">
          <AddJobButton />
        </div>
      </div>

      <div className=" w-full space-y-4">
        <JobFilters />
      </div>

      {/* 2. Statistics Overview (إضافة اختيارية تعطي شكل احترافي) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Jobs"
          value="24"
          color="bg-gray-50 text-gray-600"
        />
        <StatCard label="Live" value="18" color="bg-green-50 text-[#2ecc91]" />
        <StatCard
          label="Drafts"
          value="6"
          color="bg-orange-50 text-orange-600"
        />
        <StatCard label="Expired" value="2" color="bg-red-50 text-red-600" />
      </div>

      {/* 3. Jobs List Section */}
      <div className="bg-gray-50/50 rounded-3xl min-h-100">
        <Suspense
          fallback={
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          }
        >
          {/* تأكد أن JobsListAdmin يعرض الكروت بمسافات (gap) جيدة */}
          <div className="grid grid-cols-1 gap-4">
            <JobsListAdmin searchParams={searchParams} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

// مكون فرعي صغير للإحصائيات السريعة
function StatCard({ label, value, color }) {
  return (
    <div
      className={`p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center bg-white`}
    >
      <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
        {label}
      </span>
      <span className={`text-xl font-black ${color.split(" ")[1]}`}>
        {value}
      </span>
    </div>
  );
}
