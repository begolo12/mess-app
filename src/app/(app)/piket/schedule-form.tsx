'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Area = { id: number; name: string };
type Member = { id: number; firstName: string };

export function ScheduleForm({ areas, members }: { areas: Area[]; members: Member[] }) {
  const router = useRouter();
  const [areaId, setAreaId] = useState(areas[0]?.id.toString() || '');
  const [assignedTo, setAssignedTo] = useState(members[0]?.id.toString() || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/piket/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ areaId: Number(areaId), assignedTo: Number(assignedTo), scheduledFor: date }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card">
      <h2 className="font-semibold mb-3">Tambah Jadwal Piket</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select className="input" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select className="input" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.firstName}</option>
          ))}
        </select>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <button className="btn-primary mt-3" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Tambah'}
      </button>
    </form>
  );
}
