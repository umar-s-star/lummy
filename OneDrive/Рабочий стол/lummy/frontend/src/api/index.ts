const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(err);
  }
  return res.json();
}

// ── Dishes ──────────────────────────────────────────────────
export const getDishes   = ()            => request<any[]>('/api/dishes');
export const createDish  = (d: any)      => request<any>('/api/dishes', { method: 'POST', body: JSON.stringify(d) });
export const updateDish  = (id: string, d: any) => request<any>(`/api/dishes/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deleteDish  = (id: string)  => request<any>(`/api/dishes/${id}`, { method: 'DELETE' });

// ── Categories ──────────────────────────────────────────────
export const getCategories   = ()            => request<any[]>('/api/categories');
export const createCategory  = (c: any)      => request<any>('/api/categories', { method: 'POST', body: JSON.stringify(c) });
export const updateCategory  = (id: string, c: any) => request<any>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(c) });
export const deleteCategory  = (id: string)  => request<any>(`/api/categories/${id}`, { method: 'DELETE' });

// ── Branches ────────────────────────────────────────────────
export const getBranches   = ()            => request<any[]>('/api/branches');
export const createBranch  = (b: any)      => request<any>('/api/branches', { method: 'POST', body: JSON.stringify(b) });
export const updateBranch  = (id: string, b: any) => request<any>(`/api/branches/${id}`, { method: 'PUT', body: JSON.stringify(b) });
export const deleteBranch  = (id: string)  => request<any>(`/api/branches/${id}`, { method: 'DELETE' });

// ── Promos ──────────────────────────────────────────────────
export const getPromos    = (all = false) => request<any[]>(`/api/promos${all ? '?all=true' : ''}`);
export const createPromo  = (p: any) => request<any>('/api/promos', { method: 'POST', body: JSON.stringify(p) });
export const updatePromo  = (id: string, p: any) => request<any>(`/api/promos/${id}`, { method: 'PUT', body: JSON.stringify(p) });
export const deletePromo  = (id: string) => request<any>(`/api/promos/${id}`, { method: 'DELETE' });

// ── Image upload ─────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  const { url } = await res.json();
  return `${BASE}${url}`;
}

// ── Health check ─────────────────────────────────────────────
export const checkHealth = () => request<{ status: string }>('/api/health');
