"use client";

import { deleteAllNotifications } from "@/app/_lib/actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTransition } from "react";

export default function RemoveNotifications({ id }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteAllNotifications(id);
        });
      }}
      className={`text-[11px] font-black uppercase flex items-center gap-1 transition-colors ${
        isPending ? "text-gray-300" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <TrashIcon className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
      {isPending ? "Uppdaterar..." : "Rensa alla aviseringar"}
    </button>
  );
}
