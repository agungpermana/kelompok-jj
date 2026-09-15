'use client';

import Sidebar from '@/components/layout/sidebar';
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext';
import { adminMenus } from '@/config/menus/admin';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      {/* Overlay — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={close}
        />
      )}

      <Sidebar
        menuSections={adminMenus}
        isOpen={isOpen}
        onClose={close}
      />

      <main className="flex-1 lg:ml-[260px] p-4 sm:p-6 min-w-0">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SidebarProvider>
  );
}
