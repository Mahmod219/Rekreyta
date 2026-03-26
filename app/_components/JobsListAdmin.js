import { getJobsAdmin } from "../_lib/data-service";
import JobCardAdmin from "./JobCardAdmin";
import JobFilters from "./JobFilters";

export default async function JobsListAdmin({ searchParams }) {
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

  return (
    <div className="grid gap-3">
      {filteredJobs.map((job) => (
        <JobCardAdmin job={job} key={job.id} />
      ))}
    </div>
  );
}
