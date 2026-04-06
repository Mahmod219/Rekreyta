import {
  ArrowPathIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-[#2ecc91] font-bold tracking-widest uppercase text-sm mb-3">
          Vad erbjuder vi
        </h2>
        <h3 className="text-4xl md:text-5xl font-black text-[#2d2e3e]">
          Våra tjänster
        </h3>
        <p className="mt-4 text-gray-500 text-lg">
          Vi erbjuder ett heltäckande ekosystem för att säkerställa din framgång
          på arbetsmarknaden.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Service 1 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <MagnifyingGlassIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Smart jobbsökning
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Avancerad filtrering för att hitta roller som perfekt matchar dina
            färdigheter och dina flyttbehov.
          </p>
        </div>

        {/* Service 2 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <UserGroupIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Direkt nätverkande
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Få direktkontakt med HR-chefer och teknikchefer utan mellanhänder.
          </p>
        </div>

        {/* Service 3 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <PaperAirplaneIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Enkel ansökan
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Ansök snabbt och smidigt direkt via plattformen utan krångel.
          </p>
        </div>

        {/* Service 4 */}
        <div className="group p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
            <EyeIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Snabb översikt
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Se direkt vilka jobb som är aktuella och passar dig bäst.
          </p>
        </div>
      </div>
    </section>
  );
}
