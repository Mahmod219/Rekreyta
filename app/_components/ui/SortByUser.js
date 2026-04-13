"use client";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function SortByUser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sortBy") || "newest";

  function handleChange(value) {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", value);
    router.push(`${pathname}?${params.toString()}`);
  }
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2  font-black  text-sm uppercase text-gray-600 tracking-widest ml-1 group-focus-within:text-[#2ecc91] transition-colors">
        <AdjustmentsHorizontalIcon className="h-3.5 w-3.5 stroke-[3px]" />
        Sortera
      </span>
      <div className="relative group min-w-45 flex-1">
        {/* أيقونة السهم المخصصة */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-hover:text-[#2ecc91] transition-colors">
          <ChevronDownIcon className="h-4 w-4 stroke-[3px]" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full  appearance-none bg-white border-2 border-gray-100 text-[#2d2e3e] py-2.5 px-5 pr-12 rounded-2xl font-bold text-sm shadow-sm hover:border-[#2ecc91] focus:ring-4 focus:ring-[#2ecc91]/10 transition-all cursor-pointer outline-none"
        >
          <option className="bg-white text-gray-700 py-2" value="newest">
            Senaste först
          </option>
          <option className="bg-white text-gray-700 py-2" value="oldest">
            Äldsta först
          </option>
          <option className="bg-white text-gray-700 py-2" value="deadline">
            Ansökningsdatum
          </option>
        </select>
      </div>
    </div>
  );
}
