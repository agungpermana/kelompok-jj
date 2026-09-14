'use client';

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { VoucherItem } from '@/types/voucher';

interface VoucherDeleteModalProps {
  isOpen: boolean;
  item: VoucherItem | null;
  onClose: () => void;
  onConfirm: (item: VoucherItem) => void;
}

export default function VoucherDeleteModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}: VoucherDeleteModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 flex-shrink-0">
            <AlertTriangle className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Hapus Data Voucher?
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus voucher{' '}
              <strong className="text-gray-800">{item.namaVoucher}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(item)}
            className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}