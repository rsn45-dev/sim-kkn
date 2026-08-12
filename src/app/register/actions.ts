"use server";

import pool from "@/lib/db";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const gender = formData.get("gender") as string;
  const dob = formData.get("dob") as string;
  const address = formData.get("address") as string;
  const jobStatus = formData.get("jobStatus") as string;
  const maritalStatus = formData.get("maritalStatus") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await pool.execute(
      `INSERT INTO users 
      (full_name, gender, dob, address, job_status, marital_status, phone, email, password, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, gender, dob, address, jobStatus, maritalStatus, phone, email, password, 'user']
    );
  } catch (error) {
    console.error("Failed to register:", error);
    // You could return an error message here, but for simplicity we throw/log
    throw new Error("Failed to register user");
  }

  // Redirect to login or dashboard on success
  redirect("/");
}
