"use client";
import { useState } from "react";

export default function TagInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = input.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        Färdigheter / Tags (Tryck Enter)
      </label>
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 min-h-[45px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-[#2ecc91] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-200"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="t.ex. React, Excel, Ledarskap..."
          className="flex-1 bg-transparent outline-none text-sm min-w-[120px]"
        />
      </div>
    </div>
  );
}
