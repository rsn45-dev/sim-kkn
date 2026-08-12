"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  const id = formData.get("id");
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  if (password && password.trim() !== "") {
    // Update role and password
    await pool.execute(
      'UPDATE users SET role=?, password=? WHERE id=?',
      [role, password, id]
    );
  } else {
    // Update role only
    await pool.execute(
      'UPDATE users SET role=? WHERE id=?',
      [role, id]
    );
  }

  revalidatePath('/dashboard/users');
}

export async function resetPassword(formData: FormData) {
  const userId = formData.get("userId");
  if (!userId) return;

  // Reset password to '123456' temporarily for demo purposes
  await pool.execute('UPDATE users SET password = ? WHERE id = ?', ['123456', userId]);
  revalidatePath('/dashboard/users');
}
