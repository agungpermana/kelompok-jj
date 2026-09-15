'use client';

import {
  Users,
  UserCheck,
  Scale,
  Star,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeLabel?: string;
  isPositive?: boolean;
  link?: string;
  linkLabel?: string;
  iconBg: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Warga',
    value: '1.248',
    icon: Users,
    change: '+12,5%',
    changeLabel: 'dari 7 hari sebelumnya',
    isPositive: true,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Total Petugas',
    value: '28',
    icon: UserCheck,
    change: '+7,1%',
    changeLabel: 'dari 7 hari sebelumnya',
    isPositive: true,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Total Setoran (7 Hari)',
    value: '186,4 kg',
    icon: Scale,
    change: '+18,7%',
    changeLabel: 'dari 7 hari sebelumnya',
    isPositive: true,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    title: 'Total Poin Diberikan',
    value: '18.560',
    icon: Star,
    change: '+14,3%',
    changeLabel: 'dari 7 hari sebelumnya',
    isPositive: true,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Saldo Bank Sampah',
    value: 'Rp 5.236.000',
    icon: Wallet,
    change: '+9,8%',
    changeLabel: 'dari 7 hari sebelumnya',
    isPositive: true,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
  },
  {
    title: 'Transaksi Hari Ini',
    value: '32',
    icon: ArrowLeftRight,
    link: '/admin/transaksi',
    linkLabel: 'Lihat detail transaksi',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="relative bg-white rounded-xl border border-gray-200/80 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 group overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            {/* Icon + Title */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-[18px] w-[18px] ${stat.iconColor}`} strokeWidth={1.8} />
              </div>
              <span className="text-xs font-medium text-gray-500 leading-tight">{stat.title}</span>
            </div>

            {/* Value */}
            <p className="text-xl font-bold text-gray-900 mb-1.5">{stat.value}</p>

            {/* Change */}
            {stat.change && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className={`flex items-center gap-0.5 font-semibold ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
                <span className="text-gray-400">{stat.changeLabel}</span>
              </div>
            )}

            {/* Link */}
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
