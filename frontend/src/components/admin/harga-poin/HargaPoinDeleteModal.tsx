'use client';

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { HargaPoinItem } from '@/types/harga-poin';

interface HargaPoinDeleteModalProps {
  isOpen: boolean;
  item: HargaPoinItem | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (item: HargaPoinItem) => void;
}

export default function HargaPoinDeleteModal({
  isOpen,
  item,
  isLoading = false,
  onClose,
  onConfirm,
}: HargaPoinDeleteModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl mx-4">
        <div className="px-6 pt-6 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center">
            Hapus Data Harga & Poin?
          </h3>
          <p className="text-sm text-gray-600 mt-1 text-center leading-relaxed">
            Apakah Anda yakin ingin menghapus data tarif untuk{' '}
            <strong className="text-gray-800">{item.namaJenisSampah}</strong> (
            {item.kategori})? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-60"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(item)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}