import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Middleware hanya menggunakan authConfig (TANPA import DB)
// sehingga aman dijalankan di Edge Runtime
// Wajib diekspor sebagai named "middleware"
const { auth } = NextAuth(authConfig);
export { auth as middleware };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
