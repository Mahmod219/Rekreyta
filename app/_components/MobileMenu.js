"use client";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function MobileMenu({ navLinks }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* زر البرغر */}
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
        {isOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <Bars3Icon className="h-7 w-7" />
        )}
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className=" absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 shadow-xl flex flex-col gap-4 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex gap-1.5 items-center text-gray-600 font-medium text-lg hover:text-[#2ecc91]"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
