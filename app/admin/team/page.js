import TeamForm from "@/app/_components/admin/TeamForm";
import TeamList from "@/app/_components/admin/TeamList";
import { getTeamMembers, getTeamProfileInfo } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authConfig);

  // 1. جلب بيانات بروفايل الفريق للمستخدم الحالي
  const profile = await getTeamProfileInfo(session.user.id);

  // 2. شرط الحماية الصارم (فقط للمدير الأساسي)
  if (session?.user?.role !== "admin" || profile?.managed_by) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white/80 backdrop-blur-lg p-10 rounded-4xl shadow-xl border border-red-50 max-w-md text-center space-y-4">
          <div className="text-red-500 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            Behörighet <span className="text-red-500">Saknas</span>
          </h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Tyvärr، du har inte rättigheter att hantera teamet. Endast
            huvudkontots administratör kan bjuda in nya medarbetare.
          </p>
        </div>
      </div>
    );
  }

  // إذا تجاوز الشرط، نكمل جلب البيانات
  const teamMembers = await getTeamMembers(session.user.id);

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4 lg:p-0">
      {/* 1. رأس الصفحة (Header) */}
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
          Hantera <span className="text-[#2ecc91]">Teamet</span>
        </h1>
        <p className="text-gray-500 font-medium max-w-2xl">
          Bygg ditt drömteam! Här kan du bjuda in nya rekryterare، tilldela
          roller och hantera behörigheter för din organisation.
        </p>
      </header>

      {/* 2. قسم إضافة موظف - بتصميم Glassmorphism */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 bg-[#2ecc91] rounded-full animate-pulse"></div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Lägg till Medarbetare
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-4xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
          <TeamForm />
        </div>
      </section>

      {/* 3. قائمة الفريق الحالي */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Ditt Team <span className="ml-2 text-gray-200">|</span>{" "}
            <span className="ml-2 text-[#2ecc91]">
              {teamMembers.length} Aktiva
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-4xl shadow-md border border-gray-100 overflow-hidden">
          <TeamList members={teamMembers} />
        </div>
      </section>

      {/* نصائح إضافية للمدير */}
      <footer className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
        <div className="flex gap-4">
          <div className="text-blue-500 mt-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-semibold">
              Tips för Teamledare
            </p>
            <p className="text-xs text-blue-600/80 leading-relaxed">
              När du lägger till en medarbetare kommer de att få statusen
              "Väntar på inloggning" tills de loggar in första gången via
              Google. Du kan när som helst ändra roller eller ta bort åtkomst.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
