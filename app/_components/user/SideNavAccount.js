"use client";
import { DocumentDuplicateIcon, UserIcon } from "@heroicons/react/24/outline";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Profile",
    href: "/account/info",
    icon: <UserIcon className="h-5 w-5" />,
  },
  {
    name: "Applications",
    href: "/account/applications",
    icon: <DocumentDuplicateIcon className="h-5 w-5" />,
  },
  { name: "Jobs", href: "/jobs", icon: <BriefcaseIcon className="h-5 w-5" /> },
];

export default function SideNavAccount() {
  const pathname = usePathname();

  return (
    <nav className="bg-white  lg:border-none lg:shadow-sm rounded-2xl overflow-hidden">
      <ul className="flex flex-row lg:flex-col overflow-x-auto no-scrollbar">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name} className="flex-1 min-w-fit">
              <Link
                href={link.href}
                className={`py-4 px-5 flex items-center justify-center lg:justify-start gap-3 font-bold transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "text-[#2ecc91] border-b-2 border-[#2ecc91] lg:border-b-0 lg:border-l-4 lg:bg-green-50"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {link.icon}
                <span className="text-sm lg:text-base">{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
