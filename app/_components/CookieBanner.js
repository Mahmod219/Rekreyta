"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // التحقق إذا كان المستخدم قد وافق مسبقاً
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-200 md:left-auto md:max-w-md animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span>🍪</span> Vi använder cookies
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Rekreyta använder cookies för att förbättra din upplevelse,
              analysera trafik och se till att du förblir inloggad. Genom att
              fortsätta godkänner du vår{" "}
              <Link
                href="/privacy"
                className="text-[#2ecc91] underline font-bold"
              >
                integritetspolicy
              </Link>
              .
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={acceptCookies}
              className="flex-1 bg-gray-900 text-white text-sm font-black py-3 rounded-2xl hover:bg-gray-800 transition-all active:scale-95"
            >
              Acceptera alla
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="px-6 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Stäng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
