'use client';

import React from 'react';
import { X, Pencil, Calendar, Coins, DollarSign, Info } from 'lucide-react';
import { HargaPoinItem } from '@/types/harga-poin';

interface HargaPoinDetailModalProps {
  isOpen: boolean;
  item: HargaPoinItem | null;
  onClose: () => void;
  onEdit: (item: HargaPoinItem) => void;
}

export default function HargaPoinDetailModal({
  isOpen,
  item,
  onClose,
  onEdit,
}: HargaPoinDetailModalProps) {
  if (!isOpen || !item) return null;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

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
              <h3 className="text-base font-bold text-gray-900">
                {item.namaJenisSampah}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                  item.status === 'Aktif'
                    ? 'bg-[#e6f4ea] text-[#16a34a]'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Kategori: <span className="font-semibold text-gray-700">{item.kategori}</span> • Satuan: <span className="font-semibold text-gray-700">{item.satuan}</span>
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
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-[#16a34a] mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Harga Beli Bank
                </span>
              </div>
              <p className="text-xl font-extrabold text-[#16a34a]">
                {formatRupiah(item.hargaPerSatuan)}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  /{item.satuan}
                </span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Coins className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Reward Poin
                </span>
              </div>
              <p className="text-xl font-extrabold text-amber-600">
                {item.nilaiPoinPerSatuan}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  Poin/{item.satuan}
                </span>
              </p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                Mulai Berlaku
              </span>
              <span className="font-semibold text-gray-800">
                {item.berlakuMulai}
              </span>
            </div>

            {item.keterangan && (
              <div className="pt-2 border-t border-gray-200/60">
                <span className="text-gray-500 flex items-center gap-1.5 mb-1">
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                  Keterangan Kondisi
                </span>
                <p className="text-gray-700 leading-relaxed">
                  {item.keterangan}
                </p>
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
