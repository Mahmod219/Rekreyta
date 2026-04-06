"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  text = "Spara ändringar",
  pendingText = "Sparande...",
  className = "",
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-[#2d2e3e] cursor-pointer text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        !pending &&
        "hover:bg-[#2ecc91] active:scale-95 hover:shadow-[#2ecc91]/20"
      } ${className}`}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{pendingText}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}
