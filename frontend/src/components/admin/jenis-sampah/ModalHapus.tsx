'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden p-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 mb-4 shadow-sm">
          <AlertTriangle className="h-7 w-7" />
        </div>

        {/* Title & Desc */}
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Hapus Jenis Sampah?
        </h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Apakah Anda yakin ingin menghapus data{' '}
          <span className="font-semibold text-gray-800">
            &ldquo;{item.nama_jenis_sampah}&rdquo;
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>

        {error && (
          <div className="mb-4 text-left p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}
