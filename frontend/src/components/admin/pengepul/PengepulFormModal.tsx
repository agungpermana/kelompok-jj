'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
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

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/10';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Tambah Pengepul' : 'Edit Pengepul'}
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {mode === 'create'
                ? 'Akun pengguna (users) dibuat otomatis saat pengepul ditambahkan.'
                : 'Username dan email tidak dapat diubah.'}
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
                  className={inputClass}
                  placeholder="Contoh: pengepul2"
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
                  className={inputClass}
                  placeholder="contoh@trashure.test"
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
                  className={inputClass}
                  placeholder="Minimal 6 karakter"
                />
                {errors.password && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </>
          )}

          {mode === 'edit' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
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
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
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
                  className={inputClass}
                  placeholder="Kosongkan jika tidak diubah"
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
                  className={inputClass}
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

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nama Pengepul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={namaPengepul}
              onChange={(e) => setNamaPengepul(e.target.value)}
              className={inputClass}
              placeholder="Contoh: Pengepul Trashure"
            />
            {errors.namaPengepul && (
              <p className="text-[11px] text-red-500 mt-1">{errors.namaPengepul}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              No. Telepon
            </label>
            <input
              type="text"
              maxLength={20}
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              className={inputClass}
              placeholder="Contoh: 081234567892"
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
              className={`${inputClass} resize-none`}
              placeholder="Alamat lokasi pengepul (opsional)..."
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