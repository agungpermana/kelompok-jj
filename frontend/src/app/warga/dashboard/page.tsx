'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/layout/header';
import { fetchWargaDashboard, DashboardData, DEFAULT_DASHBOARD_DATA } from '@/services/wargaDashboardService';

export default function WargaDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData>(DEFAULT_DASHBOARD_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      const data = await fetchWargaDashboard();
      setDashboard(data);
      setIsLoading(false);
    };

    loadDashboard();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { bg: string; text: string; label: string } } = {
      diajukan: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Menunggu Proses' },
      dijadwalkan: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dijadwalkan' },
      diproses: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Di Proses' },
      selesai: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      dibatalkan: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };

    const statusConfig = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return statusConfig;
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      <AdminHeader
        title="Dashboard Warga"
        subtitle="Ringkasan aktivitas pengelolaan sampah Anda."
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Setoran</p>
          <p className="text-2xl font-bold text-gray-900">
            {isLoading ? '-' : dashboard.total_setoran}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Berat</p>
          <p className="text-2xl font-bold text-gray-900">
            {isLoading ? '-' : `${dashboard.total_berat_sampah.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kg`}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Poin Aktif</p>
          <p className="text-2xl font-bold text-[#16a34a]">
            {isLoading ? '-' : dashboard.total_poin_aktif.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Penjemputan Aktif</p>
          <p className="text-2xl font-bold text-amber-500">
            {isLoading ? '-' : dashboard.penjemputan_aktif}
          </p>
        </div>
      </div>

      {dashboard.pengajuan_terbaru.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/80 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Pengajuan Penjemputan Terbaru</h3>
            <p className="text-sm text-gray-500 mt-1">Pengajuan yang belum diproses oleh admin maupun petugas</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200/80 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Tanggal Dibuat</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Alamat Penjemputan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Jenis Sampah</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Berat</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.pengajuan_terbaru.map((pengajuan, idx) => {
                  const statusConfig = getStatusBadge(pengajuan.status_pengajuan);
                  return (
                    <tr key={pengajuan.pengajuan_id} className="border-b border-gray-200/80 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(pengajuan.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{pengajuan.alamat_penjemputan}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="space-y-1">
                          {pengajuan.detail_sampah.map((sampah, sIdx) => (
                            <div key={sIdx} className="text-xs">
                              {sampah.jenis_sampah}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        {pengajuan.perkiraan_total_berat.toLocaleString('id-ID', { maximumFractionDigits: 1 })} kg
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={`/warga/riwayat-setoran`}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 transition-colors"
                        >
                          Lihat
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
