import Image from "next/image";
import SignInButton from "../_components/SignInButton";
import signin from "@/public/signin.jpg";

export const metadata = {
  title: "login",
};

export default function Page() {
  return (
    <div className="flex flex-col items-center">
      {/* Background Image */}
      <div className="relative w-full aspect-16/6">
        <Image
          src={signin}
          alt="Rekryta job platform connecting companies with talent"
          fill
          priority
          placeholder="blur"
          quality={90}
          className="object-cover object-top"
        />
      </div>

      <div className="relative -mt-24 w-full max-w-2xl px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-10 text-center">
          <h2 className="text-3xl text-primary-900 font-semibold leading-relaxed mb-8">
            Sign in and let your experience connect you with the right job
            opportunities.
          </h2>

          <div className="flex justify-center">
            <SignInButton />
          </div>
        </div>
      </div>
    </div>
  );
}
