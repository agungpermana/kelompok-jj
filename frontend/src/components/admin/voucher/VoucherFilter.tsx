'use client';

import React from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { FilterState } from '@/types/voucher';

interface VoucherFilterProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  statusOptions: string[];
  onOpenCreateModal: () => void;
}

export default function VoucherFilter({
  filter,
  onFilterChange,
  statusOptions,
  onOpenCreateModal,
}: VoucherFilterProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4">
        {/* Left Side: Search + Dropdown Filters */}
        <div className="flex flex-1 flex-wrap items-end gap-3.5">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[220px]">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filter.search}
                onChange={(e) =>
                  onFilterChange({ ...filter, search: e.target.value })
                }
                placeholder="Cari nama voucher..."
                className="w-full h-11 pl-10 pr-4 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="min-w-[150px]">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                value={filter.status}
                onChange={(e) =>
                  onFilterChange({ ...filter, status: e.target.value })
                }
                className="w-full h-11 appearance-none bg-white border border-gray-200 rounded-xl px-3.5 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] cursor-pointer transition-all"
              >
                <option value="">Semua Status</option>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Side: + Tambah Voucher Button */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="h-11 px-5 rounded-xl bg-[#057a44] hover:bg-[#04683a] active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span>Tambah Voucher</span>
          </button>
        </div>
      </div>
    </div>
  );
}