import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  History,
  Coins,
  FileText,
  User,
} from 'lucide-react';
import type { MenuSection } from '@/components/layout/sidebar';

export const pengepulMenus: MenuSection[] = [
  {
    title: '',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/pengepul/dashboard' },
    ],
  },
  {
    title: 'PENJUALAN',
    items: [
      { label: 'Stok Sampah', icon: Package, href: '/pengepul/stok-sampah' },
      { label: 'Penjualan Sampah', icon: ShoppingCart, href: '/pengepul/penjualan-sampah' },
      { label: 'Riwayat Penjualan', icon: History, href: '/pengepul/riwayat-penjualan' },
    ],
  },
  {
    title: 'TRANSAKSI',
    items: [
      { label: 'Saldo', icon: Coins, href: '/pengepul/saldo' },
      { label: 'Riwayat Transaksi', icon: FileText, href: '/pengepul/riwayat-transaksi' },
    ],
  },
  {
    title: 'PENGATURAN',
    items: [
      { label: 'Profil Saya', icon: User, href: '/pengepul/profil' },
    ],
  },
];
