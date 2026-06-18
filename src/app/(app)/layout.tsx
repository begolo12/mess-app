import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { LogoutButton } from './logout-button';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/finance', label: 'Keuangan' },
  { href: '/programs', label: 'Program' },
  { href: '/piket', label: 'Piket' },
  { href: '/kitchen', label: 'Stok Dapur' },
  { href: '/members', label: 'Penghuni' },
  { href: '/profile', label: 'Profil' },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.user) redirect('/login');
  const u = session.user;
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
        <div className="mb-2 hidden md:block">
          <h2 className="text-lg font-bold text-brand-700">Mess App</h2>
          <p className="text-xs text-slate-500">Halo, {u.firstName}</p>
        </div>
        <nav className="flex md:flex-col gap-1 flex-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 whitespace-nowrap"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">{children}</main>
    </div>
  );
}
