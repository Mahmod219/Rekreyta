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

export default async function SavedJobsCard({ job }) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  if (!job) return null;

  let isInitialSaved = false;

  const {
    created_at,
    jobs: {
      id: jobId,
      title,
      company,
      category,
      duration,
      location,
      image_url,
      employmentType,
      application_deadline,
    },
  } = job;

  const savedJobs = await getSavedJob(userId);
  const allSavedJobsIds = savedJobs.map((s) => s.job_id) || [];
  isInitialSaved = allSavedJobsIds.includes(jobId);

  return (
    <div className="group relative rounded-3xl border border-gray-100 bg-white p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#2ecc91]/30">
      {/* 1. Top Section: Logo & Titles */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex gap-4 items-center sm:items-start">
          {/* Logo Container */}
          {image_url ? (
            <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl border border-gray-100 p-2 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors shadow-sm">
              <Image
                src={image_url}
                alt={company}
                width={58}
                height={58}
                className="object-contain max-h-full"
              />
            </div>
          ) : (
            <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 rounded-2xl bg-[#2ecc91]/10 flex items-center justify-center">
              <BuildingOffice2Icon className="h-6 w-6 md:h-7 md:w-7 text-[#2ecc91]" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-[#2d2e3e] group-hover:text-[#2ecc91] transition-colors leading-tight truncate">
              {title}
            </h3>
            <p className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">
              <BuildingOffice2Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{company}</span>
            </p>
          </div>
        </div>

        {/* Saved Date & Button - Responsive Position */}
        {session?.user && (
          <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:absolute sm:top-6 sm:right-6">
            <p className="text-gray-400 text-[11px] md:text-xs font-medium">
              Sparad: {new Date(created_at).toLocaleDateString("sv-SE")}
            </p>
            <SaveJobButton jobId={jobId} initialSaved={isInitialSaved} />
          </div>
        )}
      </div>

      {/* 2. Middle Section: Tags */}
      <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
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
      </div>

      {/* Deadline Info */}
      <div className="flex items-center gap-2 text-[11px] md:text-xs font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-xl w-fit">
        <CalendarDaysIcon className="h-4 w-4" />
        <span>
          Sista ansökan:{" "}
          {new Date(application_deadline).toLocaleDateString("sv-SE")}
        </span>
      </div>

      {/* 3. Bottom Section: Action Link */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end items-center">
        <Link
          href={`/jobs/${jobId}`}
          className="flex items-center gap-1 text-sm font-extrabold text-[#2d2e3e] hover:text-[#2ecc91] transition-all group-hover:gap-2"
        >
          Visa mer
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// Sub-components remains the same but with improved padding for mobile
function Tag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-[12px] font-bold border border-transparent group-hover:border-gray-100 transition-all shadow-sm">
      <span className="text-gray-400 group-hover:text-[#2ecc91] transition-colors shrink-0">
        {icon}
      </span>
      <span className="truncate max-w-25 md:max-w-none">{text}</span>
    </span>
  );
}

function MapPinTag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-[#2ecc91]/5 text-[#2ecc91] px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-[12px] font-bold border border-[#2ecc91]/10 shadow-sm">
      <span className="shrink-0">{icon}</span>
      <span className="truncate max md:max-w-none">{text}</span>
    </span>
  );
}
