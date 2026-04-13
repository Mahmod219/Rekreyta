// components/PaginationControls.js
"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function PaginationControls({ currentPage, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handlePageChange(newPage) {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex justify-center gap-4 mt-10">
      <button
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50"
      >
        Föregående
      </button>

      <span className="self-center font-bold">
        Sida {currentPage} av {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 bg-[#2ecc91] text-white rounded-xl disabled:opacity-50"
      >
        Nästa
      </button>
    </div>
  );
}
