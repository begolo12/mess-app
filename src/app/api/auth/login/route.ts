import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib' }, { status: 400 });
  }
  const found = await db.select().from(users).where(eq(users.username, username)).limit(1);
  const user = found[0];
  if (!user) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
  }
  const session = await getSession();
  session.user = {
    id: user.id,
    username: user.username,
    name: user.name,
    firstName: user.firstName,
    role: user.role,
    mustChangePassword: !!user.mustChangePassword,
  };
  await session.save();
  return NextResponse.json({ ok: true, mustChangePassword: !!user.mustChangePassword });
}
