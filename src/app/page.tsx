"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, LogIn, Calculator, Info, Baby, AlertTriangle, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { calcHealthStatus, type HealthResult } from "@/lib/healthCalc";
import { saveGuestHealthCheck } from "@/app/actions/guest";

export default function Home() {
  const [formData, setFormData] = useState({ nama: "", tglLahir: "", gender: "L", berat: "", tinggi: "" });
  const [result, setResult] = useState<(HealthResult & { nama: string }) | null>(null);
  const [showMethodInfo, setShowMethodInfo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tglLahir || !formData.tinggi || !formData.berat) return;
    const height = parseFloat(formData.tinggi);
    const weight = parseFloat(formData.berat);

    const r = calcHealthStatus(
      formData.gender,
      formData.tglLahir,
      new Date().toISOString().split('T')[0],
      height,
      weight
    );
    setResult({ ...r, nama: formData.nama });

    // Simpan ke database laporan non-terdaftar (guest)
    await saveGuestHealthCheck({
      nama: formData.nama,
      gender: formData.gender,
      tglLahir: formData.tglLahir,
      tinggi: height,
      berat: weight
    });
  };

  const alertBg = result?.alertLevel === 'danger' ? 'bg-red-50 border-red-200' : result?.alertLevel === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200';
  const alertText = result?.alertLevel === 'danger' ? 'text-red-700' : result?.alertLevel === 'warning' ? 'text-orange-700' : 'text-emerald-700';
  const recBg = result?.alertLevel === 'danger' ? 'bg-red-50 border-red-100' : result?.alertLevel === 'warning' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100';
  const recText = result?.alertLevel === 'danger' ? 'text-red-900' : result?.alertLevel === 'warning' ? 'text-orange-900' : 'text-blue-900';
  const recBody = result?.alertLevel === 'danger' ? 'text-red-800' : result?.alertLevel === 'warning' ? 'text-orange-800' : 'text-blue-800';
  const recIcon = result?.alertLevel === 'danger' ? 'text-red-500' : result?.alertLevel === 'warning' ? 'text-orange-500' : 'text-blue-500';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Digitalisasi Warga dan Kesehatan</span>
          </div>
          <Link href="/login" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Masuk</span>
            <span className="sm:hidden">Masuk</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Kalkulator Status Gizi</h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Menggunakan standar WHO — Z-Score (0–5 tahun) · IMT/U (5–18 tahun) · IMT Dewasa (&gt;18 tahun)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 p-5 text-white flex items-center gap-3">
              <Baby className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Data Pengukuran</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                <input type="text" required value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Contoh: Budi Santoso" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Lahir</label>
                  <input type="date" required value={formData.tglLahir} onChange={e => setFormData({ ...formData, tglLahir: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Kelamin</label>
                  <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all">
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Berat Badan (kg)</label>
                  <input type="number" step="0.1" min="1" required value={formData.berat} onChange={e => setFormData({ ...formData, berat: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="12.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tinggi Badan (cm)</label>
                  <input type="number" step="0.1" min="30" required value={formData.tinggi} onChange={e => setFormData({ ...formData, tinggi: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="85.0" />
                </div>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]">
                <Calculator className="w-5 h-5" /> Cek Status Gizi
              </button>
            </form>
          </div>

          {/* Result */}
          <div>
            {result ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className={`p-5 text-white ${result.alertLevel === 'danger' ? 'bg-red-600' : result.alertLevel === 'warning' ? 'bg-orange-500' : 'bg-indigo-600'}`}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1 opacity-80">{result.method}</p>
                  <h2 className="text-xl font-semibold">Hasil: {result.nama}</h2>
                </div>

                <div className="p-5 flex flex-col gap-5">
                  {/* Status Cards */}
                  <div className={`p-4 rounded-xl border ${alertBg}`}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status Utama</p>
                    <p className={`text-xl font-bold ${alertText}`}>{result.primaryStatus}</p>
                    {result.secondaryStatus && <p className={`text-sm font-medium mt-1 ${alertText}`}>{result.secondaryStatus}</p>}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Apa artinya?</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{result.friendlyDetail}</p>
                    {result.bmi && (
                      <p className="text-xs text-slate-400 mt-2 font-mono">Nilai IMT: {result.bmi} kg/m² · Metode: {result.method}</p>
                    )}
                  </div>

                  {/* Penjelasan IMT — muncul jika metode menggunakan IMT */}
                  {result.bmi && (
                    <div className="border border-indigo-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowMethodInfo(!showMethodInfo)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 text-indigo-800 text-sm font-medium hover:bg-indigo-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>Apa itu {result.method.includes('Dewasa') ? 'IMT (Indeks Massa Tubuh)' : 'IMT/U (IMT menurut Umur)'}?</span>
                        </div>
                        {showMethodInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {showMethodInfo && (
                        <div className="p-4 bg-white text-sm text-slate-700 space-y-3 leading-relaxed">
                          {result.method.includes('Dewasa') ? (
                            <>
                              <p><strong>IMT (Indeks Massa Tubuh)</strong> adalah cara paling umum untuk mengetahui apakah berat badan seseorang sudah ideal sesuai dengan tinggi badannya.</p>
                              <p>Rumusnya: <span className="font-mono bg-slate-100 px-1 rounded">IMT = Berat (kg) ÷ Tinggi² (m)</span></p>
                              <p>Contoh: berat 60 kg, tinggi 1.65 m → IMT = 60 ÷ (1.65 × 1.65) = <strong>22.0 kg/m²</strong></p>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="bg-blue-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-blue-700">&lt; 17.0</p><p>Kurus Berat</p>
                                </div>
                                <div className="bg-sky-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-sky-700">17.0 – 18.4</p><p>Kurus</p>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-emerald-700">18.5 – 24.9</p><p>Normal / Ideal</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-orange-700">25.0 – 26.9</p><p>Gemuk</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-2 text-xs text-center col-span-2">
                                  <p className="font-bold text-red-700">&gt; 27.0</p><p>Obesitas</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p><strong>IMT/U (IMT menurut Umur)</strong> digunakan untuk anak dan remaja usia 5–18 tahun, karena nilai IMT ideal berbeda-beda tergantung usia dan jenis kelamin.</p>
                              <p>Rumus IMT-nya sama: <span className="font-mono bg-slate-100 px-1 rounded">IMT = Berat (kg) ÷ Tinggi² (m)</span></p>
                              <p>Namun hasilnya dibandingkan dengan <strong>tabel standar WHO</strong> sesuai usia anak, bukan angka tetap seperti orang dewasa.</p>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div className="bg-red-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-red-700">Z-Score &lt; -3</p><p>Sangat Kurus</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-orange-700">-3 s/d -2</p><p>Kurus</p>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-emerald-700">-2 s/d +1</p><p>Normal / Ideal</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-2 text-xs text-center">
                                  <p className="font-bold text-orange-700">+1 s/d +2</p><p>Gemuk</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-2 text-xs text-center col-span-2">
                                  <p className="font-bold text-red-700">&gt; +2</p><p>Obesitas</p>
                                </div>
                              </div>
                            </>
                          )}
                          <p className="text-xs text-slate-400">*Standar berdasarkan referensi WHO dan Kemenkes RI.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className={`rounded-xl p-4 flex gap-3 border ${recBg}`}>
                    {result.alertLevel === 'normal'
                      ? <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${recIcon}`} />
                      : <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${recIcon}`} />}
                    <div>
                      <p className={`font-semibold text-sm mb-1 ${recText}`}>Rekomendasi</p>
                      <p className={`text-sm leading-relaxed ${recBody}`}>{result.recommendation}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    *Estimasi awal. Untuk diagnosa pasti, konsultasikan ke tenaga kesehatan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-2xl min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <Calculator className="w-16 h-16 text-slate-300 mb-4" />
                <p className="font-medium text-lg text-slate-700">Belum ada data</p>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">Lengkapi form lalu klik "Cek Status Gizi"</p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-slate-500 w-full max-w-xs">
                  <div className="bg-blue-50 rounded-lg p-2 text-center"><p className="font-semibold text-blue-700">0–5 thn</p><p>WHO Z-Score</p></div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center"><p className="font-semibold text-purple-700">5–18 thn</p><p>IMT/U</p></div>
                  <div className="bg-teal-50 rounded-lg p-2 text-center"><p className="font-semibold text-teal-700">&gt;18 thn</p><p>IMT Dewasa</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xl font-bold text-white">APP-Digitaliasi RT 02 RW 06 Patemon</span>
            </div>

            <div className="text-sm text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} KKN Stunting App. RT 02 RW 06 Patemon</p>
              <p className="mt-1 text-slate-500">Mewujudkan generasi sehat dan bebas stunting.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
