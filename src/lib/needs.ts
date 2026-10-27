import type { Planting } from './types';
import { baseFert, drench, npkKg } from './calc';
import { buildSchedule } from './schedule';

export const SDM_POWDER_KG = 0.0125; // 1 sdm serbuk ≈ 12,5 g (perkiraan; PDF: 2 sdm mankozeb ≈ 20–30 g)
export const defSprayTanks = (plants: number) => Math.max(1, Math.round(plants / 300));

export interface Need { productId: string; qty: number; basis: string[] }

/** Kebutuhan bahan satu musim sesuai jadwal. Total spray bergantung pada jumlah tangki per aplikasi (perkiraan). */
export function seasonNeeds(p: Planting, endHst: number): Need[] {
  const tasks = buildSchedule(p, endHst);
  const tk = p.sprayTanks ?? defSprayTanks(p.plants);
  const map = new Map<string, Need>();
  const add = (productId: string, qty: number, basis: string) => {
    const n = map.get(productId) ?? { productId, qty: 0, basis: [] };
    n.qty += qty; n.basis.push(basis); map.set(productId, n);
  };
  const cnt = (re: RegExp) => tasks.filter((t) => re.test(t.key)).length;

  const bf = baseFert(p.plants);
  add('kandang', bf.kandangKg, 'Pupuk dasar');
  add('phonska', bf.phonskaKg, 'Pupuk dasar');
  add('sp36', bf.sp36Kg, 'Pupuk dasar');

  const h1 = drench(p.plants, 150).liters;
  add('trichoderma', (2 * h1 * SDM_POWDER_KG) / 20, 'Kocor H-1 (2 sdm/20 L)');
  add('silica', (1 * h1 * SDM_POWDER_KG) / 20, 'Kocor H-1 (1 sdm/20 L)');
  add('powersoil', (2 * h1 * SDM_POWDER_KG) / 20, 'Kocor H-1 (2 sdm/20 L)');

  const k = drench(p.plants).liters;
  add('mordenfol', (3 * 100 * k) / 20 / 1000, 'Kocor akar 3× (100 ml/20 L)');
  add('amino', (3 * 50 * k) / 20 / 1000, 'Kocor akar 3× (50 ml/20 L)');

  add('npk', cnt(/^susulan/) * npkKg(p.plants, p.holes).mid, `Susulan ${cnt(/^susulan/)}× (${p.holes} sdm/tanaman)`);
  add('mankozeb', (cnt(/^fungi/) * 2 * k * SDM_POWDER_KG) / 20, `Fungisida kocor ${cnt(/^fungi/)}× (2 sdm/20 L)`);

  const nv = cnt(/^spv/), ng = tasks.filter((t) => /^spg/.test(t.key)).length;
  const nCal = tasks.filter((t) => /^spg/.test(t.key) && t.title.includes('Cal-Ha')).length;
  const nVit = ng - nCal;
  add('abamektin', (nv * tk * 15) / 1000, `Spray vegetatif ${nv}× × ${tk} tangki (15 ml/16 L)`);
  add('amino', (nv * tk * 50) / 1000, `Spray vegetatif ${nv}× (50 ml/16 L)`);
  add('kalinet', (ng * tk * 100) / 1000, `Spray generatif ${ng}× × ${tk} tangki (100 ml/16 L)`);
  add('insektisida', (ng * tk * 20) / 1000, `Spray generatif ${ng}× (20 ml/16 L)`);
  add('calha', nCal * tk * 2 * SDM_POWDER_KG, `Cal-Ha ${nCal}× (2 sdm/16 L)`);
  add('vitaron', (nVit * tk * 25) / 1000, `Vitaron SL ${nVit}× (25 ml/16 L)`);
  add('amino', (tk * 50) / 1000, 'Spray 85 HST');
  add('mankozeb', tk * 2 * SDM_POWDER_KG, 'Spray menjelang merah (2 sdm/16 L)');
  return [...map.values()];
}
