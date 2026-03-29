'use client';

import { useMemo, useState } from 'react';

type Option = {
  id: number;
  name: string;
  slug: string;
};

type Tool = {
  id: number;
  name: string;
  url: string;
  documentation_url?: string | null;
  description: string;
  difficulty_level?: string | null;
  is_featured: boolean;
  status: string;
  categories: Option[];
  roles: Option[];
  tags: Option[];
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
};

const API_BASE = 'http://localhost:8201/api';

const inputClassName =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

const labelClassName = 'mb-2 block text-sm font-semibold text-slate-700';

const primaryButtonClassName =
  'inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60';

export default function AdminToolsPage() {
  const [token, setToken] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const authHeaders = useMemo(
    () => ({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  const fetchReferenceData = async () => {
    const [rolesRes, categoriesRes] = await Promise.all([
      fetch(`${API_BASE}/roles`, { headers: authHeaders }),
      fetch(`${API_BASE}/categories`, { headers: authHeaders }),
    ]);

    if (!rolesRes.ok || !categoriesRes.ok) {
      throw new Error('Failed to load filter data.');
    }

    const [rolesData, categoriesData] = await Promise.all([
      rolesRes.json(),
      categoriesRes.json(),
    ]);

    setRoles(rolesData);
    setCategories(categoriesData);
  };

  const fetchAdminTools = async () => {
    try {
      if (!token.trim()) {
        setError('Please enter a valid owner token.');
        return;
      }

      setLoading(true);
      setError('');
      setMessage('');

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (roleFilter) params.append('role_id', roleFilter);
      if (categoryFilter) params.append('category_id', categoryFilter);

      const res = await fetch(`${API_BASE}/admin/tools?${params.toString()}`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error('Failed to load admin tools.');
      }

      const data = await res.json();
      setTools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async () => {
    try {
      if (!token.trim()) {
        setError('Please enter a valid owner token.');
        return;
      }

      setError('');
      setMessage('');
      await fetchReferenceData();
      await fetchAdminTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setError('');
      setMessage('');

      const res = await fetch(`${API_BASE}/admin/tools/${id}/approve`, {
        method: 'PATCH',
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error('Failed to approve tool.');
      }

      setMessage('Tool approved successfully.');
      await fetchAdminTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approve failed.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      setError('');
      setMessage('');

      const res = await fetch(`${API_BASE}/admin/tools/${id}/reject`, {
        method: 'PATCH',
        headers: authHeaders,
      });

      if (!res.ok) {
        throw new Error('Failed to reject tool.');
      }

      setMessage('Tool rejected successfully.');
      await fetchAdminTools();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reject failed.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Panel
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review, approve and reject submitted tools.
            </p>
          </div>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Owner Access</h2>
            <p className="mt-1 text-sm text-slate-500">
              Use an owner token to manage all submitted tools.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className={labelClassName}>Sanctum Token</label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste owner token"
                className={inputClassName}
              />
            </div>

            <button onClick={handleLoad} className={primaryButtonClassName}>
              Load Admin Data
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
              <p className="mt-1 text-sm text-slate-500">
                Filter by status, category and role.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClassName}>Status</label>
                <select
                  className={inputClassName}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>

              <div>
                <label className={labelClassName}>Category</label>
                <select
                  className={inputClassName}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Role</label>
                <select
                  className={inputClassName}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={fetchAdminTools} className={primaryButtonClassName}>
                Apply Filters
              </button>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Submitted Tools
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Admin review queue and moderation list.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {tools.length} total
              </span>
            </div>

            {loading && (
              <p className="text-sm text-slate-500">Loading admin tools...</p>
            )}

            {!loading && tools.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No tools found for the selected filters.
              </div>
            )}

            {!loading && tools.length > 0 && (
              <div className="space-y-4">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {tool.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              tool.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : tool.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {tool.status}
                          </span>

                          {tool.is_featured && (
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                              featured
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {tool.description}
                        </p>

                        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          <p>
                            <span className="font-semibold text-slate-800">Added by:</span>{' '}
                            {tool.user?.name || 'Unknown'}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">Difficulty:</span>{' '}
                            {tool.difficulty_level || '-'}
                          </p>
                          <p className="sm:col-span-2">
                            <span className="font-semibold text-slate-800">URL:</span>{' '}
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {tool.url}
                            </a>
                          </p>
                        </div>

                        <div className="mt-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Categories
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {tool.categories.map((category) => (
                              <span
                                key={category.id}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Roles
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {tool.roles.map((role) => (
                              <span
                                key={role.id}
                                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                              >
                                {role.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-row gap-3 lg:flex-col">
                        <button
                          onClick={() => handleApprove(tool.id)}
                          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(tool.id)}
                          className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}