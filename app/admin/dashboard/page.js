import ApplicationsPieChartAdmin from "@/app/_components/admin/dashboard/ApplicationsPieChartAdmin";
import JobStatRow from "@/app/_components/admin/dashboard/JobStatRow";
import JobStatusOverview from "@/app/_components/admin/dashboard/JobStatusOverview";
import ProcessingGapChart from "@/app/_components/admin/dashboard/ProcessingGapChart";
import {
  getBottomJobs,
  getJobsStatusCount,
  getTopJobs,
  getTotalApplications,
  getWeeklyApplicationStats,
} from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Statistik & Analys" };

export default async function Page() {
  const session = await getServerSession(authConfig);
  if (!session || session.user.role !== "admin") redirect("/login");
  const statusCounts = {
    inkommen: 0,
    godkänd: 0,
    avböjd: 0,
    intervju: 0,
  };
  let topJobs = [];
  let bottomJobs = [];
  let jobsCont = [];
  let totalApplications = [];
  let chartData = [];

  try {
    const [top, bottom, jobStats, totalApps, chartapps] = await Promise.all([
      getTopJobs(),
      getBottomJobs(),
      getJobsStatusCount(),
      getTotalApplications(),
      getWeeklyApplicationStats(),
    ]);
    topJobs = top || [];
    bottomJobs = bottom || [];
    jobsCont = jobStats || [];
    totalApplications = totalApps || [];
    chartData = chartapps || [];
  } catch (error) {
    console.log(error.message);
  }

  totalApplications.forEach((app) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status]++;
    }
  });

  // 🟢 pie data
  const pieData = [
    { name: "Inkommen", value: statusCounts.inkommen },
    { name: "Godkänd", value: statusCounts.godkänd },
    { name: "Avböjd", value: statusCounts.avböjd },
    { name: "Intervju", value: statusCounts.intervju },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* الهيدر بنفس ستايل صفحة الأدمن */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
            Analys <span className="text-[#2ecc91]">.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Här ser du hur dina annonser presterar och var du behöver lägga
            fokus.
          </p>
        </div>
      </header>
      <JobStatusOverview stats={jobsCont} />
      <ApplicationsPieChartAdmin
        data={pieData}
        count={totalApplications.length}
      />
      <ProcessingGapChart data={chartData} />
      {/* الشبكة الرئيسية: تقسيم العرض */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* القسم الأول: الأكثر طلباً (5 أعمدة) */}
        <section className="lg:col-span-6 space-y-6 bg-white p-6 rounded-4xl shadow-xl border border-gray-50">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Mest populära jobb
              </h2>
              <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">
                Hög prestation 🔥
              </p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
              TOP 5
            </span>
          </div>

          <div className="space-y-1">
            {topJobs.length > 0 ? (
              topJobs.map((job, index) => (
                <JobStatRow key={job.id} job={job} index={index} type="top" />
              ))
            ) : (
              <p className="text-center py-10 text-gray-400 italic text-sm">
                Ingen data tillgänglig
              </p>
            )}
          </div>
        </section>

        {/* القسم الثاني: الأقل طلباً (5 أعمدة) */}
        <section className="lg:col-span-6 space-y-6 bg-white p-6 rounded-4xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Minst populära jobb
              </h2>
              <p className="text-[10px] text-red-400 font-bold uppercase mt-1">
                Behöver optimeras 🧊
              </p>
            </div>
            <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded-lg">
              TOP 5
            </span>
          </div>

          <div className="space-y-1">
            {bottomJobs.length > 0 ? (
              bottomJobs.map((job, index) => (
                <JobStatRow
                  key={job.id}
                  job={job}
                  index={index}
                  type="bottom"
                />
              ))
            ) : (
              <p className="text-center py-10 text-gray-400 italic text-sm">
                Ingen data tillgänglig
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
