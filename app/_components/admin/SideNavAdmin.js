"use client";

import {
  BookmarkIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Översikt",
    href: "/admin",
    icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
  },
  {
    name: "Statistik",
    href: "/admin/dashboard",
    icon: <ChartBarIcon className="h-5 w-5" />,
  },
  {
    name: "Lediga jobb",
    href: "/admin/joboffers",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    name: "Ansökningar",
    href: "/admin/applications",
    icon: <DocumentDuplicateIcon className="h-5 w-5" />,
  },
  {
    name: "Intervjuer",
    href: "/admin/interviews",
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    name: "Kandidatbank",
    href: "/admin/kandidatbank",
    icon: <BookmarkIcon className="h-5 w-5" />,
  },
  {
    name: "Hantera Team", // إدارة الفريق بالسويدي
    href: "/admin/team",
    icon: <UsersIcon className="w-5 h-5" />,
  },
];

export default function SideNavAdmin({ userRole, managedBy }) {
  const pathname = usePathname();
  const isAdminRoot = userRole === "admin" && !managedBy;

  return (
    <nav className="bg-white lg:border-none lg:rounded-3xl overflow-hidden sticky top-16 lg:top-0 z-30 shadow-xl">
      <ul className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar bg-white">
        {navLinks.map((link) => {
          // 🔒 حماية الزر: إذا كان الرابط هو إدارة الفريق والمستخدم مو أدمن رئيسي، لا ترجع شي
          if (link.href === "/admin/team" && !isAdminRoot) return null;

          const isActive = pathname === link.href;
          return (
            <li key={link.name} className="flex-1 min-w-fit">
              <Link
                href={link.href}
                className={`py-4 px-6 flex items-center justify-center lg:justify-start gap-3 font-bold transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "text-[#2ecc91] border-b-2 border-[#2ecc91] lg:border-b-0 lg:border-l-4 lg:bg-green-50"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                <span
                  className={`${isActive ? "text-[#2ecc91]" : "text-gray-400"}`}
                >
                  {link.icon}
                </span>
                <span className="text-sm lg:text-[16px]">{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
