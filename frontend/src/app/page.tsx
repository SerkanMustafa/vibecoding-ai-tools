export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Tools',
      value: '24',
      description: 'All tools currently in the system',
    },
    {
      title: 'Featured Tools',
      value: '8',
      description: 'Highlighted tools for quick discovery',
    },
    {
      title: 'Categories',
      value: '6',
      description: 'Tool groups available for filtering',
    },
    {
      title: 'Roles',
      value: '5',
      description: 'User roles connected to tools',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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