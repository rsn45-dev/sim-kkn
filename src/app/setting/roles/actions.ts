"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveRole(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (name) {
    await pool.execute(
      'INSERT INTO roles (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    revalidatePath('/setting/roles');
  }
}

export async function deleteRole(formData: FormData) {
  const id = formData.get("id");
  if (id) {
    await pool.execute('DELETE FROM roles WHERE id=?', [id]);
    revalidatePath('/setting/roles');
  }
}
