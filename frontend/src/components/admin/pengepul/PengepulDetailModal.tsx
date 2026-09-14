'use client';

import React from 'react';
import { X, Recycle, Mail, User as UserIcon, Phone, MapPin } from 'lucide-react';
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
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-[#e6f4ea] text-[#16a34a]">
        Aktif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-50 text-red-600">
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Detail Pengepul
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Informasi lengkap data pengepul.
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
        <div className="p-6">
          {/* Profile Card */}
          <div className="flex items-center gap-4 p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16a34a] text-white flex-shrink-0">
              <Recycle className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">
                {item.namaPengepul}
              </h4>
              <div className="mt-1">
                <StatusPill status={item.user?.status ?? 'aktif'} />
              </div>
            </div>
          </div>

          {/* Data List */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <UserIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">
                  Username
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {item.user?.username || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {item.user?.email || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">
                  No. Telepon
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {item.noTelepon || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">
                  Alamat
                </p>
                <p className="text-sm font-medium text-gray-800 leading-relaxed">
                  {item.alamat || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onEdit(item);
            }}
            className="h-10 px-5 rounded-xl bg-[#057a44] hover:bg-[#04683a] active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all"
          >
            Ubah Data
          </button>
        </div>
      </div>
    </div>
  );
}