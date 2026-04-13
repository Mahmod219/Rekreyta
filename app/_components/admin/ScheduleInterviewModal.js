"use client";

import { scheduleInterview } from "@/app/_lib/actions"; // تأكد من المسار
import {
  CalendarIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import sv from "date-fns/locale/sv"; // للغة السويدية
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";

registerLocale("sv", sv);

export default function ScheduleInterviewModal({
  applicationId,
  applicantName,
  onClose,
  jobs,
  profileId,
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { title } = jobs;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    formData.append("applicationId", applicationId);
    formData.append("startTime", startDate.toISOString());
    formData.append("title", title);
    formData.append("profileId", profileId);

    const result = await scheduleInterview(formData);

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
    } else {
      // نجاح الحجز
      onClose();
      toast.success("Intervjun har bokats framgångsrikt!");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Boka Intervju
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Planera möte med {applicantName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-bounce">
              ⚠️ {error}
            </div>
          )}

          {/* Date & Time Picker */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
              Välj Datum & Tid
            </label>
            <div className="relative border-2 border-gray-100 rounded-2xl py-3 px-10 focus-within:border-[#2ecc91] transition-all">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Tid"
                dateFormat="yyyy-MM-dd HH:mm"
                locale="sv"
                className="w-full outline-none font-bold text-gray-700 bg-transparent"
                minDate={new Date()} // لا يسمح بالحجز في الماضي
              />
              <CalendarIcon className="w-5 h-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                Längd (Min)
              </label>
              <select
                name="duration"
                className="w-full border-2 border-gray-100 rounded-2xl p-3 font-bold text-sm outline-none focus:border-[#2ecc91]"
              >
                <option defaultValue="30">30 min</option>

                <option value="60">60 min</option>
              </select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                Typ
              </label>
              <select
                name="type"
                className="w-full border-2 border-gray-100 rounded-2xl p-3 font-bold text-sm outline-none focus:border-[#2ecc91]"
              >
                <option value="online">Online (Video)</option>
                <option value="onsite">På plats</option>
                <option value="phone">Telefon</option>
              </select>
            </div>
          </div>

          {/* Location / Link */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
              Länk eller Plats
            </label>
            <div className="relative">
              <input
                name="location"
                type="text"
                placeholder="Google Meet-länk eller adress..."
                className="w-full border-2 border-gray-100 rounded-2xl p-3 pl-10 font-medium text-sm outline-none focus:border-[#2ecc91]"
              />
              <VideoCameraIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
              Intern Anteckning
            </label>
            <textarea
              name="note"
              rows="2"
              className="w-full border-2 border-gray-100 rounded-2xl p-3 font-medium text-sm outline-none focus:border-[#2ecc91]"
              placeholder="Något du vill komma ihåg inför intervjun..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white transition-all ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#2ecc91] hover:bg-[#28b481] shadow-lg shadow-[#2ecc91]/20"
            }`}
          >
            {loading ? "Bokar..." : "Bekräfta Bokning"}
          </button>
        </form>
      </div>
    </div>
  );
}
