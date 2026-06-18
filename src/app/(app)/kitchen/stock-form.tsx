'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function StockForm() {
  const router = useRouter();
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('');
  const [threshold, setThreshold] = useState('2');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/kitchen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, qty: Number(qty), unit, threshold: Number(threshold) }),
    });
    setItem('');
    setQty('');
    setUnit('');
    setThreshold('2');
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card">
      <h2 className="font-semibold mb-3">Tambah / Update Stok</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input className="input" placeholder="Nama item" value={item} onChange={(e) => setItem(e.target.value)} required />
        <input className="input" type="number" placeholder="Jumlah" value={qty} onChange={(e) => setQty(e.target.value)} required />
        <input className="input" placeholder="Satuan (kg, liter, pcs)" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        <input className="input" type="number" placeholder="Batas min." value={threshold} onChange={(e) => setThreshold(e.target.value)} />
      </div>
      <button className="btn-primary mt-3" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
