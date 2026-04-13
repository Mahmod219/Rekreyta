import { redirect } from "next/navigation";
import { authConfig } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import {
  getExpairedJobs,
  getInterviews,
  getStaleInterViews,
} from "../_lib/data-service";
import { isToday } from "date-fns";
import TodayesIntervies from "../_components/admin/adminMainPage/TodayesIntervies";
import DeadlineAlerts from "../_components/admin/adminMainPage/DeadlineAlerts";
import StaleInterviewAlert from "../_components/admin/adminMainPage/StaleInterviewAlert";

export const metadata = { title: "Översikt & Uppgifter" };
export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }
  let todayInterviews = [];
  let expairedJobs = [];
  let staleInterviwes;
  try {
    const [interviews, expired, stale] = await Promise.all([
      getInterviews(),
      getExpairedJobs(),
      getStaleInterViews(),
    ]);
    todayInterviews = interviews || [];
    expairedJobs = expired || [];
    staleInterviwes = stale || [];
  } catch (error) {
    console.error("Feil vid hämtning:", error);
  }

  const interviewsResult = todayInterviews.filter((today) =>
    isToday(new Date(today.start_time)),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* الهيدر أو الترحيب في الأعلى */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
            Översikt <span className="text-[#2ecc91]">.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Välkommen tillbaka, {session?.user?.name?.split(" ")[0]}. Här är
            dagens viktigaste uppdateringar.
          </p>
        </div>
        <div className="text-right bg-white p-4 rounded-4xl shadow-xl ">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Dagens Datum
          </span>
          <span className="font-bold text-gray-700">
            {new Date().toLocaleDateString("sv-SE")}
          </span>
        </div>
      </header>

      {/* الشبكة الرئيسية: تقسيم العرض */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* القسم الأول: أجندة اليوم (يأخذ 5 أعمدة من أصل 12 مثلاً) */}
        <section className="lg:col-span-5 space-y-6 bg-white p-4 rounded-4xl shadow-xl ">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Dagens Agenda
            </h2>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
              {interviewsResult.length} MÖTEN
            </span>
          </div>

          {interviewsResult.length > 0 &&
            interviewsResult.map((inter) => (
              <TodayesIntervies key={inter.id} interviews={inter} />
            ))}
        </section>

        <section className="lg:col-span-5 space-y-6 bg-white p-4 rounded-4xl shadow-xl">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
              Sista ansökningsdag idag
            </h2>
            <span className="text-[10px] font-bold bg-[#fff9f2] text-orange-600 px-2 py-1 rounded-lg">
              {expairedJobs.length} Jobb
            </span>
          </div>

          <div className="space-y-4">
            {expairedJobs.length > 0 &&
              expairedJobs.map((dead) => (
                <DeadlineAlerts key={dead.id} expiringJobs={dead} />
              ))}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white p-6 rounded-[2.5rem] border border-gray-100 flex flex-col h-full shadow-xl">
          {/* الرأس - Header */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex flex-col">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Väntar på Feedback
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5 italic">
                Intervjuer äldre än 7 dagar
              </p>
            </div>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
              {staleInterviwes.length} Personer
            </span>
          </div>

          {/* القائمة - List */}
          <div className="flex-1 overflow-y-auto pr-1">
            {staleInterviwes.length > 0 ? (
              staleInterviwes.map((stale) => (
                <StaleInterviewAlert key={stale.id} stale={stale} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
                <p className="text-sm">Inga sena uppföljningar</p>
              </div>
            )}
          </div>
        </section>

        {/* القسم الثاني: مكونات أخرى (يأخذ باقي المساحة 7 أعمدة) */}
      </div>
    </div>
  );
}
