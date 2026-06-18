'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Login gagal');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="label">Username</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          required
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Login'}
      </button>
    </form>
  );
}
