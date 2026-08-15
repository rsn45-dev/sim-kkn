"use server";

import pool from "@/lib/db";

export async function saveGuestHealthCheck(data: {
  nama: string;
  gender: string;
  tglLahir: string;
  berat: number;
  tinggi: number;
}) {
  try {
    await pool.execute(
      'INSERT INTO guest_health_checks (child_name, gender, dob, weight_kg, height_cm) VALUES (?, ?, ?, ?, ?)',
      [data.nama, data.gender, data.tglLahir, data.berat, data.tinggi]
    );
    return { success: true };
  } catch (error) {
    console.error("Failed to save guest check:", error);
    return { success: false };
  }
}
