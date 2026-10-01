import { useSyncExternalStore } from 'react';
import type { AppState, Harvest, Planting } from './types';

const KEY = 'sobat-cabe:v1';
const initial: AppState = { plantings: [], harvests: [], done: {}, settings: { notify: false, endHst: 180 } };

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return { ...initial, ...s, settings: { ...initial.settings, ...(s.settings ?? {}) } };
    }
  } catch { /* storage dapat diblokir */ }
  return initial;
}

let state: AppState = load();
const listeners = new Set<() => void>();

function set(next: AppState) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* abaikan */ }
  listeners.forEach((l) => l());
}

export const useStore = () =>
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => state);

export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export const actions = {
  addPlanting(p: Omit<Planting, 'id' | 'createdAt'>) {
    const planting: Planting = { ...p, id: uid(), createdAt: new Date().toISOString() };
    set({ ...state, plantings: [...state.plantings, planting] });
    return planting.id;
  },
  updatePlanting(id: string, patch: Partial<Planting>) {
    set({ ...state, plantings: state.plantings.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  },
  removePlanting(id: string) {
    const done = Object.fromEntries(Object.entries(state.done).filter(([k]) => !k.startsWith(id + ':')));
    set({ ...state, plantings: state.plantings.filter((p) => p.id !== id), harvests: state.harvests.filter((h) => h.plantingId !== id), done });
  },
  toggleDone(pid: string, key: string, date: string) {
    const k = `${pid}:${key}`;
    const done = { ...state.done };
    if (done[k]) delete done[k]; else done[k] = date;
    set({ ...state, done });
  },
  addHarvest(h: Omit<Harvest, 'id'>) { set({ ...state, harvests: [...state.harvests, { ...h, id: uid() }] }); },
  removeHarvest(id: string) { set({ ...state, harvests: state.harvests.filter((h) => h.id !== id) }); },
  setSettings(patch: Partial<AppState['settings']>) { set({ ...state, settings: { ...state.settings, ...patch } }); },
  exportJSON: () => JSON.stringify(state, null, 2),
  importJSON(text: string) {
    const s = JSON.parse(text);
    if (!Array.isArray(s.plantings)) throw new Error('Format berkas tidak valid');
    set({ ...initial, ...s, settings: { ...initial.settings, ...(s.settings ?? {}) } });
  },
  reset() { set(initial); }
};
