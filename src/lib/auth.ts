import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import pool from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const [rows] = await pool.execute(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [credentials.email]
          ) as any[];

          const user = rows[0];

          if (!user) return null;

          // Simple plain text comparison — in production use bcrypt
          if (user.password !== credentials.password) return null;

          return {
            id: String(user.id),
            name: user.full_name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
});
