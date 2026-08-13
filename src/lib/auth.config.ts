import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Auth config TANPA database — hanya untuk dipakai di middleware (Edge Runtime)
export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize hanya dijalankan di server, bukan di edge
      authorize: async () => null,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;

      const publicRoutes = ["/", "/register"];
      const isPublic = publicRoutes.includes(nextUrl.pathname);

      // Route admin only
      const adminRoutes = ["/dashboard/users", "/dashboard/menus", "/setting"];
      const isAdminRoute = adminRoutes.some((r) =>
        nextUrl.pathname.startsWith(r)
      );

      if (isPublic) {
        // Kalau sudah login dan ke halaman login, redirect ke dashboard
        if (isLoggedIn && nextUrl.pathname === "/") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isAdminRoute && role !== "admin") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
