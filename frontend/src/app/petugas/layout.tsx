'use client';

import Sidebar from '@/components/layout/sidebar';
import { petugasMenus } from '@/config/menus/petugas';

export default function PetugasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <Sidebar menuSections={petugasMenus} />
      <main className="flex-1 ml-[260px] p-6">
        {children}
      </main>
    </div>
  );
}
