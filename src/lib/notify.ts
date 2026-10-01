import { useEffect } from 'react';
import { useStore } from './store';
import { buildSchedule, doneKey } from './schedule';
import { todayISO } from './date';

/** Pengingat lokal saat aplikasi dibuka (tanpa server push). */
export function useDueNotifications() {
  const s = useStore();
  useEffect(() => {
    if (!s.settings.notify || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const today = todayISO();
    const flag = 'sobat-cabe:notified';
    try { if (localStorage.getItem(flag) === today) return; } catch { /* abaikan */ }
    const due: string[] = [];
    for (const p of s.plantings)
      for (const t of buildSchedule(p, s.settings.endHst))
        if (t.date === today && !s.done[doneKey(p.id, t.key)]) due.push(`${p.name}: ${t.title}`);
    if (!due.length) return;
    try { localStorage.setItem(flag, today); } catch { /* abaikan */ }
    const body = due.slice(0, 4).join('\n') + (due.length > 4 ? `\n+${due.length - 4} lainnya` : '');
    navigator.serviceWorker?.ready
      .then((r) => r.showNotification('Tugas cabai hari ini', { body, icon: '/icons/icon-192.png', tag: 'due' }))
      .catch(() => new Notification('Tugas cabai hari ini', { body }));
  }, [s.plantings, s.done, s.settings]);
}

export async function requestNotify(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  return (await Notification.requestPermission()) === 'granted';
}
