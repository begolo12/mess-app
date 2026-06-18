import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({
      ok: true,
      hasUser: !!session.user,
      hasDb: !!process.env.DATABASE_URL,
      hasSession: !!process.env.SESSION_PASSWORD,
      hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message, stack: e.stack?.slice(0, 500) },
      { status: 500 }
    );
  }
}
