import type { Category, Planting, Source, Task } from './types';
import { addDays, diffDays, todayISO } from './date';
import { baseFert, drench, nf, npkKg, portion } from './calc';

export const CAT: Record<Category, { label: string; color: string }> = {
  persiapan: { label: 'Persiapan', color: '#6b4a34' },
  tanam: { label: 'Tanam', color: '#1f3a2e' },
  kocor: { label: 'Kocor akar', color: '#4f7c45' },
  susulan: { label: 'Pupuk susulan', color: '#c08a2b' },
  fungisida: { label: 'Fungisida kocor', color: '#a8332a' },
  spray: { label: 'Spray daun', color: '#2c5a8a' },
  perawatan: { label: 'Perawatan', color: '#7a6a3a' },
  panen: { label: 'Panen', color: '#a8332a' }
};

type Draft = Omit<Task, 'hst' | 'date' | 'baseHst'>;

/** Jadwal lengkap berdasarkan Panduan Mas Udin Edisi 3 (basis cabai rawit, 920 mdpl). */
export function buildSchedule(p: Planting, endHst = 180): Task[] {
  const out: Task[] = [];
  // Tugas sebelum tanam tidak ikut digeser; setelah tanam digeser sesuai `shift`.
  const add = (baseHst: number, d: Draft) => {
    if (d.optional && !p.includeSaran) return;
    const hst = baseHst <= 0 ? baseHst : Math.max(1, baseHst + p.shift);
    out.push({ ...d, baseHst, hst, date: addDays(p.plantDate, hst) });
  };
  const S = (...s: Source[]) => s;

  // ---- Persiapan ----
  const bf = baseFert(p.plants);
  add(-14, {
    key: 'olah', cat: 'persiapan', title: 'Olah tanah, cek pH & bentuk bedengan', method: 'Lahan',
    items: [
      'Bajak 30–40 cm, jemur 7–14 hari untuk memutus siklus patogen',
      'Cek pH, target 5,5–6,8. Bila < 5,5 beri dolomit 100–150 kg/1.000 m²',
      'Bentuk bedengan lebar 100–120 cm, tinggi 30–40 cm + parit'
    ],
    note: 'Lahan 920 mdpl lembap: bedengan tinggi agar air hujan cepat pergi.', sources: S('SOP', '920')
  });
  add(-7, {
    key: 'dasar', cat: 'persiapan', title: 'Pupuk dasar & fermentasi di bedengan', method: 'Tabur + semprot',
    items: [
      `Kandang kambing MATANG ±${nf(bf.kandangKg)} kg (±${nf(bf.sak, 1)} sak)`,
      `Phonska ${nf(bf.phonskaKg, 1)} kg · SP-36 ${nf(bf.sp36Kg, 1)} kg`,
      'Semprot M21/EM4 5 tutup + molase 5 tutup per 20 L air',
      'Tutup mulsa, tunggu rumput tumbuh di sela bedengan (3–7 hari)'
    ],
    note: 'Dosis diskalakan dari SOP 1.200 tanaman. Kandang mentah = panas & membawa patogen.', sources: S('SOP')
  });
  const h1 = drench(p.plants, 150);
  add(-1, {
    key: 'hayati', cat: 'persiapan', title: 'Kocor agen hayati di lubang tanam (H-1)', method: 'Kocor lubang tanam',
    items: [
      `Per 20 L air: Trichoderma 2 sdm + Silica Carbon 1 sdm + Powersoil 2 sdm`,
      `Perkiraan ${nf(h1.liters, 1)} L larutan (±100–200 ml/lubang) ≈ ${h1.tanks} tangki 20 L`,
      'Larutkan bertahap, aduk perlahan, pakai dalam 2–4 jam'
    ],
    note: 'Jangan campur dengan fungisida/insektisida kimia. Tanam 1–2 hari setelah kocor.', sources: S('SOP', 'SARAN')
  });
  add(0, {
    key: 'tanam', cat: 'tanam', title: 'Pindah tanam bibit', method: 'Lubang tanam',
    items: [
      'Bibit umur 21–28 hari, 4–5 daun sejati',
      'Jarak 60×70 – 70×80 cm (saran 920 mdpl)',
      'Tanam sore atau pagi sebelum jam 9, siram secukupnya',
      `Siapkan ${p.holes} lubang susulan di samping tiap tanaman (±10–15 cm)`
    ],
    note: 'Opsional: celup akar ke PGPR sebelum tanam (tanpa fungisida).', sources: S('SOP', '920', 'SARAN')
  });
  // Tugas pasca tanam tidak boleh digeser sebelum HST 0 → pakai baseHst langsung
  add(7, {
    key: 'ajir', cat: 'perawatan', title: 'Pasang ajir', method: 'Perawatan',
    items: ['Pasang ajir ±1 minggu setelah tanam'], sources: S('SOP')
  });
  add(25, {
    key: 'ikat', cat: 'perawatan', title: 'Ikat batang ke ajir', method: 'Perawatan',
    items: ['Ikat batang saat 25–30 HST', 'Musim hujan: JANGAN rempel tunas, cukup pangkas daun tua bagian bawah'],
    sources: S('SOP')
  });

  // ---- Kocor akar 5/10/15 ----
  const k = drench(p.plants);
  [5, 10, 15].forEach((d, i) =>
    add(d, {
      key: `akar${i + 1}`, cat: 'kocor', title: `Kocor akar ${i + 1}/3`, method: 'Kocor lubang tanam',
      items: [
        'Per 20 L air: Mordenfol 100 ml + asam amino 50 ml',
        `Kocor 50–100 ml per lubang tanam (≈ ${nf(k.liters, 1)} L untuk ${nf(p.plants)} tanaman, ${k.tanks} tangki)`,
        `Total: Mordenfol ±${nf(portion(100, k.liters))} ml, asam amino ±${nf(portion(50, k.liters))} ml`
      ],
      note: 'Persis 3 kali saja, tidak perlu mingguan.', sources: S('SOP')
    })
  );

  // ---- Susulan & fungisida ----
  const npk = npkKg(p.plants, p.holes);
  const fl = drench(p.plants);
  [20, 40, 60, 80].forEach((d, i) => {
    add(d, {
      key: `susulan${i + 1}`, cat: 'susulan', title: `Pupuk susulan ${i + 1}/4`, method: 'Lubang susulan (samping)',
      items: [
        `NPK Mutiara 16-16-16 (atau NPK+TE): 1 sdm/lubang × ${p.holes} lubang`,
        `Total ±${nf(npk.low, 1)}–${nf(npk.high, 1)} kg untuk ${nf(p.plants)} tanaman`,
        'Musim kemarau: kocor 3 sdm NPK / 16 L air'
      ],
      note: 'Bukan di lubang tanam. Besok: fungisida kocor.', sources: S('SOP')
    });
    add(d + 1, {
      key: `fungi${i + 1}`, cat: 'fungisida', title: `Fungisida kocor ${i + 1}/4`, method: 'Kocor lubang tanam',
      items: [
        'Mankozeb 2 sdm per 16–20 L air (aduk terus)',
        `Kocor 50–100 ml/lubang tanam ≈ ${nf(fl.liters, 1)} L larutan, mankozeb ±${nf((2 * fl.liters) / 20, 1)} sdm`,
        i === 3 ? 'Tanaman sudah tua / tekanan penyakit tinggi: boleh Cabrio Top sesuai label' : 'Hanya di lubang tanam, bukan seluruh bedengan',
        'APD: masker, sarung tangan, lengan panjang. Jangan simpan sisa larutan'
      ],
      note: 'Jeda ≥ 7 hari dari kocor agen hayati.', sources: S('SOP')
    });
  });
  // Pemulihan hayati (opsional)
  [28, 48, 68].forEach((d, i) =>
    add(d, {
      key: `pulih${i + 1}`, cat: 'kocor', optional: true, title: 'Kocor pemulihan hayati (opsional)', method: 'Kocor lubang tanam',
      items: ['Trichoderma / M21 ringan, 7–10 hari setelah fungisida kocor', 'Jangan dalam satu tangki dengan fungisida'],
      note: 'Saran untuk memulihkan mikroba zona akar.', sources: S('SARAN')
    })
  );

  // ---- Spray vegetatif 15 → 45 tiap 4 hari ----
  for (let d = 15; d < 45; d += 4)
    add(d, {
      key: `spv${d}`, cat: 'spray', title: 'Spray vegetatif', method: 'Spray pagi (06–09)',
      items: ['Per 16 L air: abamektin 10–20 ml + asam amino 50 ml', 'Sasar bawah daun & pucuk (thrips/tungau)'],
      note: 'Ganti bahan aktif insektisida secara bergilir agar hama tidak kebal.', sources: S('SOP')
    });

  // ---- Spray generatif 45 → akhir, Cal-Ha & Vitaron bergantian ±2 minggu ----
  for (let d = 45; d <= endHst; d += 4) {
    const cal = Math.floor((d - 45) / 14) % 2 === 0;
    add(d, {
      key: `spg${d}`, cat: 'spray', title: `Spray generatif · ${cal ? 'Cal-Ha' : 'Vitaron SL'}`, method: 'Spray pagi (06–09)',
      items: [
        'Per 16 L air: Kalinet 100 ml + insektisida 20 ml',
        cal ? '+ Cal-Ha 2 sdm' : '+ Vitaron SL 25 ml',
        'Cal-Ha & Vitaron SL bergantian (rolling), masing-masing ±2 minggu'
      ],
      note: 'Jangan campur Cal-Ha dengan Mordenfol. Uji campuran dulu di gelas bening.', sources: S('SOP')
    });
  }
  add(85, {
    key: 'aa85', cat: 'spray', title: 'Spray asam amino (85 HST)', method: 'Spray pagi',
    items: ['Asam amino untuk membantu pemulihan tanaman tua'], sources: S('SOP')
  });
  add(88, {
    key: 'mz-merah', cat: 'spray', title: 'Mankozeb menjelang buah merah', method: 'Spray pagi',
    items: ['Mankozeb 2 sdm / 16 L air', 'Cek interval aman panen (PHI) di label sebelum petik'],
    note: 'Sesuaikan tanggal dengan kondisi buah di lahan Anda.', sources: S('SOP')
  });
  add(95, {
    key: 'panen1', cat: 'panen', title: 'Perkiraan panen pertama (95–115 HST)', method: 'Panen',
    items: ['Petik tiap 3–5 hari, 15–20 kali petik (±4–6 bulan)', 'Catat hasil di tab Panen', 'Buang buah busuk/patek, rawat luka petik'],
    note: 'Dataran rendah ±85–90 HST; di 920 mdpl lebih lambat.', sources: S('920', 'SOP')
  });

  return out.sort((a, b) => a.hst - b.hst || a.key.localeCompare(b.key));
}

export const doneKey = (pid: string, key: string) => `${pid}:${key}`;

export function stageOf(hst: number): string {
  if (hst < 0) return 'Persiapan lahan';
  if (hst < 15) return 'Adaptasi & perakaran';
  if (hst < 45) return 'Vegetatif';
  if (hst < 95) return 'Generatif (berbunga & berbuah)';
  return 'Masa panen';
}

export const hstNow = (p: Planting, today = todayISO()) => diffDays(today, p.plantDate);
