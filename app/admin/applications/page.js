import JobListApplicatinAdmin from "@/app/_components/JobListApplicatinAdmin";

export default function page() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-[#2d2e3e] tracking-tight">
            All <span className="text-[#2ecc91]">Applications</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Review candidate profiles, track their status, and find the perfect
            match for your team.
          </p>
        </div>

        {/* زر الإضافة سيأخذ العرض الكامل في الموبايل */}
        <div className="w-full sm:w-auto"></div>
      </div>
      <JobListApplicatinAdmin />
    </div>
  );
}
