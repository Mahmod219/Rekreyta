import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";

import Link from "next/link";
import { getAccountInfo } from "../_lib/data-service";
import ApplyJobButton from "./ApplyJobButton";

export default async function ApplyJob({ jobId }) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  const accountInfo = await getAccountInfo(userId);

  return (
    <div>
      <ApplyJobButton jobId={jobId} accountInfo={accountInfo} />
    </div>
  );
}
