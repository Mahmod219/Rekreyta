"use client";
import {
  BookmarkIcon,
  DocumentDuplicateIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    name: "Profil",
    href: "/account/info",
    icon: <UserIcon className="h-5 w-5" />,
  },
  {
    name: "Ansökningar",
    href: "/account/applications",
    icon: <DocumentDuplicateIcon className="h-5 w-5" />,
  },
  {
    name: "Sparade Jobb",
    href: "/account/savedjobs",
    icon: <BookmarkIcon className="h-5 w-5" />,
  },
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
                className={`py-2 px-2 sm:px-5 sm:py-4  flex items-center justify-center lg:justify-start gap-1 sm:gap-3 font-bold transition-all whitespace-nowrap
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
