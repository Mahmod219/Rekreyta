"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { addJob } from "app/_lib/actions";

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
import { CustomSelect } from "../ui";
import { CATEGORY_OPTIONS, JOB_TYPE_OPTIONS, LOCATION } from "../ui/constants";

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
      className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <InputField
          label="Job Title"
          name="title"
          icon={IdentificationIcon}
          placeholder="e.g. Senior React Developer"
          error={state?.fieldErrors?.title}
        />
        <InputField
          label="Company Name"
          name="company"
          icon={BuildingOfficeIcon}
          placeholder="e.g. Spotify"
          error={state?.fieldErrors?.company}
        />

        <CustomSelect
          label="Job Category"
          name="category"
          icon={TagIcon}
          options={CATEGORY_OPTIONS}
          value={formData.category}
          onChange={(val) => setFormData({ ...formData, category: val })}
        />
        <CustomSelect
          label="Location"
          name="location"
          icon={MapPinIcon}
          options={LOCATION}
          value={formData.location}
          onChange={(val) => setFormData({ ...formData, location: val })}
        />

        <CustomSelect
          label="Employment Type"
          name="employmentType"
          icon={BriefcaseIcon}
          options={JOB_TYPE_OPTIONS}
          value={formData.employmentType}
          onChange={(val) => setFormData({ ...formData, employmentType: val })}
        />
        <InputField
          label="Duration"
          name="duration"
          icon={ClockIcon}
          placeholder="e.g. 6 Months or Permanent"
          error={state?.fieldErrors?.duration}
        />

        <InputField
          label="Salary"
          name="salary"
          icon={CurrencyDollarIcon}
          placeholder="e.g. 45,000 SEK"
          error={state?.fieldErrors?.salary}
        />
        <InputField
          label="Application Deadline"
          name="application_deadline"
          icon={CalendarIcon}
          type="date"
          error={state?.fieldErrors?.application_deadline}
        />

        <div className="md:col-span-2">
          <InputField
            label="Full Address"
            name="address"
            icon={MapPinIcon}
            placeholder="Street, City, Postal Code"
            error={state?.fieldErrors?.address}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
            <PencilSquareIcon className="h-3.5 w-3.5 stroke-[3px]" />
            Description
          </label>
          <textarea
            name="description"
            placeholder="Write a detailed job description..."
            className="w-full min-h-50 px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#2ecc91]/20 focus:bg-white rounded-2xl outline-none transition-all shadow-sm text-sm font-bold text-gray-700 placeholder:text-gray-300"
          />
          {state?.fieldErrors?.description && (
            <p className="text-red-500 text-xs mt-1 ml-2 font-bold italic">
              * {state.fieldErrors.description[0]}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 mb-2">
            Company Logo / Image
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
          className="cursor-pointer px-6 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-all"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer bg-[#2ecc91] hover:bg-[#2ecc91]/90 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#2ecc91]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending ? "Creating Opportunity..." : "Create Job Post"}
        </button>
      </div>
    </form>
  );
}
