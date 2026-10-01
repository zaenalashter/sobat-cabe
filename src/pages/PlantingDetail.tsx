import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { actions, useStore } from '../lib/store';
import { CAT, buildSchedule, doneKey, hstNow, stageOf } from '../lib/schedule';
import { diffDays, fmt, todayISO } from '../lib/date';
import { Empty, PageHead, TaskCard } from '../components';
import { PlantingForm } from './Plantings';
import { nf, rp } from '../lib/calc';
import type { Category, Planting, Task } from '../lib/types';

type Tab = 'jadwal' | 'kalender' | 'panen' | 'info';
type Filter = 'next' | 'all' | 'done';

export default function PlantingDetail() {
  const { id } = useParams();
  const s = useStore();
  const nav = useNavigate();
  const p = s.plantings.find((x) => x.id === id);
  const [tab, setTab] = useState<Tab>('jadwal');
  const [filter, setFilter] = useState<Filter>('next');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [editing, setEditing] = useState(false);
  const today = todayISO();
  const tasks = useMemo(() => (p ? buildSchedule(p, s.settings.endHst) : []), [p, s.settings.endHst]);

  if (!p) return <><PageHead title="Lahan tidak ditemukan" /><Link className="btn" to="/lahan">Kembali</Link></>;

  const isDone = (t: Task) => !!s.done[doneKey(p.id, t.key)];
  const hst = hstNow(p, today);
  const shown = tasks.filter((t) => {
    if (cat !== 'all' && t.cat !== cat) return false;
    if (filter === 'done') return isDone(t);
    if (filter === 'next') return !isDone(t) && (t.date >= today || diffDays(today, t.date) <= 14);
    return true;
  });
  const firstUpcoming = shown.findIndex((t) => t.date >= today);

  return (
    <>
      <PageHead kicker={`${p.variety === 'rawit' ? 'Cabai rawit' : 'Cabai keriting'} · tanam ${fmt(p.plantDate)}`} title={p.name}>
        <div className="statline">
          <span className="pill big">{hst < 0 ? `H${hst}` : `${hst} HST`}</span>
          <span>{stageOf(hst)}</span>
        </div>
      </PageHead>
      <div className="tabs" role="tablist">
        {(['jadwal', 'kalender', 'panen', 'info'] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {{ jadwal: 'Jadwal', kalender: 'Kalender', panen: 'Panen', info: 'Info' }[t]}
          </button>
        ))}
      </div>

      {tab === 'jadwal' && (
        <>
          <div className="seg small-seg">
            {([['next', 'Belum'], ['all', 'Semua'], ['done', 'Selesai']] as [Filter, string][]).map(([f, l]) => (
              <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{l}</button>
            ))}
          </div>
          <div className="chips">
            <button className={'chipbtn' + (cat === 'all' ? ' on' : '')} onClick={() => setCat('all')}>Semua</button>
            {(Object.keys(CAT) as Category[]).map((c) => (
              <button key={c} className={'chipbtn' + (cat === c ? ' on' : '')} style={{ ['--c' as string]: CAT[c].color }} onClick={() => setCat(c)}>{CAT[c].label}</button>
            ))}
          </div>
          {shown.length === 0 && <Empty>Tidak ada tugas pada filter ini.</Empty>}
          {shown.map((t, i) => (
            <div key={t.key}>
              {i === firstUpcoming && filter !== 'done' && <div className="today-line"><span>Hari ini · {fmt(today, { day: 'numeric', month: 'short' })}</span></div>}
              <TaskCard task={t} today={today} done={isDone(t)} onToggle={() => actions.toggleDone(p.id, t.key, today)} />
            </div>
          ))}
        </>
      )}

      {tab === 'kalender' && <CalendarView tasks={tasks} hst={hst} isDone={isDone} />}

      {tab === 'panen' && <HarvestTab p={p} />}

      {tab === 'info' && (
        <>
          {editing ? (
            <section className="card">
              <PlantingForm initial={p} submitLabel="Simpan" onCancel={() => setEditing(false)}
                onSubmit={(v) => { actions.updatePlanting(p.id, v); setEditing(false); }} />
            </section>
          ) : (
            <section className="card">
              <dl className="dl">
                <dt>Tanggal tanam</dt><dd>{fmt(p.plantDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</dd>
                <dt>Jumlah tanaman</dt><dd>{nf(p.plants)}</dd>
                <dt>Lubang susulan</dt><dd>{p.holes} per tanaman</dd>
                <dt>Geser jadwal</dt><dd>{p.shift} hari</dd>
                <dt>Modal</dt><dd>{p.capital ? rp(p.capital) : '—'}</dd>
                <dt>Tugas opsional</dt><dd>{p.includeSaran ? 'Disertakan' : 'Tidak'}</dd>
              </dl>
              <div className="row">
                <button className="btn" onClick={() => setEditing(true)}>Ubah data</button>
                <button className="btn danger" onClick={() => { if (confirm(`Hapus “${p.name}” beserta catatan panen?`)) { actions.removePlanting(p.id); nav('/lahan'); } }}>Hapus lahan</button>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}

function CalendarView({ tasks, hst, isDone }: { tasks: Task[]; hst: number; isDone: (t: Task) => boolean }) {
  const MAX = 140;
  const rows: Category[] = ['kocor', 'susulan', 'fungisida', 'spray', 'panen'];
  const pos = (h: number) => `${(Math.max(0, Math.min(MAX, h)) / MAX) * 100}%`;
  return (
    <section className="card">
      <p className="muted small">Satu gambar seluruh musim (0–{MAX} HST). Titik terisi = sudah dikerjakan.</p>
      <div className="cal">
        {rows.map((r) => (
          <div className="cal-row" key={r}>
            <div className="cal-label">{CAT[r].label}</div>
            <div className="cal-track">
              {tasks.filter((t) => t.cat === r && t.hst >= 0 && t.hst <= MAX).map((t) => (
                <i key={t.key} title={`${t.title} · ${t.hst} HST`} className={'dot' + (isDone(t) ? ' on' : '')}
                  style={{ left: pos(t.hst), ['--c' as string]: CAT[r].color }} />
              ))}
              {hst >= 0 && hst <= MAX && <b className="now" style={{ left: pos(hst) }} />}
            </div>
          </div>
        ))}
        <div className="cal-axis">{[0, 20, 40, 60, 80, 100, 120, 140].map((n) => <span key={n} style={{ left: pos(n) }}>{n}</span>)}</div>
      </div>
      <h3 className="sec">Titik penting</h3>
      <ul className="prose-list">
        {tasks.filter((t) => ['tanam', 'persiapan', 'panen'].includes(t.cat) || /^(susulan|fungi|akar)/.test(t.key)).map((t) => (
          <li key={t.key}><b>{t.hst < 0 ? `H${t.hst}` : `${t.hst} HST`}</b> — {t.title} <span className="muted">({fmt(t.date, { day: 'numeric', month: 'short', year: 'numeric' })})</span></li>
        ))}
      </ul>
    </section>
  );
}

function HarvestTab({ p }: { p: Planting }) {
  const s = useStore();
  const list = s.harvests.filter((h) => h.plantingId === p.id).sort((a, b) => b.date.localeCompare(a.date));
  const [date, setDate] = useState(todayISO());
  const [kg, setKg] = useState('');
  const [price, setPrice] = useState('');
  const totalKg = list.reduce((a, h) => a + h.kg, 0);
  const revenue = list.reduce((a, h) => a + h.kg * (h.price ?? 0), 0);
  return (
    <>
      <section className="card">
        <div className="stats">
          <div><b>{list.length}</b><span>kali petik</span></div>
          <div><b>{nf(totalKg, 1)} kg</b><span>total hasil</span></div>
          <div><b>{rp(revenue)}</b><span>pendapatan</span></div>
        </div>
        {p.capital ? (
          <p className={'callout ' + (revenue >= p.capital ? 'ok' : 'info')}>
            Modal {rp(p.capital)} · {revenue >= p.capital ? `sudah balik modal, laba ${rp(revenue - p.capital)}` : `sisa ${rp(p.capital - revenue)} menuju balik modal`}
          </p>
        ) : <p className="muted small">Isi modal di tab Info untuk melihat balik modal.</p>}
      </section>
      <form className="card form" onSubmit={(e) => {
        e.preventDefault();
        const v = parseFloat(kg.replace(',', '.'));
        if (!v || v <= 0) return;
        actions.addHarvest({ plantingId: p.id, date, kg: v, price: price ? Number(price) : undefined });
        setKg('');
      }}>
        <h2 className="sec first">Catat petik</h2>
        <label>Tanggal<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        <label>Hasil (kg)<input inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="mis. 93" required /></label>
        <label>Harga (Rp/kg, opsional)<input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000–20000" /></label>
        <button className="btn primary" type="submit">Simpan</button>
      </form>
      {list.map((h, i) => (
        <div className="hrow" key={h.id}>
          <div><b>Petik ke-{list.length - i}</b><div className="muted small">{fmt(h.date)} · {diffDays(h.date, p.plantDate)} HST</div></div>
          <div className="right"><b>{nf(h.kg, 1)} kg</b>{h.price ? <div className="muted small">{rp(h.kg * h.price)}</div> : null}</div>
          <button className="x" aria-label="Hapus" onClick={() => actions.removeHarvest(h.id)}>×</button>
        </div>
      ))}
      <p className="muted small">Contoh SOP (1.200 tanaman): petik ke-4 93 kg · ke-5 85 kg · ke-6 86 kg · ke-7 100 kg+. Hasil di 920 mdpl bisa lebih rendah.</p>
    </>
  );
}
