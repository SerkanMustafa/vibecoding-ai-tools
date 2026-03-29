'use client';

import { useState } from 'react';

const API_BASE = 'http://localhost:8201/api';

const inputClassName =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

const labelClassName = 'mb-2 block text-sm font-semibold text-slate-700';

const primaryButtonClassName =
  'inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60';

export default function ProfilePage() {
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const handleSetup2FA = async () => {
    try {
      if (!token.trim()) {
        setError('Please enter a valid token.');
        return;
      }

      setLoadingSetup(true);
      setError('');
      setMessage('');

      const res = await fetch(`${API_BASE}/2fa/setup`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to generate 2FA setup data.');
      }

      const data = await res.json();
      setQrUrl(data.qr_code_url || '');
      setSecret(data.secret || '');
      setMessage('2FA setup data generated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '2FA setup failed.');
    } finally {
      setLoadingSetup(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      if (!token.trim()) {
        setError('Please enter a valid token.');
        return;
      }

      if (!code.trim()) {
        setError('Please enter the 6-digit code from Google Authenticator.');
        return;
      }

      setLoadingVerify(true);
      setError('');
      setMessage('');

      const res = await fetch(`${API_BASE}/2fa/verify`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to verify 2FA code.');
      }

      setMessage(data?.message || '2FA enabled successfully.');
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '2FA verification failed.');
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Profile
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            User information, account overview and security settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                U
              </div>

              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                Logged User
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                owner@example.com
              </p>

              <span className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                Owner
              </span>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Account Details
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Full Name</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Logged User
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Email</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    owner@example.com
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Role</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Owner
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">
                    Account Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    Active
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">
                  Two-Factor Authentication
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Set up Google Authenticator to add an extra layer of security.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelClassName}>Sanctum Token</label>
                  <input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your token"
                    className={inputClassName}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSetup2FA}
                    disabled={loadingSetup}
                    className={primaryButtonClassName}
                  >
                    {loadingSetup ? 'Generating...' : 'Setup 2FA'}
                  </button>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                {secret && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      Secret Key
                    </p>
                    <p className="mt-2 break-all text-sm text-slate-600">
                      {secret}
                    </p>
                  </div>
                )}

                {qrUrl && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      Google Authenticator Setup Link
                    </p>
                    <a
                      href={qrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block break-all text-sm text-indigo-600 hover:underline"
                    >
                      {qrUrl}
                    </a>
                    <p className="mt-3 text-xs text-slate-500">
                      Copy the secret or use the generated link to configure the app.
                    </p>
                  </div>
                )}

                <div>
                  <label className={labelClassName}>Verification Code</label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className={inputClassName}
                  />
                </div>

                <button
                  onClick={handleVerify2FA}
                  disabled={loadingVerify}
                  className={primaryButtonClassName}
                >
                  {loadingVerify ? 'Verifying...' : 'Verify 2FA'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}