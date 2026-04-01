export default function page() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8 text-gray-800">
      <h1 className="text-4xl font-black mb-8 text-gray-900">
        Integritetspolicy
      </h1>

      <p className="text-lg mb-8 leading-relaxed font-medium text-gray-600">
        Din integritet är viktig för oss på{" "}
        <span className="text-[#2ecc91] font-bold">Rekreyta</span>. Här
        beskriver vi hur vi samlar in, använder och skyddar dina personuppgifter
        i enlighet med GDPR.
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide">
            1. Information vi samlar in
          </h2>
          <p className="leading-relaxed">
            När du skapar en profil eller ansöker om ett jobb samlar vi in
            uppgifter som namn, e-postadress, telefonnummer, CV och personligt
            brev. Vi samlar även in teknisk data via cookies för att förbättra
            din användarupplevelse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide">
            2. Hur vi använder din data
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>För att koppla ihop dig med relevanta arbetsgivare.</li>
            <li>För att skicka viktiga aviseringar om dina ansökningar.</li>
            <li>För att förbättra och säkra vår plattform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide">
            3. Delning av information
          </h2>
          <p className="leading-relaxed">
            Dina personuppgifter delas endast med de arbetsgivare vars jobb du
            väljer att ansöka till. Vi säljer aldrig din data till tredje part.
          </p>
        </section>

        <section className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-900 uppercase tracking-wide">
            4. Dina rättigheter
          </h2>
          <p className="leading-relaxed">
            Enligt GDPR har du rätt att begära utdrag av din data, rätta
            felaktig information eller begära att vi raderar all din personliga
            information från våra servrar när som helst.
          </p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-500 font-medium">
        Senast uppdaterad: {new Date().toLocaleDateString("sv-SE")}
      </div>
    </div>
  );
}
