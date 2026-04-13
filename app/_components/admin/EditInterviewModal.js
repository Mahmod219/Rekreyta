"use client";
import { useState } from "react";
import { updateInterviewDetails, deleteInterview } from "@/app/_lib/actions";
import { XMarkIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function EditInterviewModal({ interview, onClose }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const result = await updateInterviewDetails(formData);
    if (result.success) onClose();
    else toast.error(result.error);
  }

  async function handleDelete() {
    setIsDeleting(true);
    await deleteInterview(interview.id);
    toast.success("Tiden har raderat");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Hantera Intervju
            </h2>
            <p className="text-gray-400 text-xs">Möte med {interview.title}</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          <input type="hidden" name="id" value={interview.id} />
          <input
            type="hidden"
            name="userId"
            value={interview.extendedProps.userId}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                Typ
              </label>
              <select
                name="type"
                defaultValue={interview.extendedProps.type}
                className="w-full border-2 border-gray-100 rounded-2xl p-3 font-bold text-sm outline-none focus:border-[#2ecc91]"
              >
                <option value="online">Online</option>
                <option value="onsite">På plats</option>
                <option value="phone">Telefon</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                Plats / Länk
              </label>
              <input
                name="location"
                type="text"
                defaultValue={interview.extendedProps.location}
                className="w-full border-2 border-gray-100 rounded-2xl p-3 font-medium text-sm outline-none focus:border-[#2ecc91]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
              Anteckningar
            </label>
            <textarea
              name="note"
              rows="3"
              defaultValue={interview.extendedProps.note}
              className="w-full border-2 border-gray-100 rounded-2xl p-3 font-medium text-sm outline-none focus:border-[#2ecc91]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-red-600 border-2 border-red-50 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              {isDeleting ? "Raderar..." : "Radera"}
            </button>

            <button
              type="submit"
              className="flex-2 py-4 rounded-2xl font-black uppercase tracking-widest text-white bg-[#2ecc91] hover:bg-[#28b481] shadow-lg shadow-[#2ecc91]/20 flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-5 h-5" />
              Spara ändringar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
