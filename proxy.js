import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// يجب أن يكون اسم الفانكشن middleware ليعمل المحرك بشكل مستقر
export async function proxy(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 1. حماية صفحات الأدمن
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. حماية صفحة الحساب (Account)
  if (pathname.startsWith("/account")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. منع المسجلين من دخول صفحة اللوجن مرة أخرى
  if (pathname === "/login" && token) {
    const target = token.role === "admin" ? "/admin" : "/jobs";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

// الـ matcher يجب أن يكون محدداً جداً لمنع الـ Loops
export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/login",
    // حذفنا سطر الـ "Catch-all" العشوائي الذي كان يسبب الحلقات اللانهائية
  ],
};
