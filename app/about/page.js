import Image from "next/image";
import team from "@/public/team.jpg";
import {
  RocketLaunchIcon,
  UsersIcon,
  LightBulbIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black text-[#2d2e3e] leading-tight mb-6">
              Building Bridges Between <br />
              <span className="text-primary-300">Ambition & Opportunity</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Rekreyta, we believe a job isn’t just a paycheck—it’s the next
              step in your journey of self-fulfillment.
            </p>
          </div>
        </div>
        {/* عنصر جمالي خلفي مستوحى من اللوجو */}
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <svg
            width="600"
            height="600"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 20L80 50L50 80"
              stroke="#2ecc91"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 20L50 50L20 80"
              stroke="#2ecc91"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#2d2e3e] mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-loose">
              We are here to revolutionize the recruitment experience in Sweden.
              <span className="font-semibold text-[#2d2e3e]"> Rekreyta</span> is
              more than just a job board; it is a smart digital community
              connecting ambitious talent with companies that value excellence.
            </p>
            <div className="space-y-4">
              {[
                "Simplifying the Swedish job market access.",
                "Ensuring full transparency for every candidate.",
                "Empowering local businesses with top-tier talent.",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckBadgeIcon className="h-6 w-6 text-primary-300" />
                  <span className="font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-100 rounded-3xl h-100 relative overflow-hidden shadow-inner">
            {/* يمكنك وضع صورة فريق عمل هنا */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium italic">
              <Image
                src={team}
                alt="Team"
                fill
                priority
                placeholder="blur"
                quality={100}
                className="object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="py-20 bg-[#2d2e3e] text-white">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Rekreyta?</h2>
          <p className="text-gray-400">
            The values that drive us forward every day.
          </p>
        </div>

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-gray-700 hover:border-primary-300 transition-colors group">
            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-300 transition-colors">
              <RocketLaunchIcon className="h-8 w-8 text-primary-bg-primary-300 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Speed & Efficiency</h3>
            <p className="text-gray-400">
              Finding the right match shouldn't be a full-time job. We shorten
              the distance between "CV Sent" and "Interview".
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-700 hover:border-primary-300 transition-colors group">
            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-300 transition-colors">
              <UsersIcon className="h-8 w-8 text-primary-300 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Community First</h3>
            <p className="text-gray-400">
              We put people at the center of our design, ensuring that
              candidates and employers feel supported throughout.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-700 hover:border-primary-300 transition-colors group">
            <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-300 transition-colors">
              <LightBulbIcon className="h-8 w-8 text-primary-300 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-gray-400">
              Leveraging technology to provide accurate job matching that keeps
              up with the fast-paced modern economy.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-6 text-center">
        <div className="bg-gray-50 rounded-[3rem] py-16 px-6">
          <h2 className="text-3xl md:text-4xl font-black text-[#2d2e3e] mb-6">
            Ready to find your next star? <br />
            Or your next challenge?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/jobs"
              className="bg-[#2d2e3e] text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all"
            >
              Browse Jobs
            </Link>
            <Link
              href="/employers"
              className="border-2 border-[#2d2e3e] text-[#2d2e3e] px-8 py-4 rounded-xl font-bold hover:bg-[#2d2e3e] hover:text-white transition-all"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
