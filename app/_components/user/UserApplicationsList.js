import { getUserAppliedJobs } from "@/app/_lib/data-service";
import UserApplicationCard from "./UserApplicationCard";

export default async function UserApplicationsList({ application }) {
  const { job_id, status } = application;
  const appliedJobs = await getUserAppliedJobs(job_id);
  if (!appliedJobs || appliedJobs.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">
        Inga ansökningar ännu
      </div>
    );

  return (
    <div>
      {appliedJobs.map((job) => (
        <UserApplicationCard job={job} key={job.id} status={status} />
      ))}
    </div>
  );
}
