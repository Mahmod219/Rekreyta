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
      case "Inkommen": // Pending / New
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "intervju": // Interview
        return "bg-orange-50 text-orange-700 border-orange-100";

      case "godkänd": // Accepted / Hired
        return "bg-green-50 text-green-700 border-green-100";

      case "avböjd": // Rejected
        return "bg-red-50 text-red-700 border-red-100";

      default: // حالة احتياطية
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="group relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#2ecc91]/30">
      {/* 1. Top Section: Logo & Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          {image_url ? (
            <div className="h-14 w-14 rounded-2xl border border-gray-100 p-2 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors">
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
            <h3 className="text-xl font-bold text-[#2d2e3e] group-hover:text-[#2ecc91] transition-colors leading-tight">
              {title}
            </h3>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mt-1">
              {company}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(status)}`}
        >
          {status || "Inkommen"}
        </span>
      </div>

      {/* 2. Middle Section: Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Tag icon={<FolderIcon className="h-3.5 w-3.5" />} text={category} />
        <Tag icon={<MapPinIcon className="h-3.5 w-3.5" />} text={location} />
        <Tag
          icon={<ClockIcon className="h-3.5 w-3.5" />}
          text={employmentType}
        />
        <Tag
          icon={<CalendarDateRangeIcon className="h-3.5 w-3.5" />}
          text={duration}
        />
      </div>

      {/* 3. Bottom Section: Deadline & Action */}
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
          <CalendarDaysIcon className="h-4 w-4" />
          <span>
            Deadline:{" "}
            {new Date(application_deadline).toLocaleDateString("en-GB")}
          </span>
        </div>

        <Link
          href={`/jobs/${id}`}
          className="flex items-center gap-1 text-sm font-bold text-[#2d2e3e] hover:text-[#2ecc91] transition-colors"
        >
          Detaljer
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function Tag({ icon, text }) {
  return (
    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl text-[12px] font-medium border border-transparent group-hover:border-gray-100 transition-all">
      {icon}
      {text}
    </span>
  );
}
