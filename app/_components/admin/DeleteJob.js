"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Modal } from "../shared";
import { deleteJob } from "@/app/_lib/actions";

export default function DeleteJob({ jobOffer }) {
  const { id } = jobOffer;
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteJob, {});

  useEffect(() => {
    if (deleteState?.success) {
      toast.success("Annonsen har raderats");
    }
    if (deleteState?.formError) {
      toast.error(deleteState.formError);
    }
  }, [deleteState]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
        Radera annons
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        Är du säker på att du vill radera denna annons?
        <span className="block font-bold text-red-500 mt-2">
          Denna åtgärd kan inte ångras.
        </span>
      </p>

      {/* منع الـ Form من إغلاق الدروب داون الأب */}
      <form action={deleteAction} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="jobofferId" value={id} />

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isDeleting}
            // أضفنا e.stopPropagation هنا أيضاً للضمان
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? "Raderar..." : "Ja, radera"}
          </button>

          <Modal.Close>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer"
            >
              Avbryt
            </button>
          </Modal.Close>
        </div>
      </form>
    </div>
  );
}
