import {
  BriefcaseIcon,
  InformationCircleIcon,
  PhoneIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authConfig } from "../api/auth/[...nextauth]/route";
import { SignOutButton } from "./SignOutButton";
import MobileMenu from "./MobileMenu"; // استيراد المكون الجديد

export default async function Navigation() {
  const session = await getServerSession(authConfig);

  const navLinks = [
    {
      href: "/jobs",
      label: "Find a job",
      icon: <BriefcaseIcon className="h-5 w-5" />,
    },
    {
      href: "/employers",
      label: "For Employers",
      icon: <UserGroupIcon className="h-5 w-5" />,
    },
    {
      href: "/contact",
      label: "Contact Us",
      icon: <PhoneIcon className="h-5 w-5" />,
    },
    {
      href: "/about",
      label: "About",
      icon: <InformationCircleIcon className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="flex items-center gap-4 lg:gap-10">
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
      <div className="flex items-center">
        {session?.user ? (
          <div className="flex items-center gap-3">
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
            <div className="scale-75 lg:scale-90">
              <SignOutButton />
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="group flex items-center gap-2 bg-[#2ecc91] text-white px-4 py-2 lg:px-5 lg:py-2.5 rounded-full font-semibold hover:bg-[#28b681] transition-all shadow-md"
          >
            <UserCircleIcon className="h-5 w-5" />
            <span className="text-sm lg:text-base">Login</span>
          </Link>
        )}
      </div>

      {/* 3. برغر منيو للموبايل */}
      <MobileMenu navLinks={navLinks} />
    </nav>
  );
}
