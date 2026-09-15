'use client';

import AdminHeader from '@/components/layout/header';

export default function PetugasDashboardPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      <AdminHeader
        title="Dashboard Petugas"
        subtitle="Ringkasan tugas penjemputan dan setoran hari ini."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Penjemputan Hari Ini</p>
          <p className="text-2xl font-bold text-gray-900">5</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Selesai</p>
          <p className="text-2xl font-bold text-[#16a34a]">3</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Menunggu</p>
          <p className="text-2xl font-bold text-amber-500">2</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Setoran Dikumpul</p>
          <p className="text-2xl font-bold text-gray-900">78,5 kg</p>
        </div>
      </div>
    </div>
  );
}
