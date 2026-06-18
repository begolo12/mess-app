import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL!;
const sql = neon(url);

const statements = [
  `CREATE TYPE role AS ENUM ('ketua', 'advisor', 'program', 'bendahara', 'kebersihan', 'humas', 'konsumsi')`,
  `CREATE TYPE finance_type AS ENUM ('income', 'expense')`,
  `CREATE TYPE picket_status AS ENUM ('pending', 'completed', 'skipped')`,

  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role role NOT NULL,
    advisor TEXT,
    must_change_password INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS finance_entries (
    id SERIAL PRIMARY KEY,
    type finance_type NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    recorded_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    scheduled_for TIMESTAMP NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS picket_areas (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS picket_schedules (
    id SERIAL PRIMARY KEY,
    area_id INTEGER NOT NULL REFERENCES picket_areas(id),
    assigned_to INTEGER NOT NULL REFERENCES users(id),
    scheduled_for DATE NOT NULL,
    status picket_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS picket_reports (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER NOT NULL REFERENCES picket_schedules(id),
    completed_by INTEGER NOT NULL REFERENCES users(id),
    notes TEXT,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS picket_photos (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES picket_reports(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`,

  `CREATE TABLE IF NOT EXISTS kitchen_stock (
    id SERIAL PRIMARY KEY,
    item TEXT NOT NULL UNIQUE,
    qty INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    threshold INTEGER NOT NULL DEFAULT 2,
    last_updated TIMESTAMP NOT NULL DEFAULT NOW()
  )`,
];

async function main() {
  for (const stmt of statements) {
    try {
      await sql(stmt);
      console.log('✓', stmt.split('\n')[0].slice(0, 60));
    } catch (e: any) {
      if (e.message?.includes('already exists')) {
        console.log('= exists:', stmt.split('\n')[0].slice(0, 60));
      } else {
        console.error('✗', stmt.split('\n')[0].slice(0, 60), '\n  ', e.message);
        process.exit(1);
      }
    }
  }
  console.log('\nAll tables created successfully.');
}

main();
