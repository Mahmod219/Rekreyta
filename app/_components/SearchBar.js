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
    <div className="flex flex-col gap-2 w-full group">
      {/* العنوان مع الأيقونة فوق الـ Input */}
      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 group-focus-within:text-[#2ecc91] transition-colors">
        <MagnifyingGlassIcon className="h-3.5 w-3.5 stroke-[3px]" />
        Keyword
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-6 py-4 bg-primary-50 border-2 border-transparent focus:border-[#2ecc91]/20 focus:bg-white rounded-2xl outline-none transition-all shadow-sm text-sm font-bold text-gray-700  placeholder:font-medium"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get(queryName)?.toString()}
        />
      </div>
    </div>
  );
}
