import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
  BuildingOffice2Icon,
  CalendarDateRangeIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  FolderIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";

import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import ApplyJob from "./ApplyJob";

import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import TextExpander from "../ui/TextExpender";

export default async function Job({ job }) {
  const session = await getServerSession(authConfig);
  const {
    id,
    image_url,
    company,
    category,
    duration,
    employmentType,
    location,
    title,
    description,
    salary,
    created_at,
    application_deadline,
    address,
    created_by,
  } = job;

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <div className="border-b border-gray-100 pb-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {image_url && (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-50 rounded-2xl border border-gray-100 p-2">
                  <Image
                    src={image_url || "/api/placeholder/500/500"}
                    alt={company}
                    fill
                    className="rounded-xl object-contain"
                  />
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  {title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6">
                  <p className="flex items-center gap-2 text-lg font-bold text-[#2ecc91]">
                    <BuildingOffice2Icon className="h-5 w-5" />
                    {company}
                  </p>
                  <span className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <CalendarIcon className="h-4 w-4" />
                    Publicerad:{" "}
                    {new Date(created_at).toLocaleDateString("sv-SE")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info Tags */}
            <div className="mt-8 flex flex-wrap gap-3">
              <InfoTag
                icon={<FolderIcon />}
                text={category}
                color="text-blue-500"
              />
              <InfoTag
                icon={<MapPinIcon />}
                text={location}
                color="text-red-500"
              />
              <InfoTag
                icon={<ClockIcon />}
                text={employmentType}
                color="text-[#2ecc91]"
              />
              <InfoTag
                icon={<CalendarDateRangeIcon />}
                text={duration}
                color="text-purple-500"
              />
              <InfoTag
                icon={<CurrencyDollarIcon />}
                text={salary}
                color="text-amber-600"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description Column */}
            <div className="lg:col-span-2">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <DocumentTextIcon className="h-6 w-6 text-[#2ecc91]" />
                Om tjänsten
              </h3>

              <div className="w-full text-gray-700 leading-relaxed bg-gray-50/50 p-6 md:p-10 rounded-[2.5rem] border border-gray-100 whitespace-pre-wrap wrap-break-word">
                {/* تأكد من عدم وجود مسافات كبيرة هنا */}
                {description ? (
                  <TextExpander>{description}</TextExpander>
                ) : (
                  <p className="text-gray-400 italic font-medium">
                    Ingen beskrivning tillgänglig.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-100 rounded-4xl p-8 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">
                  Information
                </h4>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="h-6 w-6 text-[#2ecc91] shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Adress</p>
                      <p className="text-gray-600 text-sm">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDaysIcon className="h-6 w-6 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Sista ansökningsdag
                      </p>
                      <p className="text-orange-600 text-sm font-bold">
                        {new Date(application_deadline).toLocaleDateString(
                          "sv-SE",
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  {!session ? (
                    <Link
                      href="/login"
                      className="block w-full bg-gray-900 text-white text-center py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-md"
                    >
                      Logga in för att ansöka
                    </Link>
                  ) : (
                    <ApplyJob jobId={id} createdBy={created_by} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكوّن فرعي للأوسمة لتقليل تكرار الكود
// مكوّن فرعي للأوسمة - بسيط وسريع
function InfoTag({ icon, text, color }) {
  return (
    <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-sm font-bold text-gray-600 hover:bg-white transition-colors">
      {/* هنا نمرر الأيقونة مباشرة داخل الـ span مع اللون */}
      <span className={color}>{icon}</span>
      {text}
    </span>
  );
}
