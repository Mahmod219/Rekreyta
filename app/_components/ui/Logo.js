import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 z-10">
      <Image src={logo} height="120" width="200" alt="Rekreyta" />
    </Link>
  );
}
