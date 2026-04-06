"use client";

import { useEffect } from "react";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // يفضل دائماً تسجيل الخطأ في خدمات مثل Sentry أو LogRocket في بيئة الإنتاج
    console.error("Caught error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full text-center bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50">
        {/* أيقونة التحذير بلون الهوية الخاص بك */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#2ecc91]/10 mb-8 border-4 border-[#2ecc91]/20 animate-pulse">
          <ExclamationTriangleIcon
            className="h-12 w-12 text-[#2ecc91]"
            aria-hidden="true"
          />
        </div>

        {/* النص السويدي الاحترافي */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4 uppercase">
          Hoppsan! Något gick fel.
        </h1>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
          Ett oväntat fel har inträffat. Vi ber om ursäkt för besväret. Vänligen
          försök igen eller gå tillbaka till startsidan.
        </p>

        {/* عرض رسالة الخطأ فقط في بيئة التطوير للتصحيح */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-10 p-5 bg-red-50 border border-red-100 rounded-2xl text-left shadow-inner">
            <p className="text-xs font-bold text-red-700 uppercase tracking-widest mb-2">
              Error Details (Dev Only):
            </p>
            <p className="text-sm font-mono text-red-600 wrap-break-word whitespace-pre-wrap bg-white/50 p-3 rounded-lg border border-red-100">
              {error.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* أزرار الإجراءات المتجاوبة والمتناسقة مع التصميم */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#2ecc91] hover:bg-[#26a676] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-md active:scale-95 cursor-pointer group"
          >
            <ArrowPathIcon className="h-5 w-5 text-white/80 group-hover:rotate-180 transition-transform duration-500" />
            Försök igen
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-lg transition-all active:scale-95 cursor-pointer border border-gray-200 shadow-sm"
          >
            <HomeIcon className="h-5 w-5 text-gray-500" />
            Till startsidan
          </Link>
        </div>
      </div>
    </main>
  );
}
