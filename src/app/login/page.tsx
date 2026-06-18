import { LoginForm } from './login-form';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();
  if (session.user) redirect('/dashboard');
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm card">
        <h1 className="text-2xl font-bold text-brand-700 mb-1">Mess App</h1>
        <p className="text-sm text-slate-500 mb-6">Login untuk melanjutkan</p>
        <LoginForm />
        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          Default: username = nama depan, password = <code className="bg-slate-100 px-1 rounded">namadepan123</code>.
          Ganti setelah login pertama.
        </p>
      </div>
    </main>
  );
}
