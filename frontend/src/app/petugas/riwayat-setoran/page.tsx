'use client';
import { useState, useEffect, useMemo } from 'react';
import PetugasHeader from '@/components/layout/PetugasHeader';
import WasteIcon from '@/components/common/WasteIcon';
import { Search, RotateCcw, FileText, Scale, Star, CheckCircle2, XCircle, Eye } from 'lucide-react';

interface DetailSetoran { detail_setoran_id: number; jenis_sampah_id: number; berat_aktual: number; harga_satuan: number; nilai_poin_per_satuan: number; poin: number; poin_sementara?: number; jenis_sampah: { jenis_sampah_id: number; nama_jenis_sampah: string; }; }
interface TransaksiSetoran { setoran_id: number; pengajuan_id: number; tanggal_setoran: string; tanggal_validasi?: string | null; status_validasi: string; total_berat_aktual: number; total_poin: number; total_poin_sementara?: number; poin?: number; warga: { warga_id: number; nama_warga: string; no_telepon?: string; alamat?: string; }; detail_setoran: DetailSetoran[]; validator_admin?: { nama_admin: string; }; validatorAdmin?: { nama_admin: string; }; }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const getToken = () => { if (typeof window === 'undefined') return ''; return localStorage.getItem('trashure_token') || localStorage.getItem('token') || ''; };

export default function RiwayatSetoranPage() {
  const [list, setList] = useState<TransaksiSetoran[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [tanggalFilter, setTanggalFilter] = useState('');
  const [selected, setSelected] = useState<TransaksiSetoran | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try { setLoading(true); const token = getToken(); const h: HeadersInit = { Accept: 'application/json' }; if (token) h['Authorization'] = `Bearer ${token}`; const r = await fetch(`${API_BASE_URL}/petugas/setoran`, { headers: h }); const j = await r.json(); if (j?.data && Array.isArray(j.data)) setList(j.data); else setList([]); } catch { setList([]); } finally { setLoading(false); }
  };

  const stats = useMemo(() => {
    const total = list.length;
    const totalBerat = list.reduce((s, x) => s + Number(x.total_berat_aktual || 0), 0);
    const totalPoin = list.reduce((s, x) => s + Number((x as any).total_poin ?? x.total_poin_sementara ?? 0), 0);
    const valid = list.filter(x => x.status_validasi === 'disetujui').length;
    const tidakValid = list.filter(x => x.status_validasi === 'ditolak').length;
    return { total, totalBerat, totalPoin, valid, tidakValid };
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
      if (statusFilter !== 'Semua Status') {
        const map: Record<string, string> = { 'Terverifikasi': 'disetujui', 'Menunggu Validasi': 'menunggu', 'Ditolak': 'ditolak' };
        if (s.status_validasi !== map[statusFilter]) return false;
      }
      if (tanggalFilter) {
        const d = new Date(s.tanggal_setoran).toISOString().slice(0, 10);
        if (d !== tanggalFilter) return false;
      }
      return true;
    });
  }, [list, search, statusFilter, tanggalFilter]);

  const paginated = useMemo(() => { const s = (currentPage - 1) * pageSize; return filtered.slice(s, s + pageSize); }, [filtered, currentPage]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const resetFilter = () => { setSearch(''); setStatusFilter('Semua Status'); setTanggalFilter(''); setCurrentPage(1); };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <PetugasHeader title="Riwayat Setoran" subtitle="Riwayat transaksi setoran sampah yang telah Anda lakukan." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a] flex-shrink-0"><FileText className="h-6 w-6" /></div>
          <div><p className="text-[11px] font-medium text-gray-500">Total Setoran</p><p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.total}</p><p className="text-[11px] text-gray-400">Transaksi</p></div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb] flex-shrink-0"><Scale className="h-6 w-6" /></div>
          <div><p className="text-[11px] font-medium text-gray-500">Total Berat Sampah</p><p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.totalBerat.toFixed(1).replace('.', ',')} kg</p><p className="text-[11px] text-gray-400">Keseluruhan</p></div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fffbeb] text-[#d97706] flex-shrink-0"><Star className="h-6 w-6" /></div>
          <div><p className="text-[11px] font-medium text-gray-500">Total Poin</p><p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.totalPoin}</p><p className="text-[11px] text-gray-400">Poin</p></div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3ff] text-[#7c3aed] flex-shrink-0"><CheckCircle2 className="h-6 w-6" /></div>
          <div><p className="text-[11px] font-medium text-gray-500">Setoran Valid</p><p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.valid}</p><p className="text-[11px] text-gray-400">Transaksi</p></div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626] flex-shrink-0"><XCircle className="h-6 w-6" /></div>
          <div><p className="text-[11px] font-medium text-gray-500">Setoran Tidak Valid</p><p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.tidakValid}</p><p className="text-[11px] text-gray-400">Transaksi</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Cari nama warga, jenis sampah, atau no. transaksi..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-green-100 shadow-sm" /></div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-[13px]"><span className="text-gray-400 mr-2 text-xs">Status Validasi</span><select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"><option>Semua Status</option><option>Terverifikasi</option><option>Menunggu Validasi</option><option>Ditolak</option></select></div>
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-[13px]"><span className="text-gray-400 mr-2 text-xs">Tanggal Setoran</span><input type="date" value={tanggalFilter} onChange={e => { setTanggalFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent font-medium text-gray-800 focus:outline-none" /></div>
          <button onClick={resetFilter} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"><RotateCcw className="h-3.5 w-3.5" />Reset Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-gray-100 bg-[#fafafa]/80 text-[12px] font-bold text-gray-600"><th className="px-5 py-4">No. Transaksi</th><th className="px-5 py-4">Warga</th><th className="px-5 py-4">Tanggal Setoran</th><th className="px-5 py-4">Jenis Sampah & Berat</th><th className="px-5 py-4">Total Berat</th><th className="px-5 py-4">Poin</th><th className="px-5 py-4">Status Validasi</th><th className="px-5 py-4">Aksi</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">Memuat...</td></tr> : paginated.length === 0 ? <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">Tidak ada riwayat setoran</td></tr> : paginated.map(s => (
                <tr key={s.setoran_id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 align-top"><p className="text-[13px] font-bold text-gray-900">STN-2024-0822-{String(s.setoran_id).padStart(3, '0')}</p><p className="text-[11px] text-gray-400 mt-1">Dari Pengajuan</p><p className="text-[11px] font-semibold text-[#16a34a]">PGJ-2024-0822-{String(s.pengajuan_id).padStart(3, '0')}</p></td>
                  <td className="px-5 py-4 align-top"><p className="text-[13px] font-semibold text-gray-900">{s.warga.nama_warga}</p><p className="text-[11px] text-gray-500">{s.warga.no_telepon || '-'}</p><p className="text-[11px] text-gray-400">{s.warga.alamat?.split('/')[0]?.trim()}</p></td>
                  <td className="px-5 py-4 align-top text-[12px] text-gray-700">{new Date(s.tanggal_setoran).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}<br /><span className="text-gray-400">{new Date(s.tanggal_setoran).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span></td>
                  <td className="px-5 py-4 align-top"><div className="space-y-1.5">{(s.detail_setoran || []).map(d => <div key={d.detail_setoran_id} className="flex items-center justify-between gap-3 text-[12px]"><span className="flex items-center gap-2"><WasteIcon type={d.jenis_sampah.nama_jenis_sampah} size={16} />{d.jenis_sampah.nama_jenis_sampah}</span><span className="font-medium text-gray-700">{Number(d.berat_aktual).toFixed(1).replace('.', ',')} kg</span></div>)}<div className="flex items-center justify-between gap-3 text-[12px] font-bold border-t border-gray-100 pt-1.5 mt-1.5"><span>Total</span><span>{Number(s.total_berat_aktual).toFixed(1).replace('.', ',')} kg</span></div></div></td>
                  <td className="px-5 py-4 align-top text-[13px] font-semibold text-gray-900">{Number(s.total_berat_aktual).toFixed(1).replace('.', ',')} kg</td>
                  <td className="px-5 py-4 align-top text-center"><p className="text-[14px] font-bold text-gray-900">{(s as any).total_poin ?? s.total_poin_sementara}</p><p className="text-[11px] text-gray-400">poin</p></td>
                  <td className="px-5 py-4 align-top">
                    {s.status_validasi === 'disetujui' && <><span className="inline-flex px-2.5 py-1 rounded-lg bg-[#f0fdf4] text-[#15803d] text-[11px] font-semibold border border-green-100">Terverifikasi</span><p className="text-[10px] text-gray-400 mt-1">Oleh Admin<br />{s.tanggal_validasi ? new Date(s.tanggal_validasi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(s.tanggal_validasi).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</p></>}
                    {s.status_validasi === 'menunggu' && <><span className="inline-flex px-2.5 py-1 rounded-lg bg-[#fffbeb] text-[#92400e] text-[11px] font-semibold border border-amber-100">Menunggu Validasi</span><p className="text-[10px] text-gray-400 mt-1">Menunggu Admin<br />{new Date(s.tanggal_setoran).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p></>}
                    {s.status_validasi === 'ditolak' && <><span className="inline-flex px-2.5 py-1 rounded-lg bg-[#fef2f2] text-[#b91c1c] text-[11px] font-semibold border border-red-100">Ditolak</span><p className="text-[10px] text-gray-400 mt-1">Oleh Admin<br />{s.tanggal_validasi ? new Date(s.tanggal_validasi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p></>}
                  </td>
                  <td className="px-5 py-4 align-top"><button onClick={() => { setSelected(s); setShowDetail(true); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-[12px] font-medium"><Eye size={14} />Lihat Detail</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-[12px] text-gray-500">
          <span>Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} transaksi</span>
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map(n => <button key={n} onClick={() => setCurrentPage(n)} className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs font-semibold ${currentPage === n ? 'bg-[#16a34a] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{n}</button>)}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">›</button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 bg-[#f8faf7] border border-green-50 rounded-2xl p-4 text-[12px] text-gray-600">
        <div className="h-6 w-6 rounded-full bg-white border border-green-100 flex items-center justify-center text-green-600 flex-shrink-0">ⓘ</div>
        <p>Setoran yang sudah Anda validasi akan masuk ke proses validasi poin dan stok oleh admin.<br />Poin dan stok resmi akan muncul setelah disetujui oleh admin.</p>
      </div>

      {showDetail && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center"><h2 className="font-bold">Detail STN-{String(selected.setoran_id).padStart(3, '0')}</h2><button onClick={() => setShowDetail(false)} className="text-gray-400">✕</button></div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl"><div><p className="text-gray-500">Warga</p><p className="font-semibold">{selected.warga.nama_warga}</p></div><div><p className="text-gray-500">Tanggal</p><p className="font-semibold">{new Date(selected.tanggal_setoran).toLocaleString('id-ID')}</p></div><div><p className="text-gray-500">Total Berat</p><p className="font-semibold">{selected.total_berat_aktual} kg</p></div><div><p className="text-gray-500">Poin Sementara</p><p className="font-semibold">{selected.total_poin_sementara}</p></div></div>
              <div className="space-y-2">{selected.detail_setoran.map(d => <div key={d.detail_setoran_id} className="flex justify-between border rounded-xl p-3"><span className="flex gap-2 items-center"><WasteIcon type={d.jenis_sampah.nama_jenis_sampah} size={16} />{d.jenis_sampah.nama_jenis_sampah}</span><span>{d.berat_aktual} kg • {d.poin_sementara} poin</span></div>)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
