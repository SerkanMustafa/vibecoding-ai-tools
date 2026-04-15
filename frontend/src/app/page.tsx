'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Option = {
  id: number;
  name: string;
  slug?: string;
};

type Tool = {
  id: number;
  is_featured: boolean;
};

export default function DashboardPage() {
  const { token, setToken } = useAuth();

  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (!token.trim()) return;

    try {
      setLoading(true);

      const [toolsRes, categoriesRes, rolesRes] = await Promise.all([
        fetch(`${API_BASE}/tools`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE}/categories`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE}/roles`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!toolsRes.ok || !categoriesRes.ok || !rolesRes.ok) {
        throw new Error('Failed to load dashboard data.');
      }

      const [toolsData, categoriesData, rolesData] = await Promise.all([
        toolsRes.json(),
        categoriesRes.json(),
        rolesRes.json(),
      ]);

      setTools(toolsData.data || []);
      setCategories(categoriesData || []);
      setRoles(rolesData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const stats = [
    {
      title: 'Total Tools',
      value: String(tools.length),
      description: 'All tools currently in the system',
    },
    {
      title: 'Featured Tools',
      value: String(tools.filter((tool) => tool.is_featured).length),
      description: 'Highlighted tools for quick discovery',
    },
    {
      title: 'Categories',
      value: String(categories.length),
      description: 'Tool groups available for filtering',
    },
    {
      title: 'Roles',
      value: String(roles.length),
      description: 'User roles connected to tools',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sanctum Token
              </label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Load Dashboard Data
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome to your AI tools management workspace.
            </p>
          </div>

          <a
            href="/tools/create"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + Add New Tool
          </a>
        </div>

        {loading && (
          <p className="mb-4 text-sm text-slate-500">Loading dashboard data...</p>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{stat.description}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Platform Overview
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This dashboard helps logged-in users discover, create and manage AI
              tools with categories, tags and role-based organization. Use the
              navigation to browse the tools list, add a new tool or review your
              profile.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Organized structure
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Tools are grouped by category, tags and recommended roles for
                  easier discovery.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Better productivity
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Quickly access the most important sections through the sidebar
                  and clean layout.
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-5 space-y-3">
              <a
                href="/tools"
                className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                View all tools
              </a>

              <a
                href="/tools/create"
                className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Add a new tool
              </a>

              <a
                href="/profile"
                className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Open profile
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}