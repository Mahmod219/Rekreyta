"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function Filter({ filterField, options, label = "Filter by" }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = searchParams.get(filterField) || options[0].value;

  function handleChange(e) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set(filterField, value);
    if (params.has("page")) params.set("page", 1);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col  sm:flex-row sm:items-center gap-3">
      {/* نص جانبي توضيحي */}
      <label className="text-sm font-black uppercase text-gray-600 tracking-widest flex items-center gap-2">
        <FunnelIcon className="h-3.5 w-3.5" />
        {label}
      </label>

      <div className="relative group min-w-45 flex-1">
        {/* أيقونة السهم المخصصة */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#2ecc91] transition-colors">
          <ChevronDownIcon className="h-5 w-5 stroke-[3px]" />
        </div>

        <select
          value={currentFilter}
          onChange={handleChange}
          className="w-full  appearance-none bg-white border-2 border-gray-100 text-[#2d2e3e] py-2.5 px-5 pr-12 rounded-2xl font-bold text-sm shadow-sm hover:border-[#2ecc91] focus:ring-4 focus:ring-[#2ecc91]/10 transition-all cursor-pointer outline-none"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-gray-700 py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
