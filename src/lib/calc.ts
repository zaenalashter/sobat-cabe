import type { Planting } from './types';

export const ML_PER_HOLE = 75; // tengah 50–100 ml/lubang (SOP)
export const SDM_GRAM = 13.5; // 1 sdm NPK granul ≈ 12–15 g (perkiraan)

export const nf = (n: number, d = 0) =>
  n.toLocaleString('id-ID', { maximumFractionDigits: d, minimumFractionDigits: 0 });
export const rp = (n: number) => 'Rp ' + nf(Math.round(n));

/** Larutan kocor (liter) untuk sejumlah tanaman. */
export const drenchLiters = (plants: number, mlPerHole = ML_PER_HOLE) => (plants * mlPerHole) / 1000;
export const tanks = (liters: number, tank = 20) => Math.max(1, Math.ceil(liters / tank - 1e-9));

export interface DrenchCalc { liters: number; tanks: number; perTankLiters: number }
export function drench(plants: number, mlPerHole = ML_PER_HOLE, tank = 20): DrenchCalc {
  const liters = drenchLiters(plants, mlPerHole);
  return { liters, tanks: tanks(liters, tank), perTankLiters: tank };
}

/** Bahan sesuai porsi larutan: dosis per tangki × (liter / tangki). */
export const portion = (dosePerTank: number, liters: number, tank = 20) => (dosePerTank * liters) / tank;

export function npkKg(plants: number, holes: number) {
  const gram = plants * holes * SDM_GRAM;
  return { low: (plants * holes * 12) / 1000, high: (plants * holes * 15) / 1000, mid: gram / 1000 };
}

/** Pupuk dasar SOP: 10 sak kandang(±200kg), 25 kg Phonska, 50 kg SP-36 per 1.200 tanaman. */
export function baseFert(plants: number) {
  const f = plants / 1200;
  return { kandangKg: 200 * f, sak: 10 * f, phonskaKg: 25 * f, sp36Kg: 50 * f };
}

export const holesOf = (p: Planting) => p.holes;
