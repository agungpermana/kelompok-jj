'use client';

import Sidebar from '@/components/layout/sidebar';
import { wargaMenus } from '@/config/menus/warga';

export default function WargaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <Sidebar menuSections={wargaMenus} />
      <main className="flex-1 ml-[260px] p-6">
        {children}
      </main>
    </div>
  );
}
