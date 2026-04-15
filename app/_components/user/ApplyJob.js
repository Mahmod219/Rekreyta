import { getAccountInfo } from "@/app/_lib/data-service";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import ApplyJobButton from "../ui/ApplyJobButton";

export default async function ApplyJob({ jobId }) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  const accountInfo = (await getAccountInfo(userId)) || [];

  return (
    <div>
      <ApplyJobButton
        jobId={jobId}
        accountInfo={accountInfo}
        userEmail={userEmail}
      />
    </div>
  );
}
