import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    hasDb: !!process.env.DATABASE_URL,
    dbPrefix: process.env.DATABASE_URL?.slice(0, 20),
    hasSession: !!process.env.SESSION_PASSWORD,
    sessionLen: process.env.SESSION_PASSWORD?.length || 0,
    hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
    nodeEnv: process.env.NODE_ENV,
  });
}
