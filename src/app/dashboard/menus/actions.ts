"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveMenu(formData: FormData) {
  const id = formData.get("id");
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const icon = formData.get("icon") as string;
  const parent_id = formData.get("parent_id") ? parseInt(formData.get("parent_id") as string) : null;
  const order_num = parseInt(formData.get("order_num") as string) || 0;
  const access_role = formData.get("access_role") as string;

  if (id) {
    // Update
    await pool.execute(
      'UPDATE menus SET name=?, url=?, icon=?, parent_id=?, order_num=?, access_role=? WHERE id=?',
      [name, url, icon, parent_id, order_num, access_role, id]
    );
  } else {
    // Insert
    await pool.execute(
      'INSERT INTO menus (name, url, icon, parent_id, order_num, access_role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, url, icon, parent_id, order_num, access_role]
    );
  }

  revalidatePath('/dashboard/menus');
  revalidatePath('/dashboard'); // revalidate sidebar
}

export async function deleteMenu(formData: FormData) {
  const id = formData.get("menuId");
  if (id) {
    await pool.execute('DELETE FROM menus WHERE id=?', [id]);
    revalidatePath('/dashboard/menus');
    revalidatePath('/dashboard');
  }
}
