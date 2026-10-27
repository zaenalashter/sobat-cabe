import type { Entry, Product } from './types';

export const unitPrice = (e: Entry) => (e.qty > 0 ? e.total / e.qty : 0);

export interface PriceStats {
  n: number; latest?: Entry; prev?: Entry; min?: Entry; max?: Entry; avg: number; history: Entry[];
}
export function statsFor(entries: Entry[], productId: string): PriceStats {
  const history = entries
    .filter((e) => e.productId === productId && e.qty > 0 && e.total > 0)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  if (!history.length) return { n: 0, avg: 0, history };
  let min = history[0], max = history[0], sum = 0;
  for (const e of history) { const u = unitPrice(e); sum += u; if (u < unitPrice(min)) min = e; if (u > unitPrice(max)) max = e; }
  return { n: history.length, latest: history[0], prev: history[1], min, max, avg: sum / history.length, history };
}

export type PriceSrc = 'catatan' | 'patokan' | 'none';
export function priceFor(p: Product, entries: Entry[]): { value: number; src: PriceSrc } {
  const st = statsFor(entries, p.id);
  if (st.latest) return { value: unitPrice(st.latest), src: 'catatan' };
  if (p.refLow && p.refHigh) return { value: (p.refLow + p.refHigh) / 2, src: 'patokan' };
  return { value: 0, src: 'none' };
}

export function fmtQty(q: number, unit: string): string {
  const f = (n: number, d = 1) => n.toLocaleString('id-ID', { maximumFractionDigits: d });
  if (unit === 'kg') return q < 1 ? `${f(q * 1000, 0)} g` : `${f(q)} kg`;
  if (unit === 'L') return q < 1 ? `${f(q * 1000, 0)} ml` : `${f(q)} L`;
  return `${f(q)} unit`;
}
