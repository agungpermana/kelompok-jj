'use client';
import { useState, useEffect, useMemo } from 'react';
import AdminHeader from '@/components/layout/header';
import WasteIcon from '@/components/common/WasteIcon';
import { Search, RotateCcw, Eye, Check, X } from 'lucide-react';

interface Detail { detail_setoran_id: number; berat_aktual: number; poin: number; jenis_sampah: { nama_jenis_sampah: string; }; }
interface Setoran { setoran_id: number; pengajuan_id: number; warga_id: number; total_berat_aktual: number; total_poin: number; status_validasi: string; tanggal_setoran: string; tanggal_validasi?: string; catatan_validasi?: string; warga: { nama_warga: string; no_telepon?: string; alamat?: string; }; petugas: { nama_petugas: string; }; detail_setoran: Detail[]; validator_admin?: { nama_admin: string; }; }
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const token = () => typeof window !== 'undefined' ? (localStorage.getItem('trashure_token') || localStorage.getItem('token') || '') : '';

export default function AdminValidasiSetoranPage() {
  const [list, setList] = useState<Setoran[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Menunggu Validasi');
  const [selected, setSelected] = useState<Setoran | null>(null);
  const [showValidasi, setShowValidasi] = useState(false);
  const [validasiData, setValidasiData] = useState({ status_validasi: 'disetujui', catatan_validasi: '' });
  const [validating, setValidating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try { const t = token(); const h: HeadersInit = { Accept: 'application/json' }; if (t) h['Authorization'] = `Bearer ${t}`; const r = await fetch(`${API}/admin/setoran`, { headers: h }); const j = await r.json(); if (j?.data) setList(j.data); } catch {} finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => list.filter(s => {
    if (search.trim()) { const q = search.toLowerCase(); if (!s.warga.nama_warga.toLowerCase().includes(q) && !String(s.setoran_id).includes(q)) return false; }
    const map: Record<string,string> = { 'Menunggu Validasi':'menunggu','Terverifikasi':'disetujui','Ditolak':'ditolak','Semua Status':'semua' };
    const target = map[statusFilter] || 'menunggu';
    if (target !== 'semua' && s.status_validasi !== target) return false;
    return true;
  }), [list, search, statusFilter]);

  const stats = useMemo(() => ({ menunggu: list.filter(s=>s.status_validasi==='menunggu').length, terverifikasi: list.filter(s=>s.status_validasi==='disetujui').length, ditolak: list.filter(s=>s.status_validasi==='ditolak').length, total: list.length }), [list]);

  const openValidasi = (s: Setoran, status: string) => { setSelected(s); setValidasiData({ status_validasi: status, catatan_validasi: '' }); setShowValidasi(true); };
  const submitValidasi = async () => {
    if (!selected) return;
    setValidating(true);
    try { const t = token(); const h: HeadersInit = { 'Content-Type':'application/json', Accept:'application/json' }; if (t) h['Authorization']=`Bearer ${t}`; const r = await fetch(`${API}/admin/setoran/${selected.setoran_id}/validasi`, { method:'PATCH', headers:h, body: JSON.stringify(validasiData) }); if (r.ok) { setShowValidasi(false); fetchData(); } else { const j=await r.json(); alert(j.message||'Gagal'); } } catch { alert('Error'); } finally { setValidating(false); }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <AdminHeader title="Validasi Setoran" subtitle="Validasi hasil penjemputan petugas — jika disetujui, poin warga & stok sampah langsung diperbarui." />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4 sm:mb-5 lg:mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><p className="text-xs text-gray-500">Menunggu Validasi</p><p className="text-lg sm:text-xl lg:text-2xl font-extrabold">{stats.menunggu}</p></div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><p className="text-xs text-gray-500">Terverifikasi</p><p className="text-lg sm:text-xl lg:text-2xl font-extrabold">{stats.terverifikasi}</p></div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><p className="text-xs text-gray-500">Ditolak</p><p className="text-lg sm:text-xl lg:text-2xl font-extrabold">{stats.ditolak}</p></div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"><p className="text-xs text-gray-500">Total</p><p className="text-lg sm:text-xl lg:text-2xl font-extrabold">{stats.total}</p></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama warga atau no. transaksi..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-green-100 shadow-sm" /></div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-white border border-gray-200 rounded-2xl px-3 py-2 text-sm font-medium"><option>Menunggu Validasi</option><option>Terverifikasi</option><option>Ditolak</option><option>Semua Status</option></select>
          <button onClick={()=>{setSearch(''); setStatusFilter('Menunggu Validasi');}} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl text-sm font-medium"><RotateCcw className="h-3.5 w-3.5" />Reset</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b bg-[#fafafa] text-xs font-bold text-gray-600"><th className="px-5 py-4">No. Transaksi</th><th className="px-5 py-4">Warga</th><th className="px-5 py-4">Petugas</th><th className="px-5 py-4">Jenis & Berat</th><th className="px-5 py-4">Total Berat</th><th className="px-5 py-4">Total Poin</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Aksi</th></tr></thead>
            <tbody className="divide-y">
              {loading ? <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">Memuat...</td></tr> : filtered.length===0 ? <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-400">Tidak ada data</td></tr> : filtered.map(s=>(
                <tr key={s.setoran_id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 text-xs font-bold">STN-{String(s.setoran_id).padStart(4,'0')}</td>
                  <td className="px-5 py-4 text-xs font-semibold">{s.warga.nama_warga}</td>
                  <td className="px-5 py-4 text-xs">{s.petugas?.nama_petugas}</td>
                  <td className="px-5 py-4 text-xs"><div className="space-y-1">{s.detail_setoran?.map(d=> <div key={d.detail_setoran_id} className="flex gap-2"><WasteIcon type={d.jenis_sampah.nama_jenis_sampah} size={14} />{d.jenis_sampah.nama_jenis_sampah} — {d.berat_aktual} kg</div>)}</div></td>
                  <td className="px-5 py-4 text-xs font-semibold">{s.total_berat_aktual} kg</td>
                  <td className="px-5 py-4 text-xs font-bold">{s.total_poin} poin</td>
                  <td className="px-5 py-4 text-xs">{s.status_validasi==='menunggu' ? <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold">Menunggu</span> : s.status_validasi==='disetujui' ? <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">Disetujui</span> : <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">Ditolak</span>}</td>
                  <td className="px-5 py-4">
                    {s.status_validasi==='menunggu' ? <div className="flex flex-col gap-1"><button onClick={()=>openValidasi(s,'disetujui')} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg sm:rounded-xl border border-green-200 text-green-600 bg-white text-xs font-semibold"><Check size={12}/>Setujui</button><button onClick={()=>openValidasi(s,'ditolak')} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg sm:rounded-xl border border-red-200 text-red-600 bg-white text-xs font-semibold"><X size={12}/>Tolak</button></div> : <span className="text-xs text-gray-400">Selesai</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showValidasi && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="border-b px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4"><h2 className="font-bold">Validasi STN-{String(selected.setoran_id).padStart(4,'0')}</h2><p className="text-xs text-gray-500">{selected.warga.nama_warga} • {selected.total_poin} poin • {selected.total_berat_aktual} kg</p></div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={validasiData.status_validasi==='disetujui'} onChange={()=>setValidasiData({...validasiData,status_validasi:'disetujui'})}/>Disetujui — tambah poin & stok</label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={validasiData.status_validasi==='ditolak'} onChange={()=>setValidasiData({...validasiData,status_validasi:'ditolak'})}/>Ditolak</label></div>
              <textarea value={validasiData.catatan_validasi} onChange={e=>setValidasiData({...validasiData,catatan_validasi:e.target.value})} placeholder="Catatan validasi..." rows={3} className="w-full border rounded-lg sm:rounded-xl px-3 py-2 text-sm" />
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg sm:rounded-xl">Jika disetujui: saldo_poin warga +{selected.total_poin} dan stok_sampah per jenis +berat aktual.</p>
            </div>
            <div className="border-t px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex justify-end gap-3"><button onClick={()=>setShowValidasi(false)} disabled={validating} className="px-4 py-2 border rounded-lg sm:rounded-xl text-sm">Batal</button><button onClick={submitValidasi} disabled={validating} className={`px-4 py-2 rounded-lg sm:rounded-xl text-sm font-semibold text-white ${validasiData.status_validasi==='disetujui'?'bg-[#16a34a]':'bg-red-600'}`}>{validating?'Memproses...': validasiData.status_validasi==='disetujui'?'Setujui':'Tolak'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
