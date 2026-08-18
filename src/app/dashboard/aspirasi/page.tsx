import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { redirect } from "next/navigation";
import AspirasiClient from "./AspirasiClient";

export default async function AspirasiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }> | { q?: string; page?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const resolvedParams = await searchParams;
  
  const q = resolvedParams.q || "";
  const page = parseInt(resolvedParams.page || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  // Build query
  let countQuery = "SELECT COUNT(*) as total FROM aspirasi WHERE user_id = ?";
  let dataQuery = "SELECT * FROM aspirasi WHERE user_id = ?";
  const params: any[] = [userId];

  if (q) {
    countQuery += " AND judul LIKE ?";
    dataQuery += " AND judul LIKE ?";
    params.push(`%${q}%`);
  }

  dataQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const dataParams = [...params, limit, offset];

  const [countRows] = await pool.execute(countQuery, params);
  const totalItems = (countRows as any[])[0].total;
  const totalPages = Math.ceil(totalItems / limit);

  const [dataRows] = await pool.execute(dataQuery, dataParams);
  const data = dataRows as any[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Aspirasi Warga</h1>
        <p className="text-sm text-slate-500 mt-1">Sampaikan masukan, keluhan, atau saran Anda di sini.</p>
      </div>

      <AspirasiClient 
        data={data} 
        totalPages={totalPages} 
        currentPage={page} 
        searchQuery={q} 
      />
    </div>
  );
}
