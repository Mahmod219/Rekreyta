import { createClient } from "@supabase/supabase-js";

// التحقق من وجود القيم لضمان عدم حدوث أخطاء مفاجئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. العميل العام (للمتصفح والعمليات العادية التي تخضع للـ RLS)
// هذا العميل آمن للاستخدام في أي مكان (Client/Server)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. العميل "الخارق" (للعمليات الإدارية فقط)
// أضفنا فحصاً بسيطاً للتأكد من أنه لا يعمل إلا على السيرفر
export const getSupabaseAdmin = () => {
  if (typeof window !== "undefined") {
    throw new Error("خطأ أمني: لا تحاول استخدام مفتاح الـ Admin في المتصفح!");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
export function getSupabaseWithAuth(session) {
  if (!session?.supabaseAccessToken) {
    throw new Error("No Supabase access token");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${session.supabaseAccessToken}`,
        },
      },
    },
  );
}
