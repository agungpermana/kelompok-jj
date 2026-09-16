'use client';

import { useEffect, useState } from 'react';
import { Truck, CheckCircle, Clock, Weight } from 'lucide-react';
import AdminHeader from '@/components/layout/header';
import { fetchPetugasDashboard, DashboardData, DEFAULT_DASHBOARD_DATA } from '@/services/petugasDashboardService';

export default function PetugasDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData>(DEFAULT_DASHBOARD_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      const data = await fetchPetugasDashboard();
      setDashboard(data);
      setIsLoading(false);
    };

    loadDashboard();
  }, []);

  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { bg: string; text: string; label: string } } = {
      dijadwalkan: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dijadwalkan' },
      sedang_diproses: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Sedang Diproses' },
      selesai: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      dibatalkan: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };
    
    const statusConfig = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return statusConfig;
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <AdminHeader
        title="Dashboard Petugas"
        subtitle="Ringkasan tugas penjemputan dan setoran hari ini."
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Penjemputan Hari Ini</p>
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {isLoading ? '-' : dashboard.penjemputan_hari_ini}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Selesai</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-[#16a34a]">
            {isLoading ? '-' : dashboard.penjemputan_selesai}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Menunggu</p>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-500">
            {isLoading ? '-' : dashboard.penjemputan_menunggu}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">Total Setoran Dikumpul</p>
            <Weight className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {isLoading ? '-' : `${dashboard.total_setoran_dikumpul.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kg`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/80 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Tugas Penjemputan Hari Ini</h3>
            <p className="text-sm text-gray-500 mt-1">Daftar jadwal penjemputan yang dijadwalkan untuk hari ini</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/80 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Nama Warga</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Alamat Penjemputan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">No Telepon</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Jenis Sampah</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Berat</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-500">Memuat data...</p>
                      </div>
                    </td>
                  </tr>
                ) : dashboard.jadwal_hari_ini.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">
                      Tidak ada jadwal penjemputan terbaru hari ini.
                    </td>
                  </tr>
                ) : (
                  dashboard.jadwal_hari_ini.map((jadwal, idx) => {
                    const statusConfig = getStatusBadge(jadwal.status_jadwal);
                    return (
                      <tr key={jadwal.jadwal_id} className="border-b border-gray-200/80 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatTime(jadwal.waktu_penjemputan)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{jadwal.nama_warga}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{jadwal.alamat_penjemputan}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{jadwal.no_telepon}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="space-y-1">
                            {jadwal.detail_sampah.map((sampah, sIdx) => (
                              <div key={sIdx} className="text-xs">
                                {sampah.jenis_sampah}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                          {jadwal.perkiraan_total_berat.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kg
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a
                            href={`/petugas/penjemputan`}
                            className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 transition-colors"
                          >
                            Lihat
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
