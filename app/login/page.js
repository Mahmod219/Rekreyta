import Image from "next/image";

import signin from "@/public/signin.jpg";
import { SignInButton } from "../_components/shared";
import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "login",
};

export default async function Page() {
  const session = await getServerSession(authConfig);
  const userRole = session?.user?.role;
  return (
    <div className="flex flex-col items-center">
      {/* Background Image */}
      <div className="relative w-full aspect-16/6">
        <Image
          src={signin}
          alt="Rekryta jobbplattform kopplar samman företag med talanger"
          fill
          priority
          placeholder="blur"
          quality={90}
          className="object-cover object-top"
        />
      </div>

      <div className="relative -mt-24 w-full max-w-2xl px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-10 text-center">
          <h2 className="lg:text-2xl text-primary-900 font-semibold leading-relaxed mb-8">
            Logga in och låt din erfarenhet koppla dig till rätt
            jobbmöjligheter.
          </h2>

          <div className="flex justify-center">
            <SignInButton userRole={userRole} />
          </div>
        </div>
      </div>
    </div>
  );
}
