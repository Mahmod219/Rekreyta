export default function Statistics() {
  return (
    <section className="bg-[#2d2e3e] py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <p className="text-[#2ecc91] text-4xl font-black mb-2">1,250</p>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Jobs Posted
          </p>
        </div>
        <div>
          <p className="text-[#2ecc91] text-4xl font-black mb-2">450</p>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Companies
          </p>
        </div>
        <div>
          <p className="text-[#2ecc91] text-4xl font-black mb-2">15k</p>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Candidates
          </p>
        </div>
        <div>
          <p className="text-[#2ecc91] text-4xl font-black mb-2">85%</p>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            Match Rate
          </p>
        </div>
      </div>
    </section>
  );
}
