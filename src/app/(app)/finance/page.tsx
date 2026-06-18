import { db } from '@/lib/db';
import { financeEntries, users } from '@/lib/db/schema';
import { getSession, canEditFinance } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { FinanceForm } from './finance-form';
import { DeleteButton } from './delete-button';

export default async function FinancePage() {
  const session = await getSession();
  const u = session.user!;
  const canEdit = canEditFinance(u.role);

  const entries = await db
    .select({
      id: financeEntries.id,
      type: financeEntries.type,
      amount: financeEntries.amount,
      description: financeEntries.description,
      category: financeEntries.category,
      date: financeEntries.date,
      recordedBy: users.firstName,
    })
    .from(financeEntries)
    .innerJoin(users, eq(users.id, financeEntries.recordedBy))
    .orderBy(desc(financeEntries.date), desc(financeEntries.id))
    .limit(100);

  const totalIncome = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Keuangan</h1>
          <p className="text-sm text-slate-500">Catatan pemasukan & pengeluaran mess</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-emerald-600">+ Rp {totalIncome.toLocaleString('id-ID')}</p>
          <p className="text-red-600">- Rp {totalExpense.toLocaleString('id-ID')}</p>
          <p className="font-bold">Saldo: Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}</p>
        </div>
      </div>

      {canEdit && <FinanceForm />}

      <div className="card overflow-x-auto">
        <h2 className="font-semibold mb-3">Riwayat Transaksi</h2>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada transaksi.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Tanggal</th>
                <th>Tipe</th>
                <th>Kategori</th>
                <th>Keterangan</th>
                <th className="text-right">Jumlah</th>
                <th>Oleh</th>
                {canEdit && <th></th>}
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="py-2">{new Date(e.date).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={e.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>
                      {e.type === 'income' ? 'Masuk' : 'Keluar'}
                    </span>
                  </td>
                  <td>{e.category}</td>
                  <td>{e.description}</td>
                  <td className="text-right font-mono">
                    Rp {e.amount.toLocaleString('id-ID')}
                  </td>
                  <td>{e.recordedBy}</td>
                  {canEdit && (
                    <td>
                      <DeleteButton id={e.id} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
