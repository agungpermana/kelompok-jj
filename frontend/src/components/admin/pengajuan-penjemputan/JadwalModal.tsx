'use client';
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PengajuanPenjemputan, Petugas, jadwalkanPenjemputan } from '@/services/adminPengajuanService';
interface JadwalModalProps {
  isOpen: boolean;
  item: PengajuanPenjemputan | null;
  petugasList: Petugas[];
  isLoading: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export default function JadwalModal({ isOpen, item, petugasList, isLoading, onClose, onSuccess }: JadwalModalProps) {
  const [formData, setFormData] = useState({ petugas_id: '', tanggal_penjemputan: '', waktu_penjemputan: '', catatan: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({ petugas_id: '', tanggal_penjemputan: tomorrow.toISOString().split('T')[0], waktu_penjemputan: '09:00', catatan: '' });
      setMessage(null);
    }
  }, [isOpen]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petugas_id || !formData.tanggal_penjemputan || !formData.waktu_penjemputan) {
      setMessage({ type: 'error', text: 'Petugas, tanggal, dan waktu penjemputan harus diisi.' });
      return;
    }
    if (!item) return;
    setIsSubmitting(true);
    setMessage(null);
    try {
      const result = await jadwalkanPenjemputan(item.pengajuan_id, {
        petugas_id: parseInt(formData.petugas_id),
        tanggal_penjemputan: formData.tanggal_penjemputan,
        waktu_penjemputan: formData.waktu_penjemputan,
        catatan: formData.catatan || undefined,
      });
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Penjemputan berhasil dijadwalkan.' });
        setTimeout(() => { onSuccess(); onClose(); }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menjadwalkan penjemputan.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan saat menjadwalkan penjemputan.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen || !item) return null;
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split('T')[0];
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Jadwalkan Penjemputan</h2>
            <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"><X className="w-5 h-5 text-gray-600" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900"><span className="font-medium">ID Pengajuan:</span> #{item.pengajuan_id}</p>
              <p className="text-sm text-blue-900 mt-1"><span className="font-medium">Warga:</span> {item.warga?.nama_warga}</p>
              <p className="text-sm text-blue-900 mt-1"><span className="font-medium">Alamat:</span> {item.alamat_penjemputan}</p>
            </div>
            {message && (
              <div className={`p-3.5 rounded-lg flex items-start gap-2.5 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                <span className="text-sm">{message.text}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Petugas <span className="text-red-600">*</span></label>
              <select name="petugas_id" value={formData.petugas_id} onChange={handleInputChange} disabled={isSubmitting || isLoading} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100" required>
                <option value="">-- Pilih Petugas --</option>
                {petugasList.map((petugas) => (<option key={petugas.petugas_id} value={petugas.petugas_id}>{petugas.nama_petugas} ({petugas.no_telepon})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Penjemputan <span className="text-red-600">*</span></label>
              <input type="date" name="tanggal_penjemputan" value={formData.tanggal_penjemputan} onChange={handleInputChange} min={minDateString} disabled={isSubmitting} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100" required />
              <p className="text-xs text-gray-500 mt-1">Minimal H+1 dari hari ini</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Penjemputan <span className="text-red-600">*</span></label>
              <input type="time" name="waktu_penjemputan" value={formData.waktu_penjemputan} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100" required />
              <p className="text-xs text-gray-500 mt-1">Format: HH:MM (24-jam)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tambahan</label>
              <textarea name="catatan" value={formData.catatan} onChange={handleInputChange} disabled={isSubmitting} placeholder="Contoh: Harap bawa karung tambahan, akses dari pintu samping, dll." rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 resize-none" />
            </div>
          </form>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50">Batal</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2">{isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Menyimpan...</>) : ('Simpan Jadwal')}</button>
          </div>
        </div>
      </div>
    </>
  );
}
