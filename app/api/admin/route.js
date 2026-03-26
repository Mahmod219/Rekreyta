import { getServerSession } from "next-auth";

export async function POST() {
  const session = await getServerSession(authConfig);

  if (!session || session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response("OK");
}
