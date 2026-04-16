import {
  MagnifyingGlassIcon,
  SparklesIcon,
  UserGroupIcon,
  BookmarkSquareIcon,
  CpuChipIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

export default function Services() {
  return (
    <section id="services" className="py-24  max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-[#2ecc91] font-bold tracking-widest uppercase text-sm mb-3">
          Vår Teknologi
        </h2>
        <h3 className="text-4xl md:text-5xl font-black text-[#2d2e3e]">
          Framtidens Rekrytering
        </h3>
        <p className="mt-4 text-gray-500 text-lg font-medium">
          Vi kombinerar artificiell intelligens med mänsklig expertis för att
          säkerställa att varje matchning är perfekt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Service 1: AI Analysis */}
        <div className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#2ecc91]/10 transition-all">
            <CpuChipIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            AI-Kandidatgranskning
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Vår intelligenta motor analyserar ansökningar automatiskt för att ge
            en objektiv bedömning av teknisk kompetens.
          </p>
        </div>

        {/* Service 2: HR Feedback */}
        <div className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#2ecc91]/10 transition-all">
            <ClipboardDocumentCheckIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Expert HR-Feedback
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Direkt feedback från erfarna rekryterare som granskar och
            betygsätter kandidater baserat på personlighet och driv.
          </p>
        </div>

        {/* Service 3: Candidate Bank */}
        <div className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#2ecc91]/10 transition-all">
            <BookmarkSquareIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Smart Kandidatbank
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Möjligheten att spara och organisera topptalanger med anpassade
            taggar för snabb åtkomst i framtida behov.
          </p>
        </div>

        {/* Service 4: Advanced Filtering */}
        <div className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#2ecc91]/10 transition-all">
            <MagnifyingGlassIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Precisionssökning
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Avancerade filter för branscher, kategorier och betyg som gör det
            enkelt att hitta rätt person för rätt roll.
          </p>
        </div>

        {/* Service 5: Direct Access */}
        <div className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#2ecc91]/10 transition-all">
            <UserGroupIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Direkt Nätverkande
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Vi eliminerar mellanhänder och möjliggör direktkommunikation mellan
            kandidater och beslutsfattare.
          </p>
        </div>

        {/* Service 6: Data Insights */}
        <div className="group p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-[#2ecc91]/10 transition-all">
            <SparklesIcon className="h-7 w-7 text-[#2ecc91]" />
          </div>
          <h4 className="text-xl font-bold text-[#2d2e3e] mb-3">
            Drivet av Data
          </h4>
          <p className="text-gray-500 text-sm leading-relaxed">
            Smart statistik och insikter som hjälper rekryteringsteamet att
            fatta snabbare och säkrare anställningsbeslut.
          </p>
        </div>
      </div>
    </section>
  );
}
