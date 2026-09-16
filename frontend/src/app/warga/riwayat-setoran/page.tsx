'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bell,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  ShoppingBag,
  Scale,
  Star,
  Info,
  MessageCircle,
  X,
  Package,
  Boxes,
  Wine,
  Leaf,
  Layers,
  Search,
  User,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  fetchRiwayatSetoran,
  fetchDetailSetoran,
  SetoranItem,
  RingkasanSetoran,
  DEFAULT_RINGKASAN,
} from '@/services/wargaSetoranService';
import { fetchCurrentUser, UserProfile } from '@/services/wargaPengajuanService';

// Format helper for formatted currency or numbers
function formatNumber(val: number | string): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0';
  return num.toLocaleString('id-ID');
}

// Generate code STYYMMDD-XXX from date and ID
function formatSetoranCode(setoranId: number, dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const seq = String(setoranId).padStart(3, '0');
    return `ST${yy}${mm}${dd}-${seq}`;
  } catch {
    return `ST-${String(setoranId).padStart(4, '0')}`;
  }
}

// Format date to Indonesian localized date
function formatIndoDate(dateStr: string): string {
  try {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

function formatIndoTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return '';
  }
}

// Waste icon badge component
function WasteBadgeIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes('botol') || lower.includes('pet')) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 border border-blue-100 flex-shrink-0">
        <Wine className="h-4 w-4" />
      </div>
    );
  }
  if (lower.includes('kardus') || lower.includes('kertas') || lower.includes('koran')) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex-shrink-0">
        <Package className="h-4 w-4" />
      </div>
    );
  }
  if (lower.includes('kaleng') || lower.includes('aluminium') || lower.includes('besi') || lower.includes('logam')) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
        <Boxes className="h-4 w-4" />
      </div>
    );
  }
  if (lower.includes('plastik') || lower.includes('kresek')) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-500 border border-pink-100 flex-shrink-0">
        <ShoppingBag className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">
      <Leaf className="h-4 w-4" />
    </div>
  );
}

export default function RiwayatSetoranPage() {
  const [data, setData] = useState<SetoranItem[]>([]);
  const [ringkasan, setRingkasan] = useState<RingkasanSetoran>(DEFAULT_RINGKASAN);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Filters
  const [activeTab, setActiveTab] = useState<'semua' | 'menunggu' | 'disetujui' | 'ditolak'>('semua');
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [isDateFilterModalOpen, setIsDateFilterModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Detail Modal
  const [selectedSetoran, setSelectedSetoran] = useState<SetoranItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [res, user] = await Promise.all([
        fetchRiwayatSetoran({
          status: activeTab === 'semua' ? undefined : activeTab,
          sort: sortOrder,
        }),
        fetchCurrentUser(),
      ]);

      setData(res.data);
      setRingkasan(res.ringkasan);
      if (user) setUserProfile(user);
    } catch (err) {
      console.error('Error fetching data:', err);
      setData([]);
      setRingkasan(DEFAULT_RINGKASAN);
    } finally {
      setLoading(false);
    }
  }, [activeTab, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Client-side date filter if custom range is set
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Tab filter
      if (activeTab !== 'semua') {
        const status = item.status_validasi?.toLowerCase();
        if (activeTab === 'menunggu' && status !== 'menunggu') return false;
        if (activeTab === 'disetujui' && status !== 'disetujui') return false;
        if (activeTab === 'ditolak' && status !== 'ditolak') return false;
      }

      // Custom date filter
      if (customStartDate) {
        const itemDate = new Date(item.tanggal_setoran);
        const start = new Date(customStartDate);
        if (itemDate < start) return false;
      }
      if (customEndDate) {
        const itemDate = new Date(item.tanggal_setoran);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }

      return true;
    });
  }, [data, activeTab, customStartDate, customEndDate]);

  const handleOpenDetail = async (item: SetoranItem) => {
    setSelectedSetoran(item);
    setIsDetailModalOpen(true);
    // Optionally fetch freshest detail from API
    const fresh = await fetchDetailSetoran(item.setoran_id);
    if (fresh) setSelectedSetoran(fresh);
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-16 font-sans">
      {/* Top Header */}
      <header className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Riwayat Setoran
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Lihat riwayat setoran sampah yang Anda lakukan dan status validasinya.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification with Badge 5 */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200/90 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
              5
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-xl bg-white border border-gray-200/90 px-3.5 py-1.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-200 to-rose-200 text-gray-800 font-semibold text-sm shadow-inner overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Warga Avatar"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {userProfile?.warga?.nama_warga || userProfile?.username || 'Warga'}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
          </div>
        </div>
      </header>

      {/* Main Grid: Left List (68%) + Right Summary (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls + Setoran Cards List */}
        <div className="lg:col-span-8 space-y-5">
          {/* Controls Bar: Status Tabs + Sort & Filter */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-3 md:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveTab('semua')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative ${activeTab === 'semua'
                  ? 'text-[#16a34a] bg-green-50/70 border-b-2 border-[#16a34a]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveTab('menunggu')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative ${activeTab === 'menunggu'
                  ? 'text-amber-700 bg-amber-50 border-b-2 border-amber-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                Menunggu Validasi
              </button>
              <button
                onClick={() => setActiveTab('disetujui')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative ${activeTab === 'disetujui'
                  ? 'text-[#16a34a] bg-green-50/70 border-b-2 border-[#16a34a]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                Disetujui
              </button>
              <button
                onClick={() => setActiveTab('ditolak')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative ${activeTab === 'ditolak'
                  ? 'text-rose-600 bg-rose-50 border-b-2 border-rose-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                Ditolak
              </button>
            </div>

            {/* Right Controls: Sort Dropdown & Date Filter */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="bg-white border border-gray-200/90 rounded-xl px-3.5 py-1.5 text-xs font-medium text-gray-700 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#16a34a] shadow-xs cursor-pointer appearance-none"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Date filter button */}
              <button
                onClick={() => setIsDateFilterModalOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition shadow-xs ${customStartDate || customEndDate
                  ? 'bg-green-50 border-[#16a34a] text-[#16a34a]'
                  : 'bg-white border-gray-200/90 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <span>Filter Tanggal</span>
                {(customStartDate || customEndDate) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-sm">
              <Loader2 className="h-7 w-7 animate-spin text-[#16a34a] mx-auto mb-3" />
              <p className="text-xs font-medium text-gray-500">Memuat riwayat setoran...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-3">
                <FileSpreadsheet className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-gray-900">
                Tidak Ada Riwayat Setoran
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Belum ada transaksi setoran sampah dengan filter yang Anda pilih.
              </p>
            </div>
          ) : (
            /* Setoran Cards List */
            <div className="space-y-4">
              {filteredData.map((item) => {
                const isDisetujui = item.status_validasi === 'disetujui';
                const isMenunggu = item.status_validasi === 'menunggu';
                const isDitolak = item.status_validasi === 'ditolak';

                const isDiajukan = item.status_pengajuan === 'diajukan';
                const isDijadwalkan = item.status_pengajuan === 'dijadwalkan';
                const isSelesai = item.status_pengajuan === 'selesai';

                const totalBeratVal = typeof item.total_berat_aktual === 'string'
                  ? parseFloat(item.total_berat_aktual)
                  : item.total_berat_aktual;

                const code = formatSetoranCode(item.setoran_id, item.tanggal_setoran) ?? "-";
                const dateIndo = formatIndoDate(item.tanggal_setoran);
                const timeIndo = formatIndoTime(item.tanggal_setoran);

                return (
                  <div
                    key={item.setoran_id}
                    className="bg-white rounded-2xl border border-gray-200/80 p-5 md:p-6 shadow-sm hover:border-gray-300 hover:shadow transition duration-150"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Col 1: Status badge, Date, Time & Code (Col span 3) */}
                      <div className="md:col-span-3 space-y-2 border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
                        {/* Status Badge */}
                        <div>
                          {isDiajukan && (
                            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold">
                              Diajukan
                            </span>
                          )}
                          {isDijadwalkan && (
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                              Dijadwalkan
                            </span>
                          )}
                          {isSelesai && (
                            <span className="inline-flex items-center gap-1.5 bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-3 py-1 rounded-full text-xs font-semibold">
                              Selesai
                            </span>
                          )}
                        </div>

                        {/* Date & Time */}
                        <div className="pt-1">
                          <span
                            className={`text-[11px] font-semibold block mb-0.5 ${isMenunggu ? 'text-amber-700 font-bold' : 'text-gray-400'
                              }`}
                          >
                            {isMenunggu ? 'Perkiraan Penjemputan' : 'Waktu Pengambilan'}
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              {isMenunggu && item.perkiraan_tanggal_jemput
                                ? formatIndoDate(item.perkiraan_tanggal_jemput)
                                : dateIndo}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 pl-5.5 font-medium mt-0.5">
                            {isMenunggu && item.perkiraan_waktu_jemput
                              ? item.perkiraan_waktu_jemput
                              : timeIndo ? `${timeIndo} WIB` : ''}
                          </p>
                        </div>

                        {/* ID Setoran */}
                        <div className="pt-1">
                          <p className="text-[11px] text-gray-400 font-medium">ID Setoran</p>
                          <p className="text-xs font-semibold text-gray-700 tracking-wide font-mono">
                            {code}
                          </p>
                        </div>
                      </div>

                      {/* Col 2: Jenis Sampah List (Col span 4) */}
                      <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Jenis Sampah
                        </p>
                        <div className="space-y-2">
                          {item.detail_setoran && item.detail_setoran.length > 0 ? (
                            item.detail_setoran.slice(0, 3).map((d) => (
                              <div
                                key={d.detail_setoran_id}
                                className="flex items-center justify-between gap-2 text-xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <WasteBadgeIcon
                                    name={d.jenis_sampah?.nama_jenis_sampah || 'Sampah'}
                                  />
                                  <span className="font-semibold text-gray-800 truncate">
                                    {d.jenis_sampah?.nama_jenis_sampah || 'Sampah'}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-600 flex-shrink-0">
                                  {Number(d.berat_aktual).toFixed(2)} kg
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">Sampah terpilah</p>
                          )}
                          {item.detail_setoran && item.detail_setoran.length > 3 && (
                            <p className="text-[11px] text-[#16a34a] font-medium pl-10">
                              +{item.detail_setoran.length - 3} jenis lainnya
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Col 3: Total Berat & Poin (Col span 2) */}
                      <div className="md:col-span-2 space-y-3 text-left border-b md:border-b-0 md:border-r border-gray-100 pb-3 md:pb-0 md:pr-3">
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium">Total Berat</p>
                          <p className="text-lg font-extrabold text-gray-900 tracking-tight">
                            {totalBeratVal ? totalBeratVal.toFixed(2) : '0.00'} kg
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-gray-400 font-medium">
                            {isMenunggu ? 'Poin Perkiraan' : 'Poin Diterima'}
                          </p>
                          <p
                            className={`text-sm font-extrabold ${isDisetujui
                              ? 'text-[#16a34a]'
                              : isMenunggu
                                ? 'text-amber-600'
                                : 'text-rose-600'
                              }`}
                          >
                            {isDitolak
                              ? '0 poin'
                              : `${formatNumber((item as any).total_poin ?? item.total_poin_sementara)} poin`}
                          </p>
                        </div>
                      </div>

                      {/* Col 4: Validasi & Action (Col span 3) */}
                      <div className="md:col-span-3 space-y-3 flex flex-col justify-between h-full">
                        <div>
                          <p className="text-[11px] text-gray-400 font-medium mb-1">
                            Validasi oleh Admin
                          </p>
                          {isDisetujui && (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#16a34a]">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Disetujui</span>
                              </div>
                              {item.tanggal_validasi && (
                                <p className="text-[11px] text-gray-500 pl-5.5">
                                  {formatIndoDate(item.tanggal_validasi)}{' '}
                                  {formatIndoTime(item.tanggal_validasi)}
                                </p>
                              )}
                            </div>
                          )}

                          {isMenunggu && (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                                <Clock className="h-4 w-4" />
                                <span>Menunggu Validasi</span>
                              </div>
                              <p className="text-[11px] text-gray-400 pl-5.5">Oleh Admin</p>
                            </div>
                          )}

                          {isDitolak && (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                                <XCircle className="h-4 w-4" />
                                <span>Ditolak</span>
                              </div>
                              {item.tanggal_validasi && (
                                <p className="text-[11px] text-gray-500 pl-5.5">
                                  {formatIndoDate(item.tanggal_validasi)}{' '}
                                  {formatIndoTime(item.tanggal_validasi)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Button Lihat Detail */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition hover:border-gray-300 shadow-xs"
                          >
                            <span>Lihat Detail</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Summary & Support Cards */}
        <div className="lg:col-span-4 space-y-5 sticky top-6">
          {/* Card 1: Ringkasan Setoran */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              Ringkasan Setoran
            </h3>

            <div className="space-y-3.5">
              {/* Total Setoran */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#16a34a] border border-emerald-100">
                    <ShoppingBag className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Setoran</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {ringkasan.total_setoran} kali
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  {ringkasan.total_setoran}
                </span>
              </div>

              {/* Total Berat Sampah */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <Scale className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Berat Sampah</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      {ringkasan.total_berat_sampah.toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Poin Diterima */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#16a34a] border border-emerald-100">
                    <Star className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Poin Diterima</p>
                    <p className="text-sm font-bold text-[#16a34a] mt-0.5">
                      {formatNumber(ringkasan.total_poin_diterima)} poin
                    </p>
                  </div>
                </div>
              </div>

              {/* Menunggu Validasi */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                    <Clock className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Menunggu Validasi</p>
                    <p className="text-sm font-bold text-amber-600 mt-0.5">
                      {ringkasan.menunggu_validasi} setoran
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  {ringkasan.menunggu_validasi}
                </span>
              </div>
            </div>
          </div>



          {/* Card 3: Informasi */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-start gap-2.5 text-[#16a34a]">
              <Info className="h-5 w-5 flex-shrink-0" />
              <h4 className="text-sm font-bold text-gray-900">Informasi</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Poin akan masuk ke saldo resmi Anda setelah setoran disetujui oleh admin. Pastikan sampah sudah dipilah dengan benar sebelum penjemputan.
            </p>

            {/* Recycling art illustration */}
            <div className="flex justify-end pt-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Leaf className="h-7 w-7" />
              </div>
            </div>
          </div>

          {/* Card 4: Butuh bantuan? */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-5 shadow-sm space-y-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Butuh bantuan?</h3>
              <p className="text-xs text-gray-600 mt-0.5">Hubungi kami melalui WhatsApp</p>
            </div>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Trashure,%20saya%20ingin%20bertanya%20tentang%20status%20riwayat%20setoran%20sampah%20saya."
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl py-2.5 px-4 text-xs font-semibold shadow-xs transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </div>

      {/* MODAL: Filter Tanggal Custom */}
      {isDateFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Filter Rentang Tanggal</h3>
              <button
                onClick={() => setIsDateFilterModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#16a34a]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                  setIsDateFilterModalOpen(false);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsDateFilterModalOpen(false)}
                className="px-5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detail Setoran Sampah */}
      {isDetailModalOpen && selectedSetoran && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-7 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-gray-900">
                    Detail Transaksi Setoran
                  </h3>
                  {selectedSetoran.status_validasi === 'disetujui' && (
                    <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      Disetujui
                    </span>
                  )}
                  {selectedSetoran.status_validasi === 'menunggu' && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      Menunggu Validasi
                    </span>
                  )}
                  {selectedSetoran.status_validasi === 'ditolak' && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      Ditolak
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {formatSetoranCode(selectedSetoran.setoran_id, selectedSetoran.tanggal_setoran)}
                </p>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">
                    {selectedSetoran.status_validasi === 'menunggu'
                      ? 'Perkiraan Tanggal Jemput'
                      : 'Tanggal Setoran'}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedSetoran.status_validasi === 'menunggu' && selectedSetoran.perkiraan_tanggal_jemput
                      ? formatIndoDate(selectedSetoran.perkiraan_tanggal_jemput)
                      : formatIndoDate(selectedSetoran.tanggal_setoran)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">
                    {selectedSetoran.status_validasi === 'menunggu'
                      ? 'Perkiraan Waktu Jemput'
                      : 'Waktu Pengambilan'}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedSetoran.status_validasi === 'menunggu' && selectedSetoran.perkiraan_waktu_jemput
                      ? selectedSetoran.perkiraan_waktu_jemput
                      : `${formatIndoTime(selectedSetoran.tanggal_setoran)} WIB`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Petugas Lapangan</span>
                  <span className="font-semibold text-gray-800">
                    {selectedSetoran.petugas?.nama_petugas ||
                      (selectedSetoran.status_validasi === 'menunggu'
                        ? 'Menunggu Penugasan'
                        : 'Petugas Trashure')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Total Berat</span>
                  <span className="font-bold text-gray-900">
                    {Number(selectedSetoran.total_berat_aktual).toFixed(2)} kg
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Poin Setoran</span>
                  <span className="font-bold text-[#16a34a]">
                    {selectedSetoran.status_validasi === 'menunggu'
                      ? 'Menunggu Validasi'
                      : `${formatNumber((selectedSetoran as any).total_poin ?? selectedSetoran.total_poin_sementara)} poin`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">
                    {selectedSetoran.status_validasi === 'menunggu' ? 'Status Validasi' : 'Validator'}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedSetoran.status_validasi === 'menunggu'
                      ? 'Menunggu Validasi Admin'
                      : (selectedSetoran as any).validator_admin?.nama_admin || (selectedSetoran as any).validator_petugas?.nama_petugas || 'Admin Bank Sampah'}
                  </span>
                </div>
              </div>

              {/* Catatan Validasi if present */}
              {selectedSetoran.catatan_validasi && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${selectedSetoran.status_validasi === 'ditolak'
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : 'bg-green-50 border border-green-200 text-emerald-900'
                    }`}
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Catatan Validasi Admin:</span>
                    <span>{selectedSetoran.catatan_validasi}</span>
                  </div>
                </div>
              )}

              {/* Rincian Sampah Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Rincian Sampah Terverifikasi
                </h4>

                <div className="border border-gray-100 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                      <tr>
                        <th className="py-2.5 px-3">Jenis Sampah</th>
                        <th className="py-2.5 px-3 text-right">Berat Aktual</th>
                        <th className="py-2.5 px-3 text-right">Nilai Poin / kg</th>
                        <th className="py-2.5 px-3 text-right">Subtotal Poin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedSetoran.detail_setoran &&
                        selectedSetoran.detail_setoran.length > 0 ? (
                        selectedSetoran.detail_setoran.map((d) => (
                          <tr key={d.detail_setoran_id} className="hover:bg-gray-50/50">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <WasteBadgeIcon
                                  name={d.jenis_sampah?.nama_jenis_sampah || 'Sampah'}
                                />
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {d.jenis_sampah?.nama_jenis_sampah || 'Sampah Terpilah'}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {d.jenis_sampah?.keterangan || 'Kondisi bersih'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right font-medium text-gray-800">
                              {Number(d.berat_aktual).toFixed(2)} kg
                            </td>
                            <td className="py-3 px-3 text-right text-gray-500 font-medium">
                              {d.nilai_poin_per_satuan ? `${d.nilai_poin_per_satuan} poin` : '-'}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-gray-900">
                              {selectedSetoran.status_validasi === 'ditolak'
                                ? '0 poin'
                                : `${formatNumber((d as any).poin ?? d.poin_sementara)} poin`}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-400">
                            Tidak ada rincian sampah tersedia
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50/80 font-bold text-gray-900 border-t border-gray-100">
                      <tr>
                        <td className="py-2.5 px-3">Total</td>
                        <td className="py-2.5 px-3 text-right text-gray-900">
                          {Number(selectedSetoran.total_berat_aktual).toFixed(2)} kg
                        </td>
                        <td className="py-2.5 px-3 text-right"></td>
                        <td className="py-2.5 px-3 text-right text-[#16a34a]">
                          {selectedSetoran.status_validasi === 'ditolak'
                            ? '0 poin'
                            : `${formatNumber(selectedSetoran.total_poin_sementara)} poin`}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
