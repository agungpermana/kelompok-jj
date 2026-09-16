'use client';
import { useState, useEffect, useMemo } from 'react';
import PetugasHeader from '@/components/layout/PetugasHeader';
import WasteIcon from '@/components/common/WasteIcon';
import { Search, RotateCcw, CheckCircle2, Clock, XCircle, Minus, Calendar, Eye, MoreVertical } from 'lucide-react';

interface Jadwal { jadwal_id: number; pengajuan_id: number; tanggal_penjemputan: string; waktu_penjemputan: string; status_jadwal: string; pengajuan_penjemputan: { pengajuan_id: number; alamat_penjemputan: string; perkiraan_total_berat: number; status_pengajuan: string; warga: { warga_id: number; nama_warga: string; no_telepon: string; alamat: string; }; detail_pengajuan_sampah: { detail_pengajuan_id: number; jenis_sampah_id: number; perkiraan_berat: number; jenis_sampah: { jenis_sampah_id: number; nama_jenis_sampah: string; }; }[]; }; }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const getToken = () => { if (typeof window === 'undefined') return ''; return localStorage.getItem('trashure_token') || localStorage.getItem('token') || ''; };

export default function RiwayatPenjemputanPage() {
  const [list, setList] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [tanggalFilter, setTanggalFilter] = useState('');
  const [selected, setSelected] = useState<Jadwal | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try { setLoading(true); const token = getToken(); const h: HeadersInit = { Accept: 'application/json' }; if (token) h['Authorization'] = `Bearer ${token}`; const r = await fetch(`${API_BASE_URL}/petugas/jadwal`, { headers: h }); const j = await r.json(); if (j?.data && Array.isArray(j.data)) setList(j.data); else setList([]); } catch { setList([]); } finally { setLoading(false); }
  };
  const stats = useMemo(() => {
    const selesai = list.filter(x => x.status_jadwal === 'selesai').length;
    const proses = list.filter(x => x.status_jadwal === 'diproses').length;
    const batal = list.filter(x => ['dibatalkan', 'batal'].includes(x.status_jadwal)).length;
    return { selesai, proses, batal, total: list.length };
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter(x => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const warga = x.pengajuan_penjemputan?.warga?.nama_warga?.toLowerCase() || '';
        const alamat = x.pengajuan_penjemputan?.alamat_penjemputan?.toLowerCase() || '';
        const jenis = (x.pengajuan_penjemputan?.detail_pengajuan_sampah || []).map(d => d.jenis_sampah?.nama_jenis_sampah?.toLowerCase()).join(' ');
        if (!warga.includes(q) && !alamat.includes(q) && !jenis.includes(q)) return false;
      }
      if (statusFilter !== 'Semua Status') {
        const s = x.status_jadwal.toLowerCase();
        if (statusFilter === 'Selesai' && s !== 'selesai') return false;
        if (statusFilter === 'Dalam Proses' && s !== 'diproses') return false;
        if (statusFilter === 'Dibatalkan' && !['dibatalkan', 'batal'].includes(s)) return false;
      }
      if (tanggalFilter) {
        const d = x.tanggal_penjemputan?.slice(0, 10);
        if (d !== tanggalFilter) return false;
      }
      return true;
    });
  }, [list, search, statusFilter, tanggalFilter]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const resetFilter = () => { setSearch(''); setStatusFilter('Semua Status'); setTanggalFilter(''); setCurrentPage(1); };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <PetugasHeader title="Riwayat Penjemputan" subtitle="Riwayat penjemputan sampah yang telah selesai atau dibatalkan." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-5 lg:mb-6">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a] flex-shrink-0"><CheckCircle2 className="h-6 w-6" /></div>
          <div><p className="text-[12px] font-medium text-gray-500">Selesai</p><div className="flex items-baseline gap-1.5"><span className="text-[22px] font-extrabold text-gray-900 leading-none">{stats.selesai}</span><span className="text-[11px] text-gray-400">Penjemputan</span></div></div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb] flex-shrink-0"><Clock className="h-6 w-6" /></div>
          <div><p className="text-[12px] font-medium text-gray-500">Dalam Proses</p><div className="flex items-baseline gap-1.5"><span className="text-[22px] font-extrabold text-gray-900 leading-none">{stats.proses}</span><span className="text-[11px] text-gray-400">Penjemputan</span></div></div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626] flex-shrink-0"><XCircle className="h-6 w-6" /></div>
          <div><p className="text-[12px] font-medium text-gray-500">Dibatalkan</p><div className="flex items-baseline gap-1.5"><span className="text-[22px] font-extrabold text-gray-900 leading-none">{stats.batal}</span><span className="text-[11px] text-gray-400">Penjemputan</span></div></div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 flex-shrink-0"><Minus className="h-6 w-6" /></div>
          <div><p className="text-[12px] font-medium text-gray-500">Total</p><div className="flex items-baseline gap-1.5"><span className="text-[22px] font-extrabold text-gray-900 leading-none">{stats.total}</span><span className="text-[11px] text-gray-400">Penjemputan</span></div></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Cari nama warga, alamat, atau jenis sampah..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-green-100 shadow-sm" /></div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-[13px]"><span className="text-gray-400 mr-2 text-xs">Status</span><select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"><option>Semua Status</option><option>Selesai</option><option>Dalam Proses</option><option>Dibatalkan</option></select></div>
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm text-[13px]"><span className="text-gray-400 mr-2 text-xs">Tanggal</span><input type="date" value={tanggalFilter} onChange={e => { setTanggalFilter(e.target.value); setCurrentPage(1); }} className="bg-transparent font-medium text-gray-800 focus:outline-none" /></div>
          <button onClick={resetFilter} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50"><RotateCcw className="h-3.5 w-3.5" />Reset Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-gray-100 bg-[#fafafa]/80 text-[12px] font-bold text-gray-600"><th className="px-5 py-4">Tanggal & Waktu</th><th className="px-5 py-4">Warga</th><th className="px-5 py-4">Alamat</th><th className="px-5 py-4">Jenis Sampah</th><th className="px-5 py-4">Total Berat</th><th className="px-5 py-4">Status Penjemputan</th><th className="px-5 py-4">Aksi</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-400">Memuat...</td></tr> : paginated.length === 0 ? <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-400">Tidak ada riwayat penjemputan</td></tr> : paginated.map(j => {
                const isSelesai = j.status_jadwal === 'selesai';
                const isBatal = ['dibatalkan', 'batal'].includes(j.status_jadwal);
                return (
                  <tr key={j.jadwal_id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelesai ? 'bg-[#f0fdf4] text-[#16a34a]' : isBatal ? 'bg-[#fef2f2] text-[#dc2626]' : 'bg-[#eff6ff] text-[#2563eb]'}`}><Calendar size={14} /></div><div><p className="text-[13px] font-semibold text-gray-900">{new Date(j.tanggal_penjemputan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p><p className="text-[11px] text-gray-500">{j.waktu_penjemputan?.slice(0, 5)}</p></div></div></td>
                    <td className="px-5 py-4"><p className="text-[13px] font-semibold text-gray-900">{j.pengajuan_penjemputan?.warga?.nama_warga}</p><p className="text-[11px] text-gray-500">{j.pengajuan_penjemputan?.warga?.no_telepon}</p></td>
                    <td className="px-5 py-4 text-[12px] text-gray-700 max-w-[160px] truncate">{j.pengajuan_penjemputan?.alamat_penjemputan}</td>
                    <td className="px-5 py-4"><div className="space-y-1">{(j.pengajuan_penjemputan?.detail_pengajuan_sampah || []).map(d => <div key={d.detail_pengajuan_id} className="flex items-center gap-2 text-[12px] text-gray-700"><WasteIcon type={d.jenis_sampah.nama_jenis_sampah} size={14} />{d.jenis_sampah.nama_jenis_sampah}</div>)}</div></td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-gray-900">{Number(j.pengajuan_penjemputan?.perkiraan_total_berat || 0).toFixed(1).replace('.', ',')} kg</td>
                    <td className="px-5 py-4">{isSelesai ? <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#f0fdf4] text-[#15803d] text-[11px] font-semibold border border-green-100">Selesai</span> : isBatal ? <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#fef2f2] text-[#b91c1c] text-[11px] font-semibold border border-red-100">Dibatalkan</span> : <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#eff6ff] text-[#1d4ed8] text-[11px] font-semibold border border-blue-100">Dalam Proses</span>}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><button onClick={() => { setSelected(j); setShowDetail(true); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg sm:rounded-xl border border-green-200 text-[#16a34a] bg-white hover:bg-green-50 text-[12px] font-medium"><Eye size={14} />Lihat Detail</button><button className="p-1.5 text-gray-400 hover:text-gray-600"><MoreVertical size={14} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-[12px] text-gray-500">
          <span>Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} riwayat penjemputan</span>
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(n => <button key={n} onClick={() => setCurrentPage(n)} className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs font-semibold ${currentPage === n ? 'bg-[#16a34a] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{n}</button>)}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">›</button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 bg-[#f8faf7] border border-green-50 rounded-2xl p-4 text-[12px] text-gray-600">
        <div className="h-6 w-6 rounded-full bg-white border border-green-100 flex items-center justify-center text-green-600 flex-shrink-0">ⓘ</div>
        <p>Klik "Lihat Detail" untuk melihat informasi lengkap penjemputan dan hasil setoran.</p>
      </div>

      {showDetail && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex justify-between items-center"><h2 className="font-bold">Detail Penjemputan</h2><button onClick={() => setShowDetail(false)} className="text-gray-400">✕</button></div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-4 rounded-lg sm:rounded-xl"><div><p className="text-gray-500">Warga</p><p className="font-semibold">{selected.pengajuan_penjemputan?.warga?.nama_warga}</p></div><div><p className="text-gray-500">Tanggal</p><p className="font-semibold">{selected.tanggal_penjemputan} {selected.waktu_penjemputan}</p></div><div className="col-span-2"><p className="text-gray-500">Alamat</p><p className="font-semibold">{selected.pengajuan_penjemputan?.alamat_penjemputan}</p></div></div>
              <div className="space-y-1">{selected.pengajuan_penjemputan?.detail_pengajuan_sampah?.map(d => <div key={d.detail_pengajuan_id} className="flex justify-between border rounded-lg sm:rounded-xl p-3 text-xs"><span className="flex gap-2 items-center"><WasteIcon type={d.jenis_sampah.nama_jenis_sampah} size={14} />{d.jenis_sampah.nama_jenis_sampah}</span><span>{d.perkiraan_berat} kg</span></div>)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
