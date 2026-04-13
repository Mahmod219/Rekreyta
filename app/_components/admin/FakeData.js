"use client";
import { seedDatabase } from "@/app/_lib/seeder";

export default function FakeData() {
  return (
    <div className="p-10 text-center">
      <h1 className="mb-4">لوحة تحكم الأدمن</h1>
      <button
        onClick={() => seedDatabase()}
        className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition-all"
      >
        ⚠️ ضخ بيانات وهمية (Seeder)
      </button>
    </div>
  );
}
