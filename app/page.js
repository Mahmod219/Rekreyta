import background from "@/public/background.jpg";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LatestOpportunities } from "./_components/user";

import { Spinner } from "./_components/shared";
import HowItWorks from "./_components/ui/HowItWorks";
import Services from "./_components/ui/Services";
import Statistics from "./_components/ui/Statistics";

export default async function Page() {
  return (
    <div className=" overflow-x-hidden">
      {" "}
      {/* أضفنا هذا لمنع أي سكرول عرضي نهائياً */}
      {/* Hero Section */}
      <main className="relative w-full h-[85vh] overflow-hidden">
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
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/20" />
        </div>

        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl pb-[10vh]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Nya möjligheter tillgängliga idag
            </div>

            <h1 className="text-4xl md:text-7xl text-white/90 text-shadow-lg font-extrabold leading-[1.1] mb-6 ">
              HITTA DITT <span className="text-[#2ecc91]">NÄSTA</span> <br />
              <span className="text-[#2ecc91]">STEG</span> I KARRIÄREN
            </h1>

            <p className="text-lg md:text-2xl text-white/90 text-shadow-xl mb-10 max-w-xl font-light">
              Mer än bara en jobbplattform. Vi skapar möten mellan talang och
              framtidens företag.
            </p>

            <div className=" flex flex-col sm:flex-row gap-4">
              <Link
                href="/jobs"
                className="bg-white text-black px-6 py-2 sm:px-8 sm:py-4 rounded-full font-bold hover:scale-105 transition-all text-center"
              >
                Kom igång
              </Link>
              <Link
                href="/about"
                className="px-6 py-2 sm:px-8 sm:py-4 rounded-full font-bold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all text-center"
              >
                Läs mer
              </Link>
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
