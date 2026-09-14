'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Ticket } from 'lucide-react';
import { StatusVoucher, VoucherFormData, VoucherItem } from '@/types/voucher';

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<VoucherItem>) => void;
  initialItem?: VoucherItem | null;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

const STATUS_OPTIONS: { value: StatusVoucher; label: string }[] = [
  { value: 'tersedia', label: 'Tersedia' },
  { value: 'habis', label: 'Habis' },
  { value: 'tidak_aktif', label: 'Tidak Aktif' },
];

export default function VoucherFormModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
  mode,
  isSubmitting = false,
}: VoucherFormModalProps) {
  const [namaVoucher, setNamaVoucher] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [poinDibutuhkan, setPoinDibutuhkan] = useState<number | ''>('');
  const [jumlahTersedia, setJumlahTersedia] = useState<number | ''>('');
  const [status, setStatus] = useState<StatusVoucher>('tersedia');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialItem && mode === 'edit') {
      setNamaVoucher(initialItem.namaVoucher);
      setDeskripsi(initialItem.deskripsi || '');
      setPoinDibutuhkan(initialItem.poinDibutuhkan);
      setJumlahTersedia(initialItem.jumlahTersedia);
      setStatus(initialItem.status);
    } else {
      setNamaVoucher('');
      setDeskripsi('');
      setPoinDibutuhkan('');
      setJumlahTersedia('');
      setStatus('tersedia');
    }
    setErrors({});
  }, [initialItem, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!namaVoucher.trim()) {
      err.namaVoucher = 'Nama voucher wajib diisi.';
    }
    if (poinDibutuhkan === '' || Number(poinDibutuhkan) <= 0) {
      err.poinDibutuhkan = 'Poin yang dibutuhkan harus lebih dari 0.';
    }
    if (jumlahTersedia === '' || Number(jumlahTersedia) < 0) {
      err.jumlahTersedia = 'Jumlah tersedia tidak boleh negatif.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: VoucherFormData = {
      namaVoucher: namaVoucher.trim(),
      deskripsi: deskripsi.trim(),
      poinDibutuhkan: Number(poinDibutuhkan),
      jumlahTersedia: Number(jumlahTersedia),
      status,
    };

    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      ...payload,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {mode === 'create' ? 'Tambah Voucher' : 'Ubah Voucher'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'create'
                ? 'Tambahkan voucher penukaran poin baru untuk warga.'
                : `Perbarui data voucher "${initialItem?.namaVoucher}".`}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Info Card */}
          <div className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16a34a]/10 flex-shrink-0">
              <Ticket className="h-5 w-5 text-[#16a34a]" strokeWidth={1.8} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Voucher ditukar warga menggunakan poin. Tentukan nama, jumlah poin,
              dan stok ketersediaan voucher.
            </p>
          </div>

          {/* Nama Voucher */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Voucher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={namaVoucher}
              onChange={(e) => setNamaVoucher(e.target.value)}
              placeholder="Contoh: Voucher Rp10.000"
              className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.namaVoucher
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                }`}
            />
            {errors.namaVoucher && (
              <p className="text-[11px] text-red-500 mt-1">{errors.namaVoucher}</p>
            )}
          </div>

          {/* Poin & Jumlah Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Poin Dibutuhkan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-amber-500">
                  POIN
                </span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={poinDibutuhkan}
                  onChange={(e) =>
                    setPoinDibutuhkan(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="1000"
                  className={`w-full h-10 pr-14 pl-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.poinDibutuhkan
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                    }`}
                />
              </div>
              {errors.poinDibutuhkan && (
                <p className="text-[11px] text-red-500 mt-1">{errors.poinDibutuhkan}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Jumlah Tersedia <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={jumlahTersedia}
                onChange={(e) =>
                  setJumlahTersedia(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="100"
                className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.jumlahTersedia
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                  }`}
              />
              {errors.jumlahTersedia && (
                <p className="text-[11px] text-red-500 mt-1">{errors.jumlahTersedia}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusVoucher)}
              className="w-full h-10 px-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Deskripsi Voucher
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Penjelasan singkat tentang voucher (opsional)..."
              className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-[#057a44] hover:bg-[#04683a] active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Voucher'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}