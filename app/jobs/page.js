import jobs from "@/public/jobs.jpg";

import Image from "next/image";
import { getJobs } from "../_lib/data-service";
import { JobFilters } from "../_components/shared";
import JobCard from "../_components/user/JobCard";

export const metadata = {
  title: "Lediga Jobb",
  description:
    "Sök och filtrera bland hundratals lediga tjänster i hela Sverige.",
};

export default async function JobsPage({ searchParams }) {
  const sParams = await searchParams;
  const query = sParams?.query || "";
  const category = sParams?.category || "all";
  const location = sParams?.location || "all";
  const type = sParams?.type || "all";

  const allJobs = (await getJobs()) || [];

  const filteredJobs = allJobs.filter((job) => {
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
    <main className="min-h-screen ">
      <section className="relative min-h-[80vh]  sm:min-h-[45vh] md:min-h-[45vh] lg:min-h-[50vh]  w-full flex items-center  overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={jobs}
            alt="Find your dream job"
            fill
            priority
            placeholder="blur"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 md:bg-linear-to-r md:from-black/80 md:to-transparent" />
        </div>

        <div className="flex flex-col relative z-10 container mx-auto px-6">
          <div className="">
            <h1 className="text-3xl md:text-6xl font-black text-white leading-tight mb-8">
              TA STEGET MOT DITT <br />
              <span className="text-[#2ecc91]">DRÖMJOBBET</span>
            </h1>

            <div className="  w-full space-y-4">
              <JobFilters />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {query ? `Search results for: "${query}"` : "Latest jobs available"}
          </h2>
          <span className="text-sm font-bold text-[#2ecc91] bg-white px-4 py-2 rounded-full border shadow-sm">
            {filteredJobs.length} Jobs Found
          </span>
        </div>

        <div className="grid grid-cols-1  gap-8">
          {filteredJobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
