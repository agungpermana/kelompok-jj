'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Scale,
  ArrowLeftRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('trashure_token') || localStorage.getItem('token') || '';
};

interface DashboardStats {
  total_warga: number;
  total_petugas: number;
  setoran_7_hari: number;
  persen_setoran: number;
  transaksi_hari_ini: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const headers: HeadersInit = { Accept: 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/admin/dashboard`, { headers });
        if (res.ok) {
          const json = await res.json();
          setStats(json.data?.stats || null);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatKg = (v: number) => v.toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' kg';
  const formatNum = (v: number) => v.toLocaleString('id-ID');

  const cards = [
    {
      title: 'Total Warga',
      value: loading ? '...' : formatNum(stats?.total_warga ?? 0),
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Total Petugas',
      value: loading ? '...' : formatNum(stats?.total_petugas ?? 0),
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Total Setoran (7 Hari)',
      value: loading ? '...' : formatKg(stats?.setoran_7_hari ?? 0),
      icon: Scale,
      change: stats?.persen_setoran != null ? `${stats.persen_setoran > 0 ? '+' : ''}${stats.persen_setoran}%` : undefined,
      changeLabel: 'dari 7 hari sebelumnya',
      isPositive: (stats?.persen_setoran ?? 0) >= 0,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Transaksi Hari Ini',
      value: loading ? '...' : formatNum(stats?.transaksi_hari_ini ?? 0),
      icon: ArrowLeftRight,
      link: '/admin/transaksi-penjualan',
      linkLabel: 'Lihat detail transaksi',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((stat) => (
        <div
          key={stat.title}
          className="relative bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-[18px] w-[18px] ${stat.iconColor}`} strokeWidth={1.8} />
              </div>
              <span className="text-xs font-medium text-gray-500 leading-tight">{stat.title}</span>
            </div>

            <p className="text-xl font-bold text-gray-900 mb-1.5">{stat.value}</p>

            {stat.change && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className={`flex items-center gap-0.5 font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
                <span className="text-gray-400">{stat.changeLabel}</span>
              </div>
            )}

            {stat.link && (
              <a
                href={stat.link}
                className="flex items-center gap-1 text-[11px] font-medium text-[#16a34a] hover:text-[#15803d] transition-colors"
              >
                {stat.linkLabel}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
