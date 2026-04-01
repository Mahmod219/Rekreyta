"use client";
import { useActionState, useEffect } from "react";

import { toast } from "sonner";
import { publishJob } from "app/_lib/actions";
import { useRouter } from "next/navigation";
import { Modal } from "../shared";

export default function PublishButton({ jobOffer }) {
  const { id, published } = jobOffer;
  const actionText = published ? "Unpublish" : "Publish";
  const [publishState, publishAction, isPublishing] = useActionState(
    publishJob,
    {},
  );
  const router = useRouter();
  useEffect(() => {
    if (publishState?.success) {
      toast.success("Updated");
      router.refresh();
    }
    if (publishState?.formError) {
      toast.error(publishState.formError);
    }
  }, [publishState]);
  return (
    <div className="flex flex-col gap-3">
      <h2 className="mb-4 text-lg font-semibold">{actionText} Job</h2>
      <p className="mb-4 text-lg text-gray-600">
        Are you sure you want to {actionText.toLowerCase()} this job offer?
      </p>
      <form action={publishAction}>
        <input type="hidden" name="jobofferId" value={id || ""} />
        <input type="hidden" name="currentStatus" value={String(published)} />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPublishing}
            className="flex items-center justify-center gap-2 hover:bg-[#2d2e3e] text-white px-6 py-3 rounded-2xl font-bold  bg-[#2ecc91] transition-all group-hover:shadow-lg active:scale-95 cursor-pointer"
          >
            {isPublishing ? `${actionText}ing...` : actionText}
          </button>
          <Modal.Close>
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-[#2d2e3e] text-white px-6 py-3 rounded-2xl font-bold  hover:bg-[#2d2e3e]/80 transition-all group-hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
          </Modal.Close>
        </div>
      </form>
    </div>
  );
}
