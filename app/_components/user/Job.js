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
import { TextExpander } from "../ui";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";

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
    <div className=" min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 w-full">
            <div className="border-b border-gray-100 pb-8">
              <div className="flex mb-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                  <Image
                    src={image_url || "/api/placeholder/500/500"}
                    alt={company}
                    fill
                    className="rounded-lg object-contain p-1"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center  gap-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    {title}
                  </h1>
                  <p className="mt-4 flex items-center gap-2 text-xl font-semibold text-gray-600">
                    <BuildingOffice2Icon className="h-6 w-6 text-primary-500" />
                    {company}
                  </p>
                  <span className="flex items-center gap-1 mt-3">
                    Posted on:
                    <CalendarIcon className="h-5 w-5 text-primary-500" />
                    {new Date(created_at).toLocaleDateString("en-US")}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2 rounded-full text-sm font-medium text-gray-600">
                  <FolderIcon className="h-5 w-5 text-primary-500" />
                  {category}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2 rounded-full text-sm font-medium text-gray-600">
                  <MapPinIcon className="h-5 w-5 text-primary-500" />
                  {location}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2 rounded-full text-sm font-medium text-gray-600">
                  <ClockIcon className="h-5 w-5 text-primary-500" />
                  {employmentType}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2 rounded-full text-sm font-medium text-gray-600">
                  <CalendarDateRangeIcon className="h-5 w-5 text-primary-500" />
                  {duration}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-5 py-2 rounded-full text-sm font-medium text-gray-600">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
                  {salary}
                </span>
              </div>
            </div>
          </div>

          <div className="">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
              <DocumentTextIcon className="h-6 w-6 text-primary-500" />
              About this role
            </h3>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/50 p-8 rounded-3xl border border-dashed border-gray-200">
              {description ? (
                <TextExpander>{description}</TextExpander>
              ) : (
                <p className="text-gray-400 italic">No description provided.</p>
              )}
              <div>
                <div>
                  <span className="flex items-center mt-4 gap-1 text-gray-600">
                    <MapPinIcon className="h-5 w-5 text-primary-500" />

                    {address}
                  </span>
                </div>
                <div>
                  <span className="flex items-center mt-4 gap-1 text-secondery-50">
                    Application deadline
                    <CalendarDaysIcon className="h-5 w-5 text-secondery-50" />
                    {new Date(application_deadline).toLocaleDateString("en-US")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex my-3">
              {!session ? (
                <Link
                  href="/login"
                  className="bg-primary-400 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all shadow-lg mx-auto cursor-pointer  "
                >
                  Login to apply
                </Link>
              ) : (
                <ApplyJob jobId={id} createdBy={created_by} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
