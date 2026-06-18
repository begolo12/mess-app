import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { picketSchedules, picketAreas, users, picketReports, picketPhotos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { ReportForm } from './report-form';
import Image from 'next/image';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scheduleId = Number(id);
  const session = await getSession();
  const u = session.user!;

  const sched = (
    await db
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
      .where(eq(picketSchedules.id, scheduleId))
  )[0];

  if (!sched) notFound();

  const existing = (
    await db
      .select({ id: picketReports.id, notes: picketReports.notes, completedAt: picketReports.completedAt })
      .from(picketReports)
      .where(eq(picketReports.scheduleId, scheduleId))
  )[0];

  const photos = existing
    ? await db.select().from(picketPhotos).where(eq(picketPhotos.reportId, existing.id))
    : [];

  const canReport = sched.assigneeId === u.id || ['ketua', 'program'].includes(u.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Laporan Piket</h1>
        <p className="text-sm text-slate-500">
          {sched.area} — {new Date(sched.scheduledFor).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Petugas: {sched.assignee}
        </p>
      </div>

      {canReport && sched.status === 'pending' && (
        <ReportForm scheduleId={scheduleId} />
      )}

      {existing ? (
        <div className="card">
          <h2 className="font-semibold mb-2">Bukti Pelaksanaan</h2>
          <p className="text-xs text-slate-500 mb-3">
            Dilaporkan {new Date(existing.completedAt).toLocaleString('id-ID')}
          </p>
          {existing.notes && (
            <p className="text-sm whitespace-pre-wrap mb-3">📝 {existing.notes}</p>
          )}
          {photos.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada foto.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {photos.map((p) => (
                <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="block relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                  <Image src={p.url} alt="bukti piket" fill style={{ objectFit: 'cover' }} unoptimized />
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <p className="text-sm text-slate-500">Belum ada laporan untuk jadwal ini.</p>
        </div>
      )}
    </div>
  );
}
