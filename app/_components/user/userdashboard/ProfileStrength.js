// app/_components/user/userdashboard/ProfileStrength.js
export default function ProfileStrength({ value = 0 }) {
  // نضمن أن القيمة بين 0 و 100
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className="bg-white p-4 md:p-8 rounded-4xl shadow-sm border border-gray-50 flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Profilstyrka
          </p>
          <h4 className="text-xl md:text-2xl font-black text-gray-800">
            Din profil
          </h4>
        </div>
        <span className="text-2xl font-black text-[#2ecc91]">
          {percentage}%
        </span>
      </div>

      {/* الحاوية الرمادية للبار */}
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        {/* البار الأخضر المتحرك */}
        <div
          className="bg-[#2ecc91] h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(46,204,145,0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {percentage < 100
          ? "Komplettera din profil för att bli mer synlig för företag."
          : "Din profil är komplett! 🎉"}
      </p>
    </div>
  );
}
