// app/admin/layout.js
import SideNavAdmin from "@/app/_components/SideNavAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="max-w-400 mx-auto px-4 py-4 lg:py-8">
      {/* العنوان الرئيسي للأدمن (اختياري) */}
      <div className="mb-6 px-2">
        <h1 className="text-2xl font-black text-[#2d2e3e] uppercase tracking-tighter">
          Admin <span className="text-[#2ecc91]">Panel</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-10">
        {/* المنيو */}
        <aside className="w-full">
          <SideNavAdmin />
        </aside>

        {/* المحتوى */}
        <main className="bg-gray-50/50 rounded-3xl p-2 lg:p-0">{children}</main>
      </div>
    </div>
  );
}
