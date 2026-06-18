import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(url);
sql('SELECT 1 as ok')
  .then((r: any) => {
    console.log('OK:', r);
    process.exit(0);
  })
  .catch((e: Error) => {
    console.error('FAIL:', e.message);
    process.exit(1);
  });
