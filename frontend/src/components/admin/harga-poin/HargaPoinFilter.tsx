'use client';

import React from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { FilterState } from '@/types/harga-poin';

interface HargaPoinFilterProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  jenisOptions: string[];
  kategoriOptions: string[];
  satuanOptions: string[];
  onOpenCreateModal: () => void;
}

export default function HargaPoinFilter({
  filter,
  onFilterChange,
  jenisOptions,
  kategoriOptions,
  satuanOptions,
  onOpenCreateModal,
}: HargaPoinFilterProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-4 border border-gray-200/80 shadow-sm mb-4 sm:mb-5 lg:mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-2.5 sm:gap-3 lg:gap-3.5">
        <div className="flex flex-1 flex-wrap items-end gap-2 sm:gap-3 lg:gap-3.5">
          <div className="flex-1 min-w-[200px] sm:min-w-[220px]">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400" />
              <input
                type="text"
                value={filter.search}
                onChange={(e) =>
                  onFilterChange({ ...filter, search: e.target.value })
                }
                placeholder="Cari jenis sampah..."
                className="w-full h-9 sm:h-10 lg:h-11 pl-8 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-gray-800 bg-white border border-gray-200 rounded-lg sm:rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all"
              />
            </div>
          </div>

          <div className="min-w-[140px] sm:min-w-[150px]">
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">
              Jenis Sampah
            </label>
            <div className="relative">
              <select
                value={filter.jenisSampah}
                onChange={(e) =>
                  onFilterChange({ ...filter, jenisSampah: e.target.value })
                }
                className="w-full h-9 sm:h-10 lg:h-11 appearance-none bg-white border border-gray-200 rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 pr-7 sm:pr-9 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] cursor-pointer transition-all"
              >
                <option value="">Semua Jenis</option>
                {jenisOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="min-w-[140px] sm:min-w-[150px]">
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">
              Kategori
            </label>
            <div className="relative">
              <select
                value={filter.kategori}
                onChange={(e) =>
                  onFilterChange({ ...filter, kategori: e.target.value })
                }
                className="w-full h-9 sm:h-10 lg:h-11 appearance-none bg-white border border-gray-200 rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 pr-7 sm:pr-9 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] cursor-pointer transition-all"
              >
                <option value="">Semua Kategori</option>
                {kategoriOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Satuan Dropdown */}
          <div className="min-w-[130px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Satuan
            </label>
            <div className="relative">
              <select
                value={filter.satuan}
                onChange={(e) =>
                  onFilterChange({ ...filter, satuan: e.target.value })
                }
                className="w-full h-11 appearance-none bg-white border border-gray-200 rounded-xl px-3.5 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] cursor-pointer transition-all"
              >
                <option value="">Semua Satuan</option>
                {satuanOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Side: + Tambah Harga & Poin Button */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="h-11 px-5 rounded-xl bg-[#057a44] hover:bg-[#04683a] active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>Tambah Harga & Poin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
