"use client";

import { savedJob } from "@/app/_lib/actions";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"; // استيراد القلب الممتلئ
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SaveJobButton({ jobId, initialSaved }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  async function handleSave(e) {
    e.stopPropagation();
    if (isLoading) return;

    // متفائلين (Optimistic UI): نغير اللون فوراً قبل انتظار السيرفر
    const previousState = isSaved;
    setIsSaved(!previousState);

    try {
      setIsLoading(true);
      const result = await savedJob(jobId);

      if (!previousState) {
        toast.success("Sparad i favoriter!");
      }
    } catch (error) {
      // إذا فشل السيرفر، نعيد الحالة لما كانت عليه
      setIsSaved(previousState);
      toast.error("Kunde inte spara jobb");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className="group outline-none focus:scale-110 transition-transform active:scale-95"
      title={isSaved ? "Ta bort" : "Spara"}
    >
      <div className="transition-colors duration-300">
        {isSaved ? (
          // أيقونة القلب الممتلئ عند الحفظ
          <HeartSolid className="h-8 w-8 text-red-500 " />
        ) : (
          // أيقونة القلب المفرغ قبل الحفظ
          <HeartOutline className="h-8 w-8 text-gray-400 group-hover:text-red-400" />
        )}
      </div>
    </button>
  );
}
