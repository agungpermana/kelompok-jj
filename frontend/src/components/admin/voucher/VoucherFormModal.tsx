'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
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

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/10';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Tambah Voucher' : 'Edit Voucher'}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {mode === 'create'
                ? 'Voucher penukaran poin baru untuk warga.'
                : `Perbarui data voucher "${initialItem?.namaVoucher}".`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Voucher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={namaVoucher}
              onChange={(e) => setNamaVoucher(e.target.value)}
              className={inputClass}
              placeholder="Contoh: Voucher Rp10.000"
            />
            {errors.namaVoucher && (
              <p className="text-[11px] text-red-500 mt-1">{errors.namaVoucher}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Poin Dibutuhkan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={poinDibutuhkan}
                onChange={(e) =>
                  setPoinDibutuhkan(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="1000"
                className={inputClass}
              />
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
                className={inputClass}
              />
              {errors.jumlahTersedia && (
                <p className="text-[11px] text-red-500 mt-1">{errors.jumlahTersedia}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusVoucher)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Deskripsi Voucher
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Penjelasan singkat tentang voucher (opsional)..."
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#16a34a] hover:bg-[#15803d] rounded-lg disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Tambah' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}