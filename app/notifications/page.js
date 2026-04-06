import { getNotifications } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

import Link from "next/link";
import {
  BellIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  InboxIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import MarkReadButton from "../_components/ui/MarkReadButton";
import RemoveNotifications from "../_components/ui/RemoveNotifications";

export default async function Page() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  const notifications = await getNotifications(userId);

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* الرأس (Header) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <BellIcon className="h-8 w-8 text-[#2ecc91]" />
            Aviseringar
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Håll dig uppdaterad med dina senaste aktiviteter och
            jobbansökningar.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="bg-[#2ecc91]/10 text-[#2ecc91] px-4 py-2 rounded-2xl text-sm font-bold border border-[#2ecc91]/20">
            {unreadCount} nya meddelanden
          </div>
        )}
      </div>

      {/* قائمة الإشعارات */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {notifications?.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-6 md:p-8 transition-all hover:bg-gray-50/50 flex gap-5 items-start ${
                  !n.is_read
                    ? "bg-[#2ecc91]/5 border-l-4 border-l-[#2ecc91]"
                    : "opacity-80"
                }`}
              >
                {/* الأيقونة الجانبية */}
                <div
                  className={`h-12 hidden   w-12 rounded-2xl shrink-0 md:flex items-center justify-center ${
                    !n.is_read
                      ? "bg-[#2ecc91] text-white shadow-lg shadow-[#2ecc91]/20"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {n.type === "job_update" ? (
                    <BriefcaseIcon className="h-6 w-6" />
                  ) : (
                    <InboxIcon className="h-6 w-6" />
                  )}
                </div>

                {/* المحتوى */}
                <div className="grow space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3
                      className={`text-lg ${!n.is_read ? "font-black text-gray-900" : "font-bold text-gray-600"}`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                        locale: sv,
                      })}
                    </span>
                  </div>

                  <p className="text-gray-500 leading-relaxed max-w-2xl font-medium">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    {/* زر تفاعلي (مثال: الذهاب للوظيفة) */}
                    {n.link && (
                      <Link
                        href={n.link}
                        className="text-sm font-bold text-[#2ecc91] hover:underline"
                      >
                        Visa detaljer
                      </Link>
                    )}

                    {!n.is_read && <MarkReadButton id={n.id} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* حالة عدم وجود إشعارات */
          <div className="py-24 text-center">
            <div className="h-24 w-24 bg-gray-50 rounded-4xl flex items-center justify-center mx-auto mb-6 text-gray-200">
              <BellIcon className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-black text-gray-900">
              Inga aviseringar än
            </h2>
            <p className="text-gray-400 font-medium mt-2">
              Vi meddelar dig så fort något händer.
            </p>
            <Link
              href="/jobs"
              className="inline-block mt-8 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all"
            >
              Utforska jobb
            </Link>
          </div>
        )}
      </div>

      {/* خيارات سفلية (إضافية) */}
      {notifications?.length > 0 && (
        <div className="mt-8 flex justify-center">
          <RemoveNotifications id={userId} />
        </div>
      )}
    </div>
  );
}
