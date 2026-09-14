import { PengepulFormData, PengepulItem, PengepulUpdateData, PengepulUser, StatusUser } from '@/types/pengepul';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface PengepulPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface RawPengepulRow {
  pengepul_id: number;
  user_id: number;
  nama_pengepul: string;
  alamat?: string | null;
  no_telepon?: string | null;
  user?: RawPengepulUser;
  created_at?: string;
  updated_at?: string;
}

interface RawPengepulUser {
  id: number;
  username: string;
  email: string;
  role: string;
  status?: StatusUser;
}

interface ApiSuccessResponse {
  message?: string;
  data?: Record<string, unknown>;
}

interface ApiErrorResponse {
  message?: string;
}

export async function getAdminToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('trashure_token');
  if (token) return token;

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        login: 'admin@trashure.test',
        password: 'password',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('trashure_token', data.token);
        localStorage.setItem('trashure_user', JSON.stringify(data.user));
        return data.token;
      }
    }
  } catch (err) {
    console.warn('Auto admin login failed:', err);
  }
  return null;
}

function mapUser(row: RawPengepulUser): PengepulUser {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    status: row.status ?? 'aktif',
  };
}

function mapPengepul(row: RawPengepulRow): PengepulItem {
  return {
    id: row.pengepul_id,
    pengepulId: row.pengepul_id,
    userId: row.user_id,
    namaPengepul: row.nama_pengepul,
    alamat: row.alamat ?? '',
    noTelepon: row.no_telepon ?? '',
    user: row.user ? mapUser(row.user) : { id: row.user_id, username: '', email: '', role: 'pengepul', status: 'aktif' },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPengepulFromDB(params?: {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<{ items: PengepulItem[]; pagination: PengepulPagination }> {
  const token = await getAdminToken();
  const headers: HeadersInit = {
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.status) query.append('status', params.status);
  if (params?.page) query.append('page', String(params.page));
  query.append('per_page', String(params?.per_page || 10));

  const res = await fetch(`${API_BASE_URL}/admin/pengepul?${query.toString()}`, {
    headers,
  });

  if (!res.ok) {
    throw new Error('Gagal mengambil data pengepul dari database.');
  }

  const json = await res.json();
  const rawList: RawPengepulRow[] = Array.isArray(json.data)
    ? json.data
    : Array.isArray((json.data as Record<string, unknown>)?.data)
      ? ((json.data as Record<string, unknown>).data as RawPengepulRow[])
      : [];

  const meta = (json.meta ?? {}) as Partial<PengepulPagination>;

  return {
    items: rawList.map(mapPengepul),
    pagination: {
      current_page: meta.current_page ?? 1,
      last_page: meta.last_page ?? 1,
      per_page: meta.per_page ?? 10,
      total: meta.total ?? rawList.length,
    },
  };
}

export async function createPengepulInDB(
  payload: PengepulFormData
): Promise<Record<string, unknown>> {
  const token = await getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/admin/pengepul`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      username: payload.username,
      email: payload.email,
      password: payload.password,
      nama_pengepul: payload.namaPengepul,
      alamat: payload.alamat || null,
      no_telepon: payload.noTelepon || null,
    }),
  });

  const json: ApiSuccessResponse = await res.json();
  if (!res.ok) {
    const message =
      (json as ApiErrorResponse).message || 'Gagal menambahkan pengepul ke database.';
    const errors = ((json as Record<string, unknown>).errors ?? null) as
      | Record<string, string[]>
      | null;
    if (errors) {
      const firstError = Object.values(errors).flat()[0];
      throw new Error(firstError || message);
    }
    throw new Error(message);
  }
  return json.data ?? {};
}

export async function updatePengepulInDB(
  pengepulId: number | string,
  payload: PengepulUpdateData
): Promise<Record<string, unknown>> {
  const token = await getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const body: Record<string, string | null> = {
    nama_pengepul: payload.namaPengepul,
    alamat: payload.alamat || null,
    no_telepon: payload.noTelepon || null,
  };
  if (payload.password) body.password = payload.password;
  if (payload.status) body.status = payload.status;

  const res = await fetch(`${API_BASE_URL}/admin/pengepul/${pengepulId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  const json: ApiSuccessResponse = await res.json();
  if (!res.ok) {
    const message =
      (json as ApiErrorResponse).message || 'Gagal memperbarui pengepul di database.';
    const errors = ((json as Record<string, unknown>).errors ?? null) as
      | Record<string, string[]>
      | null;
    if (errors) {
      const firstError = Object.values(errors).flat()[0];
      throw new Error(firstError || message);
    }
    throw new Error(message);
  }
  return json.data ?? {};
}

export async function deletePengepulFromDB(
  pengepulId: number | string
): Promise<{ message: string }> {
  const token = await getAdminToken();
  const headers: HeadersInit = {
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/admin/pengepul/${pengepulId}`, {
    method: 'DELETE',
    headers,
  });

  const json: { message?: string } = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Gagal menghapus pengepul dari database.');
  }
  return { message: json.message || 'Data pengepul berhasil dihapus.' };
}