import { getJobsAdmin } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import PaginationControls from "../shared/PaginationControls";
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
  const sortBy = sParams?.sortBy || "newst";
  const published = sParams?.published || "all";
  const page = Number(sParams?.page) || 1;
  const pageSize = 10;

  const {
    data: jobs,
    count,
    stats,
  } = (await getJobsAdmin({
    query,
    category,
    location,
    sortBy,
    published,
    type,
    page,
    pageSize,
  })) || [];

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="flex flex-col gap-6">
      {/* 2. كروت الإحصائيات - تنسيق Grid محسن */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Totala Jobb"
          value={count || 0}
          color="text-gray-600"
          bgColor="bg-gray-50"
        />
        <StatCard
          label="Aktiva"
          value={stats.publishedCount || 0}
          color="text-[#2ecc91]"
          bgColor="bg-[#2ecc91]/10"
        />
        <StatCard
          label="Utkast"
          value={stats.unpublishedCount || 0}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          label="Utgångna"
          value={stats.expiredCount || 0}
          color="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      <div className="grid gap-3">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCardAdmin job={job} key={job.id} />)
        ) : (
          <p className="text-gray-500 text-center py-8">Inga jobb hittades</p>
        )}
      </div>
      {totalPages > 1 && (
        <PaginationControls currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
