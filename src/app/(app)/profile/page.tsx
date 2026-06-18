import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ChangePasswordForm } from './change-password-form';

const roleLabel: Record<string, string> = {
  ketua: 'Ketua',
  advisor: 'Advisor',
  program: 'Program',
  bendahara: 'Bendahara',
  kebersihan: 'Kebersihan',
  humas: 'Humas',
  konsumsi: 'Konsumsi',
};

export default async function ProfilePage() {
  const session = await getSession();
  const u = session.user!;
  const me = (await db.select().from(users).where(eq(users.id, u.id)))[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Saya</h1>
      </div>

      <div className="card space-y-2">
        <Row label="Nama" value={me.name} />
        <Row label="Username" value={me.username} />
        <Row label="Role" value={roleLabel[me.role] || me.role} />
        {me.advisor && <Row label="Advisor" value={me.advisor} />}
        <Row
          label="Password"
          value={me.mustChangePassword ? '⚠️ Belum diganti (default)' : '✓ Sudah diganti'}
        />
      </div>

      <ChangePasswordForm />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
