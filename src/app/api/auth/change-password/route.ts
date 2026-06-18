import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 4) {
    return NextResponse.json(
      { error: 'Password baru minimal 4 karakter' },
      { status: 400 }
    );
  }
  const found = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  const user = found[0];
  if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Password lama salah' }, { status: 401 });
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await db
    .update(users)
    .set({ passwordHash: hash, mustChangePassword: 0 })
    .where(eq(users.id, user.id));
  return NextResponse.json({ ok: true });
}
