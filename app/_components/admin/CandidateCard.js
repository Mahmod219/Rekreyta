"use client";
import {
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  LinkIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Modal } from "../shared";
import ApplicantReview from "./ApplicantReview";

export default function CandidateCard({ candidate }) {
  const {
    id,
    note,
    rating,
    saved,
    updated_at,
    hr_user_id,
    applications,
    profiles,
  } = candidate;
  const { id: application_id } = applications || {};

  const {
    firstname,
    lastname,
    email,
    phone,
    address,
    city,
    zipcode,
    coverletter,
    another_url,
    another_path,

    cv_path,
    cv_url,
  } = profiles || {};

  const fullName = `${firstname} ${lastname}`;
  const location = `${address}, ${zipcode} ${city}`;
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
          <Modal>
            <Modal.Open opens={`app-${id}`}>
              <button className="flex items-center gap-2 bg-gray-50 text-[#2d2e3e] px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#2ecc91] hover:text-white transition-all shadow-sm cursor-pointer">
                <EyeIcon className="h-4 w-4" />
                detaljer
              </button>
            </Modal.Open>

            <Modal.Window name={`app-${id}`}>
              <div className="space-y-8">
                <div className="flex flex-col  ">
                  <div className=" py-2">
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

                <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100">
                  <h5 className="flex items-center gap-2 font-black text-gray-400 uppercase text-xs tracking-widest mb-4">
                    <DocumentTextIcon className="h-4 w-4" /> Personligt brev
                  </h5>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {coverletter || "Inget personligt brev tillhandahålls."}
                  </p>
                </div>

                <div className="grid grid-cols-1  md:grid-cols-2 gap-4 ">
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
                <div className="mt-8">
                  <ApplicantReview
                    rev={[{ rating, note, saved, application_id, updated_at }]}
                    applicationId={application_id}
                  />
                </div>
              </div>
            </Modal.Window>
          </Modal>
        </div>
      </div>
    </div>
  );
}
