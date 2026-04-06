"use client";

import { ShareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ShareJobButton({ jobTitle, jobId, company }) {
  const [origin, setOrigin] = useState("");

  // نستخدم useEffect لضبط الـ origin بمجرد وصول المكون للمتصفح
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleShare = async () => {
    // بناء الرابط هنا يضمن أننا في المتصفح
    const shareUrl = `${origin}/jobs/${jobId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: jobTitle,
          text: `Kolla in det här jobbet: ${jobTitle} på ${company}!`,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Error sharing:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Länken har kopierats till urklipp!");
      } catch (err) {
        toast.error("Kunde inte kopiera länken.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-gray-400 hover:text-[#2ecc91] transition-all p-2 rounded-xl hover:bg-[#2ecc91]/5"
      title="Dela jobb"
    >
      <ShareIcon className="h-5 w-5" />
      <span className="text-sm font-bold">Dela</span>
    </button>
  );
}
