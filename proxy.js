import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// تغيير اسم الفانكشن إلى proxy تماشياً مع التحديث الجديد
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

  // 2. حماية صفحة الحساب (Account) - جديد ✨
  // إذا حاول شخص دخول /account وهو غير مسجل دخول
  if (pathname.startsWith("/account")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // إضافة parameter للعودة لنفس الصفحة بعد تسجيل الدخول
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. منع المسجلين من دخول صفحة اللوجن مرة أخرى
  if (pathname === "/login" && token) {
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/jobs", request.url));
  }

  return NextResponse.next();
}

// تحديث الـ matcher ليشمل المسارات الجديدة
export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/account/:path*", // حماية كل ما يخص الحساب
  ],
};
