import { useState } from 'react';
import { PageHead } from '../components';
import { SDM_GRAM, baseFert, drench, nf, npkKg, portion } from '../lib/calc';
import { useStore } from '../lib/store';

export default function Calculator() {
  const s = useStore();
  const [plants, setPlants] = useState(String(s.plantings[0]?.plants ?? 1000));
  const [holes, setHoles] = useState(String(s.plantings[0]?.holes ?? 1));
  const [ml, setMl] = useState('75');
  const n = Math.max(0, parseInt(plants) || 0);
  const h = Math.max(1, parseInt(holes) || 1);
  const m = Math.min(200, Math.max(10, parseInt(ml) || 75));
  const d = drench(n, m);
  const npk = npkKg(n, h);
  const bf = baseFert(n);
  const h1 = drench(n, 150);

  return (
    <>
      <PageHead back={{ to: '/panduan', label: 'Panduan' }} kicker="Alat bantu" title="Kalkulator kebutuhan" />
      <section className="card form">
        <label>Jumlah tanaman<input type="number" inputMode="numeric" min={0} value={plants} onChange={(e) => setPlants(e.target.value)} /></label>
        <label>Lubang susulan / tanaman
          <select value={holes} onChange={(e) => setHoles(e.target.value)}><option value="1">1</option><option value="2">2</option></select>
        </label>
        <label>Volume kocor (ml/lubang tanam) <small>SOP: 50–100 ml</small>
          <input type="number" inputMode="numeric" min={50} max={100} value={ml} onChange={(e) => setMl(e.target.value)} />
        </label>
      </section>

      <Calc title="Kocor akar (5/10/15 HST) — per aplikasi" rows={[
        ['Larutan', `${nf(d.liters, 1)} L (≈ ${d.tanks} tangki 20 L)`],
        ['Mordenfol (100 ml/20 L)', `±${nf(portion(100, d.liters))} ml`],
        ['Asam amino (50 ml/20 L)', `±${nf(portion(50, d.liters))} ml`]
      ]} note="Kalikan 3 untuk seluruh kocor akar." />
      <Calc title="Pupuk susulan (20/40/60/80 HST) — per aplikasi" rows={[
        ['NPK tabur', `±${nf(npk.low, 1)}–${nf(npk.high, 1)} kg (${h} sdm/tanaman)`],
        ['Total 4 kali', `±${nf(npk.low * 4, 1)}–${nf(npk.high * 4, 1)} kg`]
      ]} note={`Dasar: 1 sdm ≈ 12–15 g (dipakai ${SDM_GRAM} g). Timbang sendok Anda untuk ketepatan.`} />
      <Calc title="Fungisida kocor (21/41/61/81 HST) — per aplikasi" rows={[
        ['Larutan', `${nf(d.liters, 1)} L`],
        ['Mankozeb (2 sdm/20 L)', `±${nf((2 * d.liters) / 20, 1)} sdm`],
        ['Total 4 kali', `±${nf((8 * d.liters) / 20, 1)} sdm`]
      ]} note="Aduk terus; jangan simpan sisa larutan." />
      <Calc title="Kocor agen hayati H-1 (±150 ml/lubang)" rows={[
        ['Larutan', `${nf(h1.liters, 1)} L (≈ ${h1.tanks} tangki 20 L)`],
        ['Trichoderma (2 sdm/20 L)', `±${nf(portion(2, h1.liters), 1)} sdm`],
        ['Silica Carbon (1 sdm/20 L)', `±${nf(portion(1, h1.liters), 1)} sdm`],
        ['Powersoil (2 sdm/20 L)', `±${nf(portion(2, h1.liters), 1)} sdm`]
      ]} />
      <Calc title="Pupuk dasar (skala dari SOP 1.200 tanaman)" rows={[
        ['Kandang kambing matang', `±${nf(bf.kandangKg)} kg (±${nf(bf.sak, 1)} sak)`],
        ['Phonska', `${nf(bf.phonskaKg, 1)} kg`],
        ['SP-36', `${nf(bf.sp36Kg, 1)} kg`]
      ]} note="Dolomit 100–150 kg/1.000 m² hanya bila pH < 5,5." />
    </>
  );
}

function Calc({ title, rows, note }: { title: string; rows: string[][]; note?: string }) {
  return (
    <section className="card">
      <h2 className="sec first">{title}</h2>
      <dl className="dl">{rows.map(([a, b]) => <><dt key={a}>{a}</dt><dd key={a + 'd'}>{b}</dd></>)}</dl>
      {note && <p className="muted small">{note}</p>}
    </section>
  );
}
