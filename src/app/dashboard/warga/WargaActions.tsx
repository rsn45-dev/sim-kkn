"use client";

import { useState } from "react";
import { Eye, Edit2, Trash2, X, Check, XCircle as XCircleIcon } from "lucide-react";
import { updateWarga, deleteWarga, approveWarga, rejectWarga } from "./actions";
import Link from "next/link";

type WargaActionsProps = {
  warga: any;
  currentTab?: string;
};

export default function WargaActions({ warga, currentTab = 'approved' }: WargaActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  // Format Date to YYYY-MM-DD for input type="date"
  const formattedDate = new Date(warga.dob).toISOString().split('T')[0];

  return (
    <>
      <div className="flex space-x-2 justify-end">
        {currentTab === 'pending' && (
          <>
            <form action={approveWarga}>
              <input type="hidden" name="id" value={warga.id} />
              <button 
                type="submit"
                className="inline-flex items-center text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1.5 rounded-lg transition-colors"
                title="Setujui Data"
              >
                <Check className="w-4 h-4" />
              </button>
            </form>
            <button
              onClick={() => setRejectOpen(true)}
              className="inline-flex items-center text-orange-600 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-2 py-1.5 rounded-lg transition-colors"
              title="Tolak Data"
            >
              <XCircleIcon className="w-4 h-4" />
            </button>
          </>
        )}

        {currentTab !== 'pending' && (
          <Link
            href={`/dashboard/warga/${warga.id}`}
            className="inline-flex items-center text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-1.5 rounded-lg transition-colors"
            title="Lihat Data"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}

        <button
          onClick={() => setEditOpen(true)}
          className="inline-flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded-lg transition-colors"
          title="Edit Data"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <form action={deleteWarga}>
          <input type="hidden" name="id" value={warga.id} />
          <button 
            type="submit"
            className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-lg transition-colors"
            title="Hapus Data"
            onClick={(e) => {
              if(!window.confirm('Yakin ingin menghapus data warga ini?')) {
                e.preventDefault();
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Modal Edit */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Data Warga
              </h3>
              <button
                onClick={() => setEditOpen(false)}
                className="text-slate-400 hover:text-slate-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              action={async (formData) => {
                await updateWarga(formData);
                setEditOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <input type="hidden" name="id" value={warga.id} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="full_name" 
                  defaultValue={warga.full_name}
                  required
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                  <select 
                    name="gender" 
                    defaultValue={warga.gender}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                  <input 
                    type="date" 
                    name="dob" 
                    defaultValue={formattedDate}
                    required
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea 
                  name="address" 
                  defaultValue={warga.address}
                  required
                  rows={2}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Pekerjaan</label>
                  <select 
                    name="job_status" 
                    defaultValue={warga.job_status}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="bekerja">Bekerja</option>
                    <option value="tidak_bekerja">Tidak Bekerja</option>
                    <option value="pelajar">Pelajar/Mahasiswa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Pernikahan</label>
                  <select 
                    name="marital_status" 
                    defaultValue={warga.marital_status}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="belum_kawin">Belum Kawin</option>
                    <option value="kawin">Kawin</option>
                    <option value="cerai">Cerai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No HP</label>
                  <input 
                    type="text" 
                    name="phone" 
                    defaultValue={warga.phone}
                    required
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    defaultValue={warga.email}
                    required
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 mt-6">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
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
      {/* Modal Reject */}
      {rejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                Tolak Pendaftaran Warga
              </h3>
              <button
                onClick={() => setRejectOpen(false)}
                className="text-slate-400 hover:text-slate-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              action={async (formData) => {
                await rejectWarga(formData);
                setRejectOpen(false);
              }}
              className="p-6 space-y-4"
            >
              <input type="hidden" name="id" value={warga.id} />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alasan Penolakan</label>
                <textarea 
                  name="reason" 
                  required
                  rows={3}
                  placeholder="Masukkan alasan penolakan (misal: data tidak valid, bukan warga RT setempat)"
                  className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setRejectOpen(false)}
                  className="px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                >
                  Konfirmasi Tolak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
