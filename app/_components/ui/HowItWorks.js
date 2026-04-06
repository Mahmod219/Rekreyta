import {
  UserPlusIcon,
  DocumentArrowUpIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  CursorArrowRaysIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white max-w-7xl mx-auto px-6">
      <div className=" max-w-2xl mx-auto mb-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#2d2e3e] mb-4">
            Hur det fungerar
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Din resa till en ny karriär, förenklad i tre enkla steg.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-[#2ecc91] flex items-center gap-3">
              <span className="bg-[#2ecc91]/10 px-4 py-1 rounded-full text-sm uppercase tracking-widest">
                För kandidater
              </span>
            </h3>

            <div className="space-y-8 relative">
              <div className="absolute left-7 top-0 bottom-0 w-px bg-dashed border-l border-gray-200 z-0"></div>

              <div className="relative z-10 flex items-start gap-6 group">
                <div className="shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2ecc91] transition-colors">
                  <UserPlusIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2ecc91]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Skapa konto
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Registrera dig på några sekunder och bygg upp din
                    professionella profil för att bli uppmärksammad av
                    toppföretag.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-6 group">
                <div className="shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2ecc91] transition-colors">
                  <DocumentArrowUpIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2ecc91]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Ladda upp CV
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Lägg till ditt CV och din portfolio. Vårt smarta system
                    matchar dig med roller som passar dina färdigheter.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-6 group">
                <div className="shrink-0 w-14 h-14 bg-[#2ecc91] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2ecc91]/20">
                  <PaperAirplaneIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Ansök och bli anställd
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Ansök till dina favoritjobb med ett enda klick och starta
                    din intervjuprocess direkt med arbetsgivare.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <h3 className="text-2xl font-bold text-[#2d2e3e] flex items-center gap-3">
              <span className="bg-[#2d2e3e]/10 px-4 py-1 rounded-full text-sm uppercase tracking-widest text-[#2d2e3e]">
                För arbetsgivare
              </span>
            </h3>

            <div className="space-y-8 relative">
              <div className="absolute left-7 top-0 bottom-0 w-px bg-dashed border-l border-gray-200 z-0"></div>

              <div className="relative z-10 flex items-start gap-6 group">
                <div className="shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2d2e3e] transition-colors">
                  <PlusCircleIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2d2e3e]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Lägg upp ett jobb
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Fyll i dina jobbuppgifter och krav för att nå tusentals
                    kvalificerade talanger i Sverige.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-6 group">
                <div className="shrink-0 w-14 h-14 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-[#2d2e3e] transition-colors">
                  <CursorArrowRaysIcon className="h-7 w-7 text-gray-400 group-hover:text-[#2d2e3e]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Recensera talang
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Bläddra bland toppkandidater och använd vår instrumentpanel
                    för att hantera ansökningar effektivt.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-6 group">
                <div className="shrink-0 w-14 h-14 bg-[#2d2e3e] rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                  <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#2d2e3e] mb-1">
                    Börja anställa
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Få kontakt med de bästa matcherna och bygg ditt drömlag med
                    lätthet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
