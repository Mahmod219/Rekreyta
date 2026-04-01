"use client";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Dropdown } from "../ui";
import { Modal } from "../shared";
import DeleteJob from "./DeleteJob";
import PublishButton from "./PublishButton";
import EditJobForm from "./EditJobForm";

export default function JobCardAdmin({ job }) {
  const {
    image_url,
    company,
    created_at,
    application_deadline,
    category,
    employmentType,
    location,
    salary,
    title,
  } = job;

  const isPublished = job.published;
  const publishText = isPublished ? "Unpublish" : "Publish";
  const PublishIcon = isPublished ? EyeSlashIcon : EyeIcon;

  return (
    <div
      className={`relative group rounded-3xl border p-5 transition-all duration-300 shadow-sm hover:shadow-md
      ${
        isPublished
          ? "bg-white border-gray-100 hover:border-[#2ecc91]/30"
          : "bg-gray-50 border-gray-200 opacity-90"
      }
    `}
    >
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex items-center lg:justify-between  gap-4  sm:block ">
          {image_url ? (
            <div className="h-14 w-14 rounded-2xl border border-gray-100 p-2 bg-white shadow-sm flex items-center justify-center">
              <img
                src={image_url}
                alt={company}
                className="object-contain max-h-full"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
              <BriefcaseIcon className="h-7 w-7" />
            </div>
          )}

          <div className="sm:hidden  ">
            <StatusBadge isPublished={isPublished} />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center  gap-4">
            <h3 className="text-xl font-bold text-[#2d2e3e] leading-tight">
              {title}
            </h3>
          </div>

          <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            <BuildingOffice2Icon className="h-4 w-4" />
            {company}
          </p>

          {/* Tags Grid */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Tag
              icon={<FolderIcon className="h-3.5 w-3.5" />}
              text={category}
            />
            <Tag
              icon={<MapPinIcon className="h-3.5 w-3.5" />}
              text={location}
            />
            <Tag
              icon={<ClockIcon className="h-3.5 w-3.5" />}
              text={employmentType}
            />
            {salary && (
              <Tag
                icon={<CurrencyDollarIcon className="h-3.5 w-3.5" />}
                text={salary}
                color="text-green-600 bg-green-50"
              />
            )}
          </div>

          {/* Dates Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase">
              <CalendarIcon className="h-3.5 w-3.5" />
              Posted: {new Date(created_at).toLocaleDateString("en-GB")}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg w-fit">
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              Deadline:{" "}
              {new Date(application_deadline).toLocaleDateString("en-GB")}
            </div>
          </div>
        </div>
        <div>
          <StatusBadge isPublished={isPublished} />
        </div>
        {/* 3. Dropdown Menu (Top Right) */}
        <div className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0">
          <Dropdown>
            <Dropdown.Toggle>
              <div className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors border border-gray-50 bg-white shadow-sm">
                <EllipsisVerticalIcon className="h-6 w-6 text-gray-600" />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <ActionItem
                icon={<PencilIcon />}
                text="Edit"
                modalContent={<EditJobForm jobOffer={job} />}
                title="Edit Job"
                job={job}
              />
              <ActionItem
                icon={<PublishIcon />}
                text={publishText}
                modalContent={<PublishButton jobOffer={job} />}
                job={job}
              />
              <div className="border-t border-gray-50 my-1"></div>
              <ActionItem
                icon={<TrashIcon />}
                text="Delete"
                modalContent={<DeleteJob jobOffer={job} />}
                variant="danger"
                job={job}
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function Tag({ icon, text, color = "text-gray-500 bg-gray-50" }) {
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[12px] font-bold border border-transparent shadow-sm ${color}`}
    >
      {icon}
      {text}
    </span>
  );
}

function StatusBadge({ isPublished }) {
  return (
    <span
      className={`text-[10px]  uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-sm  ${
        isPublished ? "bg-[#2ecc91] text-white " : "bg-gray-500 text-white "
      }`}
    >
      {isPublished ? "Live" : "Draft"}
    </span>
  );
}

function ActionItem({ icon, text, modalContent, title, variant, job }) {
  return (
    <Modal>
      <Modal.Open>
        <Dropdown.Item>
          <div
            className={`flex items-center gap-3 font-bold ${variant === "danger" ? "text-red-500" : "text-gray-700"}`}
          >
            <span className="w-4 h-4">{icon}</span>
            <span>{text}</span>
          </div>
        </Dropdown.Item>
      </Modal.Open>
      <Modal.Window>
        {title && (
          <h2 className="mb-6 text-2xl font-black text-[#2d2e3e] uppercase">
            {title}
          </h2>
        )}
        {modalContent}
      </Modal.Window>
    </Modal>
  );
}
