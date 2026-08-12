import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import pool from "@/lib/db";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Fetch menus from database
  const [rows] = await pool.execute('SELECT * FROM menus ORDER BY order_num ASC');
  const menus = rows as any[];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar menus={menus} />

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
