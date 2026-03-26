"use client";
import {
  AdjustmentsHorizontalIcon,
  BriefcaseIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
  },
  {
    name: "Job offers",
    href: "/admin/joboffers",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: <DocumentDuplicateIcon className="h-5 w-5" />,
  },
];

export default function SideNavAdmin() {
  const pathname = usePathname();

  return (
    <nav className="bg-white  lg:border-none lg:shadow-sm lg:rounded-3xl overflow-hidden sticky top-16 lg:top-0 z-30">
      <ul className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar bg-white">
        {navLinks.map((link) => {
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
