"use client";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  EyeIcon,
  LinkIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Modal } from "../shared";
import ApplicantReview from "./ApplicantReview";

export default function CandidateCard({ candidate, adminId }) {
  const {
    id,
    hr_user_id,
    note,
    rating,
    saved,
    updated_at,
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
    cv_url,
    // استخراج البيانات الجديدة
    main_category,
    tags = [],
  } = profiles || {};

  const fullName = `${firstname} ${lastname}`;
  const location = `${address}, ${zipcode} ${city}`;
  const showform = adminId === hr_user_id;

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#2ecc91]/10 flex items-center justify-center text-[#2ecc91]">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-[#2d2e3e] text-lg leading-tight">
              {fullName}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 font-medium">{email}</span>
              {/* عرض المجال الرئيسي بجانب الاسم بشكل بسيط */}
              {main_category && (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                  <BriefcaseIcon className="h-3 w-3" />
                  {main_category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* عرض أول 3 وسوم (Tags) في الكرت الخارجي للاختصار */}
        <div className="hidden md:flex flex-wrap gap-2 max-w-75 justify-center">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg text-[10px] font-bold uppercase"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] text-gray-300 font-bold">
              +{tags.length - 3}
            </span>
          )}
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
              <div className="space-y-8 max-w-2xl mx-auto">
                {/* Header Profile */}
                <div className="flex justify-between items-start border-b border-gray-50 pb-6">
                  <div>
                    <h2 className="text-3xl font-black text-[#2d2e3e] mb-1">
                      {fullName}
                    </h2>
                    <div className="flex items-center gap-3">
                      <p className="text-[#2ecc91] font-bold">{email}</p>
                      <span className="text-gray-300">|</span>
                      <p className="text-gray-500 font-bold">{phone}</p>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{location}</p>
                  </div>

                  {/* عرض المجال في المودال بشكل بارز */}
                  {main_category && (
                    <div className="bg-[#2ecc91] text-white px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#2ecc91]/20">
                      {main_category}
                    </div>
                  )}
                </div>

                {/* عرض كافة الوسوم (Tags) */}
                {tags.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="flex items-center gap-2 font-black text-gray-400 uppercase text-[10px] tracking-widest">
                      <TagIcon className="h-4 w-4" /> Kompetenser
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100">
                  <h5 className="flex items-center gap-2 font-black text-gray-400 uppercase text-xs tracking-widest mb-4">
                    <DocumentTextIcon className="h-4 w-4" /> Personligt brev
                  </h5>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                    {coverletter || "Inget personligt brev tillhandahålls."}
                  </p>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href={cv_url}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#2ecc91] transition-colors group/link"
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="h-6 w-6 text-red-500" />
                      <span className="font-bold text-gray-700 text-sm">
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
                        <span className="font-bold text-gray-700 text-sm">
                          Portfolio / Webbplats
                        </span>
                      </div>
                      <LinkIcon className="h-4 w-4 text-gray-400 group-hover/link:text-[#2ecc91]" />
                    </a>
                  )}
                </div>

                {/* التقييم والمراجعة - تمرر bara komponenten när nödvändiga ID finns */}
                {showform && (
                  <div className="mt-8 border-t border-gray-50 pt-8">
                    <ApplicantReview
                      rev={[
                        { rating, note, saved, application_id, updated_at },
                      ]}
                      applicationId={application_id}
                      profileId={profiles?.id}
                      currentProfile={profiles}
                    />
                  </div>
                )}
              </div>
            </Modal.Window>
          </Modal>
        </div>
      </div>
    </div>
  );
}
