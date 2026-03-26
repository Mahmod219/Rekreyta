import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  ClockIcon,
  FolderIcon,
  MapPinIcon,
  CalendarDateRangeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function JobCard({ job }) {
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

  return (
    <div className="group relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#2ecc91]/30">
      {/* 1. Top Section: Logo & Titles */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          {/* Logo Container */}
          {image_url ? (
            <div className="h-14 w-14 rounded-2xl border border-gray-100 p-2 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors shadow-sm">
              <img
                src={image_url}
                alt={company}
                className="object-contain max-h-full"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-[#2ecc91]/10 flex items-center justify-center">
              <BuildingOffice2Icon className="h-7 w-7 text-[#2ecc91]" />
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-[#2d2e3e] group-hover:text-[#2ecc91] transition-colors leading-tight flex items-center gap-2">
              {title}
            </h3>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">
              <BuildingOffice2Icon className="h-3.5 w-3.5" />
              {company}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Tags (نفس التنسيق الدائري الأنيق) */}
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

      <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
        <CalendarDaysIcon className="h-4 w-4" />
        <span>
          Posted on: {new Date(created_at).toLocaleDateString("en-GB")}
        </span>
      </div>

      {/* 3. Bottom Section: Action Link */}
      <div className="pt-4 border-t border-gray-50 flex justify-end items-center">
        <Link
          href={`/jobs/${id}`}
          className="flex items-center gap-1 text-sm font-extrabold text-[#2d2e3e] hover:text-[#2ecc91] transition-all group-hover:gap-2"
        >
          Show more
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
