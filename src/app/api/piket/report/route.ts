import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { picketReports, picketPhotos, picketSchedules } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { scheduleId, notes, photoUrls } = await req.json();
  if (!scheduleId || !Array.isArray(photoUrls) || photoUrls.length === 0) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  const [report] = await db
    .insert(picketReports)
    .values({ scheduleId, completedBy: session.user.id, notes: notes || null })
    .returning();

  if (photoUrls.length) {
    await db.insert(picketPhotos).values(
      photoUrls.map((url: string) => ({ reportId: report.id, url }))
    );
  }

  await db
    .update(picketSchedules)
    .set({ status: 'completed' })
    .where(eq(picketSchedules.id, scheduleId));

  return NextResponse.json({ ok: true, reportId: report.id });
}
