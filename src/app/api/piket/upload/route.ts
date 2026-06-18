import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Vercel Blob belum dikonfigurasi. Enable di Vercel dashboard lalu redeploy.' },
      { status: 500 }
    );
  }

  const blob = await put(`piket/${Date.now()}-${file.name}`, file, { access: 'public' });
  return NextResponse.json({ url: blob.url });
}
