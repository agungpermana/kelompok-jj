'use client';

import Sidebar from '@/components/layout/sidebar';
import { adminMenus } from '@/config/menus/admin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <Sidebar menuSections={adminMenus} />
      <main className="flex-1 ml-[260px] p-6">
        {children}
      </main>
    </div>
  );
}
