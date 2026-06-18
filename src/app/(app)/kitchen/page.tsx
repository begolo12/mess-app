import { db } from '@/lib/db';
import { kitchenStock } from '@/lib/db/schema';
import { getSession, canManageKitchen } from '@/lib/auth';
import { StockForm } from './stock-form';

export default async function KitchenPage() {
  const session = await getSession();
  const u = session.user!;
  const canEdit = canManageKitchen(u.role);

  const items = await db.select().from(kitchenStock).orderBy(kitchenStock.item);
  const lowStock = items.filter((i) => i.qty <= i.threshold);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stok Dapur</h1>
        <p className="text-sm text-slate-500">Inventaris dapur mess</p>
      </div>

      {lowStock.length > 0 && (
        <div className="card border-amber-300 bg-amber-50">
          <h2 className="font-semibold text-amber-800 mb-2">⚠️ Stok Menipis</h2>
          <ul className="text-sm text-amber-700 list-disc pl-5">
            {lowStock.map((i) => (
              <li key={i.id}>
                {i.item} — sisa {i.qty} {i.unit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {canEdit && <StockForm />}

      <div className="card overflow-x-auto">
        <h2 className="font-semibold mb-3">Daftar Stok</h2>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada data stok.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Item</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{i.item}</td>
                  <td>
                    <span className={i.qty <= i.threshold ? 'text-amber-600 font-semibold' : ''}>
                      {i.qty}
                    </span>
                  </td>
                  <td>{i.unit}</td>
                  <td className="text-xs text-slate-500">
                    {new Date(i.lastUpdated).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
