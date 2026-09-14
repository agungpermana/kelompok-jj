'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronDown, CheckCircle, Package } from 'lucide-react';
import { HargaPoinItem, JenisSampahDB, StatusHarga } from '@/types/harga-poin';
import { DB_JENIS_SAMPAH_LIST } from '@/data/harga-poin-initial';

interface HargaPoinFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<HargaPoinItem>) => void;
  initialItem?: HargaPoinItem | null;
  mode: 'create' | 'edit';
  availableJenisSampah?: JenisSampahDB[];
}

export default function HargaPoinFormModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
  mode,
  availableJenisSampah = DB_JENIS_SAMPAH_LIST,
}: HargaPoinFormModalProps) {
  const [selectedJenisId, setSelectedJenisId] = useState<number | ''>('');
  const [hargaPerSatuan, setHargaPerSatuan] = useState<number | ''>('');
  const [nilaiPoinPerSatuan, setNilaiPoinPerSatuan] = useState<number | ''>('');
  const [berlakuMulai, setBerlakuMulai] = useState('');
  const [status, setStatus] = useState<StatusHarga>('Aktif');
  const [keterangan, setKeterangan] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Selected Jenis Sampah object from DB
  const selectedJenis = availableJenisSampah.find((j) => j.id === Number(selectedJenisId));

  useEffect(() => {
    if (initialItem && mode === 'edit') {
      setSelectedJenisId(initialItem.jenisSampahId);
      setHargaPerSatuan(initialItem.hargaPerSatuan);
      setNilaiPoinPerSatuan(initialItem.nilaiPoinPerSatuan);
      setBerlakuMulai(initialItem.berlakuMulai);
      setStatus(initialItem.status);
      setKeterangan(initialItem.keterangan || '');
    } else {
      // Defaults for create
      setSelectedJenisId('');
      setHargaPerSatuan('');
      setNilaiPoinPerSatuan('');
      const today = new Date();
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      setBerlakuMulai(`${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`);
      setStatus('Aktif');
      setKeterangan('');
    }
    setErrors({});
  }, [initialItem, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!selectedJenisId) {
      err.jenisSampah = 'Silakan pilih jenis sampah dari database.';
    }
    if (hargaPerSatuan === '' || Number(hargaPerSatuan) <= 0) {
      err.hargaPerSatuan = 'Harga per satuan harus lebih dari 0.';
    }
    if (nilaiPoinPerSatuan === '' || Number(nilaiPoinPerSatuan) < 0) {
      err.nilaiPoinPerSatuan = 'Nilai poin tidak boleh negatif.';
    }
    if (!berlakuMulai.trim()) {
      err.berlakuMulai = 'Tanggal berlaku wajib diisi.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!selectedJenis) return;

    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      jenisSampahId: selectedJenis.id,
      namaJenisSampah: selectedJenis.nama,
      kategori: selectedJenis.kategori,
      satuan: selectedJenis.satuan,
      hargaPerSatuan: Number(hargaPerSatuan),
      nilaiPoinPerSatuan: Number(nilaiPoinPerSatuan),
      berlakuMulai: berlakuMulai.trim(),
      status,
      keterangan: keterangan.trim(),
      iconType: selectedJenis.iconType,
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
              {mode === 'create' ? 'Tambah Harga & Poin' : 'Ubah Harga & Poin'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'create'
                ? 'Pilih jenis sampah yang ada di database untuk menetapkan  harga dan poin.'
                : `Perbarui  harga dan poin untuk ${selectedJenis?.nama || initialItem?.namaJenisSampah}.`}
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
          {/* Combo Box: Pilih Jenis Sampah dari Database */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Pilih Jenis Sampah (Database) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedJenisId}
                disabled={mode === 'edit'}
                onChange={(e) => {
                  setSelectedJenisId(e.target.value ? Number(e.target.value) : '');
                }}
                className={`w-full h-11 px-3.5 pr-9 text-sm bg-white border rounded-xl text-gray-800 appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer ${mode === 'edit'
                    ? 'bg-gray-50 text-gray-600 cursor-not-allowed border-gray-200'
                    : errors.jenisSampah
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                  }`}
              >
                <option value="">-- Pilih Jenis Sampah --</option>
                {availableJenisSampah.map((jenis) => (
                  <option key={jenis.id} value={jenis.id}>
                    {jenis.nama} ({jenis.kategori} - {jenis.satuan})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.jenisSampah && (
              <p className="text-[11px] text-red-500 mt-1">{errors.jenisSampah}</p>
            )}
          </div>

          {/* Info Card Saat Jenis Sampah Dipilih */}
          {selectedJenis ? (
            <div className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-800">
                    {selectedJenis.nama}
                  </p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[#16a34a]">
                    {selectedJenis.kategori}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Satuan ukur: <strong className="text-gray-700">{selectedJenis.satuan}</strong>
                  {selectedJenis.keterangan && ` • ${selectedJenis.keterangan}`}
                </p>
              </div>
              <CheckCircle className="h-4 w-4 text-[#16a34a] flex-shrink-0" />
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
              <Package className="h-4 w-4 text-gray-400" />
              <span>Pilih jenis sampah di atas untuk melihat kategori dan satuan yang berlaku.</span>
            </div>
          )}

          {/* Harga & Poin Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Harga per {selectedJenis?.satuan || 'Satuan'} (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={hargaPerSatuan}
                  onChange={(e) =>
                    setHargaPerSatuan(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  placeholder="2000"
                  className={`w-full h-10 pl-10 pr-3 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.hargaPerSatuan
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                    }`}
                />
              </div>
              {errors.hargaPerSatuan && (
                <p className="text-[11px] text-red-500 mt-1">{errors.hargaPerSatuan}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nilai Poin per {selectedJenis?.satuan || 'Satuan'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nilaiPoinPerSatuan}
                onChange={(e) =>
                  setNilaiPoinPerSatuan(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="2"
                className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.nilaiPoinPerSatuan
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                  }`}
              />
              {errors.nilaiPoinPerSatuan && (
                <p className="text-[11px] text-red-500 mt-1">{errors.nilaiPoinPerSatuan}</p>
              )}
            </div>
          </div>

          {/* Tanggal Berlaku Mulai & Status */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Berlaku Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={berlakuMulai}
                onChange={(e) => setBerlakuMulai(e.target.value)}
                placeholder="Contoh: 1 Agustus 2024"
                className="w-full h-10 px-3.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
              />
              {errors.berlakuMulai && (
                <p className="text-[11px] text-red-500 mt-1">{errors.berlakuMulai}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusHarga)}
                className="w-full h-10 px-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Keterangan Tambahan  */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Keterangan / Catatan
            </label>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Catatan ketentuan penetapan harga (opsional)..."
              className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#057a44] hover:bg-[#04683a] active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Simpan </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
