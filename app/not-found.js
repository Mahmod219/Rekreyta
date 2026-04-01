import Link from "next/link";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    // استبدلنا min-h بـ py لضمان عدم تداخل العناصر
    <div className="py-20 flex items-center justify-center">
      <div className="text-center w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white shadow-sm rounded-full">
            <MagnifyingGlassIcon className="h-12 w-12 text-[#2ecc91]" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-4">
          Hoppsan! Sidan hittades inte.
        </h1>
        <p className="text-gray-500 text-base mb-10 font-medium px-4">
          Vi kan inte hitta sidan du letar efter. Den kan ha flyttats eller
          tagits bort. Men oroa dig inte, ditt drömjobb finns fortfarande kvar!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#2ecc91] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#28b481] transition-all w-full justify-center"
          >
            <HomeIcon className="h-5 w-5" />
            Till startsidan
          </Link>

          <Link
            href="/jobs"
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all w-full justify-center"
          >
            Sök lediga jobb
          </Link>
        </div>
      </div>
    </div>
  );
}
