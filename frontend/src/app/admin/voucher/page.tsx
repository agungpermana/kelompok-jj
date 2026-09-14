'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminHeader from '@/components/layout/header';
import VoucherFilter from '@/components/admin/voucher/VoucherFilter';
import VoucherTable from '@/components/admin/voucher/VoucherTable';
import VoucherFormModal from '@/components/admin/voucher/VoucherFormModal';
import VoucherDetailModal from '@/components/admin/voucher/VoucherDetailModal';
import VoucherDeleteModal from '@/components/admin/voucher/VoucherDeleteModal';
import { FilterState, StatusVoucher, VoucherItem } from '@/types/voucher';
import {
  getVouchersFromDB,
  createVoucherInDB,
  updateVoucherInDB,
  deleteVoucherFromDB,
  labelStatus,
} from '@/services/voucherService';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function VoucherPage() {
  // Pure dynamic data state from Database (no dummy data)
  const [items, setItems] = useState<VoucherItem[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<VoucherItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load data dynamically from Database via API
  const loadDatabaseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getVouchersFromDB();
      setItems(res.items);
    } catch (err: any) {
      console.error('Error fetching database data:', err);
      showToast(err.message || 'Gagal terhubung ke database backend.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Dropdown options derived dynamically from database items
  const statusOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: string[] = [];
    [...new Set(items.map((i) => i.status))].forEach((s) => {
      const label = labelStatus(s as StatusVoucher);
      if (!seen.has(label)) {
        seen.add(label);
        opts.push(label);
      }
    });
    return opts.sort();
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      if (filter.search) {
        const query = filter.search.toLowerCase();
        const matchName = item.namaVoucher.toLowerCase().includes(query);
        const matchDesc = (item.deskripsi || '').toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      // Status
      if (filter.status) {
        const statusLabel = labelStatus(item.status);
        if (statusLabel !== filter.status) return false;
      }

      return true;
    });
  }, [items, filter]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item: VoucherItem) => {
    setSelectedItem(item);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleOpenView = (item: VoucherItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDelete = (item: VoucherItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Save Item to Database (Create or Update)
  const handleSaveItem = async (formData: Partial<VoucherItem>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        namaVoucher: formData.namaVoucher || '',
        deskripsi: formData.deskripsi || '',
        poinDibutuhkan: Number(formData.poinDibutuhkan) || 0,
        jumlahTersedia: Number(formData.jumlahTersedia) || 0,
        status: (formData.status || 'tersedia') as StatusVoucher,
      };

      if (formMode === 'create') {
        await createVoucherInDB(payload);
        showToast(`Voucher "${payload.namaVoucher}" berhasil disimpan ke database.`);
      } else if (formMode === 'edit' && selectedItem) {
        await updateVoucherInDB(selectedItem.id, payload);
        showToast(`Perubahan voucher "${payload.namaVoucher}" berhasil diperbarui.`);
      }

      // Refresh live data directly from Database
      await loadDatabaseData();
      setIsFormModalOpen(false);
    } catch (err: any) {
      console.error('Save error:', err);
      showToast(err.message || 'Gagal menyimpan data ke database.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete from Database
  const handleConfirmDelete = async (item: VoucherItem) => {
    try {
      await deleteVoucherFromDB(item.id);
      showToast(`Data voucher "${item.namaVoucher}" berhasil dihapus dari database.`);
      setIsDeleteModalOpen(false);
      await loadDatabaseData();
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast(err.message || 'Gagal menghapus data dari database.', 'error');
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
        title="Voucher"
        subtitle="Kelola voucher penukaran poin beserta jumlah poin, stok, dan status ketersediaannya."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Master Data' },
          { label: 'Voucher' },
        ]}
      />

      {/* Filter & Action Section */}
      <VoucherFilter
        filter={filter}
        onFilterChange={setFilter}
        statusOptions={statusOptions}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* Table Section with Live Database State */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-12 flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="h-8 w-8 text-[#16a34a] animate-spin" />
          <p className="text-sm font-semibold text-gray-600">
            Memuat data voucher dari database...
          </p>
        </div>
      ) : (
        <VoucherTable
          items={paginatedItems}
          totalData={filteredItems.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Modals */}
      <VoucherFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={selectedItem}
        mode={formMode}
        isSubmitting={isSubmitting}
      />

      <VoucherDetailModal
        isOpen={isDetailModalOpen}
        item={selectedItem}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleOpenEdit}
      />

      <VoucherDeleteModal
        isOpen={isDeleteModalOpen}
        item={selectedItem}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}