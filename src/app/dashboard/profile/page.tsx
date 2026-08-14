import { auth } from "@/lib/auth";
import pool from "@/lib/db";
import ProfileTabs from "./ProfileTabs";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  
  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  // Ambil data user
  const [userRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  const user = (userRows as any[])[0];

  if (!user) {
    redirect("/login");
  }

  // Ambil data suami/istri
  const [spouseRows] = await pool.execute('SELECT * FROM spouses WHERE user_id = ? ORDER BY created_at ASC', [userId]);
  const spouses = spouseRows as any[];

  // Ambil data anak
  const [childRows] = await pool.execute('SELECT * FROM children WHERE user_id = ? ORDER BY created_at ASC', [userId]);
  const children = childRows as any[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Profil Pengguna</h1>
      </div>

      <ProfileTabs 
        user={user} 
        spouses={spouses} 
        childrenData={children} 
        isAdmin={role === 'admin'}
      />
    </div>
  );
}
