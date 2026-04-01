"use client";

import { transition, useTransition } from "react";
import { markNotificationAsRead } from "@/app/_lib/actions";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function MarkReadButton({ id }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await markNotificationAsRead(id);
        });
      }}
      className={`text-[11px] font-black uppercase flex items-center gap-1 transition-colors ${
        isPending ? "text-gray-300" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <CheckBadgeIcon
        className={`h-3 w-3 ${isPending ? "animate-pulse" : ""}`}
      />
      {isPending ? "Uppdaterar..." : "Markera som läst"}
    </button>
  );
}
