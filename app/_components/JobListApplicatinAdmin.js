import { getJobs } from "../_lib/data-service";
import JobCardApplicationAdmin from "./JobCardApplicationAdmin";

export default async function JobListApplicatinAdmin() {
  const jobs = (await getJobs()) || [];

  return (
    <div className="flex flex-col gap-4">
      {" "}
      {/* أضف التباعد هنا */}
      {jobs.map((job) => (
        <JobCardApplicationAdmin
          job={job}
          key={job.id}
          applicantsCount={job.applicantsCount}
        />
      ))}
    </div>
  );
}
