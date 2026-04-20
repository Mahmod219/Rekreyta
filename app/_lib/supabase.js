// في ملف supabase.js القديم
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseWithAuth() {
  // بدلاً من انتظار التوكن من السيشن، سنقرأ الكوكيز مباشرة
  // هذه هي الطريقة الأضمن في نيكست 15
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* تجاهل الخطأ في الـ Server Components */
          }
        },
      },
    },
  );
}
