import { getJobs } from "@/app/_lib/data-service";
import JobCard from "./JobCard";

export default async function JobsList() {
  const jobs = await getJobs();

  if (jobs.length === 0)
    return <p>Vet bara att vi inte har några jobberbjudanden till dig</p>;

  return (
    <div className="grid gap-3">
      {jobs.map((job) => (
        <JobCard job={job} key={job.id} />
      ))}
    </div>
  );
}
