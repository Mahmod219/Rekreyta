import {
  ArrowTrendingUpIcon,
  BoltIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ForEmployers() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative py-24 bg-[#2d2e3e] overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                Hire the Best{" "}
                <span className="text-[#2ecc91]">Tech Talent</span> in Sweden
              </h1>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Stop sifting through irrelevant CVs. Rekreyta connects you with
                pre-vetted professionals ready to scale your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#2ecc91] text-[#2d2e3e] px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-[#2ecc91]/20">
                  Post a Job Now
                </button>
                <Link
                  href="/contact"
                  className="border-2 border-white/20 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-4xl shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-full bg-[#2ecc91]/20 flex items-center justify-center text-[#2ecc91]">
                    <ArrowTrendingUpIcon className="h-6 w-6" />
                  </div>
                  <div className="h-4 w-32 bg-white/20 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-full bg-white/5 rounded-xl"></div>
                  <div className="h-8 w-4/5 bg-white/5 rounded-xl"></div>
                  <div className="h-8 w-3/4 bg-[#2ecc91]/40 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Choose Us (Benefits) */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-[#2ecc91] uppercase tracking-[0.3em] mb-3">
            Why Rekreyta
          </h2>
          <h3 className="text-4xl font-black text-[#2d2e3e]">
            Recruitment Made Intelligent
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Pre-Vetted Talent",
              desc: "Our AI-driven matching ensures you only see candidates that actually fit your tech stack.",
              icon: ShieldCheckIcon,
            },
            {
              title: "Faster Hiring",
              desc: "Reduce your Time-to-Hire by 40%. Our streamlined dashboard keeps your pipeline organized.",
              icon: BoltIcon,
            },
            {
              title: "Brand Visibility",
              desc: "Get your company profile in front of 15,000+ active job seekers in Sweden.",
              icon: UserGroupIcon,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all duration-300"
            >
              <feature.icon className="h-12 w-12 text-[#2ecc91] mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-[#2d2e3e] mb-4">
                {feature.title}
              </h4>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Pricing Section (Simple Table) */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#2d2e3e]">
              Simple, Transparent Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
              <h4 className="text-xl font-bold text-[#2d2e3e] mb-2">Basic</h4>
              <p className="text-gray-400 text-sm mb-6">
                Perfect for small startups
              </p>
              <div className="text-4xl font-black text-[#2d2e3e] mb-8">
                Free{" "}
                <span className="text-sm font-normal text-gray-400">
                  / 1 post
                </span>
              </div>
              <ul className="space-y-4 mb-10 flex-1 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" /> 30-day
                  listing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" />{" "}
                  Standard Support
                </li>
              </ul>
              <button className="w-full py-4 border-2 border-[#2d2e3e] rounded-xl font-bold hover:bg-[#2d2e3e] hover:text-white transition-all">
                Start for Free
              </button>
            </div>

            {/* Plan 2 - Featured */}
            <div className="bg-white p-8 rounded-3xl border-2 border-[#2ecc91] shadow-xl relative scale-105 z-10 flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2ecc91] text-[#2d2e3e] text-xs font-black px-4 py-1 rounded-full uppercase">
                Most Popular
              </div>
              <h4 className="text-xl font-bold text-[#2d2e3e] mb-2">
                Professional
              </h4>
              <p className="text-gray-400 text-sm mb-6">For growing teams</p>
              <div className="text-4xl font-black text-[#2d2e3e] mb-8">
                $199{" "}
                <span className="text-sm font-normal text-gray-400">
                  / month
                </span>
              </div>
              <ul className="space-y-4 mb-10 flex-1 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" />{" "}
                  Unlimited job posts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" />{" "}
                  Featured badge
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" />{" "}
                  Candidate filtering
                </li>
              </ul>
              <button className="w-full py-4 bg-[#2ecc91] text-[#2d2e3e] rounded-xl font-bold shadow-lg shadow-[#2ecc91]/20 hover:scale-105 transition-all">
                Get Started
              </button>
            </div>

            {/* Plan 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
              <h4 className="text-xl font-bold text-[#2d2e3e] mb-2">
                Enterprise
              </h4>
              <p className="text-gray-400 text-sm mb-6">Large organizations</p>
              <div className="text-4xl font-black text-[#2d2e3e] mb-8">
                Custom
              </div>
              <ul className="space-y-4 mb-10 flex-1 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" />{" "}
                  Dedicated Manager
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" /> API
                  Integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[#2ecc91]" /> Custom
                  Analytics
                </li>
              </ul>
              <button className="w-full py-4 border-2 border-[#2d2e3e] rounded-xl font-bold hover:bg-[#2d2e3e] hover:text-white transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-24 container mx-auto px-6 text-center">
        <div className="bg-[#2ecc91] p-12 md:p-20 rounded-[4rem] text-[#2d2e3e]">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Ready to grow your team?
          </h2>
          <p className="text-xl mb-12 opacity-80 max-w-2xl mx-auto font-medium">
            Join hundreds of Swedish companies that find their best hires
            through Rekreyta.
          </p>
          <button className="bg-[#2d2e3e] text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-110 transition-transform">
            Post Your First Job
          </button>
        </div>
      </section>
    </div>
  );
}
