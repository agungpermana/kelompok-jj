'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminHeader from '@/components/layout/header';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Weight,
  BadgeIndianRupee,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { INITIAL_HARGA_POIN } from '@/data/harga-poin-initial';
import { detectIconType } from '@/services/hargaPoinService';

interface StokItem {
  stok_id: number;
  jenis_sampah_id: number;
  nama_jenis_sampah: string;
  kategori: string;
  jumlah_stok: number;
  satuan: string;
  harga_per_satuan: number;
  total_nilai: number;
  terakhir_diperbarui?: string | null;
}

interface StokRow {
  stok_id: number;
  jenis_sampah_id: number;
  jumlah_stok: number;
  satuan: string;
  terakhir_diperbarui?: string | null;
  jenis_sampah?: {
    nama_jenis_sampah?: string;
    satuan?: string;
    kategori?: string;
  };
}

const FALLBACK_STOK: StokItem[] = [
  { stok_id: 1, jenis_sampah_id: 1, nama_jenis_sampah: 'Botol Plastik', kategori: 'Plastik', jumlah_stok: 125, satuan: 'kg', harga_per_satuan: 2000, total_nilai: 250000, terakhir_diperbarui: null },
  { stok_id: 2, jenis_sampah_id: 4, nama_jenis_sampah: 'Kardus', kategori: 'Kertas', jumlah_stok: 88, satuan: 'kg', harga_per_satuan: 2000, total_nilai: 176000, terakhir_diperbarui: null },
  { stok_id: 3, jenis_sampah_id: 7, nama_jenis_sampah: 'Aluminium', kategori: 'Logam', jumlah_stok: 45.5, satuan: 'kg', harga_per_satuan: 10000, total_nilai: 455000, terakhir_diperbarui: null },
  { stok_id: 4, jenis_sampah_id: 2, nama_jenis_sampah: 'Gelas Plastik', kategori: 'Plastik', jumlah_stok: 66.3, satuan: 'kg', harga_per_satuan: 1500, total_nilai: 99450, terakhir_diperbarui: null },
  { stok_id: 5, jenis_sampah_id: 11, nama_jenis_sampah: 'Kaca Warna', kategori: 'Kaca', jumlah_stok: 30, satuan: 'kg', harga_per_satuan: 800, total_nilai: 24000, terakhir_diperbarui: null },
  { stok_id: 6, jenis_sampah_id: 9, nama_jenis_sampah: 'Besi', kategori: 'Logam', jumlah_stok: 52, satuan: 'kg', harga_per_satuan: 5000, total_nilai: 260000, terakhir_diperbarui: null },
];

function formatRupiah(value: number): string {
  return 'Rp ' + value.toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

function formatKg(value: number): string {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) + ' kg';
}

export default function StokSampahPage() {
  const [data, setData] = useState<StokItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua Kategori');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  };

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('trashure_token') : null;
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const mapHarga = (nama: string, satuan: string, jumlah: number): { harga: number; total: number } => {
    const match = INITIAL_HARGA_POIN.find(
      (h) => h.namaJenisSampah.toLowerCase() === nama.toLowerCase()
    );
    const harga = match?.hargaPerSatuan ?? 0;
    const perKg = /kg/i.test(satuan) ? 1 : 1;
    return { harga: harga * perKg, total: Math.round(harga * jumlah) };
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${getApiUrl()}/pengepul/stok`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: StokItem[] = json.data.map((row: StokRow) => {
            const jenis = row.jenis_sampah || {};
            const nama = jenis.nama_jenis_sampah || 'Sampah';
            const jumlah = Number(row.jumlah_stok) || 0;
            const satuan = row.satuan || jenis.satuan || 'kg';
            const { harga, total } = mapHarga(nama, satuan, jumlah);
            return {
              stok_id: row.stok_id,
              jenis_sampah_id: row.jenis_sampah_id,
              nama_jenis_sampah: nama,
              kategori: jenis.kategori || 'Lainnya',
              jumlah_stok: jumlah,
              satuan,
              harga_per_satuan: harga,
              total_nilai: total,
              terakhir_diperbarui: row.terakhir_diperbarui || null,
            };
          });
          setData(mapped);
          setUsingFallback(false);
          return;
        }
      }
      setData(FALLBACK_STOK);
      setUsingFallback(true);
    } catch (err) {
      console.warn('Could not connect to backend, using local data:', err);
      setData(FALLBACK_STOK);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const kategoriOptions = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.kategori))).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (
        searchQuery &&
        !item.nama_jenis_sampah.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedKategori !== 'Semua Kategori' && item.kategori !== selectedKategori) {
        return false;
      }
      return true;
    });
  }, [data, searchQuery, selectedKategori]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const stats = useMemo(() => {
    const totalBerat = data.reduce((acc, d) => acc + d.jumlah_stok, 0);
    const totalNilai = data.reduce((acc, d) => acc + d.total_nilai, 0);
    return { totalBerat, totalNilai, totalJenis: data.length };
  }, [data]);

  return (
    <div className="w-full pb-10">
      <AdminHeader
        title="Stok Sampah"
        subtitle="Pantau jumlah stok sampah yang tersedia beserta harga per jenis sampah."
        breadcrumbs={[
          { label: 'Dashboard', href: '/pengepul/dashboard' },
          { label: 'Stok Sampah' },
        ]}
      />

      {usingFallback && !loading && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">
            Tidak dapat terhubung ke server, menampilkan data stok lokal.
          </span>
          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Muat Ulang
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Stok Tersedia</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <Weight className="h-4.5 w-4.5 text-[#16a34a]" strokeWidth={1.8} />
            </span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{formatKg(stats.totalBerat)}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Nilai Perkiraan Stok</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <BadgeIndianRupee className="h-4.5 w-4.5 text-[#16a34a]" strokeWidth={1.8} />
            </span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#16a34a]">{formatRupiah(stats.totalNilai)}</p>
        </div>
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Jenis Sampah</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <Package className="h-4.5 w-4.5 text-[#16a34a]" strokeWidth={1.8} />
            </span>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stats.totalJenis} jenis</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[260px] flex-1 max-w-[360px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari jenis sampah..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg sm:rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-2xs transition"
            />
          </div>

          <div className="relative min-w-[170px]">
            <select
              value={selectedKategori}
              onChange={(e) => {
                setSelectedKategori(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-lg sm:rounded-xl bg-white border border-gray-200 px-3.5 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:border-green-500 shadow-2xs cursor-pointer transition"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs sm:text-sm font-semibold text-gray-700">
          Total {totalItems} jenis stok sampah
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg sm:rounded-xl bg-white border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-5 text-center w-12">No</th>
                <th className="py-3 px-5 min-w-[220px]">Jenis Sampah</th>
                <th className="py-3 px-5 w-32">Kategori</th>
                <th className="py-3 px-5 text-right w-36">Stok</th>
                <th className="py-3 px-5 text-right w-36">Harga / kg</th>
                <th className="py-3 px-5 text-right w-40">Total Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-300" />
                    Memuat data...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <p className="text-sm font-medium">Tidak ada data stok sampah yang sesuai.</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => {
                  const itemIndex = startIndex + idx + 1;
                  const iconType = detectIconType(item.nama_jenis_sampah);
                  return (
                    <tr key={item.stok_id || item.jenis_sampah_id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-5 text-center text-xs font-medium text-gray-500">
                        {itemIndex}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`relative flex h-9 sm:h-10 w-9 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl text-lg ${
                              iconType === 'botol-plastik' ? 'bg-blue-50' :
                              iconType === 'kardus' || iconType === 'kertas-hvs' || iconType === 'koran' ? 'bg-amber-50' :
                              iconType === 'aluminium' || iconType === 'kaleng' || iconType === 'besi' ? 'bg-slate-100' :
                              iconType === 'kaca-bening' || iconType === 'kaca-warna' || iconType === 'kaca-pecah' ? 'bg-cyan-50' :
                              iconType === 'gelas-plastik' || iconType === 'kresek' ? 'bg-sky-50' :
                              'bg-green-50'
                            }`}
                          >
                            {iconType === 'botol-plastik' || iconType === 'gelas-plastik' || iconType === 'kresek' ? '🧴' :
                             iconType === 'kardus' || iconType === 'kertas-hvs' || iconType === 'koran' ? '📦' :
                             iconType === 'aluminium' || iconType === 'kaleng' || iconType === 'besi' ? '🛢️' :
                             iconType === 'kaca-bening' || iconType === 'kaca-warna' || iconType === 'kaca-pecah' ? '🍾' :
                             '♻️'}
                          </span>
                          <div>
                            <span className="font-semibold text-gray-800 text-sm block">
                              {item.nama_jenis_sampah}
                            </span>
                            <span className="text-[11px] text-gray-400">Satuan {item.satuan}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right font-semibold text-gray-800">
                        {formatKg(item.jumlah_stok)}
                      </td>
                      <td className="py-3 px-5 text-right font-medium text-gray-600">
                        {item.harga_per_satuan > 0 ? formatRupiah(item.harga_per_satuan) : (
                          <span className="text-gray-300 italic">-</span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-right font-bold text-[#16a34a]">
                        {formatRupiah(item.total_nilai)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">
            Menampilkan {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} dari {totalItems} jenis stok sampah
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold transition ${
                    isActive ? 'bg-[#16a34a] text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}