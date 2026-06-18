import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from './index';
import { users, picketAreas } from './schema';

type Member = {
  firstName: string;
  name: string;
  username: string;
  role: 'ketua' | 'advisor' | 'program' | 'bendahara' | 'kebersihan' | 'humas' | 'konsumsi';
  advisor?: string;
};

const members: Member[] = [
  { firstName: 'Junaedi', name: 'Junaedi', username: 'junaedi', role: 'ketua', advisor: 'Irvan Mulyadi' },
  { firstName: 'Irvan', name: 'Irvan Mulyadi', username: 'irvan', role: 'advisor' },
  { firstName: 'Chaidar', name: 'M. Chaidar', username: 'chaidar', role: 'program' },
  { firstName: 'Wahyu', name: 'Wahyu M.P', username: 'wahyu', role: 'program' },
  { firstName: 'Yoda', name: 'Yoda', username: 'yoda', role: 'bendahara' },
  { firstName: 'Aisyah', name: 'Aisyah', username: 'aisyah', role: 'kebersihan' },
  { firstName: 'Dian', name: 'Dian', username: 'dian', role: 'kebersihan' },
  { firstName: 'Nur', name: 'Nur', username: 'nur', role: 'humas' },
  { firstName: 'Lucky', name: 'Lucky', username: 'lucky', role: 'humas' },
  { firstName: 'Doni', name: 'Doni', username: 'doni', role: 'konsumsi' },
  { firstName: 'Muklis', name: 'Muklis', username: 'muklis', role: 'konsumsi' },
];

const areas = [
  { slug: 'kebersihan-umum', name: 'Kebersihan Umum', description: 'Sapu & pel area bersama' },
  { slug: 'kamar-mandi', name: 'Kamar Mandi', description: 'Bersihkan kamar mandi & wastafel' },
  { slug: 'dapur', name: 'Dapur', description: 'Masak nasi & bersihkan dapur' },
  { slug: 'konsumsi', name: 'Konsumsi', description: 'Siapkan konsumsi anggota' },
  { slug: 'taman', name: 'Taman', description: 'Siram tanaman & bersihkan halaman' },
];

async function main() {
  console.log('Seeding picket areas...');
  for (const a of areas) {
    await db.insert(picketAreas).values(a).onConflictDoNothing();
  }

  console.log('Seeding members...');
  for (const m of members) {
    const password = `${m.firstName.toLowerCase()}123`;
    const hash = await bcrypt.hash(password, 10);
    await db
      .insert(users)
      .values({
        name: m.name,
        firstName: m.firstName,
        username: m.username,
        passwordHash: hash,
        role: m.role,
        advisor: m.advisor,
        mustChangePassword: 1,
      })
      .onConflictDoNothing();
    console.log(`  ✓ ${m.username} / ${password} (${m.role})`);
  }

  console.log('\nDone! Login dengan username = nama depan, password = namadepan123');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
