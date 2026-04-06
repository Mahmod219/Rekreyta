"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ClearFilters() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasFilters = searchParams.toString().length > 0;

  if (!hasFilters) return null;

  return (
    <button
      onClick={() => replace(pathname)}
      className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
    >
      <XMarkIcon className="h-4 w-4" />
      Rensa alla filter
    </button>
  );
}
