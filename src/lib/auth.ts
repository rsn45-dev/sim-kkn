import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import pool from "@/lib/db";
import { authConfig } from "@/lib/auth.config";

// Full auth dengan DB — hanya dipakai di Server Components & Server Actions
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
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
});
