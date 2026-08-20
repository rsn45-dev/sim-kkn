import pool from "@/lib/db";
import { Users, Search, CheckCircle, Clock, XCircle } from "lucide-react";
import WargaActions from "./WargaActions";
import Link from "next/link";

export default async function WargaPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const currentTab = searchParams.tab || 'approved';
  
  // Filter query based on tab
  let statusFilter = 'approved';
  if (currentTab === 'pending') statusFilter = 'pending';
  if (currentTab === 'rejected') statusFilter = 'rejected';

  const [rows] = await pool.execute('SELECT * FROM users WHERE status = ? AND role = "user" ORDER BY created_at DESC', [statusFilter]);
  const users = rows as any[];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Data Warga</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Cari warga..."
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <Link
            href="/dashboard/warga?tab=approved"
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              currentTab === 'approved'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Data Warga
          </Link>
          <Link
            href="/dashboard/warga?tab=pending"
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              currentTab === 'pending'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            Perlu Validasi
          </Link>
          <Link
            href="/dashboard/warga?tab=rejected"
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              currentTab === 'rejected'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Validasi Ditolak
          </Link>
        </nav>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Informasi Diri</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kontak</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Alamat Lengkap</th>
                {currentTab === 'rejected' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Alasan Penolakan</th>
                )}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={currentTab === 'rejected' ? 6 : 5} className="px-6 py-12 text-center text-sm text-slate-500">
                    <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    Belum ada data warga di kategori ini.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{user.full_name}</div>
                      <div className="text-xs text-slate-500 uppercase mt-1 px-2 py-0.5 bg-slate-100 rounded inline-block">
                        Status: {user.marital_status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {user.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                      <div className="text-sm text-slate-500">
                        Tgl Lahir: {new Date(user.dob).toLocaleDateString('id-ID')}
                      </div>
                      <div className="text-sm text-slate-500">
                        Pekerjaan: {user.job_status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{user.phone}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{user.address}</div>
                    </td>
                    {currentTab === 'rejected' && (
                      <td className="px-6 py-4">
                        <div className="text-sm text-red-600 italic bg-red-50 p-2 rounded">{user.rejection_reason || 'Tidak ada alasan'}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <WargaActions warga={user} currentTab={currentTab} />
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
