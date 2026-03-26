import Job from "@/app/_components/Job";
import { getJob, getJobs } from "@/app/_lib/data-service";

export async function generateStaticParams() {
  const jobs = await getJobs();

  const ids = jobs.map((job) => ({
    jobId: String(job.id),
  }));
  return ids;
}

export default async function page({ params }) {
  const { jobId } = await params;

  const job = await getJob(jobId);

  return (
    <div>
      <div>
        <Job job={job} />
      </div>
    </div>
  );
}
