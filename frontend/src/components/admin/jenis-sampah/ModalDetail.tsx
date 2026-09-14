'use client';

import React from 'react';
import { X, Edit3, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { JenisSampahItem } from './ModalTambahEdit';

interface ModalDetailProps {
  isOpen: boolean;
  item: JenisSampahItem | null;
  onClose: () => void;
  onEdit: (item: JenisSampahItem) => void;
}

export default function ModalDetail({
  isOpen,
  item,
  onClose,
  onEdit,
}: ModalDetailProps) {
  if (!isOpen || !item) return null;

  const isAktif = item.status === 'aktif';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-bold text-gray-900">Detail Jenis Sampah</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Top Hero with Icon & Title */}
          <div className="p-4 rounded-2xl bg-[#f8fafc] border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 truncate">
              {item.nama_jenis_sampah}
            </h4>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isAktif
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAktif ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  {isAktif ? 'Aktif' : 'Nonaktif'}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  Satuan: {item.satuan}
                </span>
              </div>
          </div>

          {/* Details List */}
          <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center py-1 border-b border-gray-50">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-gray-400" />
                Satuan Penimbangan
              </span>
              <span className="font-semibold text-gray-800">{item.satuan}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-gray-50">
              <span className="text-gray-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
                Status Ketersediaan
              </span>
              <span className={`font-semibold ${isAktif ? 'text-emerald-600' : 'text-gray-500'}`}>
                {isAktif ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            {item.keterangan && (
              <div className="pt-1">
                <span className="text-gray-400 flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  Keterangan:
                </span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed text-xs">
                  {item.keterangan}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-gray-50/70 border-t border-gray-100">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Jenis Sampah
          </button>
        </div>
      </div>
    </div>
  );
}
