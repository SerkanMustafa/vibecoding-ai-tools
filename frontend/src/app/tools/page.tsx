'use client';

import { useState } from 'react';
import ToolCard from '../components/ToolCard';
import { API_BASE } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Option = {
  id: number;
  name: string;
};

type Tool = {
  id: number;
  name: string;
  url: string;
  documentation_url?: string | null;
  description: string;
  difficulty_level?: string | null;
  is_featured: boolean;
  categories: Option[];
  roles: Option[];
  tags: Option[];
  user?: {
    id: number;
    name: string;
  };
};

export default function ToolsPage() {
  const { token, setToken } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTools = async () => {
    if (!token.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/tools`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await res.json();
      setTools(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this tool?')) return;

    try {
      await fetch(`${API_BASE}/tools/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      fetchTools();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">AI Tools</h1>

        <div className="mb-6 rounded-xl bg-white p-4 shadow">
          <input
            placeholder="Paste token here..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          <button
            onClick={fetchTools}
            className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Load Tools
          </button>
        </div>

        {loading && <p>Loading...</p>}

        <div className="grid gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onDelete={handleDelete}
              token={token}
            />
          ))}
        </div>
      </div>
    </main>
  );
}