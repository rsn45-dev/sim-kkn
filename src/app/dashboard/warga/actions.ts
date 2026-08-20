"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateWarga(formData: FormData) {
  const id = formData.get("id");
  const fullName = formData.get("full_name") as string;
  const gender = formData.get("gender") as string;
  const dob = formData.get("dob") as string;
  const address = formData.get("address") as string;
  const jobStatus = formData.get("job_status") as string;
  const maritalStatus = formData.get("marital_status") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (id) {
    await pool.execute(
      'UPDATE users SET full_name=?, gender=?, dob=?, address=?, job_status=?, marital_status=?, phone=?, email=? WHERE id=?',
      [fullName, gender, dob, address, jobStatus, maritalStatus, phone, email, id]
    );
    revalidatePath('/dashboard/warga');
  }
}

export async function deleteWarga(formData: FormData) {
  const id = formData.get("id");
  if (id) {
    await pool.execute('DELETE FROM child_health WHERE user_id=?', [id]);
    await pool.execute('DELETE FROM children WHERE user_id=?', [id]);
    await pool.execute('DELETE FROM spouses WHERE user_id=?', [id]);
    await pool.execute('DELETE FROM users WHERE id=?', [id]);
    revalidatePath('/dashboard/warga');
  }
}

export async function approveWarga(formData: FormData) {
  const id = formData.get("id");
  if (id) {
    await pool.execute('UPDATE users SET status="approved", rejection_reason=NULL WHERE id=?', [id]);
    revalidatePath('/dashboard/warga');
  }
}

export async function rejectWarga(formData: FormData) {
  const id = formData.get("id");
  const reason = formData.get("reason") as string;
  if (id && reason) {
    await pool.execute('UPDATE users SET status="rejected", rejection_reason=? WHERE id=?', [reason, id]);
    revalidatePath('/dashboard/warga');
  }
}

export async function inputWargaAdmin(formData: FormData) {
  const fullName = formData.get("full_name") as string;
  const gender = formData.get("gender") as string;
  const dob = formData.get("dob") as string;
  const address = formData.get("address") as string;
  const jobStatus = formData.get("job_status") as string;
  const maritalStatus = formData.get("marital_status") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.execute(
      `INSERT INTO users 
      (full_name, gender, dob, address, job_status, marital_status, phone, email, password, role, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, gender, dob, address, jobStatus, maritalStatus, phone, email, hashedPassword, 'user', 'approved']
    );
    revalidatePath('/dashboard/warga');
  } catch (error) {
    console.error("Failed to insert warga:", error);
    throw new Error("Failed to input data warga");
  }
}
