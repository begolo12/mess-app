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

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD!,
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
