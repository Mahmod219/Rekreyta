"use client";

import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button onClick={() => signOut()}>
      <ArrowLeftStartOnRectangleIcon className="h-8 w-8 text-primary-800 font-semibold  hover:text-secondery-100" />
    </button>
  );
}
