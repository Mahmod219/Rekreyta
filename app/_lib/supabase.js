import { createClient } from "@supabase/supabase-js";

// التحقق من وجود القيم لضمان عدم حدوث أخطاء مفاجئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. العميل العام (للمتصفح والعمليات العادية التي تخضع للـ RLS)
// هذا العميل آمن للاستخدام في أي مكان (Client/Server)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials are missing. Check your environment variables.",
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

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
  // 1. إذا لم يوجد جلسة أو توكن، لا توقف الكود بـ Error، بل استخدم العميل العادي
  // هذا سيسمح للعمليات بالاستمرار إذا كان الـ RLS معطل
  if (!session?.supabaseAccessToken) {
    console.warn("تنبيه: لا يوجد توكن، سيتم استخدام العميل العام");
    return supabase;
  }

  // 2. إذا وجد التوكن، ننشئ العميل الموثق كما هو
  try {
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
  } catch (err) {
    console.error("فشل إنشاء عميل موثق، العودة للعميل العام");
    return supabase;
  }
}
