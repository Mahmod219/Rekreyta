import { getUserLatestApplications } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import Link from "next/link";

export default async function LatestApps() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  const userApplications = await getUserLatestApplications(userId);
  const hasApplications = userApplications && userApplications.length > 0;

  return (
    <div className="bg-white rounded-4xl p-4 sm:p-8 shadow-sm border border-gray-50 overflow-hidden">
      {/* Header مع زر العرض الكل */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          Senaste ansökningar
        </h3>
        {hasApplications && (
          <Link
            href="/account/applications"
            className="text-xs sm:text-sm font-bold text-[#2ecc91] hover:underline whitespace-nowrap"
          >
            Visa alla
          </Link>
        )}
      </div>

      {hasApplications ? (
        /* هنا السر: الـ wrapper بخلي الجدول يسبح جوا الكارد بدون ما يخربه */
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-125">
            {/* min-w-[500px] تضمن أن الأعمدة لن تلتصق ببعضها في الموبايل */}
            <thead>
              <tr className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 font-bold">Företag</th>
                <th className="pb-4 font-bold">Roll</th>
                <th className="pb-4 font-bold">Datum</th>
                <th className="pb-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userApplications.slice(0, 5).map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-4 pr-2 font-semibold text-gray-800 text-sm sm:text-base">
                    <div className="truncate max-w-30 sm:max-w-none">
                      {app.jobs?.company || "Företag"}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-gray-600 text-xs sm:text-sm">
                    {app.jobs?.title}
                  </td>
                  <td className="py-4 px-2 text-gray-400 text-[10px] sm:text-xs whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString("sv-SE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`inline-block px-2 sm:px-4 py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-black tracking-tighter shadow-sm ${
                        app.status === "intervju"
                          ? "bg-blue-100 text-blue-600 border border-blue-200"
                          : app.status === "godkänd"
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                            : app.status === "avböjd"
                              ? "bg-red-100 text-red-600 border border-red-200"
                              : "bg-orange-100 text-orange-600 border border-orange-200"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State Responsive */
        <div className="text-center py-10 px-4">
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Du har inte sökt jobb än! börja nu.
          </p>
          <Link
            href="/jobs"
            className="text-[#2ecc91] font-bold text-sm mt-3 inline-block"
          >
            Hitta jobb →
          </Link>
        </div>
      )}
    </div>
  );
}
