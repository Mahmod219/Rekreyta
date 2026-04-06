"use client";

import { useTransition } from "react";

import {
  UserIcon,
  CalendarIcon,
  EyeIcon,
  DocumentTextIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { toast } from "sonner";
import ApplicationStatus from "./ApplicationStatus";
import { Modal } from "../shared";
import { updateApplicationStatus } from "@/app/_lib/actions";

export default function ApplicationsAdmin({ application }) {
  const [isPending, startTransition] = useTransition();

  const {
    cv_url,
    another_url,
    coverletter,
    id,
    status,
    created_at,
    profiles = {},
    jobs = {},
  } = application;
  const {
    email,

    lastname,
    firstname,

    phone,
    address,
    zipcode,
    city,
  } = profiles;

  const jobId = jobs.id;

  const fullName = `${firstname} ${lastname}`;
  const location = `${address}, ${zipcode} ${city}`;
  const appliedDate = created_at
    ? new Date(created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  function handleStatusUpdate(newStatus) {
    startTransition(async () => {
      try {
        await updateApplicationStatus(id, jobId, newStatus);
        toast.success(`Ansökningsstatus uppdaterad till ${newStatus}!`);
      } catch (error) {
        toast.error("Misslyckades med att uppdatera statusen. Försök igen.");
      }
    });
  }
  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#2ecc91]/10 flex items-center justify-center text-[#2ecc91]">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-[#2d2e3e] text-lg">{fullName}</h4>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ApplicationStatus status={status} />
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
              Tillämpad på
            </span>
            <div className="flex items-center gap-1 text-sm font-bold text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              {appliedDate}
            </div>
          </div>

          <Modal>
            <Modal.Open opens={`app-${id}`}>
              <button className="flex items-center gap-2 bg-gray-50 text-[#2d2e3e] px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#2ecc91] hover:text-white transition-all shadow-sm cursor-pointer">
                <EyeIcon className="h-4 w-4" />
                detaljer
              </button>
            </Modal.Open>

            <Modal.Window name={`app-${id}`}>
              <div className="space-y-8">
                <div className="border-b border-gray-50 pb-6">
                  <h2 className="text-3xl font-black text-[#2d2e3e] mb-1">
                    {fullName}
                  </h2>
                  <p className="text-[#2ecc91] font-bold">{email}</p>
                </div>

                <div className="border-b border-gray-50 pb-6">
                  <h2 className="text-3xl font-black text-[#2d2e3e] mb-1">
                    {phone}
                  </h2>
                  <p className="text-[#2ecc91] font-bold">{location}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100">
                  <h5 className="flex items-center gap-2 font-black text-gray-400 uppercase text-xs tracking-widest mb-4">
                    <DocumentTextIcon className="h-4 w-4" /> Cover Letter
                  </h5>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {coverletter || "Inget personligt brev tillhandahålls."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={cv_url}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#2ecc91] transition-colors group/link"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="h-6 w-6 text-red-500" />
                      <span className="font-bold text-gray-700">
                        Curriculum Vitae (CV)
                      </span>
                    </div>
                    <LinkIcon className="h-4 w-4 text-gray-400 group-hover/link:text-[#2ecc91]" />
                  </a>

                  {another_url && (
                    <a
                      href={another_url}
                      target="_blank"
                      className="flex items-center justify-between p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#2ecc91] transition-colors group/link"
                    >
                      <div className="flex items-center gap-3">
                        <LinkIcon className="h-6 w-6 text-blue-500" />
                        <span className="font-bold text-gray-700">
                          Portfolio / Webbplats
                        </span>
                      </div>
                      <LinkIcon className="h-4 w-4 text-gray-400 group-hover/link:text-[#2ecc91]" />
                    </a>
                  )}
                </div>
                {/* Admin Operations */}
                <div className="pt-8 mt-8 border-t border-gray-100">
                  <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                    Administrativ operatör
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleStatusUpdate("Intervju")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all cursor-pointer"
                    >
                      <CalendarIcon className="h-5 w-5" />
                      Intervju
                    </button>

                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer">
                      <DocumentTextIcon className="h-5 w-5" />
                      Email
                    </button>

                    <button
                      disabled={isPending}
                      onClick={() => handleStatusUpdate("Godkänd")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-[#2ecc91] text-white rounded-2xl font-bold text-sm hover:bg-[#28b681] shadow-lg shadow-green-100 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isPending ? "Uppdaterar..." : "Godkänd"}
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleStatusUpdate("Avböjd")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <XMarkIcon className="h-5 w-5" />{" "}
                      {isPending ? "Uppdaterar..." : "Avböjd"}
                    </button>
                  </div>
                </div>
              </div>
            </Modal.Window>
          </Modal>
        </div>
      </div>
    </div>
  );
}
