import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import getSavedJob, {
  getAccountInfo,
  getUserApplications,
} from "../_lib/data-service";
import { authConfig } from "../api/auth/[...nextauth]/route";

import SimpleAreaChart from "../_components/user/userdashboard/SimpleAreaChart";
import StatCardUser from "../_components/user/userdashboard/StatCardUser";
import ApplicationsPieChart from "../_components/user/userdashboard/ApplicationsPieChart";

import { BookmarkIcon, BriefcaseIcon } from "@heroicons/react/24/solid";
import ProfileStrength from "../_components/user/userdashboard/ProfileStrength";
import LatestApps from "../_components/user/userdashboard/LatestApps";

export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");

  const userId = session.user.id;

  // 🟢 months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Maj",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ];

  // 🟢 counters
  const statusCounts = {
    inkommen: 0,
    godkänd: 0,
    avböjd: 0,
    intervju: 0,
  };

  let userApplications = [];
  let userAppsCount = 0;
  let userSavedCount = 0;
  let profileFildes = [];

  // 🟢 fetch data
  try {
    const [apps, saved, profile] = await Promise.all([
      getUserApplications(userId),
      getSavedJob(userId),
      getAccountInfo(userId),
    ]);

    userApplications = apps || [];
    userAppsCount = userApplications.length || null;
    userSavedCount = saved?.length || 0;
    profileFildes = profile || [];
  } catch (error) {
    console.error("Feil vid hämtning:", error);
  }

  // 1. حول كائن البروفايل إلى مصفوفة من القيم
  const profileValues = Object.values(profileFildes || {});

  // 2. الآن يمكنك استخدام الفلتر والحساب
  const completedFilds = profileValues.filter(Boolean).length;

  // 3. حساب النسبة المئوية (تأكد أن المصفوفة ليست فارغة لتجنب القسمة على صفر)
  const totalFields = profileValues.length || 1;
  const strengthValue = Math.round((completedFilds / totalFields) * 100);

  // 🟢 count statuses
  userApplications.forEach((app) => {
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

  // 🟢 chart per month
  const currentYear = new Date().getFullYear();
  const counts = Array(12).fill(0);

  userApplications.forEach((app) => {
    const date = new Date(app.created_at);

    if (date.getFullYear() === currentYear) {
      counts[date.getMonth()]++;
    }
  });

  const chartData = months.map((month, i) => ({
    month,
    "Antal ansökningar": counts[i],
  }));

  const firstName = session.user.name.split(" ").at(0);

  const activeProcesses = statusCounts.intervju + statusCounts.inkommen;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* 🟢 Header Section */}
      <div className="mb-4">
        <h2 className="font-black text-3xl text-gray-800">
          Välkommen, {firstName}! 👋
        </h2>
        <p className="text-gray-500 mt-1 mb-3">
          Här är en överblick av din karriärresa. Lycka till med ditt
          jobbsökande!
        </p>
        <ProfileStrength value={strengthValue} />
      </div>
      <div className="bg-[#2ecc91] p-6 rounded-[2.5rem] mb-4 text-white">
        <h4 className="font-bold mb-2">Dagens tips! 💡</h4>
        <p className="text-sm opacity-90">
          Användare med ett personligt brev har 40% högre chans att få komma på
          intervju.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🟢 Left Column (Main Content) - يأخذ مساحة 2 من 3 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 🟢 Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCardUser
              title="Ansökningar"
              value={userAppsCount}
              icon={<BriefcaseIcon className="h-6 w-6" />}
              subtitle="Totalt skickade"
            />
            <StatCardUser
              title="Sparade"
              value={userSavedCount}
              icon={<BookmarkIcon className="h-6 w-6" />}
            />
            <StatCardUser
              title="Aktiva"
              value={activeProcesses}
              icon={
                <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
              }
              subtitle="Pågående processer"
            />
          </div>

          {/* 🟢 Main Chart */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
            <h3 className="font-bold text-lg mb-4 ml-2">Aktivitetsöversikt</h3>
            <SimpleAreaChart chartData={chartData} />
          </div>

          {/* 🟢 Latest Applications Table */}
          <LatestApps />
        </div>

        {/* 🟢 Right Column (Side Info) - يأخذ مساحة 1 من 3 */}
        <div className="space-y-8">
          {/* 🟢 Profile Strength */}

          {/* 🟢 Pie Chart - نضعه هنا ليملأ الجانب */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
            <h3 className="font-bold text-lg mb-4 text-center">
              Statusfördelning
            </h3>
            <ApplicationsPieChart data={pieData} />
          </div>

          {/* 🟢 Quick Tip Card (إضافة جمالية) */}
        </div>
      </div>
    </div>
  );
}
