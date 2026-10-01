const DAY = 86400000;

export function parse(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function toISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export const todayISO = () => toISO(new Date());
export function addDays(iso: string, n: number): string {
  const d = parse(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
export function diffDays(a: string, b: string): number {
  return Math.round((parse(a).getTime() - parse(b).getTime()) / DAY);
}
export function fmt(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return parse(iso).toLocaleDateString('id-ID', opts);
}
export const fmtShort = (iso: string) => fmt(iso, { weekday: 'short', day: 'numeric', month: 'short' });
export function relative(iso: string, today = todayISO()): string {
  const d = diffDays(iso, today);
  if (d === 0) return 'Hari ini';
  if (d === 1) return 'Besok';
  if (d === -1) return 'Kemarin';
  return d > 0 ? `${d} hari lagi` : `${-d} hari lalu`;
}
