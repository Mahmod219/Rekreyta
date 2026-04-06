"use client";

import { useEffect, useState, useRef } from "react";

import {
  BellIcon,
  CheckCircleIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns"; // تحتاج لتثبيت date-fns للتوقيت
import { getNotifications } from "@/app/_lib/data-service";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/_lib/supabase";
import Link from "next/link";
import { markNotificationAsRead } from "@/app/_lib/actions";

export default function NotificationsBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // 1. جلب البيانات والاشتراك في الـ Realtime
  useEffect(() => {
    if (!userId || typeof userId !== "string" || userId === "undefined") return;
    async function init() {
      const data = await getNotifications(userId || []);

      setNotifications(data || []);

      setUnreadCount(data?.filter((n) => !n.is_read).length || 0);
    }
    init();

    const channel = supabase
      .channel(`realtime_notifications_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // تشغيل التوست عند وصول إشعار جديد
          toast.success(payload.new.title, {
            description: payload.new.message,
            icon: <BellIcon className="h-5 w-5 text-[#2ecc91]" />,
          });
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  async function handleClick(notification) {
    setIsOpen(false);
    // 1. update DB
    await markNotificationAsRead(notification.id);

    // 2. update UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)),
    );

    router.push(notification.link);
    // 3. redirect
  }

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* أيقونة الجرس */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-all outline-none group"
      >
        <BellIcon className="h-7 w-7 text-gray-600 group-hover:text-[#2ecc91] stroke-[2px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[12px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? "+9" : unreadCount}
          </span>
        )}
      </button>

      {/* القائمة المنسدلة (Dropdown) */}
      {isOpen && (
        <div className="absolute -right-30 md:right-1 mt-3 w-[calc(100vw-2rem)] max-w-[320px] md:max-w-none md:w-100 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-100 animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-sm uppercase tracking-widest text-gray-500">
              aviseringar
            </h3>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-[#2ecc91]/10 text-[#2ecc91] px-2 py-1 rounded-full font-bold">
                {unreadCount} Nya
              </span>
            )}
          </div>

          <div className="max-h-100 overflow-y-auto scrollbar-hide">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  onClick={() => handleClick(n)}
                  key={n.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 ${!n.is_read ? "bg-[#2ecc91]/5" : ""}`}
                >
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${!n.is_read ? "bg-[#2ecc91] text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    <InboxIcon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p
                      className={`text-md ${!n.is_read ? "font-black  text-gray-800" : "font-bold text-gray-500"}`}
                    >
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-500 font-medium line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                      {/* تأكد من تثبيت date-fns لاستخدام هذه الدالة */}
                      {formatDistanceToNow(new Date(n.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center flex flex-col items-center gap-3">
                <CheckCircleIcon className="h-12 w-12 text-gray-100" />
                <p className="text-gray-400 font-bold text-sm">Allt ikapp!</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)} // لإغلاق القائمة المنسدلة عند النقر
              className="block w-full py-4 text-center text-xs font-black uppercase tracking-widest text-[#2ecc91] hover:bg-[#2ecc91]/5 transition-colors border-t border-gray-50 bg-gray-50/30"
            >
              Visa alla aviseringar
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
