import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import { redirect } from "next/navigation";
import LaporanTabs from "./LaporanTabs";

export default async function LaporanPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect("/login");
  }

  // Ambil data warga terdaftar (dari child_health)
  const [registeredRows] = await pool.execute(`
    SELECT ch.id, ch.measurement_date, ch.weight_kg, ch.height_cm, 
           c.full_name as child_name, c.gender, c.dob as child_dob, 
           u.full_name as parent_name
    FROM child_health ch 
    JOIN children c ON ch.child_id = c.id
    JOIN users u ON ch.user_id = u.id
    ORDER BY ch.measurement_date DESC
  `);
  
  // Ambil data warga non-terdaftar (dari guest_health_checks)
  const [guestRows] = await pool.execute(`
    SELECT id, measurement_date, weight_kg, height_cm, child_name, gender, dob as child_dob
    FROM guest_health_checks
    ORDER BY measurement_date DESC
  `);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Pengecekan Kesehatan</h1>
          <p className="text-sm text-slate-500 mt-1">Data rekapitulasi kesehatan anak dari sistem Posyandu.</p>
        </div>
      </div>

      <LaporanTabs 
        registeredData={registeredRows as any[]} 
        guestData={guestRows as any[]} 
      />
    </div>
  );
}
