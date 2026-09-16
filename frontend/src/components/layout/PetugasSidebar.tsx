'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  Home,
  Truck,
  GitFork,
  User,
  LogOut,
} from 'lucide-react';
import PetugasAvatar from '@/components/common/PetugasAvatar';

export default function PetugasSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Accordion open states - default Penjemputan is open
  const [isPenjemputanOpen, setIsPenjemputanOpen] = useState(true);
  const [isSetoranOpen, setIsSetoranOpen] = useState(false);
  const [userName, setUserName] = useState('Ahmad Fauzi');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('trashure_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.nama || u.nama_petugas || u.username) {
          setUserName(u.nama || u.nama_petugas || 'Ahmad Fauzi');
        }
      }
    } catch {
      // ignore
    }

    // Auto open accordion if current route is within it
    if (pathname.includes('/petugas/penjemputan') || pathname.includes('/petugas/riwayat-penjemputan')) {
      setIsPenjemputanOpen(true);
    }
    if (pathname.includes('/petugas/validasi-setoran') || pathname.includes('/petugas/riwayat-setoran')) {
      setIsSetoranOpen(true);
    }
  }, [pathname]);

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        const token = localStorage.getItem('trashure_token') || localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        if (token) {
          await fetch(`${apiUrl}/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
        }
      } catch {
        // ignore error
      } finally {
        localStorage.removeItem('trashure_token');
        localStorage.removeItem('token');
        localStorage.removeItem('trashure_user');
        document.cookie = 'trashure_token=; path=/; max-age=0';
        router.push('/login');
      }
    }
  };

  const isTugasSayaActive = pathname === '/petugas/penjemputan' || pathname === '/petugas/tugas-saya';
  const isRiwayatPenjemputanActive = pathname === '/petugas/riwayat-penjemputan';
  const isValidasiSetoranActive = pathname === '/petugas/validasi-setoran';
  const isRiwayatSetoranActive = pathname === '/petugas/riwayat-setoran';
  const isDashboardActive = pathname === '/petugas/dashboard';
  const isProfilActive = pathname === '/petugas/profil';

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-[260px] flex-col bg-white border-r border-gray-100 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-50/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-[#16a34a] flex-shrink-0">
          <Leaf className="h-7 w-7 fill-[#16a34a] text-[#16a34a]" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-[17px] font-extrabold tracking-tight text-[#16a34a] uppercase leading-none">
            TRASHURE
          </h1>
          <p className="text-[11px] font-normal text-gray-500 mt-1 leading-tight">
            Kelola Sampah, Raih Manfaat
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 sidebar-scrollbar">
        {/* Dashboard */}
        <Link
          href="/petugas/dashboard"
          className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
            isDashboardActive
              ? 'bg-[#f0fdf4] text-[#16a34a] font-semibold'
              : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
          }`}
        >
          <Home
            className={`h-[19px] w-[19px] flex-shrink-0 ${
              isDashboardActive ? 'text-[#16a34a]' : 'text-gray-600'
            }`}
            strokeWidth={1.8}
          />
          <span>Dashboard</span>
        </Link>

        {/* Penjemputan (Accordion) */}
        <div>
          <button
            type="button"
            onClick={() => setIsPenjemputanOpen(!isPenjemputanOpen)}
            className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
              isTugasSayaActive || isRiwayatPenjemputanActive
                ? 'text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Truck className="h-[19px] w-[19px] text-gray-600 flex-shrink-0" strokeWidth={1.8} />
              <span>Penjemputan</span>
            </div>
            {isPenjemputanOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {isPenjemputanOpen && (
            <div className="mt-1 pl-4 pr-1 space-y-1">
              {/* Tugas Saya */}
              <Link
                href="/petugas/penjemputan"
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-[13px] transition-all duration-200 ${
                  isTugasSayaActive
                    ? 'bg-[#ecfdf3] text-[#15803d] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 font-medium'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    isTugasSayaActive ? 'bg-[#16a34a]' : 'bg-gray-400'
                  }`}
                />
                <span className="truncate">Tugas Saya</span>
              </Link>

              {/* Riwayat Penjemputan */}
              <Link
                href="/petugas/riwayat-penjemputan"
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-[13px] transition-all duration-200 ${
                  isRiwayatPenjemputanActive
                    ? 'bg-[#ecfdf3] text-[#15803d] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 font-medium'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    isRiwayatPenjemputanActive ? 'bg-[#16a34a]' : 'bg-gray-400'
                  }`}
                />
                <span className="truncate">Riwayat Penjemputan</span>
              </Link>
            </div>
          )}
        </div>

        {/* Setoran (Accordion) */}
        <div>
          <button
            type="button"
            onClick={() => setIsSetoranOpen(!isSetoranOpen)}
            className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
              isValidasiSetoranActive || isRiwayatSetoranActive
                ? 'text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <GitFork className="h-[19px] w-[19px] text-gray-600 flex-shrink-0" strokeWidth={1.8} />
              <span>Setoran</span>
            </div>
            {isSetoranOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {isSetoranOpen && (
            <div className="mt-1 pl-4 pr-1 space-y-1">
              {/* Validasi Setoran */}
              <Link
                href="/petugas/validasi-setoran"
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-[13px] transition-all duration-200 ${
                  isValidasiSetoranActive
                    ? 'bg-[#ecfdf3] text-[#15803d] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 font-medium'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    isValidasiSetoranActive ? 'bg-[#16a34a]' : 'bg-gray-400'
                  }`}
                />
                <span className="truncate">Validasi Setoran</span>
              </Link>

              {/* Riwayat Setoran */}
              <Link
                href="/petugas/riwayat-setoran"
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-[13px] transition-all duration-200 ${
                  isRiwayatSetoranActive
                    ? 'bg-[#ecfdf3] text-[#15803d] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 font-medium'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${
                    isRiwayatSetoranActive ? 'bg-[#16a34a]' : 'bg-gray-400'
                  }`}
                />
                <span className="truncate">Riwayat Setoran</span>
              </Link>
            </div>
          )}
        </div>

        {/* Profil */}
        <Link
          href="/petugas/profil"
          className={`flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
            isProfilActive
              ? 'bg-[#f0fdf4] text-[#16a34a] font-semibold'
              : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
          }`}
        >
          <User className="h-[19px] w-[19px] text-gray-600 flex-shrink-0" strokeWidth={1.8} />
          <span>Profil</span>
        </Link>

        {/* Keluar */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-red-50/70 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="h-[19px] w-[19px] text-gray-600 hover:text-red-500 flex-shrink-0" strokeWidth={1.8} />
          <span>Keluar</span>
        </button>
      </nav>

      {/* User Profile Card at Bottom */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <Link
          href="/petugas/profil"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
        >
          <PetugasAvatar size={42} />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-gray-800 truncate leading-tight">
              {userName}
            </p>
            <p className="text-[12px] font-medium text-gray-400 truncate leading-tight mt-0.5">
              Petugas
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
