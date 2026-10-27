import { useSyncExternalStore } from 'react';

export type Theme = 'system' | 'light' | 'dark';
const KEY = 'sobat-cabe:theme';
const subs = new Set<() => void>();

const read = (): Theme => {
  try { const v = localStorage.getItem(KEY); if (v === 'light' || v === 'dark') return v; } catch { /* abaikan */ }
  return 'system';
};
let theme: Theme = read();

export function applyTheme(t: Theme = theme) {
  const root = document.documentElement;
  if (t === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#101a15' : '#5dbb8c');
}
export function setTheme(t: Theme) {
  theme = t;
  try { t === 'system' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, t); } catch { /* abaikan */ }
  applyTheme(t);
  subs.forEach((f) => f());
}
export const useTheme = () => useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => theme);
export const isDarkNow = (t: Theme) => t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
