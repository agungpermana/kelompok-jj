'use client';
import React from 'react';
import { X, MapPin, Phone, Calendar, Weight, FileText } from 'lucide-react';
import { PengajuanPenjemputan } from '@/services/adminPengajuanService';
interface PengajuanDetailModalProps {
  isOpen: boolean;
  item: PengajuanPenjemputan | null;
  onClose: () => void;
  onSchedule: () => void;
}
export default function PengajuanDetailModal({ isOpen, item, onClose, onSchedule }: PengajuanDetailModalProps) {
  if (!isOpen || !item) return null;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const statusBadgeClass: Record<string, string> = {
    diajukan: 'bg-blue-100 text-blue-800',
    dijadwalkan: 'bg-yellow-100 text-yellow-800',
    diproses: 'bg-purple-100 text-purple-800',
    selesai: 'bg-green-100 text-green-800',
    dibatalkan: 'bg-red-100 text-red-800',
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detail Pengajuan Penjemputan</h2>
              <p className="text-sm text-gray-500">ID: #{item.pengajuan_id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-600" /></button>
          </div>
          <div className="p-6 space-y-6">
            <div><span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${statusBadgeClass[item.status_pengajuan] || 'bg-gray-100 text-gray-800'}`}>{item.status_pengajuan}</span></div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Informasi Warga</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm"><span className="font-medium text-gray-700">Nama:</span> <span className="text-gray-900">{item.warga?.nama_warga || '-'}</span></p>
                <div className="flex items-start gap-2"><Phone className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-sm text-gray-900">{item.warga?.no_telepon || '-'}</p></div>
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-sm text-gray-900">{item.warga?.alamat || '-'}</p></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Informasi Pengajuan</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2"><Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-sm"><span className="font-medium text-gray-700">Tanggal Pengajuan:</span><br /><span className="text-gray-900">{formatDate(item.tanggal_pengajuan)}</span></p></div>
                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-sm"><span className="font-medium text-gray-700">Alamat Penjemputan:</span><br /><span className="text-gray-900">{item.alamat_penjemputan}</span></p></div>
                <div className="flex items-start gap-2"><Weight className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" /><p className="text-sm"><span className="font-medium text-gray-700">Estimasi Total Berat:</span><br /><span className="text-gray-900">{item.perkiraan_total_berat} kg</span></p></div>
              </div>
            </div>
            {item.detailPengajuanSampah && item.detailPengajuanSampah.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Detail Sampah</h3>
                <div className="space-y-2">
                  {item.detailPengajuanSampah.map((detail) => (
                    <div key={detail.detail_pengajuan_id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <div><p className="text-sm font-medium text-gray-900">{detail.jenis_sampah?.nama_jenis_sampah || '-'}</p><p className="text-xs text-gray-500">{detail.jenis_sampah?.satuan || 'kg'}</p></div>
                      <p className="text-sm font-semibold text-gray-900">{detail.perkiraan_berat} kg</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {item.catatan && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4" />Catatan</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-sm text-blue-900">{item.catatan}</p></div>
              </div>
            )}
            {item.jadwalPenjemputan && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Informasi Jadwal</h3>
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><span className="font-medium text-gray-700">Petugas:</span> <span className="text-gray-900">{item.jadwalPenjemputan.petugas?.nama_petugas || '-'}</span></p>
                  <p className="text-sm"><span className="font-medium text-gray-700">Tanggal Penjemputan:</span> <span className="text-gray-900">{new Date(item.jadwalPenjemputan.tanggal_penjemputan).toLocaleDateString('id-ID')}</span></p>
                  <p className="text-sm"><span className="font-medium text-gray-700">Waktu Penjemputan:</span> <span className="text-gray-900">{item.jadwalPenjemputan.waktu_penjemputan}</span></p>
                  {item.jadwalPenjemputan.catatan && (<p className="text-sm"><span className="font-medium text-gray-700">Catatan Jadwal:</span><br /><span className="text-gray-900">{item.jadwalPenjemputan.catatan}</span></p>)}
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 sticky bottom-0">
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">Tutup</button>
            {item.status_pengajuan === 'diajukan' && (<button onClick={onSchedule} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">Jadwalkan Penjemputan</button>)}
          </div>
        </div>
      </div>
    </>
  );
}
