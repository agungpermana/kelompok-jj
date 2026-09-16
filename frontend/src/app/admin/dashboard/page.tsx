'use client';

import AdminHeader from '@/components/layout/header';
import StatsCards from '@/components/admin/StatsCards';
import { SetoranChart, KomposisiChart, PoinChart } from '@/components/admin/Charts';
import { PengajuanTable, SetoranValidasiList, AktivitasTerbaru } from '@/components/admin/DashboardTables';

export default function DashboardPage() {
  return (
    <div className="w-full">
      <AdminHeader
        title="Dashboard Admin"
        subtitle="Ringkasan aktivitas pengelolaan bank sampah secara keseluruhan."
      />

      <StatsCards />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
        <SetoranChart />
        <KomposisiChart />
        <PoinChart />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-4 mb-4 sm:mb-5 lg:mb-6">
        <PengajuanTable />
        <SetoranValidasiList />
        <AktivitasTerbaru />
      </div>
    </div>
  );
}
