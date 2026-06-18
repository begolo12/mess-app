'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ReportForm({ scheduleId }: { scheduleId: number }) {
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError('Minimal 1 foto bukti wajib diupload');
      return;
    }
    setError(null);
    setLoading(true);

    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('scheduleId', String(scheduleId));
      const res = await fetch('/api/piket/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        setError('Gagal upload foto');
        setLoading(false);
        return;
      }
      const data = await res.json();
      urls.push(data.url);
    }

    const res = await fetch('/api/piket/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduleId, notes, photoUrls: urls }),
    });
    if (!res.ok) {
      setError('Gagal menyimpan laporan');
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="font-semibold">Upload Laporan</h2>
      <div>
        <label className="label">Foto bukti (minimal 1, bisa banyak)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full text-sm"
        />
      </div>
      <div>
        <label className="label">Catatan (opsional)</label>
        <textarea
          className="input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Misal: sudah disapu, lantai dipel, stok sabun habis..."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary" disabled={loading}>
        {loading ? 'Mengupload...' : 'Kirim Laporan'}
      </button>
    </form>
  );
}
