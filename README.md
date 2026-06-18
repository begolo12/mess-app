# Mess App

Aplikasi pencatatan mess — PWA yang bisa diakses dari HP semua penghuni.

## Stack
- **Next.js 14** (App Router) + Tailwind CSS
- **Neon PostgreSQL** via `@neondatabase/serverless` + Drizzle ORM
- **Iron-session** untuk auth (cookie-based, tanpa external OAuth)
- **Vercel Blob** untuk upload foto bukti piket
- **PWA** installable ke home screen

## Struktur & Akun Default

Ketua: **Junaedi** (Advisor: Irvan Mulyadi)
Program: **Chaidar** (M. Chaidar), **Wahyu** (Wahyu M.P)
Bendahara: **Yoda**
Kebersihan: **Aisyah**, **Dian**
Humas: **Nur**, **Lucky**
Konsumsi: **Doni**, **Muklis**

Username = nama depan, password default = `namadepan123` (harus diganti setelah login pertama).

## Setup Lokal

```bash
npm install
cp .env.example .env
# Isi DATABASE_URL dari Neon dashboard, lalu:
npm run db:push        # buat tabel
npm run db:seed        # seed 11 anggota + 5 area piket
npm run dev
```

## Deploy ke Vercel

1. Push repo ke GitHub
2. Di Vercel → **New Project** → import repo
3. Setelah deploy pertama, buka **Storage** tab → **Connect Store** → pilih **Neon** → buat database baru (Vercel auto-inject `DATABASE_URL`)
4. Buka **Storage** → **Vercel Blob** → enable (auto-inject `BLOB_READ_WRITE_TOKEN`)
5. Set `SESSION_PASSWORD` di **Settings → Environment Variables** (gunakan `openssl rand -base64 32`)
6. Redeploy
7. Setelah deploy sukses, jalankan migrasi & seed:

```bash
# Dari local, pakai DATABASE_URL Vercel:
DATABASE_URL=<neon-url> npm run db:push
DATABASE_URL=<neon-url> npm run db:seed
```

Atau buka Vercel → **Settings → Functions → Console** dan jalankan via `npx`:
```bash
npx drizzle-kit push
npx tsx src/lib/db/seed.ts
```

## Fitur

- **Dashboard**: ringkasan keuangan bulan ini + chart 6 bulan + piket hari ini + program mendatang
- **Keuangan**: catat pemasukan/pengeluaran (role bendahara/ketua)
- **Program**: jadwal kegiatan (role program/ketua)
- **Piket**: jadwal 4 area + laporan dengan upload multi-foto
- **Stok Dapur**: inventaris + alert stok menipis
- **Profil**: ganti password sendiri
- **PWA**: installable, support offline dasar

## Environment Variables

| Name | Keterangan |
|---|---|
| `DATABASE_URL` | Postgres connection string dari Neon |
| `SESSION_PASSWORD` | 32+ char random untuk iron-session |
| `BLOB_READ_WRITE_TOKEN` | Auto-set Vercel saat enable Blob |
