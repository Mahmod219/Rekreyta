import { getJobsAdmin } from "@/app/_lib/data-service";
import JobCardApplicationAdmin from "./JobCardApplicationAdmin";

export default async function JobListApplicatinAdmin({ searchParams }) {
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const sortBy = sParams?.sortBy || "newst";

  const jobs = (await getJobsAdmin()) || [];

  const filteredJobs = jobs.filter((job) => {
    const serchTerm = query.toLowerCase();
    const matchesQuery =
      query === "" ||
      job?.title?.toLowerCase().includes(serchTerm) ||
      job?.company?.toLowerCase().includes(serchTerm) ||
      job?.location?.toLowerCase().includes(serchTerm);

    return matchesQuery;
  });

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
    </div>
  );
}
