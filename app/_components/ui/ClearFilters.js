"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ClearFilters() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. نقوم بإنشاء كائن جديد من البارامترات الحالية
  const params = new URLSearchParams(searchParams);

  // 2. نحذف "page" من الحساب لأننا لا نعتبره "فلتر" يحتاج للمسح
  params.delete("page");

  // 3. الشرط الجديد: هل يوجد أي مفتاح (key) متبقي؟
  // (مثل query, category, location, type)
  const hasActiveFilters = params.toString().length > 0;

  if (!hasActiveFilters) return null;

  return (
    <button
      onClick={() => replace(pathname)} // سيعود للرابط الأساسي بدون أي Params (بما فيها الصفحة)
      className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
    >
      <XMarkIcon className="h-4 w-4" />
      Rensa alla filter
    </button>
  );
}
