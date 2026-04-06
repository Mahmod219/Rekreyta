"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  BriefcaseIcon,
  TagIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { InputField } from "../shared";

import { CATEGORY_OPTIONS, JOB_TYPE_OPTIONS, LOCATION } from "../ui/constants";
import { updateJob } from "@/app/_lib/actions";
import CustomSelect from "../ui/CustomSelect";

export default function EditJobForm({ jobOffer }) {
  const {
    id,
    address,
    application_deadline,
    category,
    company,
    description,
    duration,
    employmentType,
    location,
    salary,
    title,
    image_url,
  } = jobOffer;

  const [state, formAction, isPending] = useActionState(updateJob, {});
  const [imagePreview, setImagePreview] = useState(image_url || null);

  // تهيئة الـ State بالقيم القديمة لضمان ظهورها في الـ CustomSelect
  const [formData, setFormData] = useState({
    employmentType: employmentType || "",
    category: category || "",
    location: location || "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // فحص الحجم لتجنب خطأ الـ 1MB الذي واجهته سابقاً
      if (file.size > 1024 * 1024) {
        toast.error("Image is too large. Max 1MB allowed.");
        e.target.value = "";
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (state?.success) toast.success("Updated successfully!");
    if (state?.formError) toast.error(state.formError);
  }, [state]);

  return (
    <form
      action={formAction}
      className="max-w-5xl mx-auto bg-white  rounded-[2.5rem]  "
    >
      <input type="hidden" name="jobofferId" value={id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="sm:col-span-2 flex flex-col gap-4 mb-4 p-6 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
            <PhotoIcon className="h-4 w-4 stroke-[3px]" />
            Jobbbild / Banner
          </label>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-2xl shadow-md border-2 border-white"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-bold file:bg-[#2ecc91]/10 file:text-[#2ecc91] hover:file:bg-[#2ecc91]/20 cursor-pointer"
            />
          </div>
        </div>

        <InputField
          label="Jobbtitel"
          name="title"
          defaultValue={title}
          error={state?.fieldErrors?.title}
        />
        <InputField
          label="Företagsnamn"
          name="company"
          defaultValue={company}
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
          defaultValue={duration}
          error={state?.fieldErrors?.duration}
        />

        <InputField
          label="Lön"
          name="salary"
          defaultValue={salary}
          error={state?.fieldErrors?.salary}
        />
        <InputField
          label="Sista ansökningsdag"
          name="application_deadline"
          type="date"
          defaultValue={application_deadline}
          error={state?.fieldErrors?.application_deadline}
        />

        <div className="md:col-span-2">
          <InputField
            label="Fullständig adress"
            name="address"
            defaultValue={address}
            error={state?.fieldErrors?.address}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
            <PencilSquareIcon className="h-3.5 w-3.5 stroke-[3px]" />
            Beskrivning
          </label>
          <textarea
            name="description"
            defaultValue={description ?? ""}
            className="w-full wrap-break-word min-h-50 px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#2ecc91]/20 focus:bg-white rounded-2xl outline-none transition-all shadow-sm text-sm font-bold text-gray-700 placeholder:text-gray-300"
          />
          {state?.fieldErrors?.description && (
            <p className="text-red-500 text-xs mt-1 ml-2">
              {state.fieldErrors.description[0]}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-12 pt-8 border-t border-gray-50">
        <button
          type="reset"
          className=" cursor-pointer text-sm px-4 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-all"
        >
          Återställ ändringar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer text-sm bg-[#2ecc91] hover:bg-[#2ecc91]/90 text-white px-4 py-4  rounded-2xl font-bold shadow-lg shadow-[#2ecc91]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending ? "Uppdaterar..." : "Spara ändringar"}
        </button>
      </div>
    </form>
  );
}
