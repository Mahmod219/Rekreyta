import SavedJobsCard from "@/app/_components/user/SavedJobsCard";
import getSavedJob from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect("/login");
  }

  const userId = session?.user?.id;
  const savedJobs = (await getSavedJob(userId)) || [];

  return (
    <div className="max-w-5xl mx-auto pb-10 px-4">
      {/* 🟢 Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            Sparade jobb <span className="text-2xl">🔖</span>
          </h1>
          <p className="text-gray-500 mt-2 max-w-md">
            Här hittar du alla tjänster du har sparat. Gå igenom dem och skicka
            din ansökan när du är redo!
          </p>
        </div>

        {/* إحصائية سريعة للوظائف المحفوظة */}
        <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100">
          <span className="text-sm text-orange-600 font-bold uppercase tracking-wider">
            Antal sparade
          </span>
          <p className="text-2xl font-black text-orange-600">
            {savedJobs.length} st
          </p>
        </div>
      </div>

      {/* 🟢 Saved Jobs Grid/List */}
      <div className="grid grid-cols-1 gap-6">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <div
              key={job.id}
              className="transition-all hover:-translate-y-1 duration-300"
            >
              <SavedJobsCard job={job} />
            </div>
          ))
        ) : (
          /* 🟢 Empty State في حال لا يوجد وظائف محفوظة */
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-gray-200">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Din lista är tom
            </h3>
            <p className="text-gray-500 mt-2 mb-8 max-w-xs mx-auto">
              Hittade du inget intressant än? Utforska lediga tjänster och spara
              dina favoriter.
            </p>
            <Link
              href="/jobs"
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all inline-block shadow-xl shadow-gray-200"
            >
              Utforska jobb
            </Link>
          </div>
        )}
      </div>

      {/* 🟢 Tips Section (إضافة جمالية) */}
      {savedJobs.length > 0 && (
        <div className="mt-12 p-6 bg-blue-50 rounded-4xl border border-blue-100 flex items-start gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900">Tips från oss!</h4>
            <p className="text-sm text-blue-700 opacity-80">
              Vänta inte för länge med att söka. De mest populära jobben kan
              försvinna snabbt!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
