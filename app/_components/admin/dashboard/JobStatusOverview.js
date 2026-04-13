export default function JobStatusOverview({ stats }) {
  const { total, published, drafts } = stats;

  return (
    <div className="lg:col-span-12 bg-white p-8 rounded-4xl shadow-xl border border-gray-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* القسم الرئيسي: العنوان والإجمالي */}
        <div className="space-y-1">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Totalt antal jobb i systemet
          </h2>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black text-gray-900 tracking-tighter">
              {total}
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase">
              Positioner
            </span>
          </div>
        </div>

        {/* القسم الفرعي: تفاصيل الحالة (بشكل نصوص بارغراف) */}
        <div className="flex flex-col sm:flex-row gap-6 md:gap-12 md:pr-4">
          {/* Publicerade */}
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Publicerade
            </p>
            <p className="text-gray-600 text-sm font-medium">
              <span className="text-gray-900 font-black text-xl">
                {published}
              </span>{" "}
              tjänster är live just nu
            </p>
          </div>

          {/* Drafts */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest pl-1">
              Utkast (Drafts)
            </p>
            <p className="text-gray-600 text-sm font-medium">
              <span className="text-gray-900 font-black text-xl">{drafts}</span>{" "}
              väntar på publicering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
