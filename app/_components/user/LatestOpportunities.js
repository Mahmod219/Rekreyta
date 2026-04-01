import { getRecentJobs } from "app/_lib/data-service";
import JobCard from "./JobCard";

export default async function LatestOpportunities() {
  const recentJobs = await getRecentJobs();
  return (
    <section className="relative z-20 -mt-24 max-w-7xl mx-auto py-12 px-6">
      <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-gray-100 shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-gray-950 tracking-tight">
          Latest Opportunities
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentJobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
