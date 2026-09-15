import {
  LayoutDashboard,
  Truck,
  Clock,
  Recycle,
  FileText,
  FileBarChart,
  Settings,
} from 'lucide-react';
import type { MenuSection } from '@/components/layout/sidebar';

export const petugasMenus: MenuSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/petugas/dashboard' },
    ],
  },
  {
    title: 'PENJEMPUTAN',
    items: [
      {
        label: 'Penjemputan',
        icon: Truck,
        children: [
          { label: 'Tugas Saya', icon: Truck, href: '/petugas/penjemputan' },
          { label: 'Riwayat Penjemputan', icon: Clock, href: '/petugas/riwayat-penjemputan' },
        ],
      },
    ],
  },
  {
    title: 'SETORAN',
    items: [
      {
        label: 'Setoran',
        icon: Recycle,
        children: [
          { label: 'Validasi Setoran', icon: Recycle, href: '/petugas/validasi-setoran' },
          { label: 'Riwayat Setoran', icon: FileText, href: '/petugas/riwayat-setoran' },
        ],
      },
    ],
  },
  {
    title: 'LAPORAN',
    items: [
      { label: 'Laporan', icon: FileBarChart, href: '/petugas/laporan' },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Pengaturan', icon: Settings, href: '/petugas/pengaturan' },
    ],
  },
];
