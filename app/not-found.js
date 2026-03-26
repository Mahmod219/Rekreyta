import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>This page could not be found :(</h1>
      <Link href="/">Go back home</Link>
    </main>
  );
}
