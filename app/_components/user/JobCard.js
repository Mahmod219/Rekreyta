import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
  BuildingOffice2Icon,
  CalendarDateRangeIcon,
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import SaveJobButton from "./SaveJobButton";
import getSavedJob from "@/app/_lib/data-service";
import ShareJobButton from "../ui/ShareJobButton";
import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  isToday,
} from "date-fns";

export default async function JobCard({ job }) {
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
    location,
    title,
    created_at,
  } = job;
  const savedJobs = await getSavedJob(userId);
  const allSavedJobsIds = savedJobs.map((s) => s.job_id) || [];

  isInitialSaved = allSavedJobsIds.includes(id);

  const isCreatedToday = isToday(new Date(created_at));

  return (
    <div className="group relative rounded-3xl border border-gray-300/50 bg-white p-5 md:p-6 shadow-lg transition-all duration-300  hover:shadow-xl hover:-translate-y-1  hover:border-[#2ecc91]/30 w-full overflow-hidden">
      {/* 1. Top Section: Logo & Titles & Actions */}

      {isCreatedToday && (
        <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden">
          <div className="absolute top-5 -right-8.75 rotate-45 bg-[#2ecc91] text-white text-xs font-semibold py-1 w-35 text-center shadow-md">
            Nytt
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
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
          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-xl font-bold text-[#2d2e3e] group-hover:text-[#2ecc91] transition-colors leading-tight wrap-break-word line-clamp-2">
              {title}
            </h3>
            <p className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">
              <BuildingOffice2Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{company}</span>
            </p>
          </div>
        </div>

        {/* Actions: Moved to absolute on Mobile or stayed in flex on Desktop */}
      </div>
      {/* 2. Middle Section: Tags (تحسين الـ Wrapping) */}
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
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg shrink-0">
          Publicerad:
          <CalendarDaysIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span className="whitespace-nowrap">
            {new Date(created_at).toLocaleDateString("en-GB")}
          </span>
        </div>
      </div>

      {/* Footer: Date & Show More */}
      <div className="pt-4 border-t  border-gray-50 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
          <ShareJobButton jobTitle={title} jobId={id} company={company} />
          {session?.user && (
            <div className="flex items-center justify-center w-10 h-10">
              <SaveJobButton jobId={id} initialSaved={isInitialSaved} />
            </div>
          )}
        </div>

        <Link
          href={`/jobs/${id}`}
          className="flex items-center gap-1 text-xs md:text-sm font-extrabold text-[#2d2e3e] hover:text-[#2ecc91] transition-all group-hover:gap-2 whitespace-nowrap"
        >
          LÄS MER
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// مكون فرعي للـ Tags للحفاظ على نظافة الكود وتوحيد التصميم
function Tag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl text-[12px] font-bold border border-transparent group-hover:border-gray-100 transition-all shadow-sm">
      <span className="text-gray-400 group-hover:text-[#2ecc91] transition-colors">
        {icon}
      </span>
      {text}
    </span>
  );
}

// مخصص للمكان بلون أخضر خفيف للتميز
function MapPinTag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-[#2ecc91]/5 text-[#2ecc91] px-3 py-1.5 rounded-xl text-[12px] font-bold border border-[#2ecc91]/10 shadow-sm">
      {icon}
      {text}
    </span>
  );
}
