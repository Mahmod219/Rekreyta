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
    if (pathname.startsWith("/admin")) {
      setIsVisible(false);
      return;
    }
    if (isDismissed) {
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [pathname, isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-999 group">
      {/* زر الإغلاق - يظهر دائماً على الموبايل وبـ Hover على الديسك توب */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDismissed(true);
        }}
        className="absolute -top-1 -left-1 bg-red-500/90 text-white rounded-full p-1 
                   md:opacity-0 md:group-hover:opacity-100 
                   transition-all duration-300 z-20 shadow-lg hover:bg-red-600"
      >
        <XMarkIcon className="h-3 w-3 md:h-4 md:w-4" />
      </button>

      {/* التسمية (Tooltip) - محسنة لتظهر بشكل ألطف */}
      <div
        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden md:block 
                      opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
      >
        <div
          className="bg-[#2d2e3e]/95 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-lg 
                        whitespace-nowrap shadow-2xl border border-white/10 relative"
        >
          Visa AI-matchningar
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#2d2e3e] rotate-45 border-r border-t border-white/10"></div>
        </div>
      </div>

      {/* الروبوت وحركته الجديدة */}
      <div
        onClick={() => router.push("/ai-matches")}
        className="relative cursor-pointer transition-all duration-500 transform hover:scale-105 active:scale-90"
      >
        {/* هالة نبض ضوئية خلفية - تعطي إحساساً بالذكاء */}
        <div className="absolute inset-0 bg-[#2ecc91] rounded-full blur-xl opacity-20 animate-pulse"></div>

        {/* حركة الطفو الهادئ (Floating) */}
        <div className="relative animate-[float_3s_ease-in-out_infinite]">
          <Image
            src={aiRorbot}
            alt="AI Assistant"
            width={70}
            height={70}
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
          />
        </div>
      </div>

      {/* إضافة الأنيميشن المخصص في Tailwind (يُفضل وضعه في globals.css ولكن يمكنك محاكاته هنا) */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
