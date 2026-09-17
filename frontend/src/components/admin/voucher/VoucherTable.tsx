'use client';

import React from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { VoucherItem, StatusVoucher } from '@/types/voucher';
import { formatPoin, labelStatus } from '@/services/voucherService';

interface VoucherTableProps {
  items: VoucherItem[];
  totalData: number;
  currentPage: number;
  itemsPerPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onView: (item: VoucherItem) => void;
  onEdit: (item: VoucherItem) => void;
  onDelete: (item: VoucherItem) => void;
}

function StatusBadge({ status }: { status: StatusVoucher }) {
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

export default function VoucherTable({
  items,
  totalData,
  currentPage,
  itemsPerPage,
  isLoading = false,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: VoucherTableProps) {
  const totalPages = Math.ceil(totalData / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + items.length, totalData);
  const lastPage = Math.max(totalPages, 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Desktop Table - hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-14">
                No
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Nama Voucher
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Poin Ditukar
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Tersedia
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Ditukar
              </th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-300" />
                  Memuat data...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-gray-400"
                >
                  Tidak ada data voucher ditemukan.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const rowNumber = startIndex + idx + 1;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {rowNumber}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-700">
                        {item.namaVoucher}
                      </p>
                      {item.deskripsi && (
                        <p className="text-xs text-gray-400 max-w-[220px] truncate">
                          {item.deskripsi}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-amber-600">
                      {formatPoin(item.poinDibutuhkan)} poin
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {item.jumlahTersedia.toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {(item.totalDitukar ?? 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onView(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - visible only on mobile */}
      <div className="lg:hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-300" />
            Memuat data...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Tidak ada data voucher ditemukan.
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {items.map((item, idx) => {
              const rowNumber = startIndex + idx + 1;
              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{item.namaVoucher}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Voucher #{rowNumber}</p>
                      {item.deskripsi && (
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{item.deskripsi}</p>
                      )}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Poin Ditukar:</span>
                      <span className="font-medium text-amber-600">{formatPoin(item.poinDibutuhkan)} poin</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tersedia:</span>
                      <span className="text-gray-700 font-medium">{item.jumlahTersedia.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sudah Ditukar:</span>
                      <span className="text-gray-700">{(item.totalDitukar ?? 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => onView(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Detail
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <p className="text-[11px] text-gray-400">
          Menampilkan {totalData > 0 ? startIndex + 1 : 0} - {endIndex} dari{' '}
          {totalData} voucher
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                currentPage === page
                  ? 'bg-[#16a34a] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}