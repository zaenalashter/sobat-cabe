import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { actions, useStore } from '../lib/store';
import { hstNow, stageOf } from '../lib/schedule';
import { fmt, todayISO } from '../lib/date';
import { Empty, PageHead } from '../components';
import type { Planting, Variety } from '../lib/types';

export function PlantingForm({ initial, onSubmit, onCancel, submitLabel }: {
  initial?: Partial<Planting>; onSubmit: (p: Omit<Planting, 'id' | 'createdAt'>) => void; onCancel?: () => void; submitLabel: string;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [variety, setVariety] = useState<Variety>(initial?.variety ?? 'rawit');
  const [plantDate, setPlantDate] = useState(initial?.plantDate ?? todayISO());
  const [plants, setPlants] = useState(String(initial?.plants ?? 1000));
  const [holes, setHoles] = useState<1 | 2>(initial?.holes ?? 1);
  const [shift, setShift] = useState(String(initial?.shift ?? 0));
  const [saran, setSaran] = useState(initial?.includeSaran ?? true);
  const [tanks, setTanks] = useState(initial?.sprayTanks ? String(initial.sprayTanks) : '');
  const [capital, setCapital] = useState(initial?.capital ? String(initial.capital) : '');

  const pickVariety = (v: Variety) => {
    setVariety(v);
    if (initial?.shift === undefined && v === 'rawit') setShift('0');
  };

  return (
    <form className="form" onSubmit={(e) => {
      e.preventDefault();
      onSubmit({
        name: name.trim() || 'Lahan baru', variety, plantDate, plants: Math.max(1, parseInt(plants) || 1), holes,
        shift: parseInt(shift) || 0, includeSaran: saran, capital: capital ? Number(capital) : undefined,
        sprayTanks: tanks ? Math.max(1, parseInt(tanks)) : undefined
      });
    }}>
      <label>Nama lahan / bedengan
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Blok A — Ori 212" required />
      </label>
      <div className="seg" role="radiogroup" aria-label="Jenis cabai">
        {(['rawit', 'keriting'] as Variety[]).map((v) => (
          <button type="button" key={v} className={variety === v ? 'on' : ''} onClick={() => pickVariety(v)}>
            {v === 'rawit' ? 'Cabai rawit' : 'Cabai keriting'}
          </button>
        ))}
      </div>
      <label>Tanggal tanam (0 HST)
        <input type="date" value={plantDate} onChange={(e) => setPlantDate(e.target.value)} required />
      </label>
      <label>Jumlah tanaman
        <input type="number" inputMode="numeric" min={1} value={plants} onChange={(e) => setPlants(e.target.value)} required />
      </label>
      <div className="seg" role="radiogroup" aria-label="Lubang susulan">
        {([1, 2] as const).map((h) => (
          <button type="button" key={h} className={holes === h ? 'on' : ''} onClick={() => setHoles(h)}>{h} lubang susulan</button>
        ))}
      </div>
      <label>Geser jadwal pasca-tanam (hari)
        <input type="number" inputMode="numeric" value={shift} onChange={(e) => setShift(e.target.value)} />
        <small>Basis jadwal = cabai rawit. Keriting berfase generatif lebih cepat; Mas Udin menganjurkan jadwal “dimajukan” sesuai kondisi tanaman — isi negatif (mis. -5) untuk memajukan. Tidak menggeser tugas sebelum tanam.</small>
      </label>
      <label>Tangki spray 16 L per aplikasi (opsional)
        <input type="number" inputMode="numeric" min={1} value={tanks} onChange={(e) => setTanks(e.target.value)} placeholder="otomatis ±1 per 300 tanaman" />
        <small>Dipakai untuk menghitung total bahan spray di daftar belanja. Sesuaikan dengan hasil semprot nyata Anda.</small>
      </label>
      <label>Modal (Rp, opsional)
        <input type="number" inputMode="numeric" min={0} value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="3570000" />
      </label>
      <label className="check-row">
        <input type="checkbox" checked={saran} onChange={(e) => setSaran(e.target.checked)} />
        <span>Sertakan tugas opsional “saran” (kocor pemulihan hayati 28/48/68 HST)</span>
      </label>
      <div className="row">
        <button className="btn primary" type="submit">{submitLabel}</button>
        {onCancel && <button type="button" className="btn" onClick={onCancel}>Batal</button>}
      </div>
    </form>
  );
}

export default function Plantings() {
  const s = useStore();
  const nav = useNavigate();
  const [q, setQ] = useSearchParams();
  const adding = q.get('baru') === '1' || s.plantings.length === 0;
  const today = todayISO();

  return (
    <>
      <PageHead kicker="Kebun" title="Lahan & jadwal tanam">
        {!adding && <button className="btn primary" onClick={() => setQ({ baru: '1' })}>+ Tambah lahan</button>}
      </PageHead>
      {adding && (
        <section className="card">
          <h2 className="sec first">Lahan baru</h2>
          <PlantingForm submitLabel="Buat jadwal" onCancel={s.plantings.length ? () => setQ({}) : undefined}
            onSubmit={(p) => { const id = actions.addPlanting(p); nav(`/lahan/${id}`); }} />
        </section>
      )}
      {!adding && !s.plantings.length && <Empty>Belum ada lahan.</Empty>}
      {s.plantings.map((p) => {
        const hst = hstNow(p, today);
        return (
          <Link key={p.id} to={`/lahan/${p.id}`} className="plot">
            <div className="plot-top"><b>{p.name}</b><span className="pill">{hst < 0 ? `H${hst}` : `${hst} HST`}</span></div>
            <div className="muted">Tanam {fmt(p.plantDate)} · {p.variety === 'rawit' ? 'Rawit' : 'Keriting'} · {p.plants.toLocaleString('id-ID')} tanaman</div>
            <div className="muted small">{stageOf(hst)}</div>
          </Link>
        );
      })}
    </>
  );
}
