import background from "@/public/background.jpg";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LatestOpportunities } from "./_components/user";

import { Spinner } from "./_components/shared";
import HowItWorks from "./_components/ui/HowItWorks";
import Services from "./_components/ui/Services";
import Statistics from "./_components/ui/Statistics";
import { SparklesIcon } from "@heroicons/react/24/outline"; // استيراد أيقونة الذكاء الاصطناعي

export default async function Page() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <main className="relative w-full h-[90vh] md:h-[85vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={background}
            alt="Rekryta jobbplattform"
            fill
            priority
            placeholder="blur"
            quality={75}
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/65 to-black/30" />
        </div>

        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-4xl pb-[5vh]">
            {/* AI Badge - الترويج للميزة الجديدة */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2ecc91]/20 backdrop-blur-md border border-[#2ecc91]/40 text-[#2ecc91] text-xs md:text-sm font-bold mb-8 animate-pulse">
              <SparklesIcon className="h-4 w-4 md:h-5 md:w-5" />
              NYHET: AI-DRIVEN MATCHNING ÄR HÄR
            </div>

            <h1 className="text-4xl md:text-7xl text-white/95 text-shadow-lg font-extrabold leading-[1.1] mb-6">
              LÅT <span className="text-[#2ecc91]">AI</span> HITTA DITT <br />
              NÄSTA <span className="text-[#2ecc91]">STEG</span>
            </h1>

            <p className="text-lg md:text-2xl text-white/90 text-shadow-xl mb-10 max-w-2xl font-light leading-relaxed">
              Vi använder avancerad AI för att matcha din kompetens mot rätt
              möjligheter. Ladda upp ditt CV och låt framtiden hitta dig.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* زر التفعيل الأساسي - يوجه لرفع السيفي أو صفحة الـ AI */}
              <Link
                href="/ai-matches" // أو المسار الذي يرفع فيه السيفي
                className="bg-[#2ecc91] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all text-center shadow-lg shadow-[#2ecc91]/20 flex items-center justify-center gap-2"
              >
                <SparklesIcon className="h-5 w-5" />
                Prova AI-Matchning
              </Link>

              <Link
                href="/jobs"
                className="px-8 py-4 rounded-full font-bold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all text-center"
              >
                Bläddra bland jobb
              </Link>
            </div>

            {/* AI Trust Badges */}
            <div className="mt-12 flex items-center gap-6 text-white/60 text-sm border-l-2 border-[#2ecc91] pl-6">
              <p>Analysera CV • Matcha Skills • Direkt Träff</p>
            </div>
          </div>
        </div>
      </main>

      <Suspense fallback={<Spinner />}>
        <LatestOpportunities />
      </Suspense>
      <Services />
      <Statistics />
      <HowItWorks />
    </div>
  );
}
