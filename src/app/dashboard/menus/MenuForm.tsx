"use client";

import { useState } from "react";
import { Plus, Edit2, X } from "lucide-react";
import { saveMenu } from "./actions";

type MenuFormProps = {
  mode: "add" | "edit";
  allMenus: any[];
  initialData?: any;
};

export default function MenuForm({ mode, allMenus, initialData }: MenuFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {mode === "add" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Menu
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {mode === "add" ? "Tambah Menu Baru" : "Edit Menu"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              action={async (formData) => {
                await saveMenu(formData);
                setIsOpen(false);
              }}
              className="p-6 space-y-4"
            >
              {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Nama Menu</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={initialData?.name}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">URL / Laman</label>
                <input 
                  type="text" 
                  name="url" 
                  defaultValue={initialData?.url}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Contoh: /dashboard/settings"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Icon (Lucide)</label>
                  <input 
                    type="text" 
                    name="icon" 
                    defaultValue={initialData?.icon}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Contoh: Activity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Urutan</label>
                  <input 
                    type="number" 
                    name="order_num" 
                    defaultValue={initialData?.order_num || 0}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Parent Menu</label>
                  <select 
                    name="parent_id"
                    defaultValue={initialData?.parent_id || ""}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">-- Tidak Ada --</option>
                    {allMenus.filter(m => m.id !== initialData?.id && !m.parent_id).map(menu => (
                      <option key={menu.id} value={menu.id}>{menu.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Hak Akses</label>
                  <select 
                    name="access_role"
                    defaultValue={initialData?.access_role || "all"}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">Semua User (all)</option>
                    <option value="admin">Admin Saja (admin)</option>
                    <option value="user">User Saja (user)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
