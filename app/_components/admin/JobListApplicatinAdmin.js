import { getJobsAdmin } from "@/app/_lib/data-service";
import JobCardApplicationAdmin from "./JobCardApplicationAdmin";
import PaginationControls from "../shared/PaginationControls";

export default async function JobListApplicatinAdmin({ searchParams }) {
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const category = sParams?.category || "all";
  const location = sParams?.location || "all";
  const type = sParams?.type || "all";
  const sortBy = sParams?.sortBy || "newst";
  const published = sParams?.published || "all";
  const page = Number(sParams?.page) || 1;
  const pageSize = 10;

  const { data: jobs, count } =
    (await getJobsAdmin({
      query,
      category,
      location,
      sortBy,
      published,
      type,
      page,
      pageSize,
    })) || [];

  const filteredJobs = jobs.filter((job) => job.applicantsCount > 0, []);

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at); // من الأقدم للأحدث
    } else if (sortBy === "numApp-asc") {
      return (a.applicantsCount || 0) - (b.applicantsCount || 0); // من الأقل عدداً للأكثر
    } else if (sortBy === "numApp-desc") {
      return (b.applicantsCount || 0) - (a.applicantsCount || 0); // من الأكثر عدداً للأقل
    } else {
      // الافتراضي: newest (الأحدث أولاً)
      return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const totalPages = Math.ceil(count / pageSize);
  const showPagination = totalPages > 1;

  return (
    <div>
      <div className="flex flex-col gap-4">
        {sortedJobs.length > 0 ? (
          sortedJobs.map((job) => (
            <JobCardApplicationAdmin
              job={job}
              key={job.id}
              applicantsCount={job.applicantsCount}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10 font-bold">
            Inga jobb hittades... 🔍
          </p>
        )}
      </div>
      {showPagination && (
        <PaginationControls currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
