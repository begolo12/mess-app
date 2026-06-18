import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { financeEntries } from '@/lib/db/schema';
import { getSession, canEditFinance } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!canEditFinance(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json();
  const { type, amount, category, description, date } = body;
  if (!type || !amount || !category || !description || !date) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }
  const inserted = await db
    .insert(financeEntries)
    .values({
      type,
      amount: Number(amount),
      category,
      description,
      date,
      recordedBy: session.user.id,
    })
    .returning();
  return NextResponse.json(inserted[0]);
}
