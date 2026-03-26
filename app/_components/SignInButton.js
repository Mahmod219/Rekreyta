"use client";

import { signIn } from "next-auth/react";

function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/account" })}
      className="flex items-center gap-6 text-lg border border-primary-800 rounded-2xl cursor-pointer px-10 py-4 font-medium"
    >
      <img
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google logo"
        height="24"
        width="24"
      />
      <span>Continue with Google</span>
    </button>
  );
}

export default SignInButton;
