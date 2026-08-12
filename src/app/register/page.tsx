import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";
import { registerUser } from "./actions";

export default function RegisterPage() {
  return (
    <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Registrasi Akun
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Silakan lengkapi data diri Anda di bawah ini
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" action={registerUser}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                  Nama Lengkap
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
                  Jenis Kelamin
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    required
                    className="block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border transition-colors bg-white"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-slate-700">
                  Tanggal Lahir
                </label>
                <div className="mt-1">
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                  Alamat Lengkap
                </label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors resize-none"
                    placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Desa, dll)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jobStatus" className="block text-sm font-medium text-slate-700">
                  Status Pekerjaan
                </label>
                <div className="mt-1">
                  <select
                    id="jobStatus"
                    name="jobStatus"
                    required
                    className="block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border transition-colors bg-white"
                  >
                    <option value="">Pilih Status</option>
                    <option value="bekerja">Bekerja</option>
                    <option value="tidak_bekerja">Tidak Bekerja</option>
                    <option value="ibu_rumah_tangga">Ibu Rumah Tangga</option>
                    <option value="pelajar">Pelajar/Mahasiswa</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="maritalStatus" className="block text-sm font-medium text-slate-700">
                  Status Pernikahan
                </label>
                <div className="mt-1">
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    required
                    className="block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border transition-colors bg-white"
                  >
                    <option value="">Pilih Status</option>
                    <option value="belum_kawin">Belum Kawin</option>
                    <option value="kawin">Kawin</option>
                    <option value="cerai_hidup">Cerai Hidup</option>
                    <option value="cerai_mati">Cerai Mati</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  No HP
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Buat password yang kuat"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="flex items-center justify-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Link>
              <button
                type="submit"
                className="w-full sm:w-auto flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Daftar Sekarang
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
