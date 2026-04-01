import { authConfig } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

import { getAccountInfo } from "@/app/_lib/data-service";
import { ApplyJobButton } from "../ui";

export default async function ApplyJob({ jobId }) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;

  const accountInfo = (await getAccountInfo(userId)) || [];

  return (
    <div>
      <ApplyJobButton jobId={jobId} accountInfo={accountInfo} />
    </div>
  );
}
