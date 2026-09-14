'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Recycle } from 'lucide-react';
import { PengepulFormData, PengepulItem, StatusUser } from '@/types/pengepul';

interface PengepulFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: number | string;
    payload: PengepulFormData;
    status?: StatusUser;
  }) => void;
  initialItem?: PengepulItem | null;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

const STATUS_OPTIONS: { value: StatusUser; label: string }[] = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Nonaktif' },
];

export default function PengepulFormModal({
  isOpen,
  onClose,
  onSave,
  initialItem,
  mode,
  isSubmitting = false,
}: PengepulFormModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [namaPengepul, setNamaPengepul] = useState('');
  const [alamat, setAlamat] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [status, setStatus] = useState<StatusUser>('aktif');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialItem && mode === 'edit') {
      setUsername(initialItem.user?.username || '');
      setEmail(initialItem.user?.email || '');
      setPassword('');
      setNamaPengepul(initialItem.namaPengepul);
      setAlamat(initialItem.alamat || '');
      setNoTelepon(initialItem.noTelepon || '');
      setStatus(initialItem.user?.status ?? 'aktif');
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setNamaPengepul('');
      setAlamat('');
      setNoTelepon('');
      setStatus('aktif');
    }
    setErrors({});
  }, [initialItem, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (mode === 'create' && !username.trim()) {
      err.username = 'Username wajib diisi.';
    }
    if (mode === 'create' && !email.trim()) {
      err.email = 'Email wajib diisi.';
    } else if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = 'Format email tidak valid.';
    }
    if (mode === 'create' && !password) {
      err.password = 'Password wajib diisi.';
    } else if (password && password.length < 6) {
      err.password = 'Password minimal 6 karakter.';
    }
    if (!namaPengepul.trim()) {
      err.namaPengepul = 'Nama pengepul wajib diisi.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: PengepulFormData = {
      username: username.trim(),
      email: email.trim(),
      password: mode === 'create' ? password : password || undefined,
      namaPengepul: namaPengepul.trim(),
      alamat: alamat.trim(),
      noTelepon: noTelepon.trim(),
    };

    onSave({
      ...(initialItem ? { id: initialItem.id } : {}),
      payload,
      ...(mode === 'edit' ? { status } : {}),
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
              {mode === 'create' ? 'Tambah Pengepul' : 'Ubah Pengepul'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'create'
                ? 'Akun pengguna (users) akan dibuat otomatis dengan role pengepul.'
                : `Perbarui data pengepul "${initialItem?.namaPengepul}".`}
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
              <Recycle className="h-5 w-5 text-[#16a34a]" strokeWidth={1.8} />
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {mode === 'create'
                ? 'Mengisi akun pengguna (username/email) lalu data pengepul. Data tersimpan dalam satu transaksi.'
                : 'Email dan username tidak dapat diubah. Ubah password hanya jika ingin me-reset.'}
            </p>
          </div>

          {/* Akun Pengguna - hanya saat tambah baru */}
          {mode === 'create' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: pengepul2"
                  className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.username
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                    }`}
                />
                {errors.username && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@trashure.test"
                  className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.email
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                    }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.password
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                    }`}
                />
                {errors.password && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </>
          )}

          {/* Ubah Password - hanya saat edit */}
          {mode === 'edit' && (
            <>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full h-10 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    disabled
                    className="w-full h-10 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password Baru <span className="text-gray-400">(opsional)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak diubah"
                  className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.password
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                    }`}
                />
                {errors.password && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Status Akun
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusUser)}
                  className="w-full h-10 px-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Nama Pengepul */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Pengepul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={namaPengepul}
              onChange={(e) => setNamaPengepul(e.target.value)}
              placeholder="Contoh: Pengepul Trashure"
              className={`w-full h-10 px-3.5 text-sm bg-white border rounded-xl text-gray-800 focus:outline-none focus:ring-2 transition-all ${errors.namaPengepul
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-[#16a34a]/20 focus:border-[#16a34a]'
                }`}
            />
            {errors.namaPengepul && (
              <p className="text-[11px] text-red-500 mt-1">{errors.namaPengepul}</p>
            )}
          </div>

          {/* No. Telepon & Alamat */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              No. Telepon
            </label>
            <input
              type="text"
              maxLength={20}
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              placeholder="Contoh: 081234567892"
              className="w-full h-10 px-3.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              rows={3}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Alamat lokasi pengepul (opsional)..."
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
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pengepul'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}