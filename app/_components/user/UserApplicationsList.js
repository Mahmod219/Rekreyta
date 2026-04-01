import { getUserAppliedJobs } from "app/_lib/data-service";
import UserApplicationCard from "./UserApplicationCard";

export default async function UserApplicationsList({ application }) {
  const { job_id, status } = application;
  const appliedJobs = await getUserAppliedJobs(job_id);
  if (!appliedJobs.length)
    return (
      <div className="text-center py-10 text-gray-500">No applications yet</div>
    );

  return (
    <div>
      {appliedJobs.map((job) => (
        <UserApplicationCard job={job} key={job.id} status={status} />
      ))}
    </div>
  );
}
