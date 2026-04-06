import { UserApplicationsList } from "@/app/_components/user";
import { getUserApplications } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");

  const userId = session?.user?.id;
  const applications = (await getUserApplications(userId)) || [];

  return (
    <div className="max-w-5xl mx-auto pb-10 px-4">
      {/* 🟢 Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800">
            Mina ansökningar
          </h1>
          <p className="text-gray-500 mt-2 max-w-md">
            Här kan du följa statusen på alla jobb du har sökt. Vi håller
            tummarna för dig! 🤞
          </p>
        </div>

        {/* إحصائية سريعة تعطي شكل جمالي */}
        <div className="bg-[#2ecc91]/10 px-6 py-3 rounded-2xl border border-[#2ecc91]/20">
          <span className="text-sm text-[#18a277] font-bold uppercase tracking-wider">
            Totalt skickade
          </span>
          <p className="text-2xl font-black text-[#18a277]">
            {applications.length} st
          </p>
        </div>
      </div>

      {/* 🟢 Applications List */}
      <div className="flex flex-col gap-6">
        {applications?.length > 0 ? (
          applications.map((application) => (
            <UserApplicationsList
              application={application}
              key={application.id}
            />
          ))
        ) : (
          /* Empty State شكل احترافي في حال لا يوجد طلبات */
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-gray-200">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-800">
              Inga ansökningar ännu
            </h3>
            <p className="text-gray-500 mt-2 mb-6">
              Du har inte skickat in några ansökningar än. Ditt drömjobb väntar
              på dig!
            </p>
            <Link
              href="/jobs"
              className="bg-[#2ecc91] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1bb988] transition-all inline-block shadow-lg shadow-[#2ecc91]/20"
            >
              Hitta lediga jobb
            </Link>
          </div>
        )}
      </div>

      {/* 🟢 Footer Note */}
      {applications.length > 0 && (
        <p className="text-center text-gray-400 text-xs mt-12">
          Visar alla dina inskickade ansökningar. Uppdateras i realtid.
        </p>
      )}
    </div>
  );
}
