'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProgramForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, scheduledFor: datetime }),
    });
    setTitle('');
    setDescription('');
    setDatetime('');
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card">
      <h2 className="font-semibold mb-3">Tambah Program</h2>
      <div className="space-y-3">
        <input className="input" placeholder="Judul program" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="input" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
        <textarea className="input" placeholder="Deskripsi" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <button className="btn-primary mt-3" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
