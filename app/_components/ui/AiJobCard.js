import getSavedJob from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { CalendarDaysIcon, SparklesIcon } from "@heroicons/react/24/outline"; // أضفت أيقونة Sparkles للـ AI
import {
  BuildingOffice2Icon,
  CalendarDateRangeIcon,
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { isToday } from "date-fns";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import ShareJobButton from "../ui/ShareJobButton";
import SaveJobButton from "../user/SaveJobButton";

export default async function AiJobCard({ job }) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  if (!job) return null;

  let isInitialSaved = false;

  const {
    id,
    image_url,
    company,
    category,
    duration,
    employmentType,
    application_deadline, // تأكدنا من الاسم حسب قاعدة البيانات
    location,
    title,
    created_at,
    similarity, // النسبة القادمة من RPC
  } = job;

  const savedJobs = await getSavedJob(userId);
  const allSavedJobsIds = savedJobs.map((s) => s.job_id) || [];

  isInitialSaved = allSavedJobsIds.includes(id);

  const isCreatedToday = isToday(new Date(created_at));
  const isDeadlineToday = isToday(new Date(application_deadline));

  // حساب نسبة التطابق
  const matchPercentage = similarity ? Math.round(similarity * 100) : 0;

  // تحديد ألوان الـ AI Badge بناءً على النسبة
  const getMatchStyles = (percent) => {
    if (percent >= 80) return "border-[#2ecc91] text-[#2ecc91] bg-[#2ecc91]/5";
    if (percent >= 50) return "border-blue-500 text-blue-500 bg-blue-50/50";
    return "border-orange-500 text-orange-500 bg-orange-50/50";
  };

  return (
    <div className="group relative rounded-3xl border border-gray-300/50 bg-white p-5 md:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#2ecc91]/30 w-full overflow-hidden">
      {/* 1. AI Match Badge - المميز لهذه البطاقة */}
      {/* 1. AI Match Circle - تصميم الدائرة المختصر */}
      <div
        className={`
        absolute top-4 right-4 z-10
        flex items-center justify-center
        /* الحجم: صغير على الموبايل وأكبر قليلاً على الديسك توب */
        h-10 w-10 md:h-12 md:w-12
        rounded-full border-2
        shadow-sm backdrop-blur-sm
        transition-all duration-500
        group-hover:rotate-360 group-hover:scale-110
        ${getMatchStyles(matchPercentage)}
      `}
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[11px] md:text-sm font-black">
            {matchPercentage}%
          </span>
          {/* أيقونة صغيرة جداً للإشارة للذكاء الاصطناعي */}
          <SparklesIcon className="h-2 w-2 md:h-2.5 md:w-2.5 mt-0.5 opacity-70" />
        </div>
      </div>

      {/* Ribbon for New or Deadline */}
      {isCreatedToday && !isDeadlineToday && (
        <div className="absolute top-0 left-0 w-28 h-28 overflow-hidden pointer-events-none">
          <div className="absolute top-5 -left-8.75 -rotate-45 bg-blue-500 text-white text-[10px] font-bold py-1 w-35 text-center shadow-md uppercase">
            Nytt
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 mt-4">
        <div className="flex gap-4 flex-1 min-w-0 w-full">
          {/* Logo Container */}
          <div className="shrink-0">
            {image_url ? (
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl border border-gray-100 p-2 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors">
                <Image
                  src={image_url}
                  alt={company}
                  width={58}
                  height={58}
                  className="object-contain max-h-full"
                />
              </div>
            ) : (
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-[#2ecc91]/10 flex items-center justify-center">
                <BuildingOffice2Icon className="h-6 w-6 text-[#2ecc91]" />
              </div>
            )}
          </div>

          {/* Title & Company */}
          <div className="min-w-0 flex-1 pr-16">
            {" "}
            {/* pr-16 لترك مساحة للـ Match Badge */}
            <h3 className="text-lg md:text-xl font-bold text-[#2d2e3e] group-hover:text-[#2ecc91] transition-colors leading-tight wrap-break-word line-clamp-2">
              {title}
            </h3>
            <p className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">
              <BuildingOffice2Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{company}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Tag icon={<FolderIcon className="h-3.5 w-3.5" />} text={category} />
        <MapPinTag
          icon={<MapPinIcon className="h-3.5 w-3.5" />}
          text={location}
        />
        <Tag
          icon={<ClockIcon className="h-3.5 w-3.5" />}
          text={employmentType}
        />
        <Tag
          icon={<CalendarDateRangeIcon className="h-3.5 w-3.5" />}
          text={duration}
        />
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg shrink-0 border border-orange-100">
          Ansök senast
          <CalendarDaysIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span className="whitespace-nowrap">
            {application_deadline
              ? new Date(application_deadline).toLocaleDateString("en-GB")
              : "Löpande"}
          </span>
        </div>
      </div>

      {/* Footer: Actions & Link */}
      <div className="pt-4 border-t border-gray-50 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-6 self-end sm:self-start shrink-0">
          <ShareJobButton jobTitle={title} jobId={id} company={company} />
          {session?.user && (
            <div className="flex items-center justify-center w-10 h-10">
              <SaveJobButton jobId={id} initialSaved={isInitialSaved} />
            </div>
          )}
        </div>

        <Link
          href={`/jobs/${id}`}
          className="flex items-center gap-1 text-xs md:text-sm font-extrabold text-gray-800 hover:text-[#2ecc91] transition-all group-hover:gap-2 whitespace-nowrap"
        >
          LÄS MER
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// مكونات الـ Tags الفرعية
function Tag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-transparent group-hover:border-gray-100 transition-all shadow-sm">
      <span className="text-gray-400 group-hover:text-[#2ecc91] transition-colors">
        {icon}
      </span>
      {text}
    </span>
  );
}

function MapPinTag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-[#2ecc91]/5 text-[#2ecc91] px-3 py-1.5 rounded-xl text-[11px] font-bold border border-[#2ecc91]/10 shadow-sm">
      {icon}
      {text}
    </span>
  );
}
