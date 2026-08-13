"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginUser(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah. Silakan coba lagi." };
        default:
          return { error: "Terjadi kesalahan. Silakan coba lagi." };
      }
    }
    throw error;
  }
}
