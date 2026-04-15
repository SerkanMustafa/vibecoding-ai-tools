'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const menu = [
    { name: 'Dashboard', href: '/' },
    { name: 'Tools', href: '/tools' },
    { name: 'Add Tool', href: '/tools/create' },
    { name: 'Profile', href: '/profile' },
  ];

  const pageTitleMap: Record<string, string> = {
    '/': 'Dashboard',
    '/tools': 'Tools',
    '/tools/create': 'Add Tool',
    '/profile': 'Profile',
  };

  const pageTitle = pageTitleMap[pathname] || 'Vibecoding';

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="p-6 text-xl font-bold text-indigo-600">
            Vibecoding
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {menu.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <h1 className="text-lg font-semibold text-slate-900">
                {pageTitle}
              </h1>

              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-slate-600 sm:inline">
                  {loading
                    ? 'Loading user...'
                    : user
                    ? `${user.name} (${user.role})`
                    : 'Guest'}
                </span>

                <button
                  onClick={logout}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 px-2 py-2 lg:hidden">
              <nav className="flex flex-wrap gap-2">
                {menu.map((item) => {
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname === item.href || pathname.startsWith(item.href + '/');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}