'use client';

import { useState, useEffect, useMemo } from 'react';
import PetugasHeader from '@/components/layout/PetugasHeader';
import WasteIcon from '@/components/common/WasteIcon';
import { Search, RotateCcw, Clock, CheckCircle2, XCircle, Minus, Eye, Check, X, Calendar as CalendarIcon } from 'lucide-react';

interface DetailSetoran { detail_setoran_id: number; jenis_sampah_id: number; berat_aktual: number; harga_satuan: number; nilai_poin_per_satuan: number; poin_sementara: number; jenis_sampah: { jenis_sampah_id: number; nama_jenis_sampah: string; }; }
interface TransaksiSetoran { setoran_id: number; pengajuan_id: number; jadwal_id: number; warga_id: number; petugas_id: number; validator_petugas_id: number | null; tanggal_setoran: string; konfirmasi_pengambilan: string; status_validasi: string; catatan_validasi: string | null; tanggal_validasi: string | null; total_berat_aktual: number; total_poin_sementara: number; warga: { warga_id: number; nama_warga: string; alamat: string; no_telepon?: string; }; petugas: { petugas_id: number; nama_petugas: string; }; validatorPetugas?: { petugas_id: number; nama_petugas: string; }; detail_setoran: DetailSetoran[]; pengajuanPenjemputan?: { pengajuan_id: number; }; }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const getToken = () => { if (typeof window === 'undefined') return ''; return localStorage.getItem('trashure_token') || localStorage.getItem('token') || ''; };

export default function ValidasiSetoranPage() {
  const [list, setList] = useState<TransaksiSetoran[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TransaksiSetoran | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showValidasi, setShowValidasi] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validasiData, setValidasiData] = useState({ status_validasi: 'disetujui', catatan_validasi: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Menunggu Validasi');
  const [tanggalFilter, setTanggalFilter] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try { setLoading(true); const token = getToken(); const h: HeadersInit = { Accept: 'application/json' }; if (token) h['Authorization'] = `Bearer ${token}`; const r = await fetch(`${API_BASE_URL}/petugas/setoran`, { headers: h }); const j = await r.json(); if (j?.data && Array.isArray(j.data)) setList(j.data); else setList([]); } catch { setList([]); } finally { setLoading(false); }
  };
  const stats = useMemo(() => {
    const menunggu = list.filter(s => s.status_validasi === 'menunggu').length;
    const terverifikasi = list.filter(s => s.status_validasi === 'disetujui').length;
    const ditolak = list.filter(s => s.status_validasi === 'ditolak').length;
    return { menunggu, terverifikasi, ditolak, total: list.length };
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter(s => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const warga = s.warga?.nama_warga?.toLowerCase() || '';
        const jenis = (s.detail_setoran || []).map(d => d.jenis_sampah?.nama_jenis_sampah?.toLowerCase()).join(' ');
        const no = `stn-${s.setoran_id}`.toLowerCase();
        if (!warga.includes(q) && !jenis.includes(q) && !no.includes(q)) return false;
      }
      const map: Record<string, string> = { 'Menunggu Validasi': 'menunggu', 'Terverifikasi': 'disetujui', 'Ditolak': 'ditolak', 'Semua Status': 'semua' };
      const target = map[statusFilter] || 'menunggu';
      if (target !== 'semua' && s.status_validasi !== target) return false;
      if (tanggalFilter) {
        const d = new Date(s.tanggal_setoran).toISOString().slice(0, 10);
        if (d !== tanggalFilter) return false;
      }
      return true;
    });
  }, [list, search, statusFilter, tanggalFilter]);

  const openValidasi = (s: TransaksiSetoran, status: string) => { setSelected(s); setValidasiData({ status_validasi: status, catatan_validasi: '' }); setShowValidasi(true); };
  const submitValidasi = async () => {
    if (!selected) return;
    try { setValidating(true); const token = getToken(); const h: HeadersInit = { 'Content-Type': 'application/json', Accept: 'application/json' }; if (token) h['Authorization'] = `Bearer ${token}`; const r = await fetch(`${API_BASE_URL}/petugas/setoran/${selected.setoran_id}/validasi`, { method: 'PATCH', headers: h, body: JSON.stringify(validasiData) }); const j = await r.json(); if (r.ok) { setShowValidasi(false); fetchData(); } else alert(j.message || 'Gagal'); } catch { alert('Error'); } finally { setValidating(false); }
  };
  const resetFilter = () => { setSearch(''); setStatusFilter('Menunggu Validasi'); setTanggalFilter(''); };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <PetugasHeader title="Validasi Setoran" subtitle="Periksa dan validasi transaksi setoran yang telah selesai penimbangan." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button onClick={() => setStatusFilter('Menunggu Validasi')} className={`flex items-center gap-4 bg-white rounded-2xl p-5 border shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition ${statusFilter === 'Menunggu Validasi' ? 'border-amber-200 ring-2 ring-amber-100' : 'border-gray-100'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fffbeb] text-[#d97706] flex-shrink-0"><Clock className="h-6 w-6" /></div>
          <div className="flex-1"><p className="text-[12px] font-medium text-gray-500">Menunggu Validasi</p><p className="text-[22px] font-extrabold text-gray-900 leading-none mt-1">{stats.menunggu}</p><p className="text-[11px] text-gray-400">Transaksi</p></div>
          <span className="text-[11px] font-medium text-amber-600">Lihat Detail ›</span>
        </button>
        <button onClick={() => setStatusFilter('Terverifikasi')} className={`flex items-center gap-4 bg-white rounded-2xl p-5 border shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition ${statusFilter === 'Terverifikasi' ? 'border-green-200 ring-2 ring-green-100' : 'border-gray-100'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a] flex-shrink-0"><CheckCircle2 className="h-6 w-6" /></div>
          <div className="flex-1"><p className="text-[12px] font-medium text-gray-500">Terverifikasi</p><p className="text-[22px] font-extrabold text-gray-900 leading-none mt-1">{stats.terverifikasi}</p><p className="text-[11px] text-gray-400">Transaksi</p></div>
          <span className="text-[11px] font-medium text-green-600">Lihat Detail ›</span>
        </button>
        <button onClick={() => setStatusFilter('Ditolak')} className={`flex items-center gap-4 bg-white rounded-2xl p-5 border shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition ${statusFilter === 'Ditolak' ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626] flex-shrink-0"><XCircle className="h-6 w-6" /></div>
          <div className="flex-1"><p className="text-[12px] font-medium text-gray-500">Ditolak</p><p className="text-[22px] font-extrabold text-gray-900 leading-none mt-1">{stats.ditolak}</p><p className="text-[11px] text-gray-400">Transaksi</p></div>
          <span className="text-[11px] font-medium text-red-600">Lihat Detail ›</span>
        </button>
        <button onClick={() => setStatusFilter('Semua Status')} className={`flex items-center gap-4 bg-white rounded-2xl p-5 border shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-left transition ${statusFilter === 'Semua Status' ? 'border-gray-300 ring-2 ring-gray-100' : 'border-gray-100'}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 flex-shrink-0"><Minus className="h-6 w-6" /></div>
          <div className="flex-1"><p className="text-[12px] font-medium text-gray-500">Total</p><p className="text-[22px] font-extrabold text-gray-900 leading-none mt-1">{stats.total}</p><p className="text-[11px] text-gray-400">Transaksi</p></div>
          <span className="text-[11px] font-medium text-gray-500">Lihat Semua ›</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama warga, jenis sampah, atau nomor transaksi..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-green-100 shadow-sm" />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-[13px]"><span className="text-gray-400 mr-2 text-xs">Status</span><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"><option>Menunggu Validasi</option><option>Terverifikasi</option><option>Ditolak</option><option>Semua Status</option></select></div>
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-[13px]"><span className="text-gray-400 mr-2 text-xs">Tanggal</span><input type="date" value={tanggalFilter} onChange={e => setTanggalFilter(e.target.value)} className="bg-transparent font-medium text-gray-800 focus:outline-none" /></div>
          <button onClick={resetFilter} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"><RotateCcw className="h-3.5 w-3.5" />Reset Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-gray-100 bg-[#fafafa]/80 text-[12px] font-bold text-gray-600"><th className="px-5 py-4">No. Transaksi</th><th className="px-5 py-4">Warga</th><th className="px-5 py-4">Tanggal Setoran</th><th className="px-5 py-4">Jenis Sampah & Berat</th><th className="px-5 py-4">Total Berat</th><th className="px-5 py-4">Poin Sementara</th><th className="px-5 py-4">Status Validasi</th><th className="px-5 py-4">Aksi</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">Memuat...</td></tr> : filtered.length === 0 ? <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">Tidak ada transaksi</td></tr> : filtered.map(s => (
                <tr key={s.setoran_id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 align-top"><p className="text-[13px] font-bold text-gray-900">STN-2024-0822-{String(s.setoran_id).padStart(3, '0')}</p><p className="text-[11px] text-gray-400 mt-1">Dari Pengajuan</p><p className="text-[11px] font-semibold text-[#16a34a]">PGJ-2024-0822-{String(s.pengajuan_id).padStart(3, '0')}</p></td>
                  <td className="px-5 py-4 align-top"><p className="text-[13px] font-semibold text-gray-900">{s.warga.nama_warga}</p><p className="text-[11px] text-gray-500">{s.warga.no_telepon || '-'}</p><p className="text-[11px] text-gray-400">{s.warga.alamat?.split(',').slice(0, 2).join(',')}</p></td>
                  <td className="px-5 py-4 align-top text-[12px] text-gray-700">{new Date(s.tanggal_setoran).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}<br /><span className="text-gray-400">{new Date(s.tanggal_setoran).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span></td>
                  <td className="px-5 py-4 align-top">
                    <div className="space-y-1.5">
                      {(s.detail_setoran || []).map(d => (
                        <div key={d.detail_setoran_id} className="flex items-center justify-between gap-3 text-[12px]"><span className="flex items-center gap-2"><WasteIcon type={d.jenis_sampah.nama_jenis_sampah} size={16} />{d.jenis_sampah.nama_jenis_sampah}</span><span className="font-medium text-gray-700">{Number(d.berat_aktual).toFixed(1).replace('.', ',')} kg</span></div>
                      ))}
                      <div className="flex items-center justify-between gap-3 text-[12px] font-bold border-t border-gray-100 pt-1.5 mt-1.5"><span>Total</span><span>{Number(s.total_berat_aktual).toFixed(1).replace('.', ',')} kg</span></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-[13px] font-semibold text-gray-900">{Number(s.total_berat_aktual).toFixed(1).replace('.', ',')} kg</td>
                  <td className="px-5 py-4 align-top text-center"><p className="text-[14px] font-bold text-gray-900">{s.total_poin_sementara}</p><p className="text-[11px] text-gray-400">poin</p></td>
                  <td className="px-5 py-4 align-top">
                    {s.status_validasi === 'menunggu' && <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#fffbeb] text-[#92400e] text-[11px] font-semibold border border-amber-100">Menunggu Validasi</span>}
                    {s.status_validasi === 'disetujui' && <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#f0fdf4] text-[#15803d] text-[11px] font-semibold border border-green-100">Terverifikasi</span>}
                    {s.status_validasi === 'ditolak' && <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#fef2f2] text-[#b91c1c] text-[11px] font-semibold border border-red-100">Ditolak</span>}
                    <p className="text-[10px] text-gray-400 mt-1">Oleh Petugas</p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-col gap-1.5 min-w-[110px]">
                      {s.status_validasi === 'menunggu' ? (
                        <>
                          <button onClick={() => openValidasi(s, 'disetujui')} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-green-200 text-[#16a34a] bg-white hover:bg-green-50 text-[12px] font-semibold"><Check size={14} />Verifikasi</button>
                          <button onClick={() => openValidasi(s, 'ditolak')} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-50 text-[12px] font-semibold"><X size={14} />Tolak</button>
                        </>
                      ) : null}
                      <button onClick={() => { setSelected(s); setShowDetail(true); }} className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-[12px] font-medium"><Eye size={14} />Lihat Detail</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-[12px] text-gray-500">
          <span>Menampilkan 1 - {filtered.length} dari {list.length} transaksi</span>
          <div className="flex gap-1"><span className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#16a34a] text-white font-bold">1</span></div>
        </div>
      </div>

      <div className="flex gap-3 bg-[#f8faf7] border border-green-50 rounded-2xl p-4 text-[12px] text-gray-600">
        <div className="h-6 w-6 rounded-full bg-white border border-green-100 flex items-center justify-center text-green-600 flex-shrink-0">ⓘ</div>
        <p>Pastikan data jenis sampah dan berat sudah sesuai sebelum melakukan validasi.<br />Setoran yang sudah Anda verifikasi akan diteruskan ke admin untuk validasi poin dan stok.</p>
      </div>

      {showDetail && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center"><h2 className="font-bold">Detail STN-{String(selected.setoran_id).padStart(3, '0')}</h2><button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">✕</button></div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl"><div><p className="text-gray-500">Warga</p><p className="font-semibold">{selected.warga.nama_warga}</p></div><div><p className="text-gray-500">Tanggal</p><p className="font-semibold">{new Date(selected.tanggal_setoran).toLocaleString('id-ID')}</p></div><div><p className="text-gray-500">Total Berat</p><p className="font-semibold">{selected.total_berat_aktual} kg</p></div><div><p className="text-gray-500">Poin Sementara</p><p className="font-semibold">{selected.total_poin_sementara}</p></div></div>
              <div className="space-y-2">{selected.detail_setoran.map(d => <div key={d.detail_setoran_id} className="flex justify-between border rounded-xl p-3"><span className="flex gap-2 items-center"><WasteIcon type={d.jenis_sampah.nama_jenis_sampah} size={16} />{d.jenis_sampah.nama_jenis_sampah}</span><span>{d.berat_aktual} kg • {d.poin_sementara} poin</span></div>)}</div>
              {selected.catatan_validasi && <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">{selected.catatan_validasi}</div>}
            </div>
          </div>
        </div>
      )}

      {showValidasi && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="border-b px-6 py-4"><h2 className="font-bold">Validasi STN-{String(selected.setoran_id).padStart(3, '0')}</h2><p className="text-xs text-gray-500">{selected.warga.nama_warga} • {selected.total_poin_sementara} poin akan masuk ke poin_sementara saat disetujui</p></div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={validasiData.status_validasi === 'disetujui'} onChange={() => setValidasiData({ ...validasiData, status_validasi: 'disetujui' })} />Disetujui</label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={validasiData.status_validasi === 'ditolak'} onChange={() => setValidasiData({ ...validasiData, status_validasi: 'ditolak' })} />Ditolak</label></div>
              <textarea value={validasiData.catatan_validasi} onChange={e => setValidasiData({ ...validasiData, catatan_validasi: e.target.value })} placeholder="Catatan validasi..." className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-300" rows={3} />
              <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 space-y-1"><p>Total Berat: <b>{selected.total_berat_aktual} kg</b></p><p>Total Poin Sementara: <b>{selected.total_poin_sementara}</b></p><p className="text-[11px] text-amber-600">Jika disetujui, {selected.total_poin_sementara} poin akan ditambahkan ke tabel poin_sementara (status menunggu validasi admin).</p></div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end gap-3"><button onClick={() => setShowValidasi(false)} disabled={validating} className="px-4 py-2 border rounded-xl text-sm">Batal</button><button onClick={submitValidasi} disabled={validating} className={`px-4 py-2 rounded-xl text-sm font-semibold text-white ${validasiData.status_validasi === 'disetujui' ? 'bg-[#16a34a]' : 'bg-red-600'}`}>{validating ? 'Memproses...' : validasiData.status_validasi === 'disetujui' ? 'Verifikasi' : 'Tolak'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
