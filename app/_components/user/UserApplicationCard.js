import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
  BuildingOffice2Icon,
  CalendarDateRangeIcon,
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

export default function UserApplicationCard({ job, status }) {
  const {
    id,
    image_url,
    company,
    category,
    duration,
    employmentType,
    location,
    title,
    application_deadline,
  } = job;

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "inkommen":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "intervju":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "godkänd":
        return "bg-green-50 text-green-600 border-green-100";
      case "avböjd":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="group relative rounded-4xl md:rounded-[2.5rem] border border-gray-100 bg-white p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#2ecc91]/30">
      {/* 1. Top Section: Logo & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
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
            <p className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider truncate">
              <BuildingOffice2Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              {company}
            </p>
          </div>
        </div>

        {/* Status Badge - Responsive: Full width on mobile, auto on desktop */}
        <div
          className={`px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest border shadow-sm text-center self-start sm:self-auto ${getStatusStyles(status)}`}
        >
          {status || "Inkommen"}
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
      </div>

      {/* 3. Bottom Section: Deadline & Details Link */}
      <div className="pt-5 border-t border-gray-50 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100/50 uppercase tracking-tight">
          <CalendarDaysIcon className="h-4 w-4 shrink-0" />
          <span>
            Sista ansökan:{" "}
            {new Date(application_deadline).toLocaleDateString("sv-SE")}
          </span>
        </div>

        <Link
          href={`/jobs/${id}`}
          className="flex items-center gap-1 text-sm font-extrabold text-[#2d2e3e] hover:text-[#2ecc91] transition-all group-hover:gap-2 self-end xs:self-auto"
        >
          Visa mer
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Tag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-[12px] font-bold border border-transparent group-hover:border-gray-100 transition-all shadow-sm">
      <span className="text-gray-400 group-hover:text-[#2ecc91] transition-colors shrink-0">
        {icon}
      </span>
      <span className="truncate max-w-30 md:max-w-none">{text}</span>
    </span>
  );
}

function MapPinTag({ icon, text }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-1.5 bg-[#2ecc91]/5 text-[#2ecc91] px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-[12px] font-bold border border-[#2ecc91]/10 shadow-sm">
      <span className="shrink-0">{icon}</span>
      <span className="truncate max-w-30 md:max-w-none">{text}</span>
    </span>
  );
}
