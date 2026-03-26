import background from "@/public/background.jpg";
import Image from "next/image";
import Link from "next/link";

import HowItWorks from "./_components/HowItWorks";
import LatestOpportunities from "./_components/LatestOpportunities";
import Services from "./_components/Services";
import Statistics from "./_components/Statistics";
import { Suspense } from "react";
import Spinner from "./_components/Spinner";

export default async function Page() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <main className="relative w-full h-[85vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={background}
            alt="Rekryta job platform"
            fill
            priority
            placeholder="blur"
            quality={100}
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl pb-[10vh]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              New opportunities available today
            </div>
            <h1 className="text-5xl md:text-7xl text-white font-extrabold leading-[1.1] mb-6">
              Build your <span className="text-[#2ecc91]">future</span> in
              Sweden.
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl font-light">
              More than just a job board. We bridge the gap between global
              talent and Sweden's leading innovators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/jobs"
                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-all text-center"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 rounded-full font-bold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all text-center"
              >
                Learn More
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
