'use client';

import { useMemo, useState } from 'react';

type Option = {
  id: number;
  name: string;
  slug: string;
};

const API_BASE = 'http://localhost:8201/api';

const inputClassName =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

const textareaClassName =
  'w-full min-h-[110px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

const labelClassName = 'mb-2 block text-sm font-semibold text-slate-700';

const primaryButtonClassName =
  'inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60';

export default function CreateToolPage() {
  const [token, setToken] = useState('');
  const [roles, setRoles] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    url: '',
    documentation_url: '',
    description: '',
    how_to_use: '',
    real_examples: '',
    image_url: '',
    difficulty_level: 'beginner',
    is_featured: false,
    category_ids: [] as number[],
    role_ids: [] as number[],
    tag_ids: [] as number[],
  });

  const authHeaders = useMemo(
    () => ({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  const fetchReferenceData = async () => {
    if (!token.trim()) {
      setError('Моля, въведи валиден token.');
      return;
    }

    try {
      setLoadingRefs(true);
      setError('');
      setMessage('');

      const [rolesRes, categoriesRes, tagsRes] = await Promise.all([
        fetch(`${API_BASE}/roles`, { headers: authHeaders }),
        fetch(`${API_BASE}/categories`, { headers: authHeaders }),
        fetch(`${API_BASE}/tags`, { headers: authHeaders }),
      ]);

      if (!rolesRes.ok || !categoriesRes.ok || !tagsRes.ok) {
        throw new Error('Неуспешно зареждане на roles/categories/tags.');
      }

      const [rolesData, categoriesData, tagsData] = await Promise.all([
        rolesRes.json(),
        categoriesRes.json(),
        tagsRes.json(),
      ]);

      setRoles(rolesData);
      setCategories(categoriesData);
      setTags(tagsData);
      setMessage('Данните за формата са заредени успешно.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Грешка при зареждане.'
      );
    } finally {
      setLoadingRefs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      setError('Моля, въведи валиден token.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const res = await fetch(`${API_BASE}/tools`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          ...form,
          documentation_url: form.documentation_url || null,
          how_to_use: form.how_to_use || null,
          real_examples: form.real_examples || null,
          image_url: form.image_url || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || 'Неуспешно добавяне на tool.');
      }

      setMessage('Tool е добавен успешно.');
      setForm({
        name: '',
        url: '',
        documentation_url: '',
        description: '',
        how_to_use: '',
        real_examples: '',
        image_url: '',
        difficulty_level: 'beginner',
        is_featured: false,
        category_ids: [],
        role_ids: [],
        tag_ids: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при запис.');
    } finally {
      setSaving(false);
    }
  };

  const toggleMultiSelectValue = (
    key: 'category_ids' | 'role_ids' | 'tag_ids',
    value: number
  ) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);

      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((id) => id !== value)
          : [...prev[key], value],
      };
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Add New Tool
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a new AI tool entry with roles, categories and tags.
          </p>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className={labelClassName}>Sanctum Token</label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token without Bearer"
                className={inputClassName}
              />
            </div>

            <button
              type="button"
              onClick={fetchReferenceData}
              className={primaryButtonClassName}
            >
              {loadingRefs ? 'Loading...' : 'Load Form Data'}
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClassName}>Name</label>
              <input
                className={inputClassName}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClassName}>Tool Link</label>
              <input
                className={inputClassName}
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClassName}>Official Documentation</label>
              <input
                className={inputClassName}
                value={form.documentation_url}
                onChange={(e) =>
                  setForm({ ...form, documentation_url: e.target.value })
                }
              />
            </div>

            <div>
              <label className={labelClassName}>Description</label>
              <textarea
                className={textareaClassName}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className={labelClassName}>How to use</label>
              <textarea
                className={textareaClassName}
                value={form.how_to_use}
                onChange={(e) =>
                  setForm({ ...form, how_to_use: e.target.value })
                }
              />
            </div>

            <div>
              <label className={labelClassName}>Real examples</label>
              <textarea
                className={textareaClassName}
                value={form.real_examples}
                onChange={(e) =>
                  setForm({ ...form, real_examples: e.target.value })
                }
              />
            </div>

            <div>
              <label className={labelClassName}>Image URL</label>
              <input
                className={inputClassName}
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
              />
            </div>

            <div>
              <label className={labelClassName}>Difficulty level</label>
              <select
                className={inputClassName}
                value={form.difficulty_level}
                onChange={(e) =>
                  setForm({ ...form, difficulty_level: e.target.value })
                }
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm({ ...form, is_featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Featured tool
            </label>

            <MultiSelectBlock
              title="Categories"
              items={categories}
              selected={form.category_ids}
              onToggle={(id) => toggleMultiSelectValue('category_ids', id)}
            />

            <MultiSelectBlock
              title="Roles"
              items={roles}
              selected={form.role_ids}
              onToggle={(id) => toggleMultiSelectValue('role_ids', id)}
            />

            <MultiSelectBlock
              title="Tags"
              items={tags}
              selected={form.tag_ids}
              onToggle={(id) => toggleMultiSelectValue('tag_ids', id)}
            />

            <button
              type="submit"
              disabled={saving}
              className={primaryButtonClassName}
            >
              {saving ? 'Saving...' : 'Add Tool'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function MultiSelectBlock({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: Option[];
  selected: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-slate-700">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected.includes(item.id);

          return (
            <label
              key={item.id}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                isSelected
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(item.id)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              {item.name}
            </label>
          );
        })}
      </div>
    </div>
  );
}