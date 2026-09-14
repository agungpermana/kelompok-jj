'use client';

import Sidebar from '@/components/layout/sidebar';
import { pengepulMenus } from '@/config/menus/pengepul';

export default function PengepulLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <Sidebar menuSections={pengepulMenus} />
      <main className="flex-1 ml-[260px] p-6">
        {children}
      </main>
    </div>
  );
}
