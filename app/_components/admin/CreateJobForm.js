"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  BriefcaseIcon,
  TagIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import { InputField } from "../shared";

import { CATEGORY_OPTIONS, JOB_TYPE_OPTIONS, LOCATION } from "../ui/constants";
import { addJob } from "@/app/_lib/actions";
import CustomSelect from "../ui/CustomSelect";

export default function CreateJobForm() {
  const [formData, setFormData] = useState({
    employmentType: "",
    category: "",
    location: "",
  });
  const [state, formAction, isPending] = useActionState(addJob, {});

  useEffect(() => {
    if (state?.success) toast.success("Added successfully");
    if (state?.formError) toast.error(state.formError);
  }, [state]);

  return (
    <form
      action={formAction}
      className="max-w-5xl mx-auto bg-white  md:p-12 rounded-[2.5rem]  border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <InputField
          label="Jobbtitel"
          name="title"
          icon={IdentificationIcon}
          placeholder="e.g. Senior React Developer"
          error={state?.fieldErrors?.title}
        />
        <InputField
          label="Företagsnamn"
          name="company"
          icon={BuildingOfficeIcon}
          placeholder="e.g. Spotify"
          error={state?.fieldErrors?.company}
        />

        <CustomSelect
          label="Jobbkategori"
          name="category"
          icon={TagIcon}
          options={CATEGORY_OPTIONS}
          value={formData.category}
          onChange={(val) => setFormData({ ...formData, category: val })}
        />
        <CustomSelect
          label="Plats"
          name="location"
          icon={MapPinIcon}
          options={LOCATION}
          value={formData.location}
          onChange={(val) => setFormData({ ...formData, location: val })}
        />

        <CustomSelect
          label="Anställningstyp"
          name="employmentType"
          icon={BriefcaseIcon}
          options={JOB_TYPE_OPTIONS}
          value={formData.employmentType}
          onChange={(val) => setFormData({ ...formData, employmentType: val })}
        />
        <InputField
          label="Varaktighet"
          name="duration"
          icon={ClockIcon}
          placeholder="e.g. 6 Months or Permanent"
          error={state?.fieldErrors?.duration}
        />

        <InputField
          label="Lön"
          name="salary"
          icon={CurrencyDollarIcon}
          placeholder="e.g. 45,000 SEK"
          error={state?.fieldErrors?.salary}
        />
        <InputField
          label="Sista ansökningsdag"
          name="application_deadline"
          icon={CalendarIcon}
          type="date"
          error={state?.fieldErrors?.application_deadline}
        />

        <div className="md:col-span-2">
          <InputField
            label="Fullständig adress"
            name="address"
            icon={MapPinIcon}
            placeholder="Street, City, Postal Code"
            error={state?.fieldErrors?.address}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2 whitespace-pre-wrap wrap-break-word">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
            <PencilSquareIcon className="h-3.5 w-3.5 stroke-[3px]" />
            Beskrivning
          </label>
          <textarea
            name="description"
            placeholder="Beskriv rollen och arbetsuppgifterna..."
            className="w-full wrap-break-word min-h-50 px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#2ecc91]/20 focus:bg-white rounded-2xl outline-none transition-all shadow-sm text-sm font-bold text-gray-700 placeholder:text-gray-400 resize-y"
          />
          {state?.fieldErrors?.description && (
            <p className="text-red-500 text-xs mt-1 ml-2 font-bold italic">
              * {state.fieldErrors.description[0]}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2">
            Företagslogotyp / Bild
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-bold file:bg-[#2ecc91]/10 file:text-[#2ecc91] hover:file:bg-[#2ecc91]/20 cursor-pointer transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-12 pt-8 border-t border-gray-50">
        <button
          type="reset"
          className="cursor-pointer text-sm px-6 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-all"
        >
          Återställa
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer text-sm bg-[#2ecc91] hover:bg-[#2ecc91]/90 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#2ecc91]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending ? "Skapar möjligheter..." : "Skapa jobbannons"}
        </button>
      </div>
    </form>
  );
}
