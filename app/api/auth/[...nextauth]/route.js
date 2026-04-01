import { getSupabaseAdmin } from "@/app/_lib/supabase";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function getSupabaseToken(user) {
  const payload = {
    // aud: "authenticated", // ضروري جداً لتعرف سوبابيس أن المستخدم مسجل دخول
    sub: user.id, // هذا المعرف الذي سيقرأه auth.uid()
    email: user.email,
    app_metadata: {
      role: user.role, // سوبابيس تفضل وجود الأدوار هنا أو في الـ user_metadata
    },
    role: "authenticated", // نوع الدور الأساسي في سوبابيس
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // توقيت الانتهاء (ساعة)
  };

  return jwt.sign(payload, process.env.SUPABASE_JWT_SECRET);
}
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // استدعاء نسخة الآدمن كدالة ()
      const supabaseAdmin = getSupabaseAdmin();

      const { data } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (!data) {
        const { error } = await supabaseAdmin.from("users").insert({
          email: user.email,
          name: user.name,
          image: user.image,
          role: "user",
        });

        if (error) {
          console.error("Supabase insert error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user || token.email) {
        const supabaseAdmin = getSupabaseAdmin();

        const { data } = await supabaseAdmin
          .from("users")
          .select("id, role")
          .eq("email", user?.email || token.email)
          .maybeSingle();

        if (data) {
          token.id = data.id;
          token.role = data.role || "user";

          // 🔥 هون نضيف التوكن
          token.supabaseAccessToken = getSupabaseToken({
            id: data.id,
            email: user?.email || token.email,
            role: data.role,
          });
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;

      // 🔥 مهم جدًا
      session.supabaseAccessToken = token.supabaseAccessToken;

      return session;
    },
  },
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
