import {
  LayoutDashboard,
  Recycle,
  History,
  Coins,
  ShoppingCart,
  FileText,
  User,
} from 'lucide-react';
import type { MenuSection } from '@/components/layout/sidebar';

export const wargaMenus: MenuSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/warga/dashboard' },
    ],
  },
  {
    title: 'PENJEMPUTAN',
    items: [
      { label: 'Ajukan Penjemputan', icon: FileText, href: '/warga/ajukan-penjemputan' },
      { label: 'Riwayat Penjemputan', icon: History, href: '/warga/riwayat-penjemputan' },
    ],
  },
  {
    title: 'SETORAN',
    items: [
      { label: 'Riwayat Setoran', icon: Recycle, href: '/warga/riwayat-setoran' },
      { label: 'Poin & Saldo', icon: Coins, href: '/warga/poin-saldo' },
    ],
  },
  {
    title: 'TUKAR POIN',
    items: [
      { label: 'Voucher', icon: ShoppingCart, href: '/warga/voucher' },
      { label: 'Riwayat Penukaran', icon: History, href: '/warga/riwayat-penukaran' },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Profil Saya', icon: User, href: '/warga/profil' },
    ],
  },
];
