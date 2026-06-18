'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Gagal');
      return;
    }
    setSuccess(true);
    setCurrent('');
    setNew('');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="font-semibold">Ganti Password</h2>
      <input
        className="input"
        type="password"
        placeholder="Password lama"
        value={currentPassword}
        onChange={(e) => setCurrent(e.target.value)}
        required
      />
      <input
        className="input"
        type="password"
        placeholder="Password baru (min. 4 karakter)"
        value={newPassword}
        onChange={(e) => setNew(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">Password berhasil diganti ✓</p>}
      <button className="btn-primary" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Ganti'}
      </button>
    </form>
  );
}
