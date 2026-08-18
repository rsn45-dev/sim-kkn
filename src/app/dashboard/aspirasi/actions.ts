"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function saveDraftAspirasi(data: { id?: number, tanggal: string, judul: string, isi: string }) {
  const session = await auth();
  if (!session?.user) return null;
  const userId = (session.user as any).id;

  if (data.id) {
    await pool.execute(
      'UPDATE aspirasi SET tanggal=?, judul=?, isi=? WHERE id=? AND user_id=? AND status="draft"',
      [data.tanggal, data.judul, data.isi, data.id, userId]
    );
    return data.id;
  } else {
    const [result] = await pool.execute(
      'INSERT INTO aspirasi (user_id, tanggal, judul, isi, status) VALUES (?, ?, ?, ?, "draft")',
      [userId, data.tanggal, data.judul, data.isi]
    );
    return (result as any).insertId;
  }
}

export async function sendAspirasi(id: number) {
  const session = await auth();
  if (!session?.user) return;
  const userId = (session.user as any).id;
  
  await pool.execute(
    'UPDATE aspirasi SET status="terkirim" WHERE id=? AND user_id=? AND status="draft"',
    [id, userId]
  );
  revalidatePath('/dashboard/aspirasi');
}

export async function deleteAspirasi(id: number) {
  const session = await auth();
  if (!session?.user) return;
  const userId = (session.user as any).id;
  
  await pool.execute(
    'DELETE FROM aspirasi WHERE id=? AND user_id=? AND status="draft"',
    [id, userId]
  );
  revalidatePath('/dashboard/aspirasi');
}

// Admin Action (for later if needed)
export async function respondAspirasi(id: number, respon: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') return;
  
  await pool.execute(
    'UPDATE aspirasi SET respon=?, status="direspon" WHERE id=?',
    [respon, id]
  );
  revalidatePath('/dashboard/aspirasi');
}
