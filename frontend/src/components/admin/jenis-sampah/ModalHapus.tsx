'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { JenisSampahItem } from './ModalTambahEdit';

interface ModalHapusProps {
  isOpen: boolean;
  item: JenisSampahItem | null;
  onClose: () => void;
  onConfirm: (item: JenisSampahItem) => Promise<void>;
}

export default function ModalHapus({
  isOpen,
  item,
  onClose,
  onConfirm,
}: ModalHapusProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      await onConfirm(item);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menghapus data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl mx-4">
        <div className="px-6 pt-6 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center">
            Hapus Jenis Sampah?
          </h3>
          <p className="text-sm text-gray-600 mt-1 text-center leading-relaxed">
            Apakah Anda yakin ingin menghapus data{' '}
            <strong className="text-gray-800">&ldquo;{item.nama_jenis_sampah}&rdquo;</strong>{' '}
            ? Tindakan ini tidak dapat dibatalkan.
          </p>

          {error && (
            <div className="mt-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-60"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}