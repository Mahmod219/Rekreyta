import { getServerSession } from "next-auth";
import { SideNavAdmin } from "../_components/admin";
import { getTeamProfileInfo } from "../_lib/data-service";
import { authConfig } from "../api/auth/[...nextauth]/route";

// إضافة الميتاداتا (Metadata)
export const metadata = {
  title: {
    template: "%s | Admin Panel",
    default: "Admin Panel | Dashboard",
  },
  description: "Hantera ansökningar och intervjuer effektivt.",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authConfig);
  const userRole = session?.user?.role;
  // افترضنا عندك دالة بتجيب البروفايل من سوبابيس
  const profile = await getTeamProfileInfo(session.user.id);
  return (
    <div className="max-w-360 mx-auto px-4 py-4 lg:py-8">
      {/* شبكة التصميم الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-x-10">
        {/* الجزء العلوي - الهيدر يمتد فوق المحتوى فقط للمحاذاة */}

        {/* السايد بار - يأخذ العمود الأول */}
        <aside className="w-full">
          <div className="lg:col-start-2 mb-6 px-2">
            <h1 className="text-2xl font-black text-[#2d2e3e] uppercase tracking-tighter">
              Admin <span className="text-[#2ecc91]">Panel</span>
            </h1>
          </div>
          <SideNavAdmin userRole={userRole} managedBy={profile?.managed_by} />
        </aside>

        {/* المحتوى الرئيسي - يبدأ من العمود الثاني لمحاذاة الهيدر */}
        <main className="rounded-3xl p-2 lg:p-0 min-w-0">{children}</main>
      </div>
    </div>
  );
}
