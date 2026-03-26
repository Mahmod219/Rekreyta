import { authConfig, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const firstName = session.user.name.split(" ").at(0);
  return (
    <div>
      <h2 className="font-semibold text-2xl  mb-7">Welcome, {firstName}</h2>
    </div>
  );
}
