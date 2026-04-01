"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // قمنا بإضافة التوجيه لـ /account بعد النجاح
      await signIn("google", { callbackUrl: "/account" });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`flex items-center gap-6 text-lg border border-primary-800 rounded-2xl px-10 py-4 font-medium transition-all ${
        isLoading
          ? "opacity-50 cursor-not-allowed bg-gray-50"
          : "cursor-pointer hover:bg-gray-50"
      }`}
    >
      <img
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google logo"
        height="24"
        width="24"
      />
      <span>{isLoading ? "Connecting..." : "Continue with Google"}</span>
    </button>
  );
}

export default SignInButton;
