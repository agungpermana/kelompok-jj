'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminHeader from '@/components/layout/header';
import { Search, RotateCcw, FileText, Scale, Users, Eye, X } from 'lucide-react';

interface DetailSetoran {
  detail_setoran_id: number;
  jenis_sampah_id: number;
  berat_aktual: number;
  harga_satuan: number;
  nilai_poin_per_satuan: number;
  poin: number;
  jenis_sampah: { jenis_sampah_id: number; nama_jenis_sampah: string; };
}

interface TransaksiSetoran {
  setoran_id: number;
  pengajuan_id: number;
  tanggal_setoran: string;
  tanggal_validasi?: string | null;
  status_validasi: string;
  catatan_validasi?: string | null;
  catatan_penolakan?: string | null;
  total_berat_aktual: number;
  total_poin: number;
  warga: { warga_id: number; nama_warga: string; no_telepon?: string; alamat?: string; };
  petugas: { petugas_id: number; nama_petugas: string; };
  detail_setoran: DetailSetoran[];
  validator_admin?: { nama_admin: string; };
}

interface Petugas {
  petugas_id: number;
  nama_petugas: string;
}

interface JenisSampah {
  jenis_sampah_id: number;
  nama_jenis_sampah: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('trashure_token') || localStorage.getItem('token') || '';
};

export default function SetoranSampahPage() {
  const [list, setList] = useState<TransaksiSetoran[]>([]);
  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const [jenisSampahList, setJenisSampahList] = useState<JenisSampah[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [dariTanggal, setDariTanggal] = useState('');
  const [sampaiTanggal, setSampaiTanggal] = useState('');
  const [petugasFilter, setPetugasFilter] = useState('');
  const [jenisSampahFilter, setJenisSampahFilter] = useState('');

  // Modal state
  const [selected, setSelected] = useState<TransaksiSetoran | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
    fetchPetugas();
    fetchJenisSampah();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const headers: HeadersInit = { Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/admin/setoran`, { headers });
      const result = await response.json();
      if (result?.data && Array.isArray(result.data)) {
        setList(result.data);
      } else {
        setList([]);
      }
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPetugas = async () => {
    try {
      const token = getToken();
      const headers: HeadersInit = { Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/admin/petugas`, { headers });
      const result = await response.json();
      if (result?.data && Array.isArray(result.data)) {
        setPetugasList(result.data);
      }
    } catch {
      // ignore
    }
  };

  const fetchJenisSampah = async () => {
    try {
      const token = getToken();
      const headers: HeadersInit = { Accept: 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/petugas/jenis-sampah`, { headers });
      const result = await response.json();
      if (result?.data && Array.isArray(result.data)) {
        setJenisSampahList(result.data);
      }
    } catch {
      // ignore
    }
  };

  // Stats
  const stats = useMemo(() => {
    const total = list.length;
    const totalBerat = list.reduce((sum, x) => sum + Number(x.total_berat_aktual || 0), 0);
    const petugasAktif = new Set(list.map(x => x.petugas?.petugas_id).filter(Boolean)).size;
    return { total, totalBerat, petugasAktif };
  }, [list]);

  // Filter
  const filtered = useMemo(() => {
    return list.filter(s => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const warga = s.warga?.nama_warga?.toLowerCase() || '';
        const petugas = s.petugas?.nama_petugas?.toLowerCase() || '';
        const no = `stn-${s.setoran_id}`.toLowerCase();
        if (!warga.includes(q) && !petugas.includes(q) && !no.includes(q)) return false;
      }

      // Status
      if (statusFilter !== 'semua' && s.status_validasi !== statusFilter) return false;

      // Tanggal
      if (dariTanggal) {
        const tgl = new Date(s.tanggal_setoran).toISOString().slice(0, 10);
        if (tgl < dariTanggal) return false;
      }
      if (sampaiTanggal) {
        const tgl = new Date(s.tanggal_setoran).toISOString().slice(0, 10);
        if (tgl > sampaiTanggal) return false;
      }

      // Petugas
      if (petugasFilter && String(s.petugas?.petugas_id) !== petugasFilter) return false;

      // Jenis Sampah
      if (jenisSampahFilter) {
        const hasJenis = s.detail_setoran?.some(d => String(d.jenis_sampah_id) === jenisSampahFilter);
        if (!hasJenis) return false;
      }

      return true;
    });
  }, [list, search, statusFilter, dariTanggal, sampaiTanggal, petugasFilter, jenisSampahFilter]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const resetFilter = () => {
    setSearch('');
    setStatusFilter('semua');
    setDariTanggal('');
    setSampaiTanggal('');
    setPetugasFilter('');
    setJenisSampahFilter('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#f0fdf4] text-[#15803d] text-[11px] font-semibold border border-green-100">Disetujui</span>;
      case 'menunggu':
        return <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#fffbeb] text-[#92400e] text-[11px] font-semibold border border-amber-100">Menunggu</span>;
      case 'ditolak':
        return <span className="inline-flex px-2.5 py-1 rounded-lg bg-[#fef2f2] text-[#b91c1c] text-[11px] font-semibold border border-red-100">Ditolak</span>;
      default:
        return <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-semibold">{status}</span>;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-12">
      <AdminHeader
        title="Setoran Sampah"
        subtitle="Daftar semua transaksi setoran sampah dari petugas."
      />

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a] flex-shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Setoran</p>
            <p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.total}</p>
            <p className="text-[11px] text-gray-400">Transaksi</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb] flex-shrink-0">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Total Berat Sampah</p>
            <p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.totalBerat.toFixed(1).replace('.', ',')} kg</p>
            <p className="text-[11px] text-gray-400">Keseluruhan</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3ff] text-[#7c3aed] flex-shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-500">Petugas Aktif</p>
            <p className="text-[20px] font-extrabold text-gray-900 leading-none mt-1">{stats.petugasAktif}</p>
            <p className="text-[11px] text-gray-400">Petugas</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Cari nama warga, petugas, atau no. transaksi..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-[#16a34a] focus:ring-4 focus:ring-green-100"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#16a34a] bg-white"
            >
              <option value="semua">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>

            <input
              type="date"
              value={dariTanggal}
              onChange={e => { setDariTanggal(e.target.value); setCurrentPage(1); }}
              placeholder="Dari tanggal"
              className="px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#16a34a]"
            />
            <input
              type="date"
              value={sampaiTanggal}
              onChange={e => { setSampaiTanggal(e.target.value); setCurrentPage(1); }}
              placeholder="Sampai tanggal"
              className="px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#16a34a]"
            />

            <select
              value={petugasFilter}
              onChange={e => { setPetugasFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#16a34a] bg-white"
            >
              <option value="">Semua Petugas</option>
              {petugasList.map(p => (
                <option key={p.petugas_id} value={p.petugas_id}>{p.nama_petugas}</option>
              ))}
            </select>

            <select
              value={jenisSampahFilter}
              onChange={e => { setJenisSampahFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-[#16a34a] bg-white"
            >
              <option value="">Semua Jenis Sampah</option>
              {jenisSampahList.map(j => (
                <option key={j.jenis_sampah_id} value={j.jenis_sampah_id}>{j.nama_jenis_sampah}</option>
              ))}
            </select>

            <button
              onClick={resetFilter}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#fafafa]/80 text-[12px] font-bold text-gray-600">
                <th className="px-5 py-4">No. Transaksi</th>
                <th className="px-5 py-4">Tanggal</th>
                <th className="px-5 py-4">Warga</th>
                <th className="px-5 py-4">Petugas</th>
                <th className="px-5 py-4">Jenis Sampah</th>
                <th className="px-5 py-4">Total Berat</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-gray-400">Memuat data...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-gray-400">Tidak ada data setoran</td>
                </tr>
              ) : (
                paginated.map(s => (
                  <tr key={s.setoran_id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-bold text-gray-900">STN-{String(s.setoran_id).padStart(4, '0')}</p>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray-700">
                      {new Date(s.tanggal_setoran).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-gray-900">{s.warga?.nama_warga || '-'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] text-gray-700">{s.petugas?.nama_petugas || '-'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {s.detail_setoran?.map(d => (
                          <span key={d.detail_setoran_id} className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md">
                            {d.jenis_sampah?.nama_jenis_sampah}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-gray-900">
                      {Number(s.total_berat_aktual).toFixed(1).replace('.', ',')} kg
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(s.status_validasi)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setSelected(s); setShowDetail(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-[12px] font-medium"
                      >
                        <Eye size={14} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-[12px] text-gray-500">
          <span>Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length} transaksi</span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map(n => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs font-semibold ${currentPage === n ? 'bg-[#16a34a] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
              >
                {n}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {showDetail && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Detail STN-{String(selected.setoran_id).padStart(4, '0')}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-gray-500 text-[11px]">Warga</p>
                  <p className="font-semibold">{selected.warga?.nama_warga || '-'}</p>
                  <p className="text-[11px] text-gray-400">{selected.warga?.no_telepon || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px]">Petugas</p>
                  <p className="font-semibold">{selected.petugas?.nama_petugas || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px]">Tanggal Setoran</p>
                  <p className="font-semibold">{new Date(selected.tanggal_setoran).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px]">Status</p>
                  {getStatusBadge(selected.status_validasi)}
                </div>
              </div>

              {selected.status_validasi === 'ditolak' && selected.catatan_penolakan && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-[11px] font-medium text-red-600 mb-1">Catatan Penolakan (Petugas)</p>
                  <p className="text-sm text-red-700 italic">&quot;{selected.catatan_penolakan}&quot;</p>
                </div>
              )}

              {selected.status_validasi === 'ditolak' && selected.catatan_validasi && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <p className="text-[11px] font-medium text-red-600 mb-1">Catatan Validasi (Admin)</p>
                  <p className="text-sm text-red-700 italic">&quot;{selected.catatan_validasi}&quot;</p>
                </div>
              )}

              <div>
                <p className="text-[11px] font-medium text-gray-500 mb-2">Detail Setoran</p>
                <div className="space-y-2">
                  {selected.detail_setoran?.map(d => (
                    <div key={d.detail_setoran_id} className="flex justify-between items-center border rounded-xl p-3">
                      <span className="text-gray-700">{d.jenis_sampah?.nama_jenis_sampah}</span>
                      <span className="font-medium">{d.berat_aktual} kg • {d.poin} poin</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 mt-3 pt-3 font-bold">
                  <span>Total</span>
                  <span>{selected.total_berat_aktual} kg • {selected.total_poin} poin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
