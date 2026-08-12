import { auth } from "@/lib/auth";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import pool from "@/lib/db";

export default async function SettingLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const userRole = (session?.user as any)?.role || "user";

  const [rows] = await pool.execute(
    'SELECT * FROM menus WHERE access_role = ? OR access_role = "all" ORDER BY parent_id ASC, order_num ASC',
    [userRole]
  );
  const menus = rows as any[];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar menus={menus} user={session?.user} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden md:pt-0 pt-16">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
