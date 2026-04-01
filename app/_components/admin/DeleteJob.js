"use client";
import { useActionState, useEffect } from "react";

import { toast } from "sonner";
import { deleteJob } from "app/_lib/actions";
import { Modal } from "../shared";

export default function DeleteJob({ jobOffer }) {
  const { id } = jobOffer;

  const [deleteState, deleteAction, isDeleting] = useActionState(deleteJob, {});

  useEffect(() => {
    if (deleteState?.success) {
      toast.success("deleted successfully");
    }
    if (deleteState?.formError) {
      toast.error(deleteState.formError);
    }
  }, [deleteState]);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-4 text-lg font-semibold">Delete Job</h2>
      <p className="mb-4 text-lg text-primary-700">
        Are you sure you want to delete this job offer? This action cannot be
        undone.
      </p>
      <form action={deleteAction}>
        <input type="hidden" name="jobofferId" value={id} />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 hover:bg-secondery-50/80 text-white px-6 py-3 rounded-2xl font-bold  bg-secondery-50 transition-all group-hover:shadow-lg active:scale-95 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <Modal.Close>
            <button
              type="button"
              className="flex items-center justify-center gap-2 hover:bg-[#2d2e3e]/80 text-white px-6 py-3 rounded-2xl font-bold  bg-[#2d2e3e] transition-all group-hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
          </Modal.Close>
        </div>
      </form>
    </div>
  );
}
