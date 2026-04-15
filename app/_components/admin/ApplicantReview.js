"use client";

import reviewApplicant from "@/app/_lib/actions";
import { useActionState, useEffect, useState } from "react";
import RatingInput from "../ui/RatingInput";
import TagInput from "./TagInput";
import { toast } from "sonner";
import {
  LockClosedIcon,
  PencilSquareIcon,
  BookmarkIcon,
  TagIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default function ApplicantReview({
  rev,
  applicationId,
  profileId,
  currentProfile,
}) {
  // 1. إصلاح: تحديث الوسوم عند تغير الملف الشخصي
  const [tags, setTags] = useState(currentProfile?.tags || []);

  useEffect(() => {
    if (currentProfile?.tags) {
      setTags(currentProfile.tags);
    }
  }, [currentProfile]);

  const review = rev && rev.length > 0 ? rev[0] : null;
  const { saved, note, rating, updated_at } = review || {};

  const [state, formAction, isPending] = useActionState(reviewApplicant, {});

  useEffect(() => {
    if (state?.success) {
      toast.success("Granskningen har uppdaterats!");
    }
    // 2. إصلاح: التعامل مع رسالة الخطأ القادمة من الأكشن (Behörighet)
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
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
        {/* 3. إصلاح: نرسل نص فارغ بدلاً من undefined لضمان وصول null للأكشن */}
        <input hidden name="id" value={applicationId || ""} readOnly />
        <input hidden name="profileId" value={profileId || ""} readOnly />
        <input hidden name="tags" value={JSON.stringify(tags)} readOnly />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 ml-1">
              <BriefcaseIcon className="w-4 h-4" />
              HUVUDKATEGORI
            </label>
            <select
              name="main_category"
              key={currentProfile?.main_category} // يساعد في إعادة ضبط القيمة عند التبديل بين المرشحين
              defaultValue={currentProfile?.main_category || ""}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2ecc91]/20 focus:border-[#2ecc91] outline-none transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">Välj bransch...</option>
              <option value="Administration, ekonomi, juridik">
                Administration, ekonomi, juridik
              </option>
              <option value="Bygg och anläggning">Bygg och anläggning</option>
              <option value="Utbildning">Utbildning</option>
              <option value="Ekonomi">Ekonomi & Finans</option>
              <option value="Chefer och verksamhetsledare">
                Chefer och verksamhetsledare
              </option>
              <option value="Data/IT">Data/IT</option>
              <option value="Försäljning, inköp, marknadsföring">
                Försäljning, inköp, marknadsföring
              </option>
              <option value="Hantverksyrken">Hantverksyrken</option>
              <option value="Hotell, restaurang, storhushåll">
                Hotell, restaurang, storhushåll
              </option>
              <option value="Hälso- och sjukvård">Hälso- och sjukvård</option>
              <option value="Industriell tillverkning">
                Industriell tillverkning
              </option>
              <option value="Installation, drift, underhåll">
                Installation, drift, underhåll
              </option>
              <option value="Kropps- och skönhetsvård">
                Kropps- och skönhetsvård
              </option>
              <option value="Kultur, media, design">
                Kultur, media, design
              </option>
              <option value="Militärt arbete">Militärt arbete</option>
              <option value="Naturvetenskapligt arbete">
                Naturvetenskapligt arbete
              </option>
              <option value="Pedagogiskt arbete">Pedagogiskt arbete</option>
              <option value="Sanering och renhållning">
                Sanering och renhållning
              </option>
              <option value="Socialt arbete">Socialt arbete</option>
              <option value="Säkerhetsarbete">Säkerhetsarbete</option>
              <option value="Tekniskt arbete">Tekniskt arbete</option>
              <option value="Transport">Transport</option>
            </select>
          </div>

          {/* 2. التقييم الرقمي */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 ml-1 block">
              KANDIDATBETYG
            </label>
            <div className="bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200 inline-block w-full md:w-auto">
              {/* استخدمنا key هنا لإجبار المكون على التحديث عند تغير المرشح */}
              <RatingInput
                key={profileId}
                name="rating"
                defaultValue={rating || 0}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600 ml-1">
            <TagIcon className="w-4 h-4" />
            KOMPETENSER & TAGGAR
          </label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-600 ml-1">
            <PencilSquareIcon className="w-4 h-4" />
            INTERNA ANTECKNINGAR
          </label>
          <textarea
            name="note"
            key={profileId}
            defaultValue={note || ""}
            placeholder="Skriv dina tankar om kandidaten här..."
            className="w-full min-h-30 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#2ecc91]/20 focus:border-[#2ecc91] outline-none transition-all text-sm resize-none"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <label className="group flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                name="saved"
                key={profileId}
                defaultChecked={saved || false}
                className="peer sr-only"
              />
              <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2ecc91] transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 shadow-inner"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <BookmarkIcon className="w-4 h-4 text-gray-400 group-hover:text-[#2ecc91] transition-colors" />
              <span className="text-sm font-bold text-gray-700">
                Spara i kandidatbank
              </span>
            </div>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto min-w-48 bg-[#2ecc91] hover:bg-[#27af7c] text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-[#2ecc91]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? "Sparar..." : "Uppdatera granskning"}
          </button>
        </div>
      </form>
    </div>
  );
}
