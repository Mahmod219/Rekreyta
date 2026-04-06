"use client";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  HeartIcon,
  InformationCircleIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SignOutButton } from "../shared/SignOutButton";
import MobileMenu from "./MobileMenu";
import NotificationsBell from "./NotificationsBell";

export default function Navigation({ savedJobs }) {
  const { data: session } = useSession();
  const navLinks = [
    {
      href: "/jobs",
      label: "Hitta jobb",
      icon: <BriefcaseIcon className="h-6 w-6" />,
    },
    {
      href: "/employers",
      label: "För företag",
      icon: <BuildingOfficeIcon className="h-6 w-6" />,
    },
    {
      href: "/contact",
      label: "Kontakt",
      icon: <PhoneIcon className="h-6 w-6" />,
    },
    {
      href: "/about",
      label: "Om oss",
      icon: <InformationCircleIcon className="h-6 w-6" />,
    },
  ];

  return (
    <nav className="flex items-center gap-4 lg:gap-8">
      {/* 1. القائمة لنسخة الـ Desktop */}
      <ul className="hidden lg:flex gap-10 items-center">
        {navLinks.map((link) => (
          <li key={link.href} className="relative group">
            <Link
              href={link.href}
              className="flex gap-1.5 text-gray-600 font-medium transition-colors hover:text-[#2ecc91] text-[17px]"
            >
              {link.icon}
              {link.label}
            </Link>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2ecc91] transition-all duration-300 group-hover:w-full"></span>
          </li>
        ))}
      </ul>

      {/* 2. قسم المستخدم (يظهر دائماً في الـ Desktop والـ Mobile) */}
      <div className=" flex items-center">
        {session?.user ? (
          <div className="flex items-center gap-1">
            <NotificationsBell userId={session.user.id ?? null} />

            {savedJobs?.length > 0 && (
              <Link
                href="/account/savedjobs"
                className="relative p-2 text-gray-500 hover:text-[#2ecc91] transition-colors"
              >
                <HeartIcon className="h-7 w-7 lg:h-8 lg:w-8" />
                {/* دائرة صغيرة توضح العدد */}
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {savedJobs.length}
                </span>
              </Link>
            )}

            <Link
              href="/account"
              className="flex items-center gap-2 bg-gray-50 p-1 lg:pr-4 rounded-full border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <img
                className="h-8 w-8 lg:h-9 lg:w-9 rounded-full object-cover border-2 border-white shadow-sm"
                src={session.user.image}
                alt={session.user.name}
              />
              <span className="hidden lg:block text-sm font-bold text-gray-800">
                {session.user.name.split(" ").at(0)}
              </span>
            </Link>
            <div className="hidden lg:flex scale-75 lg:scale-90">
              <SignOutButton />
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="group flex items-center gap-2 bg-[#2ecc91] text-white px-4 py-2 lg:px-5 lg:py-2.5 rounded-full font-semibold hover:bg-[#28b681] transition-all shadow-md"
          >
            <UserCircleIcon className="h-5 w-5" />
            <span className="hidden lg:inline text-sm lg:text-base">
              Logga in
            </span>
          </Link>
        )}
      </div>

      {/* 3. برغر منيو للموبايل */}
      <MobileMenu navLinks={navLinks} session={session} />
    </nav>
  );
}
