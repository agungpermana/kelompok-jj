import {
  Home,
  Truck,
  History,
  Star,
  Gift,
  User,
  Settings,
} from 'lucide-react';
import type { MenuSection } from '@/components/layout/sidebar';

export const wargaMenus: MenuSection[] = [
  {
    title: '',
    items: [
      { label: 'Beranda', icon: Home, href: '/warga/dashboard' },
      { label: 'Pengajuan Penjemputan', icon: Truck, href: '/warga/ajukan-penjemputan' },
      { label: 'Riwayat Setoran', icon: History, href: '/warga/riwayat-setoran' },
      { label: 'Poin Saya', icon: Star, href: '/warga/poin-saya' },
      { label: 'Penukaran Poin', icon: Gift, href: '/warga/penukaran-poin' },
      { label: 'Profil Saya', icon: User, href: '/warga/profil' },
      { label: 'Pengaturan', icon: Settings, href: '/warga/pengaturan' },
    ],
  },
];
