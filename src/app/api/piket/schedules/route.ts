import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { picketSchedules } from '@/lib/db/schema';
import { getSession, canManagePrograms } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!canManagePrograms(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { areaId, assignedTo, scheduledFor } = await req.json();
  if (!areaId || !assignedTo || !scheduledFor) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }
  const inserted = await db
    .insert(picketSchedules)
    .values({ areaId: Number(areaId), assignedTo: Number(assignedTo), scheduledFor })
    .returning();
  return NextResponse.json(inserted[0]);
}
