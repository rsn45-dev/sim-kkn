import pool from "@/lib/db";
import { ShieldCheck, Plus, Trash2 } from "lucide-react";
import { saveRole, deleteRole } from "./actions";
import DeleteRoleButton from "./DeleteRoleButton";

export default async function RolesPage() {
  const [rows] = await pool.execute('SELECT * FROM roles ORDER BY created_at DESC');
  const roles = rows as any[];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Roles User</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Role */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
              <h3 className="text-lg leading-6 font-medium text-slate-900">
                Tambah Role Baru
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <form action={saveRole} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nama Role</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Contoh: admin"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">Deskripsi</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                    placeholder="Contoh: Hak akses penuh ke seluruh fitur"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Simpan Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabel Data Role */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deskripsi</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-sm text-slate-500">
                        <ShieldCheck className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        Belum ada data role.
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr key={role.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {role.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">{role.description || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <form action={deleteRole}>
                            <input type="hidden" name="id" value={role.id} />
                            <DeleteRoleButton id={role.id} />
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
