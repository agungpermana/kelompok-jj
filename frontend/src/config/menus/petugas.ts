import {
  LayoutDashboard,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  FileText,
  User,
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
      { label: 'Daftar Penjemputan', icon: Truck, href: '/petugas/penjemputan' },
      { label: 'Penjemputan Aktif', icon: MapPin, href: '/petugas/penjemputan-aktif' },
      { label: 'Riwayat Penjemputan', icon: Clock, href: '/petugas/riwayat-penjemputan' },
    ],
  },
  {
    title: 'SETORAN',
    items: [
      { label: 'Validasi Setoran', icon: CheckCircle, href: '/petugas/validasi-setoran' },
      { label: 'Riwayat Setoran', icon: FileText, href: '/petugas/riwayat-setoran' },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Profil Saya', icon: User, href: '/petugas/profil' },
    ],
  },
];
