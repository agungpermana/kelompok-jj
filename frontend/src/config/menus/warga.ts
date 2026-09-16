import {
  Home,
  Truck,
  History,
  Star,
  Gift,
  User,
} from 'lucide-react';
import type { MenuSection } from '@/components/layout/sidebar';

export const wargaMenus: MenuSection[] = [
  {
    title: '',
    items: [
      { label: 'Beranda', icon: Home, href: '/warga/dashboard' },
    ],
  },
  {
    title: 'LAYANAN',
    items: [
      { label: 'Pengajuan Penjemputan', icon: Truck, href: '/warga/ajukan-penjemputan' },
      { label: 'Riwayat Setoran', icon: History, href: '/warga/riwayat-setoran' },
    ],
  },
  {
    title: 'POIN & REWARD',
    items: [
      { label: 'Poin Saya', icon: Star, href: '/warga/poin-saya' },
      { label: 'Penukaran Poin', icon: Gift, href: '/warga/penukaran-poin' },
    ],
  },
  {
    title: 'AKUN',
    items: [
      { label: 'Profil Saya', icon: User, href: '/warga/profil' },
    ],
  },
];
