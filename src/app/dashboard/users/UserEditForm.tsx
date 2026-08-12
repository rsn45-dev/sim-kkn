"use client";

import { useState } from "react";
import { Edit2, X, KeyRound } from "lucide-react";
import { updateUser, resetPassword } from "./actions";

type UserEditFormProps = {
  user: any;
  roles: any[];
};

export default function UserEditForm({ user, roles }: UserEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-lg transition-colors"
          title="Edit Akses & Password"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <form action={resetPassword}>
          <input type="hidden" name="userId" value={user.id} />
          <button 
            type="submit"
            className="inline-flex items-center text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-2 py-1.5 rounded-lg transition-colors"
            title="Reset Password ke '123456'"
            onClick={(e) => {
              if(!window.confirm('Reset password ke default (123456)?')) e.preventDefault();
            }}
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </form>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Edit User: {user.full_name}
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
                await updateUser(formData);
                setIsOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <input type="hidden" name="id" value={user.id} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hak Akses (Role)
                </label>
                <select 
                  name="role"
                  defaultValue={user.role}
                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  {roles.map(r => {
                    if (r.name !== 'user' && r.name !== 'admin') {
                      return <option key={r.id} value={r.name}>{r.name}</option>;
                    }
                    return null;
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ganti Password
                </label>
                <input 
                  type="password" 
                  name="password" 
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
