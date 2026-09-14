'use client';

import React from 'react';
import { X } from 'lucide-react';
import { StatusVoucher, VoucherItem } from '@/types/voucher';
import { formatPoin, labelStatus } from '@/services/voucherService';

interface VoucherDetailModalProps {
  isOpen: boolean;
  item: VoucherItem | null;
  onClose: () => void;
  onEdit: (item: VoucherItem) => void;
}

function StatusPill({ status }: { status: StatusVoucher }) {
  const map: Record<StatusVoucher, string> = {
    tersedia: 'bg-green-100 text-green-700',
    habis: 'bg-red-100 text-red-700',
    tidak_aktif: 'bg-gray-100 text-gray-600',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[status]}`}
    >
      {labelStatus(status)}
    </span>
  );
}

export default function VoucherDetailModal({
  isOpen,
  item,
  onClose,
  onEdit,
}: VoucherDetailModalProps) {
  if (!isOpen || !item) return null;

  const rows = [
    { label: 'Nama Voucher', value: item.namaVoucher },
    { label: 'Poin Ditukar', value: `${formatPoin(item.poinDibutuhkan)} poin` },
    {
      label: 'Jumlah Tersedia',
      value: `${item.jumlahTersedia.toLocaleString('id-ID')} voucher`,
    },
    {
      label: 'Total Ditukar',
      value: `${(item.totalDitukar ?? 0).toLocaleString('id-ID')} voucher`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Detail Voucher</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Informasi lengkap voucher penukaran poin.
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
              <p className="text-sm font-bold text-gray-900">{item.namaVoucher}</p>
              <p className="text-[11px] text-gray-500">Voucher penukaran poin warga</p>
            </div>
            <StatusPill status={item.status} />
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

          {item.deskripsi && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase mb-1">
                Deskripsi Voucher
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.deskripsi}
              </p>
            </div>
          )}
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
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#16a34a] hover:bg-[#15803d] rounded-lg transition-colors"
          >
            Ubah Data
          </button>
        </div>
      </div>
    </div>
  );
}