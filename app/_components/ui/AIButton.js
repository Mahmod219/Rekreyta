"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import aiRorbot from "@/public/aiRobot.png";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AIButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. منع الظهور في لوحة تحكم الإدارة
    if (pathname.startsWith("/admin")) {
      setIsVisible(false);
      return;
    }

    // 2. التحقق من رفع السيرة الذاتية (اختياري حسب رغبتك) ومن عدم الإغلاق اليدوي
    if (isDismissed) {
      setIsVisible(false);
      return;
    }

    // 3. ظهور ناعم بعد 1.5 ثانية من دخول الصفحة لجذب الانتباه
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [pathname, isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-999 group">
      {/* زر الإغلاق (X) - يظهر فقط عند تقريب الماوس */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // منع الانتقال للمسار عند الضغط على X
          setIsDismissed(true);
        }}
        className="absolute top-0 -left-2 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity duration-300 z-10 shadow-lg"
      >
        <XMarkIcon className="h-3 w-3 md:h-4 md:w-4" />
      </button>

      {/* التسمية (Tooltip) - تظهر بجانب الروبوت */}
      <div className="absolute right-full mr-3 top-1 -translate-y-1/2 hidden md:block opacity-100 transition-all duration-300 pointer-events-none">
        <div className="bg-[#2d2e3e] text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl border border-white/10 relative">
          Visa AI-matchningar
          {/* سهم صغير للـ Tooltip */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#2d2e3e] rotate-45 border-r border-t border-white/10"></div>
        </div>
      </div>

      {/* الروبوت المتحرك */}
      <div
        onClick={() => router.push("/ai-matches")}
        className="relative cursor-pointer transition-all duration-500 transform hover:scale-110 active:scale-95"
      >
        {/* تأثير هالة ضوئية خلف الروبوت */}
        <div className="absolute inset-0 bg-[#2ecc91] rounded-full blur-2xl opacity-20 group-hover:opacity-40 animate-pulse"></div>

        <div className="relative animate-bounce duration-2000">
          <Image
            src={aiRorbot}
            alt="AI Assistant"
            width={80}
            height={80}
            className="md:w-25 md:h-25 object-contain drop-shadow-2xl"
          />
        </div>

        {/* نقطة خضراء تشير إلى أن الـ AI متصل/نشط */}
        {/* <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#2ecc91] border-2 border-white rounded-full">
          <div className="absolute inset-0 bg-[#2ecc91] rounded-full animate-ping"></div>
        </div> */}
      </div>
    </div>
  );
}
