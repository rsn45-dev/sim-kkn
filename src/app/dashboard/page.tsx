import { Scale, Ruler, Users, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Ringkasan Data Stunting Anak</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Total Anak Terdata</dt>
                  <dd className="text-2xl font-semibold text-slate-900">128</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <Scale className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Normal (BB/TB)</dt>
                  <dd className="text-2xl font-semibold text-slate-900">95</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Risiko Stunting</dt>
                  <dd className="text-2xl font-semibold text-slate-900">21</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <Ruler className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Stunting (Sangat Pendek)</dt>
                  <dd className="text-2xl font-semibold text-slate-900">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Data Baru Section */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-slate-900 mb-4">
            Input Pengukuran Baru
          </h3>
          <form className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="child_name" className="block text-sm font-medium text-slate-700">Nama Anak</label>
              <div className="mt-1">
                <input type="text" name="child_name" id="child_name" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" placeholder="Contoh: Budi Susanto" />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="age_months" className="block text-sm font-medium text-slate-700">Umur (Bulan)</label>
              <div className="mt-1">
                <input type="number" name="age_months" id="age_months" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="weight" className="block text-sm font-medium text-slate-700">Berat (kg)</label>
              <div className="mt-1">
                <input type="number" step="0.1" name="weight" id="weight" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="height" className="block text-sm font-medium text-slate-700">Tinggi (cm)</label>
              <div className="mt-1">
                <input type="number" step="0.1" name="height" id="height" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-1 flex items-end">
              <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recent Data Table */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-5 border-b border-slate-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-slate-900">
            Data Pengukuran Terakhir
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Anak</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Umur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">BB / TB</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Ahmad Rizki</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">24 Bulan</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">12.5 kg / 88 cm</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Normal</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">12 Agustus 2026</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Siti Aminah</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">36 Bulan</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">11.0 kg / 85 cm</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Risiko</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">10 Agustus 2026</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Budi Santoso</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">18 Bulan</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">8.5 kg / 74 cm</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Stunting</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">08 Agustus 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
