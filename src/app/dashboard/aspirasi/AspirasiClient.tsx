"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Plus, Eye, Edit2, Send, Trash2, Search, X } from "lucide-react";
import { saveDraftAspirasi, sendAspirasi, deleteAspirasi } from "./actions";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type AspirasiClientProps = {
  data: any[];
  totalPages: number;
  currentPage: number;
  searchQuery: string;
};

export default function AspirasiClient({ data, totalPages, currentPage, searchQuery }: AspirasiClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState("daftar");
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  // Form State
  const [formId, setFormId] = useState<number | undefined>(undefined);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [saveStatus, setSaveStatus] = useState("Tersimpan otomatis.");

  const debouncedJudul = useDebounce(judul, 1000);
  const debouncedIsi = useDebounce(isi, 1000);
  const debouncedTanggal = useDebounce(tanggal, 1000);

  // Autosave Effect
  useEffect(() => {
    if (activeTab === "input" && (debouncedJudul || debouncedIsi)) {
      setSaveStatus("Menyimpan...");
      saveDraftAspirasi({
        id: formId,
        tanggal: debouncedTanggal,
        judul: debouncedJudul,
        isi: debouncedIsi
      }).then((id) => {
        if (id) setFormId(id);
        setSaveStatus("Tersimpan otomatis.");
        router.refresh();
      }).catch(() => setSaveStatus("Gagal menyimpan."));
    }
  }, [debouncedJudul, debouncedIsi, debouncedTanggal, activeTab, formId, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', searchValue);
    params.set('page', '1');
    router.push(pathname + '?' + params.toString());
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    router.push(pathname + '?' + params.toString());
  };

  const handleEdit = (item: any) => {
    setFormId(item.id);
    setTanggal(new Date(item.tanggal).toISOString().split('T')[0]);
    setJudul(item.judul);
    setIsi(item.isi);
    setActiveTab("input");
  };

  const handleSend = async (id: number) => {
    if (confirm("Kirim aspirasi ini? Tidak bisa diedit lagi setelah dikirim.")) {
      await sendAspirasi(id);
      if (formId === id) resetForm();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin menghapus aspirasi ini?")) {
      await deleteAspirasi(id);
      if (formId === id) resetForm();
    }
  };

  const resetForm = () => {
    setFormId(undefined);
    setTanggal(new Date().toISOString().split('T')[0]);
    setJudul("");
    setIsi("");
  };

  const submitForm = async () => {
    if (!judul || !isi) return alert("Judul dan isi tidak boleh kosong.");
    setSaveStatus("Mengirim...");
    const id = await saveDraftAspirasi({
      id: formId,
      tanggal,
      judul,
      isi
    });
    if (id) {
      await sendAspirasi(id);
      alert("Aspirasi berhasil dikirim!");
      resetForm();
      setActiveTab("daftar");
      router.refresh();
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("daftar")}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "daftar"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <MessageSquare className={`w-4 h-4 mr-2 ${activeTab === "daftar" ? "text-blue-600" : "text-slate-400"}`} />
          Daftar Aspirasi
        </button>
        <button
          onClick={() => { setActiveTab("input"); resetForm(); }}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "input"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Plus className={`w-4 h-4 mr-2 ${activeTab === "input" ? "text-blue-600" : "text-slate-400"}`} />
          Input Aspirasi Warga
        </button>
      </div>

      <div className="p-6">
        {activeTab === "daftar" ? (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Cari judul aspirasi..."
                  className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Cari
              </button>
            </form>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">No</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tanggal Input</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Judul Aspirasi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status / Respon</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                        Belum ada aspirasi.
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-500">{(currentPage - 1) * 10 + idx + 1}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.judul}</td>
                        <td className="px-4 py-3 text-sm">
                          {item.status === 'draft' && <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold">Draft</span>}
                          {item.status === 'terkirim' && <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Terkirim</span>}
                          {item.status === 'direspon' && (
                            <div className="space-y-1">
                              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-semibold">Direspon</span>
                              <p className="text-xs text-slate-600 line-clamp-1">{item.respon}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => { setSelectedData(item); setViewOpen(true); }} className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg" title="Lihat"><Eye className="w-4 h-4" /></button>
                          {item.status === 'draft' && (
                            <>
                              <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg" title="Edit"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleSend(item.id)} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg" title="Kirim"><Send className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{formId ? 'Edit Draft Aspirasi' : 'Tulis Aspirasi Baru'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Aspirasi</label>
                <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Aspirasi</label>
                <input type="text" value={judul} onChange={e => setJudul(e.target.value)} placeholder="Contoh: Perbaikan Fasilitas Posyandu" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Isi Aspirasi</label>
                <textarea value={isi} onChange={e => setIsi(e.target.value)} rows={5} placeholder="Tuliskan keluhan atau saran Anda di sini..." className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-slate-500 italic">{saveStatus}</span>
                <button onClick={submitForm} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Send className="w-4 h-4" /> Kirim Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Lihat */}
      {viewOpen && selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Detail Aspirasi</h3>
              <button onClick={() => setViewOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{new Date(selectedData.tanggal).toLocaleDateString('id-ID')}</p>
                <h4 className="text-xl font-bold text-slate-900">{selectedData.judul}</h4>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedData.isi}</p>
              </div>
              {selectedData.status === 'direspon' && (
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 mt-4">
                  <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Respon Petugas</span>
                  <p className="text-emerald-900 whitespace-pre-wrap">{selectedData.respon}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
