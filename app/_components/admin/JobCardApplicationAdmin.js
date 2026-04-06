import {
  BuildingOffice2Icon,
  ChevronRightIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function JobCardApplicationAdmin({ job, applicantsCount = 0 }) {
  const { id, title, company, image_url, published } = job;

  return (
    <div className="relative group rounded-3xl border border-gray-300/50 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#2ecc91]/30">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="shrink-0">
          {image_url ? (
            <div className="h-16 w-16 rounded-2xl border border-gray-100 p-2 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors shadow-sm">
              <img
                src={image_url}
                alt={company}
                className="object-contain max-h-full"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-[#2ecc91]/10 flex items-center justify-center">
              <BuildingOffice2Icon className="h-8 w-8 text-[#2ecc91]" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-[#2d2e3e] group-hover:text-[#2ecc91] transition-colors leading-tight mb-1">
            {title}
          </h3>
          <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            <BuildingOffice2Icon className="h-4 w-4" />
            {company}
          </p>
        </div>

        <span
          className={`text-[10px]  uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-sm  ${
            published ? "bg-[#2ecc91] text-white " : "bg-gray-500 text-white "
          }`}
        >
          {published ? "Aktiv" : "Utkast"}
        </span>

        <div className="flex flex-col items-center px-6 py-2 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-[#2ecc91]/5 group-hover:border-[#2ecc91]/20 transition-all">
          <span className="text-2xl font-black text-[#2ecc91] leading-none">
            {applicantsCount}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
            <UserGroupIcon className="h-3 w-3" />
            Applicants
          </span>
        </div>

        <div className="w-full sm:w-auto">
          {applicantsCount > 0 && (
            <Link
              href={`/admin/applications/${id}`}
              className="flex items-center justify-center gap-2 bg-[#2d2e3e] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#2ecc91] transition-all group-hover:shadow-lg active:scale-95"
            >
              Visa
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
