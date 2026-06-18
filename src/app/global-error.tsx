'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui', padding: 40, background: '#f8fafc' }}>
        <h1 style={{ color: '#dc2626' }}>Terjadi Kesalahan</h1>
        <p style={{ color: '#475569', marginBottom: 16 }}>
          {error.message || 'Tidak diketahui'}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Coba Lagi
        </button>
        <p style={{ marginTop: 24, fontSize: 13, color: '#64748b' }}>
          Tips: pastikan SESSION_PASSWORD, DATABASE_URL, dan BLOB_READ_WRITE_TOKEN sudah di-set di Vercel
          Environment Variables, lalu redeploy.
        </p>
      </body>
    </html>
  );
}
