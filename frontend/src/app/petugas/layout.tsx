'use client';

import Sidebar from '@/components/layout/sidebar';
import { SidebarProvider, useSidebar } from '@/components/layout/SidebarContext';
import { petugasMenus } from '@/config/menus/petugas';

function PetugasLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={close}
        />
      )}

      <Sidebar
        menuSections={petugasMenus}
        isOpen={isOpen}
        onClose={close}
      />

      <main className="flex-1 lg:ml-[260px] p-4 sm:p-6 min-w-0">
        {children}
      </main>
    </div>
  );
}

export default function PetugasLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PetugasLayoutInner>{children}</PetugasLayoutInner>
    </SidebarProvider>
  );
}
