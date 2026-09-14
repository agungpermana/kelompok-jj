'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminHeader from '@/components/layout/header';
import PengepulFilter from '@/components/admin/pengepul/PengepulFilter';
import PengepulTable from '@/components/admin/pengepul/PengepulTable';
import PengepulFormModal from '@/components/admin/pengepul/PengepulFormModal';
import PengepulDetailModal from '@/components/admin/pengepul/PengepulDetailModal';
import PengepulDeleteModal from '@/components/admin/pengepul/PengepulDeleteModal';
import { FilterState, PengepulFormData, PengepulItem, StatusUser } from '@/types/pengepul';
import {
  getPengepulFromDB,
  createPengepulInDB,
  updatePengepulInDB,
  deletePengepulFromDB,
} from '@/services/pengepulService';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const STATUS_OPTIONS = ['aktif', 'nonaktif'];

export default function PengepulPage() {
  const [items, setItems] = useState<PengepulItem[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterState>({
    search: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengepulItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load data from Database via API (server-side pagination + filter)
  const loadData = useCallback(async (page: number, filterState: FilterState) => {
    setIsLoading(true);
    try {
      const res = await getPengepulFromDB({
        search: filterState.search || undefined,
        status: filterState.status || undefined,
        page,
        per_page: 10,
      });
      setItems(res.items);
      setTotalData(res.pagination.total);
      setCurrentPage(res.pagination.current_page);
    } catch (err: unknown) {
      console.error('Error fetching pengepul data:', err);
      const message = err instanceof Error ? err.message : 'Gagal terhubung ke database backend.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search then reload
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(1, filter);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, loadData]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item: PengepulItem) => {
    setSelectedItem(item);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleOpenView = (item: PengepulItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDelete = (item: PengepulItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Save Item to Database (Create or Update)
  const handleSaveItem = async (data: {
    id?: number | string;
    payload: PengepulFormData;
    status?: StatusUser;
  }) => {
    setIsSubmitting(true);
    try {
      const payload = data.payload;
      if (formMode === 'create') {
        await createPengepulInDB(payload);
        showToast(`Pengepul "${payload.namaPengepul}" beserta akun pengguna berhasil ditambahkan.`);
      } else if (formMode === 'edit' && data.id) {
        await updatePengepulInDB(data.id, {
          namaPengepul: payload.namaPengepul,
          alamat: payload.alamat,
          noTelepon: payload.noTelepon,
          ...(payload.password ? { password: payload.password } : {}),
          ...(data.status ? { status: data.status } : {}),
        });
        showToast(`Perubahan pengepul "${payload.namaPengepul}" berhasil diperbarui.`);
      }

      setIsFormModalOpen(false);
      setIsDetailModalOpen(false);
      await loadData(currentPage, filter);
    } catch (err: unknown) {
      console.error('Save error:', err);
      const message = err instanceof Error ? err.message : 'Gagal menyimpan data ke database.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete from Database
  const handleConfirmDelete = async (item: PengepulItem) => {
    try {
      await deletePengepulFromDB(item.id);
      showToast(`Data pengepul "${item.namaPengepul}" beserta akunnya berhasil dihapus.`);
      setIsDeleteModalOpen(false);
      const nextPage = items.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await loadData(nextPage, filter);
    } catch (err: unknown) {
      console.error('Delete error:', err);
      const message = err instanceof Error ? err.message : 'Gagal menghapus data dari database.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-12">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5 text-white ${
            toast.type === 'error'
              ? 'bg-red-600 shadow-red-900/20'
              : 'bg-[#057a44] shadow-emerald-900/20'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-200" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-200" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header with Breadcrumbs */}
      <AdminHeader
        title="Data Pengepul"
        subtitle="Kelola data pengepul bank sampah. Akun pengguna dibuat otomatis saat pengepul ditambahkan."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Pengguna' },
          { label: 'Pengepul' },
        ]}
      />

      {/* Filter & Action Section */}
      <PengepulFilter
        filter={filter}
        onFilterChange={(f) => {
          setFilter(f);
          setCurrentPage(1);
        }}
        statusOptions={STATUS_OPTIONS}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* Table Section */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="h-8 w-8 text-[#16a34a] animate-spin" />
          <p className="text-sm font-semibold text-gray-600">
            Memuat data pengepul dari database...
          </p>
        </div>
      ) : (
        <PengepulTable
          items={items}
          totalData={totalData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => loadData(page, filter)}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Modals */}
      <PengepulFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={selectedItem}
        mode={formMode}
        isSubmitting={isSubmitting}
      />

      <PengepulDetailModal
        isOpen={isDetailModalOpen}
        item={selectedItem}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleOpenEdit}
      />

      <PengepulDeleteModal
        isOpen={isDeleteModalOpen}
        item={selectedItem}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}