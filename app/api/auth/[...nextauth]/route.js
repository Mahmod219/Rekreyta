import { getSupabaseAdmin } from "@/app/_lib/supabase";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function getSupabaseToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    app_metadata: {
      role: user.role,
    },
    role: "authenticated",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
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

      const supabaseAdmin = getSupabaseAdmin();

      // 1. فحص هل الإيميل موجود في جدول الـ team_profiles (دعوة مسبقة من الأدمن)
      const { data: teamInvitation } = await supabaseAdmin
        .from("team_profiles")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      // إذا كان موجوداً في جدول الفريق، نعطيه رول admin، وإلا رول user
      const roleToAssign = teamInvitation ? "admin" : "user";

      // 2. البحث عن المستخدم في جدول users
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      let userId = existingUser?.id;

      if (!existingUser) {
        // إنشاء مستخدم جديد
        const { data: newUser, error: insertError } = await supabaseAdmin
          .from("users")
          .insert({
            email: user.email,
            name: user.name,
            image: user.image,
            role: roleToAssign,
          })
          .select("id")
          .single();

        if (insertError) return false;
        userId = newUser.id;
      } else {
        // إذا كان المستخدم موجوداً أصلاً ولكن تم دعوته للفريق حديثاً، نحدث الرول الخاص به
        if (existingUser.role !== roleToAssign) {
          await supabaseAdmin
            .from("users")
            .update({ role: roleToAssign })
            .eq("id", existingUser.id);
        }
      }

      // 3. 🔥 الربط مع جدول team_profiles
      // إذا كان الموظف مضافاً مسبقاً بالإيميل فقط (id كان null أو عشوائي)، نحدثه بالـ ID الحقيقي
      if (teamInvitation) {
        await supabaseAdmin
          .from("team_profiles")
          .update({ id: userId }) // نربط البروفايل بالـ id الحقيقي من جدول users
          .eq("email", user.email);
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
      session.supabaseAccessToken = token.supabaseAccessToken;
      return session;
    },
  },
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
