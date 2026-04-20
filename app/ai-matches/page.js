export const dynamic = "force-dynamic"; // السطر الأهم لحل مشكلة الـ Build

import { SparklesIcon } from "@heroicons/react/24/outline";
import AiJobCard from "../_components/ui/AiJobCard";
import { getAiMatchedJobs } from "../_lib/data-service";

export default async function Page() {
  // إضافة try-catch لضمان عدم انهيار الصفحة إذا فشل الـ AI Action
  let aiJobs = [];
  try {
    aiJobs = await getAiMatchedJobs();
  } catch (error) {
    console.error("Error fetching AI jobs:", error);
    // يمكنك هنا عرض رسالة خطأ بسيطة للمستخدم أو ترك المصفوفة فارغة
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. Hero Section - هيدر جذاب بخلفية متدرجة */}
      <div className="relative overflow-hidden bg-[#2d2e3e] py-16 mb-12">
        {/* تأثيرات خلفية (دوائر ضوئية) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2ecc91] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#2ecc91]/20 text-[#2ecc91] px-4 py-2 rounded-full text-sm font-bold mb-6 border border-[#2ecc91]/30 animate-pulse">
            <SparklesIcon className="h-5 w-5" />
            AI-DRIVEN MATCHING
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Din <span className="text-[#2ecc91]">Karriär</span>,{" "}
            <br className="md:hidden" />
            Smartare än någonsin
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Vår AI har analyserat din profil och matchat din kompetens med de
            bästa möjligheterna just nu. Här är dina perfekta träffar.
          </p>
        </div>
      </div>

      {/* 2. Jobs Grid Section */}
      <div className="container mx-auto px-6 pb-20">
        {aiJobs?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {aiJobs.map((job) => (
              <AiJobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          /* حالة عدم وجود وظائف أو فشل التحميل */
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300 max-w-2xl mx-auto">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Inga matchningar än
            </h2>
            <p className="text-gray-500">
              Ladda upp ett mer detaljerat CV för att låta vår AI hitta rätt
              jobb åt dig.
            </p>
          </div>
        )}
      </div>

      {/* 3. Footer Tip - نصيحة ذكية */}
      <div className="container mx-auto px-6 pb-10 text-center text-gray-400 text-sm">
        <p>
          Matchningsresultaten uppdateras i realtid baserat på marknadens behov.
        </p>
      </div>
    </div>
  );
}
