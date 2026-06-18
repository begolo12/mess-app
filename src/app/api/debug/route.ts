import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const c = await cookies();
  return NextResponse.json({
    keys: Object.keys(c),
    hasGet: typeof c.get,
    getAll: c.getAll().map((x) => x.name),
  });
}
