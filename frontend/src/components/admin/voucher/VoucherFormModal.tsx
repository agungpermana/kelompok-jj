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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex justify-between items-center z-10">
          <div>
            <h3 className="text-[17px] font-bold text-gray-900">
              {mode === 'create' ? 'Tambah Voucher' : 'Edit Voucher'}
            </h3>
            <p className="text-xs text-gray-400">
              {mode === 'create'
                ? 'Voucher penukaran poin baru untuk warga.'
                : `Perbarui data voucher "${initialItem?.namaVoucher}".`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-[13.5px] max-h-[70vh] overflow-y-auto">
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

          <div className="grid grid-cols-2 gap-4">
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

        <div className="border-t border-gray-100 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#16a34a] hover:bg-[#15803d] rounded-lg sm:rounded-xl disabled:opacity-60 transition-colors"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'create' ? 'Tambah' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}