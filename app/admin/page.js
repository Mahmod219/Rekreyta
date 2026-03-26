import { redirect } from "next/navigation";
import { authConfig } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/login");
  }
  return <div>{session.user.name}</div>;
}
