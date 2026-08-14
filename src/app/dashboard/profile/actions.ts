"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const userId = (session.user as any).id;

  const fullName = formData.get("full_name") as string;
  const gender = formData.get("gender") as string;
  const dob = formData.get("dob") as string;
  const address = formData.get("address") as string;
  const jobStatus = formData.get("job_status") as string;
  const maritalStatus = formData.get("marital_status") as string;
  const phone = formData.get("phone") as string;

  await pool.execute(
    'UPDATE users SET full_name=?, gender=?, dob=?, address=?, job_status=?, marital_status=?, phone=? WHERE id=?',
    [fullName, gender, dob, address, jobStatus, maritalStatus, phone, userId]
  );
  
  revalidatePath('/dashboard/profile');
}

export async function addSpouse(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const userId = (session.user as any).id;

  const fullName = formData.get("full_name") as string;
  const dob = formData.get("dob") as string;
  const isAlive = formData.get("is_alive") === "true";

  await pool.execute(
    'INSERT INTO spouses (user_id, full_name, dob, is_alive) VALUES (?, ?, ?, ?)',
    [userId, fullName, dob, isAlive]
  );

  revalidatePath('/dashboard/profile');
}

export async function deleteSpouse(formData: FormData) {
  const id = formData.get("id");
  if (id) {
    await pool.execute('DELETE FROM spouses WHERE id=?', [id]);
    revalidatePath('/dashboard/profile');
  }
}

export async function addChild(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const userId = (session.user as any).id;

  const fullName = formData.get("full_name") as string;
  const dob = formData.get("dob") as string;
  const jobStatus = formData.get("job_status") as string;
  const gender = formData.get("gender") as string;
  const isAlive = formData.get("is_alive") === "true";

  await pool.execute(
    'INSERT INTO children (user_id, full_name, dob, job_status, gender, is_alive) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, fullName, dob, jobStatus, gender, isAlive]
  );

  revalidatePath('/dashboard/profile');
}

export async function deleteChild(formData: FormData) {
  const id = formData.get("id");
  if (id) {
    await pool.execute('DELETE FROM children WHERE id=?', [id]);
    revalidatePath('/dashboard/profile');
  }
}
