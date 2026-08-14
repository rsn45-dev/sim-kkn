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

export async function addChildHealth(formData: FormData) {
  const session = await auth();
  if (!session?.user) return;
  const userId = (session.user as any).id;

  const childId = formData.get("child_id");
  const measurementDate = formData.get("measurement_date") as string;
  const weightKg = formData.get("weight_kg") as string;
  const heightCm = formData.get("height_cm") as string;
  const notes = formData.get("notes") as string;

  await pool.execute(
    'INSERT INTO child_health (child_id, user_id, measurement_date, weight_kg, height_cm, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [childId, userId, measurementDate, weightKg, heightCm, notes || null]
  );

  revalidatePath('/dashboard/profile');
}

export async function deleteChildHealth(formData: FormData) {
  const id = formData.get("id");
  if (id) {
    await pool.execute('DELETE FROM child_health WHERE id=?', [id]);
    revalidatePath('/dashboard/profile');
  }
}
