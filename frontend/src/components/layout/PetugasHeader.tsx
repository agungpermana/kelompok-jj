'use client';

import { Calendar, ChevronDown } from 'lucide-react';

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
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[14px] text-gray-500 font-normal mt-1 leading-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-3 self-start md:self-auto">
        {/* Date Selector Pill */}
        <div className="flex items-center gap-2.5 rounded-2xl bg-white border border-gray-200/90 px-4 py-2.5 shadow-sm text-gray-700 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors">
          <Calendar className="h-4 w-4 text-gray-500" strokeWidth={1.8} />
          <span>{selectedDate}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-1" />
        </div>
      </div>
    </div>
  );
}
