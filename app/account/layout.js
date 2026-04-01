import { SideNavAccount } from "app/_components/user";

export default function Layout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* السايد ناف يظهر فوق في الموبايل وبجانب المحتوى في الديسكتوب */}
        <aside className="z-20">
          <SideNavAccount />
        </aside>

        <main className="min-h-150">{children}</main>
      </div>
    </div>
  );
}
