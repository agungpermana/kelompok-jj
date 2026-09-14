'use client';

import React from 'react';
import { Bell, ChevronDown, CalendarDays, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
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
    <div className="mb-6">
      <header className="flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm">
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#16a34a] px-1 text-[10px] font-bold text-white shadow-sm">
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

      {/* Breadcrumbs Row if provided */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-xs text-gray-400 mt-3">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <span className="text-gray-300">&gt;</span>}
                {isLast ? (
                  <span className="font-semibold text-[#16a34a]">
                    {crumb.label}
                  </span>
                ) : crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-500">{crumb.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}
    </div>
  );
}
