"use client";
import { useActionState, useEffect } from "react";

import { publishJob } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import { Modal } from "../shared";
import { toast } from "sonner";

export default function PublishButton({ jobOffer }) {
  const { id, published } = jobOffer;

  // ترجمة النصوص بناءً على الحالة الحالية
  const actionText = published ? "Avpublicera" : "Publicera";
  const confirmMessage = published
    ? "Är du säker på att du vill avpublicera den här annonsen?"
    : "Är du säker på att du vill publicera den här annonsen?";

  const [publishState, publishAction, isPublishing] = useActionState(
    publishJob,
    {},
  );

  const router = useRouter();

  useEffect(() => {
    if (publishState?.success) {
      toast.success("Status uppdaterad!");
      router.refresh();
    }
    if (publishState?.formError) {
      toast.error(publishState.formError);
    }
  }, [publishState, router]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <h2 className="text-xl font-black text-[#2d2e3e] uppercase tracking-tight">
        {actionText} annons
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed">{confirmMessage}</p>

      {/* منع الـ Form من "تطفيش" الدروب داون الأب */}
      <form
        action={publishAction}
        onClick={(e) => e.stopPropagation()} // منع الانتشار عند الضغط على الفورم
      >
        <input type="hidden" name="jobofferId" value={id || ""} />
        <input type="hidden" name="currentStatus" value={String(published)} />

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isPublishing}
            // السطر السحري لمنع إغلاق النافذة
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2ecc91] hover:bg-[#26a676] text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isPublishing ? "Vänta..." : actionText}
          </button>

          <Modal.Close>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#2d2e3e] hover:bg-gray-800 text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              Avbryt
            </button>
          </Modal.Close>
        </div>
      </form>
    </div>
  );
}
