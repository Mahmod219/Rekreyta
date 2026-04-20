import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route"; // تأكد من المسار
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authConfig);

    // التحقق من الجلسة والصلاحيات
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    // إذا وصلت هنا، يعني المستخدم أدمن
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.error("Auth Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
