'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FinanceForm() {
  const router = useRouter();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: Number(amount), category, description, date }),
    });
    setAmount('');
    setCategory('');
    setDescription('');
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card">
      <h2 className="font-semibold mb-3">Tambah Transaksi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select className="input" value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
        <input className="input" type="number" placeholder="Jumlah (Rp)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input className="input" placeholder="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input className="input" placeholder="Keterangan" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <button className="btn-primary mt-3" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan'}
      </button>
    </form>
  );
}
