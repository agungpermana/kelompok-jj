import React from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, CalendarDays, User, ChevronRight } from 'lucide-react';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function AdminHeader({ title, subtitle, breadcrumbs }: AdminHeaderProps) {
  const today = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <header className="flex items-start justify-between mb-6">
      {/* Left: Title & Breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-medium">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                  {isLast ? (
                    <span className="text-[#16a34a] font-semibold">{crumb.label}</span>
                  ) : crumb.href ? (
                    <Link href={crumb.href} className="hover:text-gray-700 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
            3
          </span>
        </button>

        {/* Date */}
        <div className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-3.5 py-2 text-sm text-gray-600 shadow-sm">
          <CalendarDays className="h-4 w-4 text-gray-400" strokeWidth={1.8} />
          <span className="font-medium">{dateStr}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 rounded-xl bg-white border border-gray-200 px-3.5 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a]">
            <User className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">Admin Bank Sampah</p>
            <p className="text-[11px] text-gray-400 leading-tight">Super Admin</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1" />
        </div>
      </div>
    </header>
  );
}
