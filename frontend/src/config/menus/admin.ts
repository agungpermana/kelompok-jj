import {
  LayoutDashboard,
  Users,
  UserCheck,
  Truck,
  Recycle,
  Coins,
  ArrowLeftRight,
  ShieldCheck,
  FileText,
  FileBarChart,
  FileSpreadsheet,
  FilePieChart,
  Settings,
  PackageSearch,
  BadgeDollarSign,
  Ticket,
  FileCheck
} from 'lucide-react';
import type { MenuSection } from '@/components/layout/sidebar';

export const adminMenus: MenuSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    ],
  },
  {
    title: 'MASTER DATA',
    items: [
      {
        label: 'Pengguna',
        icon: Users,
        children: [
          { label: 'Warga', icon: Users, href: '/admin/pengguna/warga' },
          { label: 'Petugas', icon: UserCheck, href: '/admin/pengguna/petugas' },
          { label: 'Pengepul', icon: Truck, href: '/admin/pengguna/pengepul' },
        ],
      },
      { label: 'Jenis Sampah', icon: PackageSearch, href: '/admin/jenis-sampah' },
      { label: 'Harga & Poin', icon: BadgeDollarSign, href: '/admin/harga-poin' },
      { label: 'Voucher', icon: Ticket, href: '/admin/voucher' },
    ],
  },
  {
    title: 'TRANSAKSI',
    items: [
      { label: 'Pengajuan Penjemputan', icon: FileText, href: '/admin/pengajuan-penjemputan' },
      // { label: 'Penjemputan', icon: Truck, href: '/admin/penjemputan' },
      { label: 'Setoran Sampah', icon: Recycle, href: '/admin/setoran-sampah' },
      { label: 'Poin & Saldo', icon: Coins, href: '/admin/poin-saldo' },
      { label: 'Penukaran Poin', icon: ArrowLeftRight, href: '/admin/penukaran-poin' },
    ],
  },
  {
    title: 'VALIDASI',
    items: [
      { label: 'Validasi Setoran', icon: ShieldCheck, href: '/admin/validasi-setoran' },
      { label: 'Validasi Transaksi', icon: FileCheck, href: '/admin/validasi-transaksi' },
    ],
  },
  {
    title: 'LAPORAN',
    items: [
      { label: 'Laporan Setoran', icon: FileBarChart, href: '/admin/laporan-setoran' },
      { label: 'Laporan Penjemputan', icon: FileText, href: '/admin/laporan-penjemputan' },
      { label: 'Laporan Keuangan', icon: FileSpreadsheet, href: '/admin/laporan-keuangan' },
      { label: 'Laporan Stok', icon: FilePieChart, href: '/admin/laporan-stok' },
      { label: 'Laporan Poin', icon: FileBarChart, href: '/admin/laporan-poin' },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Pengaturan Sistem', icon: Settings, href: '/admin/pengaturan' },
    ],
  },
];
