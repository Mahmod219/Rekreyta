import { getJobsAdmin } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import StatCard from "../ui/StatCard";
import JobCardAdmin from "./JobCardAdmin";

export default async function JobsListAdmin({ searchParams }) {
  const session = await getServerSession(authConfig);
  if (!session || session.user.role !== "admin") return null;

  const sParams = await searchParams;
  const query = sParams?.query || "";
  const category = sParams?.category || "all";
  const location = sParams?.location || "all";
  const type = sParams?.type || "all";

  const jobs = (await getJobsAdmin()) || [];
  const filteredJobs = jobs.filter((job) => {
    const searchTerm = query.toLowerCase();
    const matchesQuery =
      query === "" ||
      job.title?.toLowerCase().includes(searchTerm) ||
      job.company?.toLowerCase().includes(searchTerm);

    const matchesCategory = category === "all" || job.category === category;
    const matchesLocation = location === "all" || job.location === location;
    const matchesType = type === "all" || job.type === type;

    return matchesQuery && matchesCategory && matchesLocation && matchesType;
  });

  const publishedJobs =
    filteredJobs?.filter((job) => job.published === true) || [];
  const UnpublishedJobs =
    filteredJobs?.filter((job) => job.published === false) || [];

  const today = new Date();

  const expiredCount = filteredJobs?.filter(
    (job) =>
      job.application_deadline && new Date(job.application_deadline) < today,
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* 2. كروت الإحصائيات - تنسيق Grid محسن */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Totala Jobb"
          value={filteredJobs?.length || 0}
          color="text-gray-600"
          bgColor="bg-gray-50"
        />
        <StatCard
          label="Aktiva"
          value={publishedJobs?.length || 0}
          color="text-[#2ecc91]"
          bgColor="bg-[#2ecc91]/10"
        />
        <StatCard
          label="Utkast"
          value={UnpublishedJobs?.length || 0}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          label="Utgångna"
          value={expiredCount || 0}
          color="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      <div className="grid gap-3">
        {filteredJobs && filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCardAdmin job={job} key={job.id} />)
        ) : (
          <p className="text-gray-500 text-center py-8">Inga jobb hittades</p>
        )}
      </div>
    </div>
  );
}
