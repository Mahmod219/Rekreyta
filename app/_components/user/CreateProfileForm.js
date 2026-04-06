"use client";

import {
  BriefcaseIcon,
  DocumentArrowUpIcon,
  MapPinIcon,
  UserIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { deleteFile, profileInfo } from "@/app/_lib/actions";
import SubmitButton from "../ui/SubmitButton";

export default function CreateProfileForm({ account, userEmail }) {
  const router = useRouter();
  const {
    firstname,
    lastname,
    phone,
    address,
    zipcode,
    city,
    coverletter,
    cv_url,
    another_url,
    updated_at,
  } = account;

  const [state, formAction] = useActionState(profileInfo, null);
  const [isDeleting, setIsDeleting] = useState({ cv: false, another: false });

  useEffect(() => {
    if (state?.success) {
      toast.success("Account info updated successfully");
    }
    if (state?.formError) {
      toast.error(state.formError);
    }
  }, [state]);

  const handleDelete = async (type) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${type === "cv" ? "CV" : "file"}?`,
      )
    )
      return;

    setIsDeleting((prev) => ({ ...prev, [type]: true }));
    const res = await deleteFile(type);

    if (res?.success) {
      toast.success("File deleted successfully");
      router.refresh();
    } else {
      toast.error("Failed to delete file");
    }
    setIsDeleting((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <form action={formAction} className="max-w-4xl mx-auto space-y-6  ">
      {/* 🕒 Last Updated Header */}
      {updated_at && (
        <div className="flex items-center justify-end gap-2 text-sm text-gray-400 italic">
          <ClockIcon className="h-4 w-4" />
          <span>
            Senast uppdaterad:{" "}
            {new Date(updated_at).toLocaleDateString("en-GB")}
          </span>
        </div>
      )}

      {/* 1. Personal Information */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
          <UserIcon className="h-6 w-6 text-primary-300" />
          <h3 className="text-xl font-bold text-[#2d2e3e]">
            Personlig information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Förnamn</label>
            <input
              name="firstname"
              type="text"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary-300 outline-none transition-all"
              placeholder="Förnamn"
              defaultValue={firstname}
            />
            {state?.fieldErrors?.firstname && (
              <p className="text-red-500 text-sm">
                {state.fieldErrors.firstname[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Efternamn</label>
            <input
              name="lastname"
              type="text"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary-300 outline-none transition-all"
              placeholder="Efternamn"
              defaultValue={lastname}
            />
            {state?.fieldErrors?.lastname && (
              <p className="text-red-500 text-sm">
                {state.fieldErrors.lastname[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">
              E-postadress
            </label>
            <input
              name="email"
              type="email"
              readOnly
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
              defaultValue={userEmail}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">
              Telefonnummer
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary-300 outline-none transition-all"
              placeholder="Telefonnummer"
              defaultValue={phone}
            />
            {state?.fieldErrors?.phone && (
              <p className="text-red-500 text-sm">
                {state.fieldErrors.phone[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Address & Location */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
          <MapPinIcon className="h-6 w-6 text-primary-300" />
          <h3 className="text-xl font-bold text-[#2d2e3e]">Adressuppgifter</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-600">
              Gatuadress
            </label>
            <input
              name="address"
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary-300 outline-none transition-all"
              placeholder="Adress"
              defaultValue={address}
            />
            {state?.fieldErrors?.address && (
              <p className="text-red-500 text-sm">
                {state.fieldErrors.address[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">
              Postnummer
            </label>
            <input
              name="zipcode"
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary-300 outline-none transition-all"
              placeholder="Postnummer"
              defaultValue={zipcode}
            />
            {state?.fieldErrors?.zipcode && (
              <p className="text-red-500 text-sm">
                {state.fieldErrors.zipcode[0]}
              </p>
            )}
          </div>
          <div className="md:col-span-3 space-y-2">
            <label className="text-sm font-bold text-gray-600">Stad</label>
            <input
              name="city"
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary-300 outline-none transition-all"
              placeholder="Stad"
              defaultValue={city}
            />
            {state?.fieldErrors?.city && (
              <p className="text-red-500 text-sm">
                {state.fieldErrors.city[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Documents & Preview Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
          <DocumentArrowUpIcon className="h-6 w-6 text-primary-300" />
          <h3 className="text-xl font-bold text-[#2d2e3e]">
            Dokument och portfölj
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CV Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-600">
                CV (PDF)
              </label>
              {cv_url && (
                <div className="flex items-center gap-3">
                  <a
                    href={cv_url}
                    target="_blank"
                    className="flex items-center gap-1 text-xs font-bold text-primary-300 hover:underline"
                  >
                    <EyeIcon className="h-4 w-4" /> Se
                  </a>
                  <button
                    type="button"
                    disabled={isDeleting.cv}
                    onClick={() => handleDelete("cv")}
                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />{" "}
                    {isDeleting.cv ? "..." : "Radera"}
                  </button>
                </div>
              )}
            </div>
            <div className="group relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary-300 transition-colors bg-gray-50/30">
              <input
                type="file"
                name="cv"
                id="cv-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                disabled={cv_url}
              />
              <label
                htmlFor="cv-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <BriefcaseIcon className="h-10 w-10 text-gray-300 group-hover:text-primary-300 transition-colors" />
                <span className="text-sm font-medium text-gray-500">
                  {cv_url ? "Ersätt nuvarande CV" : "Ladda upp CV"}
                </span>
              </label>
            </div>
          </div>

          {/* Another File Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-600">
                portfölj / Annan
              </label>
              {another_url && (
                <div className="flex items-center gap-3">
                  <a
                    href={another_url}
                    target="_blank"
                    className="flex items-center gap-1 text-xs font-bold text-primary-300 hover:underline"
                  >
                    <EyeIcon className="h-4 w-4" /> Se
                  </a>
                  <button
                    type="button"
                    disabled={isDeleting.another}
                    onClick={() => handleDelete("another")}
                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />{" "}
                    {isDeleting.another ? "..." : "Radera"}
                  </button>
                </div>
              )}
            </div>
            <div className="group relative border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary-300 transition-colors bg-gray-50/30">
              <input
                type="file"
                name="another"
                id="cl-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                disabled={another_url}
              />
              <label
                htmlFor="cl-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <DocumentArrowUpIcon className="h-10 w-10 text-gray-300 group-hover:text-primary-300 transition-colors" />
                <span className="text-sm font-medium text-gray-500">
                  {another_url ? "Ersätt portfölj" : "Ladda upp portfölj"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Cover Letter Area */}
        <div className="space-y-2 mt-6">
          <label className="text-sm font-bold text-gray-600">
            Personligt brev
          </label>
          <textarea
            name="coverletter"
            rows="4"
            className="w-full wrap-break-word bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary-300 outline-none transition-all resize-none"
            placeholder="Presentera dig själv..."
            defaultValue={coverletter}
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <SubmitButton text="Spara" pendingText="Sparar..." />
      </div>
    </form>
  );
}
