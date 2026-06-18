import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const roleLabel: Record<string, string> = {
  ketua: 'Ketua',
  advisor: 'Advisor',
  program: 'Program',
  bendahara: 'Bendahara',
  kebersihan: 'Kebersihan',
  humas: 'Humas',
  konsumsi: 'Konsumsi',
};

const groupOrder = ['ketua', 'advisor', 'program', 'bendahara', 'kebersihan', 'humas', 'konsumsi'];

export default async function MembersPage() {
  const list = await db
    .select({
      name: users.name,
      firstName: users.firstName,
      username: users.username,
      role: users.role,
      advisor: users.advisor,
    })
    .from(users)
    .orderBy(users.role, users.firstName);

  const groups: Record<string, typeof list> = {};
  for (const m of list) {
    (groups[m.role] ||= []).push(m);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Penghuni Mess</h1>
        <p className="text-sm text-slate-500">Struktural & anggota mess</p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-1">Struktur Organisasi</h2>
        <pre className="text-xs text-slate-600 bg-slate-50 p-3 rounded leading-relaxed whitespace-pre overflow-x-auto">{`
Ketua     : Junaedi  (Advisor: Irvan Mulyadi)
Program   : M. Chaidar, Wahyu M.P
Bendahara : Yoda
Kebersihan: Aisyah, Dian
Humas     : Nur, Lucky
Konsumsi  : Doni, Muklis
`}</pre>
      </div>

      {groupOrder.map((role) => {
        const g = groups[role];
        if (!g) return null;
        return (
          <div key={role} className="card">
            <h2 className="font-semibold mb-3">{roleLabel[role] || role}</h2>
            <ul className="space-y-1 text-sm">
              {g.map((m) => (
                <li key={m.username} className="flex justify-between">
                  <span>{m.name}</span>
                  <span className="text-slate-500">@{m.username}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
