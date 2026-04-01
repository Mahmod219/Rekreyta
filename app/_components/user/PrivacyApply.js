import Link from "next/link";
import React from "react";

export default function PrivacyApply() {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-[#2ecc91]/20 transition-all cursor-pointer">
      <div className="flex items-center h-6">
        <input
          id="privacy-policy"
          name="privacy-policy"
          type="checkbox"
          required
          className="h-5 w-5 rounded border-gray-300 text-[#2ecc91] focus:ring-[#2ecc91] cursor-pointer accent-[#2ecc91]"
        />
      </div>
      <div className="text-sm leading-6">
        <label
          htmlFor="privacy-policy"
          className="font-medium text-gray-700 cursor-pointer select-none"
        >
          Jag godkänner att Rekreyta behandlar mina uppgifter
        </label>
        <p className="text-gray-500">
          Genom att skicka in min ansökan bekräftar jag att jag har läst och
          förstått{" "}
          <Link
            href="/privacy"
            className="text-[#2ecc91] font-bold hover:underline transition-all"
          >
            integritetspolicyn
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
