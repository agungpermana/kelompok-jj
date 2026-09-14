'use client';

import React from 'react';
import { X, Pencil, Calendar, Coins, DollarSign, Info } from 'lucide-react';
import { HargaPoinItem, StatusHarga } from '@/types/harga-poin';

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

  const statusStyle: Record<StatusHarga, string> = {
    Aktif: 'bg-green-100 text-green-700',
    Nonaktif: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">
              {item.namaJenisSampah}
            </h2>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[item.status]}`}
            >
              {item.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Harga Beli Bank
                </span>
              </div>
              <p className="text-xl font-bold text-green-700">
                {formatRupiah(item.hargaPerSatuan)}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  /{item.satuan}
                </span>
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Coins className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Reward Poin
                </span>
              </div>
              <p className="text-xl font-bold text-amber-600">
                {item.nilaiPoinPerSatuan}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  Poin/{item.satuan}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                Mulai Berlaku
              </span>
              <span className="font-semibold text-gray-800">
                {item.berlakuMulai}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-gray-400" />
                Kategori
              </span>
              <span className="font-semibold text-gray-800">{item.kategori}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Satuan</span>
              <span className="font-semibold text-gray-800">{item.satuan}</span>
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

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#16a34a] hover:bg-[#15803d] rounded-lg transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Ubah Data
          </button>
        </div>
      </div>
    </div>
  );
}