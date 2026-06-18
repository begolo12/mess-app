import { db } from '@/lib/db';
import { programs, users } from '@/lib/db/schema';
import { getSession, canManagePrograms } from '@/lib/auth';
import { desc, eq, gte } from 'drizzle-orm';
import { ProgramForm } from './program-form';

export default async function ProgramsPage() {
  const session = await getSession();
  const u = session.user!;
  const canEdit = canManagePrograms(u.role);

  const list = await db
    .select({
      id: programs.id,
      title: programs.title,
      description: programs.description,
      scheduledFor: programs.scheduledFor,
      createdBy: users.firstName,
    })
    .from(programs)
    .innerJoin(users, eq(users.id, programs.createdBy))
    .where(gte(programs.scheduledFor, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
    .orderBy(desc(programs.scheduledFor))
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Program</h1>
        <p className="text-sm text-slate-500">Jadwal kegiatan mess</p>
      </div>

      {canEdit && <ProgramForm />}

      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada program terjadwal.</p>
        ) : (
          list.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-xs text-slate-500">
                    {new Date(p.scheduledFor).toLocaleString('id-ID')} — oleh {p.createdBy}
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{p.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
