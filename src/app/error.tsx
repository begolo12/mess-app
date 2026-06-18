'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const msg = error.message || '';
  const isDb = msg.includes('DATABASE_URL') || msg.includes('database') || msg.includes('fetch failed');
  const isSession = msg.includes('SESSION_PASSWORD');
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-red-600 mb-2">⚠️ Setup Diperlukan</h1>
        {isDb ? (
          <>
            <p className="text-sm text-slate-700 mb-3">
              Database belum terkonfigurasi. Di Vercel dashboard:
            </p>
            <ol className="text-sm text-slate-600 list-decimal pl-5 space-y-1 mb-3">
              <li>Buka tab <b>Storage</b></li>
              <li>Klik <b>Connect Store → Neon → Create Database</b></li>
              <li>Tunggu <code>DATABASE_URL</code> ter-inject otomatis</li>
              <li>Redeploy & jalankan migrasi + seed</li>
            </ol>
          </>
        ) : isSession ? (
          <>
            <p className="text-sm text-slate-700 mb-3">{msg}</p>
            <p className="text-sm text-slate-600">
              Set di Vercel → Settings → Environment Variables, lalu redeploy.
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-700 mb-3">{msg || 'Terjadi kesalahan tidak dikenal.'}</p>
        )}
        <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Coba Lagi
        </button>
      </div>
    </main>
  );
}
