import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import ProfileTabs from "@/app/dashboard/profile/ProfileTabs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function WargaProfilePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect("/login");
  }
  
  const targetUserId = params.id;

  // Ambil data user
  const [userRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [targetUserId]);
  const user = (userRows as any[])[0];

  if (!user) {
    redirect("/dashboard/warga");
  }

  // Ambil data suami/istri
  const [spouseRows] = await pool.execute('SELECT * FROM spouses WHERE user_id = ? ORDER BY created_at ASC', [targetUserId]);
  const spouses = spouseRows as any[];

  // Ambil data anak
  const [childRows] = await pool.execute('SELECT * FROM children WHERE user_id = ? ORDER BY created_at ASC', [targetUserId]);
  const children = childRows as any[];

  // Ambil data kesehatan anak
  const [healthRows] = await pool.execute(
    `SELECT ch.*, c.full_name as child_name, c.gender, c.dob as child_dob 
     FROM child_health ch 
     JOIN children c ON ch.child_id = c.id 
     WHERE ch.user_id = ? 
     ORDER BY ch.measurement_date DESC`,
    [targetUserId]
  );
  const childHealthRecords = healthRows as any[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warga" className="text-slate-500 hover:text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Data Diri: {user.full_name}</h1>
        </div>
      </div>

      <ProfileTabs 
        user={user} 
        spouses={spouses} 
        childrenData={children} 
        childHealthRecords={childHealthRecords}
        isAdmin={true}
      />
    </div>
  );
}
