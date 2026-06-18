import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { kitchenStock } from '@/lib/db/schema';
import { getSession, canManageKitchen } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!canManageKitchen(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { item, qty, unit, threshold } = await req.json();
  if (!item || qty == null || !unit) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  const all = await db.select().from(kitchenStock);
  const match = all.find((i) => i.item.toLowerCase() === item.toLowerCase());
  if (match) {
    await db
      .update(kitchenStock)
      .set({
        qty: Number(qty),
        unit,
        threshold: Number(threshold) || 2,
        lastUpdated: new Date(),
      })
      .where(eq(kitchenStock.id, match.id));
  } else {
    await db.insert(kitchenStock).values({
      item,
      qty: Number(qty),
      unit,
      threshold: Number(threshold) || 2,
    });
  }
  return NextResponse.json({ ok: true });
}
