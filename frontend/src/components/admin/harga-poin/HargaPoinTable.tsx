'use client';

import React from 'react';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { HargaPoinItem } from '@/types/harga-poin';

interface HargaPoinTableProps {
  items: HargaPoinItem[];
  totalData: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView: (item: HargaPoinItem) => void;
  onEdit: (item: HargaPoinItem) => void;
  onDelete: (item: HargaPoinItem) => void;
}

export default function HargaPoinTable({
  items,
  totalData,
  currentPage,
  itemsPerPage,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: HargaPoinTableProps) {
  const totalPages = Math.ceil(totalData / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + items.length, totalData);

  const formatRupiah = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div>
      {/* Total Data Count Header */}
      <div className="mb-3 px-1">
        <h3 className="text-sm font-semibold text-gray-700">
          Total {totalData} data
        </h3>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 px-5 text-xs font-semibold text-gray-700 w-14">
                  No.
                </th>
                <th className="py-4 px-5 text-xs font-semibold text-gray-700">
                  Jenis Sampah
                </th>
                <th className="py-4 px-5 text-xs font-semibold text-gray-700">
                  Satuan
                </th>
                <th className="py-4 px-5 text-xs font-semibold text-gray-700">
                  Harga (Rp/Kg)
                </th>
                <th className="py-4 px-5 text-xs font-semibold text-gray-700">
                  Poin (Poin/Kg)
                </th>
                <th className="py-4 px-5 text-xs font-semibold text-gray-700">
                  Berlaku Mulai
                </th>
                <th className="py-4 px-5 text-xs font-semibold text-gray-700">
                  Status
                </th>
                <th className="py-4 px-5 text-xs font-semibold text-gray-700 text-center w-32">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-sm text-gray-400"
                  >
                    Tidak ada data harga & poin yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const rowNumber = startIndex + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* No. */}
                      <td className="py-4 px-5 text-xs text-gray-600 font-medium">
                        {rowNumber}
                      </td>

                      {/* Jenis Sampah */}
                      <td className="py-4 px-5">
                        <span className="text-sm font-semibold text-gray-800">
                          {item.namaJenisSampah}
                        </span>
                      </td>

                      {/* Satuan */}
                      <td className="py-4 px-5 text-sm text-gray-600">
                        {item.satuan}
                      </td>

                      {/* Harga (Rp/Kg) in bold green */}
                      <td className="py-4 px-5">
                        <span className="text-sm font-bold text-[#16a34a]">
                          {formatRupiah(item.hargaPerSatuan)}
                        </span>
                      </td>

                      {/* Poin (Poin/Kg) */}
                      <td className="py-4 px-5 text-sm text-gray-700 font-medium">
                        {item.nilaiPoinPerSatuan}
                      </td>

                      {/* Berlaku Mulai */}
                      <td className="py-4 px-5 text-sm text-gray-600">
                        {item.berlakuMulai}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {item.status === 'Aktif' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#16a34a]">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Detail Button */}
                          <button
                            type="button"
                            onClick={() => onView(item)}
                            title="Lihat Detail"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            title="Ubah Data"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-[#16a34a] hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            title="Hapus Data"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
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

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
          <p className="text-xs text-gray-500">
            Menampilkan {totalData === 0 ? 0 : startIndex + 1} - {endIndex} dari{' '}
            {totalData} data
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`flex h-8 min-w-8 px-2.5 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  pageNum === currentPage
                    ? 'bg-[#057a44] text-white shadow-sm'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
