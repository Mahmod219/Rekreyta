"use client";
import { addStaffMember } from "@/app/_lib/actions";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-[#2ecc91] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#28b481] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {pending ? "Lägger till..." : "Bekräfta inbjudan"}
    </button>
  );
}

export default function TeamForm() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef(null);

  async function clientAction(formData) {
    try {
      const result = await addStaffMember(formData);

      if (result?.success) {
        toast.success("Medarbetare har lagts till!");
        formRef.current?.reset();
        setIsOpen(false); // إغلاق الفورم بعد النجاح
      } else {
        toast.error("Något gick fel.");
      }
    } catch (error) {
      toast.error(error.message || "Ett oväntat fel uppstod.");
    }
  }

  return (
    <div className="w-full">
      {/* زر فتح/إغلاق الفورم */}
      <div className="flex justify-start mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all border ${
            isOpen
              ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              : "bg-white text-[#2ecc91] border-[#2ecc91]/30 hover:bg-[#2ecc91] hover:text-white shadow-sm"
          }`}
        >
          {isOpen ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Avbryt
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Bjuda in medarbetare
            </>
          )}
        </button>
      </div>

      {/* الفورم مع تأثير الظهور */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"}`}
      >
        <form
          ref={formRef}
          action={clientAction}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl"
        >
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              E-postadress
            </label>
            <input
              name="email"
              type="email"
              placeholder="exempel@rekreyta.se"
              className="bg-gray-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-[#2ecc91] outline-none text-sm transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Anställnings-ID
            </label>
            <input
              name="employee_id"
              type="text"
              placeholder="EMP-2024"
              className="bg-gray-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-[#2ecc91] outline-none text-sm transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Välj Roll
            </label>
            <select
              name="role"
              className="bg-gray-50 border-none p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#2ecc91] text-sm appearance-none cursor-pointer"
            >
              <option value="recruiter">Rekryterare</option>
              <option value="interviewer">Intervjuare</option>
              <option value="admin">Extra Admin</option>
            </select>
          </div>

          <div className="flex items-end shadow-sm rounded-xl">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
