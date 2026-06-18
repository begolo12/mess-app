import Link from 'next/link';
import { db } from '@/lib/db';
import { picketAreas, picketSchedules, users, picketReports, picketPhotos } from '@/lib/db/schema';
import { getSession, canManagePrograms } from '@/lib/auth';
import { eq, gte, desc, sql, inArray } from 'drizzle-orm';
import { ScheduleForm } from './schedule-form';

export default async function PiketPage() {
  const session = await getSession();
  const u = session.user!;
  const canEdit = canManagePrograms(u.role);

  const areas = await db.select().from(picketAreas);
  const members = await db
    .select({ id: users.id, firstName: users.firstName })
    .from(users)
    .orderBy(users.firstName);

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceStr = since.toISOString().slice(0, 10);

  const schedules = await db
    .select({
      id: picketSchedules.id,
      scheduledFor: picketSchedules.scheduledFor,
      status: picketSchedules.status,
      area: picketAreas.name,
      areaSlug: picketAreas.slug,
      assignee: users.firstName,
      assigneeId: users.id,
    })
    .from(picketSchedules)
    .innerJoin(picketAreas, eq(picketAreas.id, picketSchedules.areaId))
    .innerJoin(users, eq(users.id, picketSchedules.assignedTo))
    .where(gte(picketSchedules.scheduledFor, sinceStr))
    .orderBy(desc(picketSchedules.scheduledFor));

  const scheduleIds = schedules.map((s) => s.id);
  const reportMap: Record<number, { photoCount: number; notes: string | null; completedBy: string }> = {};
  if (scheduleIds.length) {
    const reports = await db
      .select({
        id: picketReports.id,
        scheduleId: picketReports.scheduleId,
        notes: picketReports.notes,
        completedBy: users.firstName,
      })
      .from(picketReports)
      .innerJoin(users, eq(users.id, picketReports.completedBy))
      .where(inArray(picketReports.scheduleId, scheduleIds));
    for (const r of reports) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(picketPhotos)
        .where(eq(picketPhotos.reportId, r.id));
      reportMap[r.scheduleId] = { photoCount: Number(count), notes: r.notes, completedBy: r.completedBy };
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Piket</h1>
        <p className="text-sm text-slate-500">Jadwal & laporan piket mess</p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Area Piket</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {areas.map((a) => (
            <div key={a.id} className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium">{a.name}</p>
              <p className="text-xs text-slate-500">{a.description}</p>
            </div>
          ))}
        </div>
      </div>

      {canEdit && <ScheduleForm areas={areas} members={members} />}

      <div className="card overflow-x-auto">
        <h2 className="font-semibold mb-3">Jadwal 7 Hari Terakhir</h2>
        {schedules.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada jadwal.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Tanggal</th>
                <th>Area</th>
                <th>Petugas</th>
                <th>Status</th>
                <th>Bukti</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => {
                const r = reportMap[s.id];
                return (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2">{new Date(s.scheduledFor).toLocaleDateString('id-ID')}</td>
                    <td>{s.area}</td>
                    <td>{s.assignee}</td>
                    <td>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          s.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : s.status === 'skipped'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {r ? (
                        <span className="text-xs">
                          📷 {r.photoCount} foto — {r.completedBy}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td>
                      {s.assigneeId === u.id && s.status === 'pending' ? (
                        <Link href={`/piket/${s.id}/report`} className="text-xs btn-primary py-1 px-2">
                          Lapor
                        </Link>
                      ) : r ? (
                        <Link href={`/piket/${s.id}/report`} className="text-xs text-brand-600 hover:underline">
                          Lihat
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
