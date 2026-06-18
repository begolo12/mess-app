import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { financeEntries, picketSchedules, picketAreas, users, programs } from '@/lib/db/schema';
import { and, eq, gte, lte, sql, desc } from 'drizzle-orm';
import { FinanceChart } from './finance-chart';

export default async function DashboardPage() {
  const session = await getSession();
  const u = session.user!;

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [incomeRow] = await db
    .select({ total: sql<number>`COALESCE(SUM(${financeEntries.amount}), 0)` })
    .from(financeEntries)
    .where(
      and(
        eq(financeEntries.type, 'income'),
        gte(financeEntries.date, monthStart.toISOString().slice(0, 10)),
        lte(financeEntries.date, monthEnd.toISOString().slice(0, 10))
      )
    );
  const [expenseRow] = await db
    .select({ total: sql<number>`COALESCE(SUM(${financeEntries.amount}), 0)` })
    .from(financeEntries)
    .where(
      and(
        eq(financeEntries.type, 'expense'),
        gte(financeEntries.date, monthStart.toISOString().slice(0, 10)),
        lte(financeEntries.date, monthEnd.toISOString().slice(0, 10))
      )
    );

  const todayStr = today.toISOString().slice(0, 10);
  const todayPickets = await db
    .select({
      id: picketSchedules.id,
      area: picketAreas.name,
      areaSlug: picketAreas.slug,
      status: picketSchedules.status,
      assignee: users.firstName,
    })
    .from(picketSchedules)
    .innerJoin(picketAreas, eq(picketAreas.id, picketSchedules.areaId))
    .innerJoin(users, eq(users.id, picketSchedules.assignedTo))
    .where(eq(picketSchedules.scheduledFor, todayStr));

  const upcomingPrograms = await db
    .select()
    .from(programs)
    .where(gte(programs.scheduledFor, today))
    .orderBy(programs.scheduledFor)
    .limit(5);

  const income = Number(incomeRow?.total ?? 0);
  const expense = Number(expenseRow?.total ?? 0);
  const balance = income - expense;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500">Ringkasan mess bulan ini</p>
      </div>

      {u.mustChangePassword ? (
        <div className="card border-amber-300 bg-amber-50">
          <p className="text-sm text-amber-800">
            ⚠️ Anda masih menggunakan password default. Segera ganti di{' '}
            <a href="/profile" className="underline font-medium">halaman profil</a>.
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs text-slate-500 uppercase">Pemasukan</p>
          <p className="text-2xl font-bold text-emerald-600">Rp {income.toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 uppercase">Pengeluaran</p>
          <p className="text-2xl font-bold text-red-600">Rp {expense.toLocaleString('id-ID')}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500 uppercase">Saldo</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-brand-700' : 'text-red-600'}`}>
            Rp {balance.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <FinanceChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-3">Piket Hari Ini</h2>
          {todayPickets.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada jadwal piket hari ini.</p>
          ) : (
            <ul className="space-y-2">
              {todayPickets.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span>{p.area} — <b>{p.assignee}</b></span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      p.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h2 className="font-semibold mb-3">Program Mendatang</h2>
          {upcomingPrograms.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada program terjadwal.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {upcomingPrograms.map((p) => (
                <li key={p.id}>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(p.scheduledFor).toLocaleString('id-ID')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
