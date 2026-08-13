"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, LogIn, Calculator, Info, Baby } from "lucide-react";

type AnalysisResult = {
  tbStatus: string; // Status Stunting
  bbStatus: string; // Status Berat Badan
  recommendation: string;
} | null;

export default function Home() {
  const [formData, setFormData] = useState({
    nama: "",
    tglLahir: "",
    gender: "L",
    berat: "",
    tinggi: ""
  });
  
  const [result, setResult] = useState<AnalysisResult>(null);
  
  // Fungsi pendekatan/aproksimasi Z-Score WHO untuk keperluan Demo
  const calculateWHOStatus = (gender: string, ageMonths: number, heightCm: number, weightKg: number) => {
    // Simplified median tables for every 12 months (0-60 months)
    const points = [
      { m: 0, boyH: 49.9, girlH: 49.1, boyW: 3.3, girlW: 3.2 },
      { m: 6, boyH: 67.6, girlH: 65.7, boyW: 7.9, girlW: 7.3 },
      { m: 12, boyH: 75.7, girlH: 74.0, boyW: 9.6, girlW: 8.9 },
      { m: 24, boyH: 87.1, girlH: 85.5, boyW: 12.2, girlW: 11.5 },
      { m: 36, boyH: 96.1, girlH: 95.1, boyW: 14.3, girlW: 13.9 },
      { m: 48, boyH: 103.3, girlH: 102.7, boyW: 16.3, girlW: 16.1 },
      { m: 60, boyH: 110.0, girlH: 109.4, boyW: 18.3, girlW: 18.2 }
    ];
    
    // Find closest lower and upper bounds for linear interpolation
    let lower = points[0];
    let upper = points[points.length - 1];
    
    for (let i = 0; i < points.length - 1; i++) {
      if (ageMonths >= points[i].m && ageMonths <= points[i + 1].m) {
        lower = points[i];
        upper = points[i + 1];
        break;
      }
    }
    
    if (ageMonths > 60) {
      lower = points[5];
      upper = points[6];
    }

    // Linear Interpolation
    const ratio = (ageMonths - lower.m) / (upper.m - lower.m || 1);
    
    const medianH = gender === 'L' 
      ? lower.boyH + (upper.boyH - lower.boyH) * ratio 
      : lower.girlH + (upper.girlH - lower.girlH) * ratio;
      
    const medianW = gender === 'L' 
      ? lower.boyW + (upper.boyW - lower.boyW) * ratio 
      : lower.girlW + (upper.girlW - lower.girlW) * ratio;

    // Approximate SDs
    const sdH = medianH * 0.04;
    const sdW = medianW * 0.11;
    
    const zHeight = (heightCm - medianH) / sdH;
    const zWeight = (weightKg - medianW) / sdW;
    
    // Evaluate Status Stunting (Tinggi/Panjang Badan menurut Umur - TB/U)
    let tbStatus = "Normal";
    if (zHeight < -3) tbStatus = "Sangat Pendek (Severely Stunted)";
    else if (zHeight < -2) tbStatus = "Pendek (Stunted)";
    else if (zHeight > 3) tbStatus = "Tinggi";
    
    // Evaluate Status Berat Badan (Berat Badan menurut Umur - BB/U)
    let bbStatus = "Berat Badan Normal";
    if (zWeight < -3) bbStatus = "Gizi Buruk (Severely Underweight)";
    else if (zWeight < -2) bbStatus = "Gizi Kurang (Underweight)";
    else if (zWeight > 2) bbStatus = "Risiko Berat Badan Lebih";

    // Recommendations
    let recommendation = "";
    if (tbStatus.includes("Stunted") || bbStatus.includes("Gizi Kurang") || bbStatus.includes("Gizi Buruk")) {
      recommendation = "Anak Anda terindikasi memiliki masalah gizi. Segera konsultasikan ke Posyandu atau Puskesmas terdekat. Pastikan anak mendapatkan ASI Eksklusif (jika di bawah 6 bulan) atau MPASI yang kaya akan protein hewani seperti telur, ikan, dan daging. Pantau terus pertumbuhan anak setiap bulan.";
    } else {
      recommendation = "Pertumbuhan anak Anda berada pada rentang normal. Terus berikan asupan gizi seimbang, stimulasi perkembangan yang tepat, dan pastikan lingkungan yang bersih. Jangan lupa tetap rutin datang ke Posyandu setiap bulan untuk memantau tumbuh kembangnya!";
    }

    return { tbStatus, bbStatus, recommendation };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tglLahir || !formData.tinggi || !formData.berat) return;
    
    const birthDate = new Date(formData.tglLahir);
    const today = new Date();
    
    let ageMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (today.getDate() < birthDate.getDate()) {
      ageMonths--;
    }
    
    // Batasi agar tidak minus
    if (ageMonths < 0) ageMonths = 0;
    
    const height = parseFloat(formData.tinggi);
    const weight = parseFloat(formData.berat);
    
    const analysis = calculateWHOStatus(formData.gender, ageMonths, height, weight);
    setResult(analysis);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Stunting Care</span>
          </div>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Masuk Petugas</span>
            <span className="sm:hidden">Masuk</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Kalkulator Status Gizi &amp; Stunting
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Periksa status pertumbuhan anak Anda berdasarkan standar kurva pertumbuhan World Health Organization (WHO).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 p-4 sm:p-6 text-white flex items-center gap-3">
              <Baby className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Data Anak</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Anak Lengkap</label>
                <input 
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Lahir</label>
                  <input 
                    type="date"
                    required
                    value={formData.tglLahir}
                    onChange={(e) => setFormData({...formData, tglLahir: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Jenis Kelamin</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Berat Badan (kg)</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="1"
                    max="100"
                    required
                    value={formData.berat}
                    onChange={(e) => setFormData({...formData, berat: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    placeholder="Contoh: 12.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tinggi/Panjang Badan (cm)</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="30"
                    max="200"
                    required
                    value={formData.tinggi}
                    onChange={(e) => setFormData({...formData, tinggi: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    placeholder="Contoh: 85.0"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-[0.98]"
                >
                  <Calculator className="w-5 h-5" />
                  Cek Status Gizi
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="h-full">
            {result ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-indigo-600 p-4 sm:p-6 text-white">
                  <h2 className="text-xl font-semibold">Hasil Analisa: {formData.nama}</h2>
                </div>
                
                <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
                  {/* Status Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${result.tbStatus.includes("Stunted") || result.tbStatus.includes("Pendek") ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className="text-sm font-medium text-slate-600 mb-1">Status TB/U (Stunting)</p>
                      <p className={`text-lg font-bold ${result.tbStatus.includes("Stunted") || result.tbStatus.includes("Pendek") ? 'text-red-700' : 'text-emerald-700'}`}>
                        {result.tbStatus}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-xl border ${result.bbStatus.includes("Gizi Kurang") || result.bbStatus.includes("Gizi Buruk") ? 'bg-orange-50 border-orange-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className="text-sm font-medium text-slate-600 mb-1">Status BB/U (Gizi)</p>
                      <p className={`text-lg font-bold ${result.bbStatus.includes("Gizi Kurang") || result.bbStatus.includes("Gizi Buruk") ? 'text-orange-700' : 'text-emerald-700'}`}>
                        {result.bbStatus}
                      </p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Rekomendasi</h3>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 text-center mt-auto pt-4">
                    *Hasil ini merupakan estimasi awal berdasarkan kurva pertumbuhan anak secara umum. Selalu prioritaskan diagnosa dari Tenaga Kesehatan di fasilitas kesehatan terdekat.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-slate-300 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Calculator className="w-16 h-16 text-slate-300 mb-4" />
                <p className="font-medium text-lg text-slate-700">Belum ada data</p>
                <p className="text-sm mt-2 max-w-sm">
                  Silakan lengkapi form di samping lalu klik "Cek Status Gizi" untuk melihat hasil analisa pertumbuhan anak Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
