"use client";

import { useState } from "react";

export default function TextExpander({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!children) return null;

  // تقسيم النص لكلمات
  const words = children.split(/\s+/);
  const isLong = words.length > 30;

  if (!isLong) return <span>{children}</span>;

  const displayText = isExpanded
    ? children
    : words.slice(0, 30).join(" ") + "...";

  return (
    <span>
      {displayText}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 text-[#2ecc91] font-bold hover:underline cursor-pointer inline-block"
      >
        {isExpanded ? "Visa mindre" : "Visa mer"}
      </button>
    </span>
  );
}
