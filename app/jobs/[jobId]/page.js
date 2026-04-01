import { getJob } from "@/app/_lib/data-service";
import { Job } from "app/_components/user";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId;
  const job = await getJob(jobId);
  if (!job) return { title: "Jobbet hittades inte" };

  return {
    title: `${job.title} hos ${job.company}`,
    description: `Ansök till tjänsten som ${job.title} på ${job.company} i ${job.city}. Läs mer och skicka din ansökan via Rekreyta.`,
  };
}

export default async function page({ params }) {
  const resolvedParams = await params;
  const jobId = resolvedParams.jobId;

  const job = await getJob(jobId);
  if (!job) {
    notFound();
  }

  return (
    <div>
      <Job job={job} />
    </div>
  );
}
