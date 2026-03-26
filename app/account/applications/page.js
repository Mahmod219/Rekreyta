import UserApplicationsList from "@/app/_components/UserApplicationsList";
import { getUserApplications } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");
  const userId = session?.user?.id;
  const applications = (await getUserApplications(userId)) || [];

  return (
    <div className="flex flex-col gap-4 ">
      {applications?.length > 0 ? (
        applications.map((application) => (
          <UserApplicationsList
            application={application}
            key={application.id}
          />
        ))
      ) : (
        <p>No applications yet</p>
      )}
    </div>
  );
}
