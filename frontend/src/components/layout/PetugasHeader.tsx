'use client';

import { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronDown } from 'lucide-react';
import PetugasAvatar from '@/components/common/PetugasAvatar';

interface PetugasHeaderProps {
  title: string;
  subtitle?: string;
  selectedDate?: string;
  onDateChange?: (dateStr: string) => void;
}

export default function PetugasHeader({
  title,
  subtitle,
  selectedDate = 'Kamis, 22 Agustus 2024',
}: PetugasHeaderProps) {
  const [userName, setUserName] = useState('Ahmad Fauzi');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('trashure_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.nama || u.nama_petugas || u.username) {
          setUserName(u.nama || u.nama_petugas || 'Ahmad Fauzi');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-7">
      {/* Title & Subtitle */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-[26px] font-extrabold text-gray-900 tracking-tight leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-[14px] text-gray-500 font-normal mt-1 leading-normal line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto flex-shrink-0">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifikasi"
          className="relative flex h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-white border border-gray-200/90 text-gray-600 hover:bg-gray-50 shadow-sm transition-all"
        >
          <Bell className="h-4 sm:h-5 w-4 sm:w-5" strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full bg-[#16a34a] text-[9px] sm:text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
            3
          </span>
        </button>

        {/* Date Selector Pill - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2.5 rounded-2xl bg-white border border-gray-200/90 px-4 py-2.5 shadow-sm text-gray-700 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors">
          <Calendar className="h-4 w-4 text-gray-500" strokeWidth={1.8} />
          <span className="whitespace-nowrap">{selectedDate}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1" />
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-xl sm:rounded-2xl bg-white border border-gray-200/90 px-2 sm:px-3 py-1.5 sm:py-1.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <PetugasAvatar size={30} />
          <div className="hidden sm:block text-left pr-1">
            <p className="text-[13px] font-bold text-gray-800 leading-tight">
              {userName}
            </p>
            <p className="text-[11px] font-medium text-gray-400 leading-tight mt-0.5">
              Petugas
            </p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 sm:ml-1" />
        </div>
      </div>
    </div>
  );
}
