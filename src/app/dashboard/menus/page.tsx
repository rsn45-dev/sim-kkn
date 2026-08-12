import pool from "@/lib/db";
import { MenuSquare, Plus, Edit2, Trash2 } from "lucide-react";
import MenuForm from "./MenuForm";
import { deleteMenu } from "./actions";
import DeleteButton from "./DeleteButton";

export default async function MenusPage() {
  const [rows] = await pool.execute('SELECT * FROM menus ORDER BY parent_id ASC, order_num ASC');
  const menus = rows as any[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Menu</h1>
        <MenuForm mode="add" allMenus={menus} />
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Menu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">URL / Laman</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Icon</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Urutan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hak Akses</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {menus.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                    <MenuSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    Belum ada menu yang terdaftar.
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium text-slate-900 ${menu.parent_id ? 'pl-6 border-l-2 border-slate-200' : ''}`}>
                        {menu.name}
                      </div>
                      {menu.parent_id && (
                        <div className="text-xs text-slate-500 pl-6">
                          Sub-menu dari: {menus.find(m => m.id === menu.parent_id)?.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{menu.url || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{menu.icon || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-500">{menu.order_num}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {menu.access_role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <MenuForm mode="edit" allMenus={menus} initialData={menu} />
                        <form action={deleteMenu}>
                          <input type="hidden" name="menuId" value={menu.id} />
                          <DeleteButton id={menu.id} />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
