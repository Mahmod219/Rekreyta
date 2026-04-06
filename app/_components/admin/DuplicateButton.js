"use client";
import React, { useActionState, useEffect } from "react";
import { Modal } from "../shared";
import { duplicateData } from "@/app/_lib/actions";
import { toast } from "sonner";

export default function DuplicateButton({ jobOffer }) {
  const { id } = jobOffer;
  const [duplicateState, actionState, isDuplicating] = useActionState(
    duplicateData,
    {},
  );

  useEffect(() => {
    if (duplicateState?.success) {
      toast.success("Annonsen har kopierats!");
    }
    if (duplicateState?.formError) {
      toast.error(duplicateState.formError); // تأكد من استخدام المفتاح الصحيح formError
    }
  }, [duplicateState]);

  return (
    <div className="flex flex-col gap-3 text-left">
      <h2 className="mb-4 text-xl font-black text-gray-900 uppercase tracking-tight">
        Kopiera annons
      </h2>
      <p className="mb-6 text-lg text-gray-600">
        Är du säker på Vill du kopiera den här annonsen? En duplikat kommer att
        skapas.
      </p>

      {/* منع الفورم من إرسال إشارة إغلاق للدروب داون الأب */}
      <form action={actionState} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="jobofferId" value={id || ""} />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isDuplicating}
            // منع الضغطة من الوصول للدروب داون
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2ecc91] hover:bg-[#26a676] text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isDuplicating ? "Kopierar..." : "Ja, kopiera"}
          </button>

          <Modal.Close>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-[#2d2e3e] text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 cursor-pointer"
            >
              Avbryt
            </button>
          </Modal.Close>
        </div>
      </form>
    </div>
  );
}
