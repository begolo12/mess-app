import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { financeEntries } from '@/lib/db/schema';
import { getSession, canEditFinance } from '@/lib/auth';

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!canEditFinance(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await ctx.params;
  await db.delete(financeEntries).where(eq(financeEntries.id, Number(id)));
  return NextResponse.json({ ok: true });
}
