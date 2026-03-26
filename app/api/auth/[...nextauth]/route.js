import { supabase } from "@/app/_lib/supabase";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

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

      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!data) {
        const { error } = await supabase.from("users").insert({
          email: user.email,
          name: user.name,
          image: user.image,
          role: "user",
        });

        if (error) return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      // يحدث فقط عند تسجيل الدخول
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("id, role")
          .eq("email", user.email)
          .single();

        token.id = data?.id;
        token.role = data?.role ?? "user";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
