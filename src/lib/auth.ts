import { cookies } from 'next/headers';
import { getIronSession, type SessionOptions } from 'iron-session';

export type SessionUser = {
  id: number;
  username: string;
  name: string;
  role: string;
  firstName: string;
  mustChangePassword?: boolean;
};

export type SessionData = {
  user?: SessionUser;
};

let cachedPassword: string | null = null;
function getSessionPassword(): string {
  if (cachedPassword) return cachedPassword;
  const p = process.env.SESSION_PASSWORD;
  if (!p || p.length < 32) {
    throw new Error(
      'SESSION_PASSWORD belum di-set atau kurang dari 32 karakter. Set di Vercel Environment Variables (Settings → Environment Variables) lalu redeploy.'
    );
  }
  cachedPassword = p;
  return p;
}

export const sessionOptions: SessionOptions = {
  get password() {
    return getSessionPassword();
  },
  cookieName: 'mess_session',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session.user) throw new Error('Unauthorized');
  return session.user;
}

export function canEditFinance(role: string) {
  return ['ketua', 'bendahara'].includes(role);
}

export function canManagePrograms(role: string) {
  return ['ketua', 'program'].includes(role);
}

export function canManageKitchen(role: string) {
  return ['ketua', 'konsumsi'].includes(role);
}
