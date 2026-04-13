import InterviewCalendar from "@/app/_components/admin/InterviewCalendar";
import { getInterviews } from "@/app/_lib/data-service";

export const metadata = {
  title: "Intervjukalender | Admin",
};

export default async function InterviewsPage() {
  const interviews = await getInterviews();

  return (
    <div className="px-4 space-y-8">
      <div className="flex flex-col   gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
            Intervju <span className="text-[#2ecc91]">hantering</span>
          </h1>
          <p className="text-gray-500 font-medium my-2">
            Ett intelligent schemaläggningssystem med stöd för drag-and-drop,
            automatisk tidsvalidering och realtidsuppdateringar. Hantera dina
            rekryteringsmöten med full kontroll.
          </p>
        </div>
      </div>

      <InterviewCalendar interviews={interviews} />
    </div>
  );
}
