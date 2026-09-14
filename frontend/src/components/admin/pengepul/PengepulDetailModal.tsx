'use client';

import React from 'react';
import { X } from 'lucide-react';
import { PengepulItem, StatusUser } from '@/types/pengepul';

interface PengepulDetailModalProps {
  isOpen: boolean;
  item: PengepulItem | null;
  onClose: () => void;
  onEdit: (item: PengepulItem) => void;
}

function StatusPill({ status }: { status: StatusUser }) {
  if (status === 'aktif') {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700">
        Aktif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700">
      Nonaktif
    </span>
  );
}

export default function PengepulDetailModal({
  isOpen,
  item,
  onClose,
  onEdit,
}: PengepulDetailModalProps) {
  if (!isOpen || !item) return null;

  const rows = [
    { label: 'Nama Pengepul', value: item.namaPengepul },
    { label: 'Username', value: item.user?.username || '-' },
    { label: 'Email', value: item.user?.email || '-' },
    { label: 'No. Telepon', value: item.noTelepon || '-' },
    { label: 'Alamat', value: item.alamat || '-' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Detail Pengepul</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Informasi lengkap data pengepul.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <div>
              <p className="text-sm font-bold text-gray-900">{item.namaPengepul}</p>
              <p className="text-[11px] text-gray-500">{item.user?.email || '-'}</p>
            </div>
            <StatusPill status={item.user?.status ?? 'aktif'} />
          </div>

          <dl className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4"
              >
                <dt className="text-[11px] font-semibold text-gray-400 uppercase">
                  {row.label}
                </dt>
                <dd className="text-sm font-medium text-gray-700 text-right break-words max-w-[60%]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#16a34a] hover:bg-[#15803d] rounded-lg transition-colors"
          >
            Ubah Data
          </button>
        </div>
      </div>
    </div>
  );
}