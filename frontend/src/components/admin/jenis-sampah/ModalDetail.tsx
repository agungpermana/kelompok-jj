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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Detail Jenis Sampah</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 truncate">
              {item.nama_jenis_sampah}
            </h4>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isAktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isAktif ? 'Aktif' : 'Nonaktif'}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-white text-gray-700 border border-gray-200">
                Satuan: {item.satuan}
              </span>
            </div>
          </div>

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
              <span className={`font-semibold ${isAktif ? 'text-green-700' : 'text-gray-500'}`}>
                {isAktif ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            {item.keterangan && (
              <div className="pt-1">
                <span className="text-gray-400 flex items-center gap-1.5 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  Keterangan:
                </span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed text-xs">
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
            <Edit3 className="h-3.5 w-3.5" />
            Edit Jenis Sampah
          </button>
        </div>
      </div>
    </div>
  );
}