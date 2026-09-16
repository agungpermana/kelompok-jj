'use client';

import AdminHeader from '@/components/layout/header';

export default function PengepulDashboardPage() {
  return (
    <div className="w-full">
      <AdminHeader
        title="Dashboard Pengepul"
        subtitle="Ringkasan stok dan penjualan sampah."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Stok</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">324,8 kg</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Penjualan Bulan Ini</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#16a34a]">Rp 4.520.000</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Saldo</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Rp 12.350.000</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Transaksi Pending</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-500">3</p>
        </div>
      </div>
    </div>
  );
}
