"use client";

import { useState, useTransition } from "react";
import {
  UserIcon,
  CalendarIcon,
  EyeIcon,
  DocumentTextIcon,
  LinkIcon,
  XMarkIcon,
  SparklesIcon, // أيقونة إضافية للذكاء الاصطناعي
} from "@heroicons/react/24/outline";

import { toast } from "sonner";
import ApplicationStatus from "./ApplicationStatus";
import { Modal } from "../shared";
import { updateApplicationStatus } from "@/app/_lib/actions";
import ApplicantReview from "./ApplicantReview";
import ScheduleInterviewModal from "./ScheduleInterviewModal";

export default function ApplicationsAdmin({ application, rev }) {
  const [isPending, startTransition] = useTransition();
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const {
    cv_url,
    another_url,
    coverletter,
    id,
    status,
    created_at,
    match_score, // التأكد من جلب الحقل من الداتابيز
    ai_analysis, // التأكد من جلب الحقل من الداتابيز
    profiles = {},
    jobs = {},
  } = application;

  const {
    id: profile_id,
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
    ? new Date(created_at).toLocaleDateString("sv-SE", {
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

  // دالة لتحديد لون النتيجة بناءً على الرقم
  const getScoreColor = (score) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#2ecc91]/10 flex items-center justify-center text-[#2ecc91]">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-col items-center ">
              <h4 className="font-bold text-[#2d2e3e] text-lg">{fullName}</h4>
              {/* شارة الذكاء الاصطناعي في القائمة الرئيسية */}

              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          {match_score > 0 && (
            <span
              className={`text-sm px-2 py-1 ml-2 rounded-full font-bold text-white ${getScoreColor(match_score)} shadow-sm`}
            >
              {match_score}% Match
            </span>
          )}
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
                {/* Header Section */}
                <div className="flex flex-col">
                  <div className="py-2">
                    <h2 className="text-3xl font-black text-[#2d2e3e] mb-1">
                      {fullName}
                    </h2>
                    <p className="text-[#2ecc91] font-bold">{email}</p>
                  </div>
                  <div className="border-b border-gray-50 pb-6">
                    <h2 className="text-xl font-black text-[#2d2e3e] mb-1">
                      {phone}
                    </h2>
                    <p className="text-gray-500 font-bold">{location}</p>
                  </div>
                </div>

                {/* AI ANALYSIS SECTION - جذاب جداً واحترافي */}
                {match_score > 0 && (
                  <div className="bg-linear-to-br from-[#2ecc91]/5 to-blue-50 p-6 rounded-4xl border border-[#2ecc91]/20 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="flex items-center gap-2 font-black text-[#2ecc91] uppercase text-xs tracking-widest">
                        <SparklesIcon className="h-4 w-4" /> AI-Utvärdering
                      </h5>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full animate-pulse ${getScoreColor(match_score)}`}
                        ></span>
                        <span className="text-2xl font-black text-[#2d2e3e]">
                          {match_score}%
                        </span>
                      </div>
                    </div>

                    <p className="text-[#2d2e3e] text-sm leading-relaxed font-medium italic bg-white/50 p-4 rounded-2xl border border-white/80">
                      "
                      {ai_analysis ||
                        "Ingen analys tillgänglig för denna ansökan."}
                      "
                    </p>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${getScoreColor(match_score)}`}
                        style={{ width: `${match_score}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Personal Letter Section */}
                <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100">
                  <h5 className="flex items-center gap-2 font-black text-gray-400 uppercase text-xs tracking-widest mb-4">
                    <DocumentTextIcon className="h-4 w-4" /> Personligt brev
                  </h5>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {coverletter || "Inget personligt brev tillhandahålls."}
                  </p>
                </div>

                {/* CV & Portfolio Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={cv_url}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#2ecc91] transition-colors group/link"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="h-6 w-6 text-red-500" />
                      <span className="font-bold text-gray-700">
                        CV (Curriculum Vitae)
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
                <div className="pt-8 my-8 border-t border-gray-100">
                  <h5 className="text-sm font-black text-gray-600 uppercase tracking-widest mb-4">
                    Administrativ operatör
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-400 text-white rounded-2xl font-bold text-sm hover:bg-blue-500 transition-all cursor-pointer"
                      onClick={() => setIsInterviewModalOpen(true)}
                    >
                      Boka Intervju
                    </button>

                    {isInterviewModalOpen && (
                      <ScheduleInterviewModal
                        applicationId={id}
                        applicantName={fullName}
                        jobs={jobs}
                        profileId={profile_id}
                        onClose={() => setIsInterviewModalOpen(false)}
                      />
                    )}

                    <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all cursor-pointer">
                      <DocumentTextIcon className="h-5 w-5" /> Email
                    </button>

                    <button
                      disabled={isPending}
                      onClick={() => handleStatusUpdate("godkänd")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-[#2ecc91] text-white rounded-2xl font-bold text-sm hover:bg-[#28b681] shadow-lg shadow-green-100 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isPending ? "Uppdaterar..." : "Godkänd"}
                    </button>

                    <button
                      disabled={isPending}
                      onClick={() => handleStatusUpdate("avböjd")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      {isPending ? "Uppdaterar..." : "Avböjd"}
                    </button>
                  </div>

                  <div className="mt-8">
                    <ApplicantReview
                      rev={rev}
                      applicationId={id}
                      profileId={profile_id}
                    />
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
