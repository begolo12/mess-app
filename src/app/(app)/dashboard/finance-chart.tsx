'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Point = { month: string; income: number; expense: number };

export function FinanceChart({ data }: { data?: Point[] }) {
  // Fallback demo data if none provided
  const chartData = data && data.length > 0 ? data : [
    { month: 'Jan', income: 0, expense: 0 },
    { month: 'Feb', income: 0, expense: 0 },
    { month: 'Mar', income: 0, expense: 0 },
    { month: 'Apr', income: 0, expense: 0 },
    { month: 'Mei', income: 0, expense: 0 },
    { month: 'Jun', income: 0, expense: 0 },
  ];
  return (
    <div className="card">
      <h2 className="font-semibold mb-3">Keuangan 6 Bulan Terakhir</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(v: number) => `Rp ${v.toLocaleString('id-ID')}`} />
            <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
            <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
