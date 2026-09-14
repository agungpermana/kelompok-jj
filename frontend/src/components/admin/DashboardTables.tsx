'use client';

import { ExternalLink, Truck, Package, Clock, Star, FileText, Scale } from 'lucide-react';

// Pengajuan Penjemputan Data
const penjemputanData = [
  {
    no: 'PGJ-2024-0822-001',
    warga: 'Siti Nurhayati',
    tanggalAjukan: '22 Agu 2024 08:45',
    jadwal: '22 Agu 2024 09:00',
    petugas: 'Ahmad Fauzi',
    status: 'Dijadwalkan',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    no: 'PGJ-2024-0822-002',
    warga: 'Budi Santoso',
    tanggalAjukan: '22 Agu 2024 10:15',
    jadwal: '22 Agu 2024 10:30',
    petugas: 'Ahmad Fauzi',
    status: 'Dalam Proses',
    statusColor: 'bg-amber-100 text-amber-700',
  },
  {
    no: 'PGJ-2024-0821-018',
    warga: 'Dewi Lestari',
    tanggalAjukan: '21 Agu 2024 13:20',
    jadwal: '21 Agu 2024 13:00',
    petugas: 'Dewi Lestari',
    status: 'Selesai',
    statusColor: 'bg-blue-100 text-blue-700',
  },
  {
    no: 'PGJ-2024-0821-017',
    warga: 'Ahmad Hidayat',
    tanggalAjukan: '21 Agu 2024 16:05',
    jadwal: '21 Agu 2024 15:00',
    petugas: 'Dewi Lestari',
    status: 'Selesai',
    statusColor: 'bg-blue-100 text-blue-700',
  },
  {
    no: 'PGJ-2024-0821-016',
    warga: 'Rina Wulandari',
    tanggalAjukan: '21 Agu 2024 09:20',
    jadwal: '-',
    petugas: '-',
    status: 'Dibatalkan',
    statusColor: 'bg-red-100 text-red-700',
  },
];

// Setoran Menunggu Validasi
const setoranValidasi = [
  {
    nama: 'Siti Nurhayati',
    tanggal: '22 Agu 2024 09:10',
    berat: '7,5 kg',
    jenis: 'Plastik, Kertas',
    status: 'Menunggu',
    statusColor: 'bg-amber-100 text-amber-700',
  },
  {
    nama: 'Budi Santoso',
    tanggal: '22 Agu 2024 10:40',
    berat: '6,5 kg',
    jenis: 'Plastik, Kaca, Kertas',
    status: 'Menunggu',
    statusColor: 'bg-amber-100 text-amber-700',
  },
  {
    nama: 'Eko Prasetyo',
    tanggal: '22 Agu 2024 11:20',
    berat: '5,6 kg',
    jenis: 'Organik',
    status: 'Menunggu',
    statusColor: 'bg-amber-100 text-amber-700',
  },
  {
    nama: 'Yuni Astuti',
    tanggal: '22 Agu 2024 14:45',
    berat: '3,2 kg',
    jenis: 'Kaca, Logam',
    status: 'Menunggu',
    statusColor: 'bg-amber-100 text-amber-700',
  },
];

// Aktivitas Terbaru
const aktivitas = [
  {
    icon: Truck,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    text: 'Petugas Ahmad Fauzi menyelesaikan penjemputan dari Siti Nurhayati',
    time: '22 Agu 2024 09:15',
  },
  {
    icon: Scale,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    text: 'Setoran oleh Budi Santoso telah divalidasi petugas',
    time: '22 Agu 2024 10:42',
  },
  {
    icon: Star,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    text: 'Poin 29 telah diberikan ke Budi Santoso',
    time: '22 Agu 2024 11:45',
  },
  {
    icon: Star,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    text: 'Poin diberikan ke Dewi Lestari Poin: 18',
    time: '22 Agu 2024 11:45',
  },
  {
    icon: FileText,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    text: 'Laporan setoran harian dibuat oleh Admin',
    time: '22 Agu 2024 16:00',
  },
];

export function PengajuanTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Pengajuan Penjemputan</h3>
        <a href="#" className="text-xs font-medium text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 transition-colors">
          Lihat Semua <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">No. Pengajuan</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Warga</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tanggal Ajukan</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Jadwal</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Petugas</th>
              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {penjemputanData.map((row) => (
              <tr key={row.no} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-2.5 text-xs font-medium text-gray-700">{row.no}</td>
                <td className="px-4 py-2.5 text-xs text-gray-600">{row.warga}</td>
                <td className="px-4 py-2.5 text-xs text-gray-500">{row.tanggalAjukan}</td>
                <td className="px-4 py-2.5 text-xs text-gray-500">{row.jadwal}</td>
                <td className="px-4 py-2.5 text-xs text-gray-600">{row.petugas}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.statusColor}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <p className="text-[11px] text-gray-400">Menampilkan 1 - 5 dari 28 pengajuan</p>
        <div className="flex items-center gap-1">
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-400 hover:bg-gray-100 transition-colors">&lt;</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16a34a] text-xs font-bold text-white">1</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-500 hover:bg-gray-100 transition-colors">2</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-500 hover:bg-gray-100 transition-colors">3</button>
          <span className="text-xs text-gray-400 px-1">...</span>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-500 hover:bg-gray-100 transition-colors">6</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-gray-400 hover:bg-gray-100 transition-colors">&gt;</button>
        </div>
      </div>
    </div>
  );
}

export function SetoranValidasiList() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Setoran Menunggu Validasi</h3>
        <a href="#" className="text-xs font-medium text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 transition-colors">
          Lihat Semua <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {setoranValidasi.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 flex-shrink-0">
              <Package className="h-4 w-4 text-amber-500" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800">{item.nama}</p>
              <p className="text-[11px] text-gray-400">{item.tanggal}</p>
              <p className="text-[11px] text-gray-400">{item.jenis}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-800">{item.berat}</p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-[11px] text-gray-400">Total 12 setoran menunggu validasi</p>
      </div>
    </div>
  );
}

export function AktivitasTerbaru() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Aktivitas Terbaru</h3>
        <a href="#" className="text-xs font-medium text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 transition-colors">
          Lihat Semua <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-gray-50">
        {aktivitas.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconBg} flex-shrink-0 mt-0.5`}>
              <item.icon className={`h-4 w-4 ${item.iconColor}`} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-relaxed">{item.text}</p>
            </div>
            <span className="text-[11px] text-gray-400 flex-shrink-0 whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
