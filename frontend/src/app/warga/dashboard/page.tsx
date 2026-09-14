'use client';

import AdminHeader from '@/components/layout/header';

export default function WargaDashboardPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <AdminHeader
        title="Dashboard Warga"
        subtitle="Ringkasan aktivitas pengelolaan sampah Anda."
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Setoran</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Berat</p>
          <p className="text-2xl font-bold text-gray-900">45,2 kg</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Poin Aktif</p>
          <p className="text-2xl font-bold text-[#16a34a]">1.250</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Penjemputan Aktif</p>
          <p className="text-2xl font-bold text-amber-500">1</p>
        </div>
      </div>
    </div>
  );
}
