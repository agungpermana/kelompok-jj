'use client';

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { VoucherItem } from '@/types/voucher';

interface VoucherDeleteModalProps {
  isOpen: boolean;
  item: VoucherItem | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (item: VoucherItem) => void;
}

export default function VoucherDeleteModal({
  isOpen,
  item,
  isSubmitting = false,
  onClose,
  onConfirm,
}: VoucherDeleteModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl mx-4">
        <div className="px-6 py-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Voucher?</h3>
          <p className="text-sm text-gray-500">
            Data voucher <span className="font-semibold">{item.namaVoucher}</span>{' '}
            akan dihapus secara permanen.
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-60"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(item)}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}