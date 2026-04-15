// app/_components/TeamList.js
"use client";
import { deleteStaffMember } from "@/app/_lib/actions";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function TeamList({ members }) {
  const [isDeleting, setIsDeleting] = useState(null);

  if (members.length === 0) {
    return (
      <div className="p-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
          <svg
            className="w-8 h-8 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Inga medarbetare hittades</p>
        <p className="text-sm text-gray-400">
          Börja med أن تضيف أول موظف لفريقك.
        </p>
      </div>
    );
  }

  async function handleDelete(id) {
    if (!confirm("Är du säker på att du vill ta bort denna medarbetare?"))
      return;

    setIsDeleting(id);
    try {
      await deleteStaffMember(id);
      toast.success("Medarbetaren har tagits bort");
    } catch (err) {
      toast.error("Ett fel uppstod vid borttagning");
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-bold">
            <th className="px-6 py-4">Medarbetare</th>
            <th className="px-6 py-4">Anställnings-ID</th>
            <th className="px-6 py-4">Roll</th>
            <th className="px-6 py-4 text-right">Åtgärder</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {members.map((member) => (
            <tr
              key={member.id}
              className="group hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {/* صورة الموظف أو حرف من اسمه */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-50 flex-shrink-0 border border-gray-100">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-500 font-bold text-xs">
                        {member.email[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {member.name || "Väntar på aktivering"}
                    </div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {member.employee_id}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                  ${
                    member.sub_role === "recruiter"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}
                >
                  {member.sub_role === "recruiter"
                    ? "Rekryterare"
                    : "Intervjuare"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={isDeleting === member.id}
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Ta bort medarbetare"
                >
                  {isDeleting === member.id ? (
                    <span className="text-xs">Tar bort...</span>
                  ) : (
                    <svg
                      className="w-5 h-5 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
