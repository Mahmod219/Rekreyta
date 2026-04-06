"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar({
  placeholder = "Search jobs...",
  queryName = "query",
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set(queryName, term);
    else params.delete(queryName);
    if (params.has("page")) params.set("page", "1");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="flex flex-col  sm:flex-row  sm:items-center gap-3">
      {/* العنوان مع الأيقونة فوق الـ Input */}
      <label className="flex items-center gap-2  font-black  text-sm uppercase text-gray-600 tracking-widest ml-1 group-focus-within:text-[#2ecc91] transition-colors">
        <MagnifyingGlassIcon className="h-4 w-4 stroke-[3px]" />
        SÖKORD
      </label>

      <div className="relative flex-1">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full  appearance-none bg-white border-2 border-gray-100 text-[#2d2e3e] py-2.5 px-5 pr-12 rounded-2xl font-bold text-sm shadow-sm hover:border-[#2ecc91] focus:ring-4 focus:ring-[#2ecc91]/10 transition-all cursor-pointer outline-none"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get(queryName)?.toString()}
        />
      </div>
    </div>
  );
}
