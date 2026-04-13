"use client";

import reviewApplicant from "@/app/_lib/actions";
import { useActionState, useEffect } from "react";
import RatingInput from "../ui/RatingInput";
import { toast } from "sonner";
import {
  LockClosedIcon,
  PencilSquareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

export default function ApplicantReview({ rev, applicationId, profileId }) {
  const review = rev && rev.length > 0 ? rev[0] : null;
  const { saved, note, rating, updated_at } = review || {};

  const [state, formAction, isPending] = useActionState(reviewApplicant, {});

  useEffect(() => {
    if (state?.success) toast.success("Granskningen har uppdaterats!");
    if (state?.formError) toast.error(state.formError);
  }, [state]);

  return (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
      {/* رأس المكون - رسالة الخصوصية */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <LockClosedIcon className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800">Intern Granskning</h3>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
            Endast synlig för rekryteringsteamet
          </p>
        </div>
      </div>

      <form action={formAction} className="p-6 space-y-6">
        <input hidden name="id" defaultValue={applicationId} />
        <input hidden name="profileId" defaultValue={profileId} />

        {/* حقل الملاحظات */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600 ml-1">
            <PencilSquareIcon className="w-4 h-4" />
            INTERNA ANTECKNINGAR
          </label>
          <textarea
            name="note"
            defaultValue={note || ""}
            placeholder="Skriv dina tankar om kandidaten här..."
            className="w-full min-h-30 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2ecc91]/20 focus:border-[#2ecc91] outline-none transition-all text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* التقييم */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-600 mx-1">
              KANDIDATBETYG
            </label>
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 inline-block">
              <RatingInput name="rating" defaultValue={rating || 0} />
            </div>
          </div>

          {/* حفظ المرشح */}
          <div className="pb-2">
            <label className="group flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  name="saved"
                  defaultChecked={saved || false}
                  className="peer sr-only"
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2ecc91] transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              </div>
              <div className="flex items-center gap-1.5">
                <BookmarkIcon className="w-4 h-4 text-gray-400 group-hover:text-[#2ecc91] transition-colors" />
                <span className="text-sm font-bold text-gray-700">
                  Spara i kandidatbank
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto min-w-40 bg-[#2ecc91] hover:bg-[#27af7c] text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-[#2ecc91]/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sparar...
              </>
            ) : (
              "Spara granskning"
            )}
          </button>
          {updated_at && (
            <span className="text-sm text-gray-500">
              Senast uppdaterad{" "}
              {new Date(updated_at).toLocaleDateString("en-GB")}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
