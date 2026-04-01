import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Services() {
  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-[#2ecc91] font-bold tracking-widest uppercase text-sm mb-3">
          What we offer
        </h2>
        <h3 className="text-4xl md:text-5xl font-black text-[#2d2e3e]">
          Our Services
        </h3>
        <p className="mt-4 text-gray-500 text-lg">
          We provide a comprehensive ecosystem to ensure your success in the
          Swedish job market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Service 1 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <MagnifyingGlassIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Smart Job Search
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Advanced filtering to find roles that perfectly match your skills
            and relocation needs.
          </p>
        </div>

        {/* Service 2 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <UserGroupIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Direct Networking
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Connect directly with Swedish HR managers and tech leads without the
            middleman.
          </p>
        </div>

        {/* Service 3 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <SparklesIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            AI Resume Tailoring
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Optimize your CV for Swedish standards using our integrated AI tools
            and tips.
          </p>
        </div>

        {/* Service 4 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <ArrowPathIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Relocation Support
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Resources and guides to help you settle into your new life and
            career in Sweden.
          </p>
        </div>
      </div>
    </section>
  );
}
