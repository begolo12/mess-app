'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function del() {
    if (!confirm('Hapus transaksi ini?')) return;
    setLoading(true);
    await fetch(`/api/finance/${id}`, { method: 'DELETE' });
    router.refresh();
  }
  return (
    <button onClick={del} disabled={loading} className="text-xs text-red-600 hover:underline">
      Hapus
    </button>
  );
}
