import { getJobs } from "../_lib/data-service";
import JobCard from "./JobCard";

export default async function JobsList() {
  const jobs = await getJobs();

  if (jobs.length === 0) return <p>Just know we have no job offers to you</p>;

  return (
    <div className="grid gap-3">
      {jobs.map((job) => (
        <JobCard job={job} key={job.id} />
      ))}
    </div>
  );
}
