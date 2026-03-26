import CreateProfileForm from "@/app/_components/CreateProfileForm";
import { getAccountInfo } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  const account = await getAccountInfo(userId);
  return (
    <div>
      <CreateProfileForm account={account} userEmail={userEmail} />
    </div>
  );
}
