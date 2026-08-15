"use client";

import { useState } from "react";
import { Users, UserMinus, Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { calcHealthStatus } from "@/lib/healthCalc";

type Props = {
  registeredData: any[];
  guestData: any[];
};

export default function LaporanTabs({ registeredData, guestData }: Props) {
  const [activeTab, setActiveTab] = useState("terdaftar");

  const exportToExcel = (data: any[], filename: string, isRegistered: boolean) => {
    const exportData = data.map((rec, index) => {
      const res = calcHealthStatus(
        rec.gender,
        new Date(rec.child_dob).toISOString().split('T')[0],
        new Date(rec.measurement_date).toISOString().split('T')[0],
        parseFloat(rec.height_cm),
        parseFloat(rec.weight_kg)
      );

      const baseRow: any = {
        "No": index + 1,
        "Nama Anak": rec.child_name,
        "Jenis Kelamin": rec.gender === 'L' ? 'Laki-laki' : 'Perempuan',
        "Tanggal Lahir": new Date(rec.child_dob).toLocaleDateString('id-ID'),
        "Tanggal Ukur": new Date(rec.measurement_date).toLocaleDateString('id-ID'),
        "Berat Badan (kg)": rec.weight_kg,
        "Tinggi Badan (cm)": rec.height_cm,
        "Status Utama": res.primaryStatus,
        "Penjelasan": res.friendlyDetail,
      };

      if (isRegistered) {
        return {
          "Nama Orang Tua": rec.parent_name,
          ...baseRow
        };
      }
      return baseRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    
    // Sesuaikan lebar kolom
    const maxWidths = [5, 20, 15, 12, 12, 15, 15, 20, 50, 20];
    worksheet["!cols"] = maxWidths.map(w => ({ wch: w }));

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const renderTable = (data: any[], isRegistered: boolean) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800">
          Daftar Pengecekan ({data.length} data)
        </h3>
        <button
          onClick={() => exportToExcel(data, `Laporan_${isRegistered ? 'Terdaftar' : 'NonTerdaftar'}_${new Date().toISOString().split('T')[0]}`, isRegistered)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tgl Ukur</th>
              {isRegistered && <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Orang Tua</th>}
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama Anak</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">L/P</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Umur</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">BB</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">TB</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr><td colSpan={isRegistered ? 8 : 7} className="px-4 py-8 text-center text-slate-500">Belum ada data.</td></tr>
            ) : data.map(rec => {
              const res = calcHealthStatus(
                rec.gender,
                new Date(rec.child_dob).toISOString().split('T')[0],
                new Date(rec.measurement_date).toISOString().split('T')[0],
                parseFloat(rec.height_cm),
                parseFloat(rec.weight_kg)
              );
              
              // Hitung umur bulan untuk tampilan
              const dob = new Date(rec.child_dob);
              const md = new Date(rec.measurement_date);
              const months = (md.getFullYear() - dob.getFullYear()) * 12 + (md.getMonth() - dob.getMonth());
              
              return (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{new Date(rec.measurement_date).toLocaleDateString('id-ID')}</td>
                  {isRegistered && <td className="px-4 py-3 text-sm text-slate-900 font-medium">{rec.parent_name}</td>}
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">{rec.child_name}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{rec.gender}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{months} bln</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{rec.weight_kg}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{rec.height_cm}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                      res.alertLevel === 'danger' ? 'bg-red-100 text-red-700' : 
                      res.alertLevel === 'warning' ? 'bg-orange-100 text-orange-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {res.primaryStatus.split(':')[1]?.trim() || res.primaryStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("terdaftar")}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "terdaftar"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Users className={`w-4 h-4 mr-2 ${activeTab === "terdaftar" ? "text-blue-600" : "text-slate-400"}`} />
          Warga Terdaftar
        </button>
        <button
          onClick={() => setActiveTab("non_terdaftar")}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "non_terdaftar"
              ? "border-blue-600 text-blue-600 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <UserMinus className={`w-4 h-4 mr-2 ${activeTab === "non_terdaftar" ? "text-blue-600" : "text-slate-400"}`} />
          Warga Non Terdaftar
        </button>
      </div>

      {activeTab === "terdaftar" ? renderTable(registeredData, true) : renderTable(guestData, false)}
    </div>
  );
}
