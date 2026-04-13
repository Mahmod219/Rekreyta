"use client";

import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className=" " onClick={() => signOut()}>
      <ArrowLeftStartOnRectangleIcon className="h-8 w-8 text-gray-600 font-semibold  hover:text-secondery-100" />
    </button>
  );
}
