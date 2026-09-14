'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export interface JenisSampahItem {
  jenis_sampah_id?: number;
  nama_jenis_sampah: string;
  satuan: string;
  keterangan?: string;
  status: string;
  harga_aktif?: {
    harga_id?: number;
    harga_per_satuan: string | number;
    berlaku_mulai?: string;
  };
}

interface ModalTambahEditProps {
  isOpen: boolean;
  isEdit?: boolean;
  initialData?: JenisSampahItem | null;
  onClose: () => void;
  onSubmit: (formData: {
    nama_jenis_sampah: string;
    satuan: string;
    keterangan?: string;
    status: string;
  }) => Promise<void>;
}

const UNITS = ['Kg', 'Pcs', 'Gram', 'Liter'];

export default function ModalTambahEdit({
  isOpen,
  isEdit = false,
  initialData,
  onClose,
  onSubmit,
}: ModalTambahEditProps) {
  const [nama, setNama] = useState('');
  const [satuan, setSatuan] = useState('Kg');
  const [status, setStatus] = useState('aktif');
  const [keterangan, setKeterangan] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && isEdit) {
      setNama(initialData.nama_jenis_sampah || '');
      setSatuan(initialData.satuan || 'Kg');
      setStatus(initialData.status || 'aktif');
      setKeterangan(initialData.keterangan || '');
    } else {
      setNama('');
      setSatuan('Kg');
      setStatus('aktif');
      setKeterangan('');
    }
    setError(null);
  }, [initialData, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nama.trim()) {
      setError('Nama jenis sampah tidak boleh kosong.');
      return;
    }
    if (!satuan) {
      setError('Satuan sampah wajib dipilih.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        nama_jenis_sampah: nama.trim(),
        satuan,
        keterangan: keterangan.trim(),
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isEdit ? 'Edit Jenis Sampah' : 'Tambah Jenis Sampah'}
              </h3>
              <p className="text-xs text-gray-500">
                {isEdit
                  ? 'Perbarui master data jenis sampah, satuan, status, dan keterangan.'
                  : 'Tambahkan data master jenis sampah baru ke dalam sistem.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Nama Jenis Sampah */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nama Jenis Sampah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Botol Plastik, Kardus, Besi"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition"
                required
              />
            </div>

            {/* Satuan & Status */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <select
                  value={satuan}
                  onChange={(e) => setSatuan(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition bg-white cursor-pointer"
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition bg-white cursor-pointer"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>

            {/* Keterangan / Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Keterangan / Deskripsi
              </label>
              <textarea
                rows={3}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Deskripsi singkat jenis sampah (misal: kondisi bersih, jenis bahan)..."
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/70 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Jenis Sampah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
