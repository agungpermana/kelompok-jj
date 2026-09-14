'use client';

import React from 'react';
import { X, Pencil, Coins, Ticket, Package, RefreshCcw, Info } from 'lucide-react';
import { StatusVoucher, VoucherItem } from '@/types/voucher';
import { formatPoin, labelStatus } from '@/services/voucherService';

interface VoucherDetailModalProps {
  isOpen: boolean;
  item: VoucherItem | null;
  onClose: () => void;
  onEdit: (item: VoucherItem) => void;
}

function StatusBadge({ status }: { status: StatusVoucher }) {
  switch (status) {
    case 'tersedia':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#e6f4ea] text-[#16a34a]">
          {labelStatus(status)}
        </span>
      );
    case 'habis':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-red-600">
          {labelStatus(status)}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500">
          {labelStatus(status)}
        </span>
      );
  }
}

export default function VoucherDetailModal({
  isOpen,
  item,
  onClose,
  onEdit,
}: VoucherDetailModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 flex-shrink-0">
                <Ticket className="h-5 w-5 text-[#16a34a]" strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                {item.namaVoucher}
              </h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-xs text-gray-500 mt-0.5 ml-0">
              Voucher penukaran poin warga
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Key Rates Card */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Coins className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Poin Ditukar
                </span>
              </div>
              <p className="text-xl font-extrabold text-amber-600">
                {formatPoin(item.poinDibutuhkan)}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  Poin
                </span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-[#16a34a] mb-1">
                <Package className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Stok Tersedia
                </span>
              </div>
              <p className="text-xl font-extrabold text-[#16a34a]">
                {item.jumlahTersedia.toLocaleString('id-ID')}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  Voucher
                </span>
              </p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1.5">
                <RefreshCcw className="h-3.5 w-3.5 text-gray-400" />
                Total Ditukar
              </span>
              <span className="font-semibold text-gray-800">
                {(item.totalDitukar ?? 0).toLocaleString('id-ID')} voucher
              </span>
            </div>

            {item.deskripsi ? (
              <div className="pt-2 border-t border-gray-200/60">
                <span className="text-gray-500 flex items-center gap-1.5 mb-1">
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                  Deskripsi Voucher
                </span>
                <p className="text-gray-700 leading-relaxed">{item.deskripsi}</p>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200/60">
                <span className="text-gray-400 flex items-center gap-1.5 mb-1">
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                  Deskripsi Voucher
                </span>
                <p className="text-gray-400 italic">Tidak ada deskripsi.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="h-10 px-4 rounded-xl bg-[#057a44] hover:bg-[#04683a] text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Ubah Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}