"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { SignOutButton } from "../shared/SignOutButton";

export default function MobileMenu({ navLinks, session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* زر البرغر */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
        {isOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <Bars3Icon className="h-8 w-8" />
        )}
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className=" absolute  top-full left-0 w-full bg-white border-b border-gray-100 p-6 shadow-xl flex flex-col gap-6 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex gap-2 items-center text-gray-600 font-medium text-xl   hover:text-[#2ecc91] border-b border-gray-300 py-2"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {session?.user?.id && (
            <div className="flex gap-2 mt-50 items-center text-gray-600 font-medium text-xl   hover:text-[#2ecc91] ">
              <SignOutButton /> <span>Logga ut</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
