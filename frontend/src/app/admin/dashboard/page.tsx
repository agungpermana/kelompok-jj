'use client';

import AdminHeader from '@/components/layout/header';
import StatsCards from '@/components/admin/StatsCards';
import { SetoranChart, KomposisiChart, PoinChart } from '@/components/admin/Charts';
import { PengajuanTable, SetoranValidasiList, AktivitasTerbaru } from '@/components/admin/DashboardTables';

export default function DashboardPage() {
  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <AdminHeader
        title="Dashboard Admin"
        subtitle="Ringkasan aktivitas pengelolaan bank sampah secara keseluruhan."
      />

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SetoranChart />
        <KomposisiChart />
        <PoinChart />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <PengajuanTable />
        <SetoranValidasiList />
        <AktivitasTerbaru />
      </div>
    </div>
  );
}
