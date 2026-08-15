"use client";

import { useState } from "react";
import { User, Users, Baby, HeartPulse, Edit2, Plus, Trash2, X, TrendingUp } from "lucide-react";
import { updateProfile, addSpouse, deleteSpouse, addChild, deleteChild, addChildHealth, deleteChildHealth } from "./actions";
import { calcHealthStatus } from "@/lib/healthCalc";

type Props = {
  user: any;
  spouses: any[];
  childrenData: any[];
  childHealthRecords: any[];
  isAdmin: boolean;
};

export default function ProfileTabs({ user, spouses, childrenData, childHealthRecords, isAdmin }: Props) {
  const [activeTab, setActiveTab] = useState("profil");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addSpouseOpen, setAddSpouseOpen] = useState(false);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [addHealthOpen, setAddHealthOpen] = useState(false);

  const isMarried = user.marital_status === "kawin";

  const tabs = [
    { id: "profil", label: "Profil", icon: User },
    ...(isMarried ? [{ id: "suami_istri", label: "Suami / Istri", icon: Users }] : []),
    { id: "anak", label: "Anak", icon: Baby },
    { id: "kesehatan_anak", label: "Kesehatan Anak", icon: HeartPulse },
  ];

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200 flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        
        {/* PROFIL TAB */}
        {activeTab === "profil" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Data Pribadi</h3>
                <p className="text-sm text-slate-500">Informasi profil akun Anda.</p>
              </div>
              <button
                onClick={() => setEditProfileOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profil
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Lengkap</span>
                <span className="block text-base font-medium text-slate-900">{user.full_name}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</span>
                <span className="block text-base font-medium text-slate-900">{user.email}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Jenis Kelamin</span>
                <span className="block text-base font-medium text-slate-900">{user.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tanggal Lahir</span>
                <span className="block text-base font-medium text-slate-900">{new Date(user.dob).toLocaleDateString('id-ID')}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status Pekerjaan</span>
                <span className="block text-base font-medium text-slate-900">{user.job_status.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status Pernikahan</span>
                <span className="block text-base font-medium text-slate-900">{user.marital_status.replace('_', ' ')}</span>
              </div>
              <div className="md:col-span-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Alamat Lengkap</span>
                <span className="block text-base font-medium text-slate-900">{user.address}</span>
              </div>
            </div>
          </div>
        )}

        {/* SUAMI ISTRI TAB */}
        {activeTab === "suami_istri" && isMarried && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Data Suami / Istri</h3>
                <p className="text-sm text-slate-500">Daftar anggota keluarga (Suami/Istri).</p>
              </div>
              <button
                onClick={() => setAddSpouseOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Input Data
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama Lahir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tanggal Lahir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {spouses.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 4 : 3} className="px-6 py-8 text-center text-sm text-slate-500">
                        Belum ada data suami/istri.
                      </td>
                    </tr>
                  ) : (
                    spouses.map(spouse => (
                      <tr key={spouse.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{spouse.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(spouse.dob).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {spouse.is_alive ? (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Hidup</span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Meninggal</span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <form action={deleteSpouse}>
                              <input type="hidden" name="id" value={spouse.id} />
                              <button 
                                type="submit" 
                                className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-lg"
                                onClick={e => !confirm('Yakin hapus data ini?') && e.preventDefault()}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANAK TAB */}
        {activeTab === "anak" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Data Anak</h3>
                <p className="text-sm text-slate-500">Daftar anak Anda.</p>
              </div>
              <button
                onClick={() => setAddChildOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Input Data Anak
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama Lengkap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">L/P</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tanggal Lahir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Pekerjaan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {childrenData.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-sm text-slate-500">
                        Belum ada data anak.
                      </td>
                    </tr>
                  ) : (
                    childrenData.map(child => (
                      <tr key={child.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{child.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{child.gender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(child.dob).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{child.job_status || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {child.is_alive ? (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Hidup</span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Meninggal</span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <form action={deleteChild}>
                              <input type="hidden" name="id" value={child.id} />
                              <button 
                                type="submit" 
                                className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-lg"
                                onClick={e => !confirm('Yakin hapus data anak ini?') && e.preventDefault()}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KESEHATAN ANAK TAB */}
        {activeTab === "kesehatan_anak" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Rekam Kesehatan Anak</h3>
                <p className="text-sm text-slate-500">Riwayat pengukuran tinggi & berat badan anak.</p>
              </div>
              {childrenData.length > 0 && (
                <button onClick={() => setAddHealthOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  Input Pengukuran
                </button>
              )}
            </div>
            {childrenData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Baby className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-slate-500">Tambah data anak terlebih dahulu di tab Anak.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama Anak</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tgl Ukur</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">BB (kg)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">TB (cm)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status TB/U</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status BB/U</th>
                      {isAdmin && <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {childHealthRecords.length === 0 ? (
                      <tr><td colSpan={isAdmin?7:6} className="px-4 py-8 text-center text-sm text-slate-500">Belum ada rekam kesehatan.</td></tr>
                    ) : childHealthRecords.map(rec => {
                      const res = calcHealthStatus(
                        rec.gender,
                        new Date(rec.child_dob).toISOString().split('T')[0],
                        new Date(rec.measurement_date).toISOString().split('T')[0],
                        parseFloat(rec.height_cm),
                        parseFloat(rec.weight_kg)
                      );
                      return (
                        <tr key={rec.id} className={res.alertLevel === 'danger' ? 'bg-red-50' : res.alertLevel === 'warning' ? 'bg-orange-50' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900">{rec.child_name}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{new Date(rec.measurement_date).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{rec.weight_kg}</td>
                          <td className="px-4 py-3 text-sm text-slate-700 font-semibold">{rec.height_cm}</td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${
                              res.alertLevel==='danger'?'bg-red-100 text-red-700':res.alertLevel==='warning'?'bg-orange-100 text-orange-700':'bg-emerald-100 text-emerald-700'
                            }`}>{res.primaryStatus}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            <span className="font-mono">{res.interpretation}</span>
                          </td>
                          {isAdmin && (
                            <td className="px-4 py-3 text-right">
                              <form action={deleteChildHealth}>
                                <input type="hidden" name="id" value={rec.id} />
                                <button type="submit" className="text-red-600 bg-red-50 p-1.5 rounded-lg" onClick={e=>!confirm('Hapus rekam ini?')&&e.preventDefault()}>
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </form>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Modal Edit Profil */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">Edit Profil Anda</h3>
              <button onClick={() => setEditProfileOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form action={async (fd) => { await updateProfile(fd); setEditProfileOpen(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" name="full_name" defaultValue={user.full_name} required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                  <select name="gender" defaultValue={user.gender} className="w-full px-3 py-2 border border-slate-300 rounded-md">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                  <input type="date" name="dob" defaultValue={new Date(user.dob).toISOString().split('T')[0]} required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                <textarea name="address" defaultValue={user.address} rows={2} required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Pekerjaan</label>
                  <select name="job_status" defaultValue={user.job_status} className="w-full px-3 py-2 border border-slate-300 rounded-md">
                    <option value="bekerja">Bekerja</option>
                    <option value="tidak_bekerja">Tidak Bekerja</option>
                    <option value="pelajar">Pelajar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status Pernikahan</label>
                  <select name="marital_status" defaultValue={user.marital_status} className="w-full px-3 py-2 border border-slate-300 rounded-md">
                    <option value="belum_kawin">Belum Kawin</option>
                    <option value="kawin">Kawin</option>
                    <option value="cerai">Cerai</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">No HP</label>
                <input type="text" name="phone" defaultValue={user.phone} required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setEditProfileOpen(false)} className="px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Input Suami/Istri */}
      {addSpouseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Input Data Suami/Istri</h3>
              <button onClick={() => setAddSpouseOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={async (fd) => { await addSpouse(fd); setAddSpouseOpen(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lahir</label>
                <input type="text" name="full_name" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                <input type="date" name="dob" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Hidup</label>
                <select name="is_alive" className="w-full px-3 py-2 border border-slate-300 rounded-md">
                  <option value="true">Hidup</option>
                  <option value="false">Meninggal</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setAddSpouseOpen(false)} className="px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Input Pengukuran Kesehatan */}
      {addHealthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Input Pengukuran Kesehatan</h3>
              <button onClick={() => setAddHealthOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <form action={async (fd) => { await addChildHealth(fd); setAddHealthOpen(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Anak</label>
                <select name="child_id" required className="w-full px-3 py-2 border border-slate-300 rounded-md">
                  <option value="">-- Pilih Anak --</option>
                  {childrenData.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Pengukuran</label>
                <input type="date" name="measurement_date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Berat Badan (kg)</label>
                  <input type="number" step="0.1" name="weight_kg" required placeholder="12.5" className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tinggi Badan (cm)</label>
                  <input type="number" step="0.1" name="height_cm" required placeholder="85.0" className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catatan (opsional)</label>
                <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button type="button" onClick={() => setAddHealthOpen(false)} className="px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan & Analisa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Input Anak */}
      {addChildOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Input Data Anak</h3>
              <button onClick={() => setAddChildOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={async (fd) => { await addChild(fd); setAddChildOpen(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" name="full_name" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                  <select name="gender" className="w-full px-3 py-2 border border-slate-300 rounded-md">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                  <input type="date" name="dob" required className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan</label>
                <input type="text" name="job_status" placeholder="Belum bekerja / Pelajar" className="w-full px-3 py-2 border border-slate-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Hidup</label>
                <select name="is_alive" className="w-full px-3 py-2 border border-slate-300 rounded-md">
                  <option value="true">Hidup</option>
                  <option value="false">Meninggal</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <button type="button" onClick={() => setAddChildOpen(false)} className="px-4 py-2 border rounded-md">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
