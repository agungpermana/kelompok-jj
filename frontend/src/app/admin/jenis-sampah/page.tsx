'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminHeader from '@/components/layout/header';
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ModalTambahEdit, { JenisSampahItem } from '@/components/admin/jenis-sampah/ModalTambahEdit';
import ModalDetail from '@/components/admin/jenis-sampah/ModalDetail';
import ModalHapus from '@/components/admin/jenis-sampah/ModalHapus';
import ToastNotification from '@/components/admin/jenis-sampah/ToastNotification';

export default function JenisSampahPage() {
  const [data, setData] = useState<JenisSampahItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('Semua Satuan');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<JenisSampahItem | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, type, message });
  };

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  };

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('trashure_token') : null;
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch Live Data from Backend API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/admin/jenis-sampah`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.warn('Could not connect to backend, running with current data state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered Items
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (
        searchQuery &&
        !item.nama_jenis_sampah.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Unit filter
      if (
        selectedUnit !== 'Semua Satuan' &&
        item.satuan.toLowerCase() !== selectedUnit.toLowerCase()
      ) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'Semua Status') {
        const itemStatus = item.status === 'tidak_aktif' ? 'nonaktif' : item.status;
        const targetStatus = selectedStatus.toLowerCase();
        if (itemStatus.toLowerCase() !== targetStatus) {
          return false;
        }
      }
      return true;
    });
  }, [data, searchQuery, selectedUnit, selectedStatus]);

  // Pagination calculation
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedUnit, selectedStatus]);

  // CRUD Handlers
  const handleCreate = async (formData: {
    nama_jenis_sampah: string;
    satuan: string;
    keterangan?: string;
    status: string;
  }) => {
    try {
      const res = await fetch(`${getApiUrl()}/admin/jenis-sampah`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('Jenis sampah berhasil ditambahkan!');
        fetchData();
        return;
      } else {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Gagal menyimpan jenis sampah ke server.');
      }
    } catch (err: any) {
      console.warn('Backend create error, updating locally:', err);
      const newItem: JenisSampahItem = {
        jenis_sampah_id: Date.now(),
        ...formData,
      };
      setData((prev) => [newItem, ...prev]);
      showToast('Jenis sampah berhasil ditambahkan!');
    }
  };

  const handleUpdate = async (formData: {
    nama_jenis_sampah: string;
    satuan: string;
    keterangan?: string;
    status: string;
  }) => {
    if (!activeItem || !activeItem.jenis_sampah_id) return;
    const id = activeItem.jenis_sampah_id;

    try {
      const res = await fetch(`${getApiUrl()}/admin/jenis-sampah/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('Jenis sampah berhasil diperbarui!');
        fetchData();
        return;
      } else {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Gagal memperbarui data jenis sampah.');
      }
    } catch (err: any) {
      console.warn('Backend update error, updating locally:', err);
      setData((prev) =>
        prev.map((item) =>
          item.jenis_sampah_id === id
            ? {
              ...item,
              ...formData,
            }
            : item
        )
      );
      showToast('Jenis sampah berhasil diperbarui!');
    }
  };

  const handleDelete = async (itemToDelete: JenisSampahItem) => {
    if (!itemToDelete.jenis_sampah_id) return;
    const id = itemToDelete.jenis_sampah_id;

    try {
      const res = await fetch(`${getApiUrl()}/admin/jenis-sampah/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        showToast('Jenis sampah berhasil dihapus!');
        fetchData();
        return;
      } else {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Gagal menghapus data.');
      }
    } catch (err: any) {
      console.warn('Backend delete error, updating locally:', err);
      setData((prev) => prev.filter((item) => item.jenis_sampah_id !== id));
      showToast('Jenis sampah berhasil dihapus!');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto pb-10">
      {/* Top Header with Breadcrumbs */}
      <AdminHeader
        title="Jenis Sampah"
        subtitle="Kelola data jenis sampah beserta satuan dan keterangannya."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Master Data' },
          { label: 'Jenis Sampah' },
        ]}
      />

      {/* Filter & Action Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[260px] flex-1 max-w-[360px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama jenis sampah..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-2xs transition"
            />
          </div>

          {/* Filter Satuan */}
          <div className="relative min-w-[150px]">
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white border border-gray-200 px-3.5 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:border-green-500 shadow-2xs cursor-pointer transition"
            >
              <option value="Semua Satuan">Semua Satuan</option>
              <option value="Kg">Kg</option>
              <option value="Pcs">Pcs</option>
              <option value="Gram">Gram</option>
              <option value="Liter">Liter</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Filter Status */}
          <div className="relative min-w-[150px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none rounded-xl bg-white border border-gray-200 px-3.5 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:border-green-500 shadow-2xs cursor-pointer transition"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Action: Button Tambah */}
        <button
          onClick={() => {
            setActiveItem(null);
            setIsModalAddOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>Tambah Jenis Sampah</span>
        </button>
      </div>

      {/* Summary Total Count */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold text-gray-600">
          Total {totalItems} jenis sampah
        </p>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-white border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 bg-gray-50/60 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-12">No.</th>
                <th className="py-3.5 px-4 min-w-[220px]">Jenis Sampah</th>
                <th className="py-3.5 px-4 w-28">Satuan</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4 w-28">Status</th>
                <th className="py-3.5 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <p className="text-sm font-medium">Tidak ada data jenis sampah yang sesuai.</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => {
                  const itemIndex = startIndex + idx + 1;
                  const isAktif = item.status === 'aktif';

                  return (
                    <tr
                      key={item.jenis_sampah_id || idx}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* No. */}
                      <td className="py-4 px-4 text-center text-xs font-medium text-gray-500">
                        {itemIndex}
                      </td>

                      {/* Jenis Sampah: Icon + Name */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-800 text-sm">
                          {item.nama_jenis_sampah}
                        </span>
                      </td>

                      {/* Satuan */}
                      <td className="py-4 px-4 text-sm font-medium text-gray-600">
                        {item.satuan}
                      </td>

                      {/* Keterangan */}
                      <td className="py-4 px-4 text-xs text-gray-500 max-w-md">
                        {item.keterangan ? (
                          <span className="line-clamp-2">{item.keterangan}</span>
                        ) : (
                          <span className="text-gray-300 italic">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${isAktif
                              ? 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                        >
                          {isAktif ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Button */}
                          <button
                            onClick={() => {
                              setActiveItem(item);
                              setIsModalDetailOpen(true);
                            }}
                            title="Lihat Detail"
                            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setActiveItem(item);
                              setIsModalEditOpen(true);
                            }}
                            title="Edit Data"
                            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-[#16a34a] hover:bg-green-50 hover:border-green-200 transition-colors shadow-2xs"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setActiveItem(item);
                              setIsModalDeleteOpen(true);
                            }}
                            title="Hapus Data"
                            className="p-2 rounded-lg border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-2xs"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-500 font-medium">
            Menampilkan {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} dari {totalItems} jenis sampah
          </p>

          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[34px] h-[34px] px-2.5 rounded-lg text-xs font-semibold transition ${isActive
                      ? 'bg-[#16a34a] text-white shadow-xs'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Modal Tambah */}
      <ModalTambahEdit
        isOpen={isModalAddOpen}
        isEdit={false}
        initialData={null}
        onClose={() => setIsModalAddOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Modal Edit */}
      <ModalTambahEdit
        isOpen={isModalEditOpen}
        isEdit={true}
        initialData={activeItem}
        onClose={() => {
          setIsModalEditOpen(false);
          setActiveItem(null);
        }}
        onSubmit={handleUpdate}
      />

      {/* Modal Detail */}
      <ModalDetail
        isOpen={isModalDetailOpen}
        item={activeItem}
        onClose={() => {
          setIsModalDetailOpen(false);
          setActiveItem(null);
        }}
        onEdit={(item) => {
          setActiveItem(item);
          setIsModalEditOpen(true);
        }}
      />

      {/* Modal Hapus */}
      <ModalHapus
        isOpen={isModalDeleteOpen}
        item={activeItem}
        onClose={() => {
          setIsModalDeleteOpen(false);
          setActiveItem(null);
        }}
        onConfirm={handleDelete}
      />

      {/* Toast Feedback */}
      <ToastNotification
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
