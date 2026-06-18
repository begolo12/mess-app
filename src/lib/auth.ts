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

function getSessionPassword(): string {
  const p = process.env.SESSION_PASSWORD;
  if (!p || p.length < 32) {
    throw new Error(
      'SESSION_PASSWORD belum di-set atau kurang dari 32 karakter. Set di Vercel Environment Variables (Settings → Environment Variables) lalu redeploy.'
    );
  }
  return p;
}

function buildSessionOptions(): SessionOptions {
  return {
    password: getSessionPassword(),
    cookieName: 'mess_session',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    },
  };
}

// Defer to runtime to avoid build-time env resolution issues on Vercel
let _sessionOptions: SessionOptions | null = null;
export const sessionOptions: SessionOptions = new Proxy({} as SessionOptions, {
  get(_target, prop) {
    if (!_sessionOptions) _sessionOptions = buildSessionOptions();
    return (_sessionOptions as any)[prop];
  },
});

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
