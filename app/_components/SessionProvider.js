// في ملفك AuthProvider.js (وليس الملف الذي أرسلته)
"use client";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children, session }) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false} // هذا يمنع إعادة الطلب المزعجة التي تسبب Network Error في 404
      refetchInterval={0}
    >
      {children}
    </SessionProvider>
  );
}
