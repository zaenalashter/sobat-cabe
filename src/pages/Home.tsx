import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { actions, useStore } from '../lib/store';
import { buildSchedule, doneKey, hstNow, stageOf } from '../lib/schedule';
import { addDays, diffDays, fmt, todayISO } from '../lib/date';
import { Empty, PageHead, TaskCard } from '../components';
import type { Task } from '../lib/types';

export default function Home() {
  const s = useStore();
  const today = todayISO();
  const rows = useMemo(
    () => s.plantings.map((p) => ({ p, tasks: buildSchedule(p, s.settings.endHst) })),
    [s.plantings, s.settings.endHst]
  );

  if (!s.plantings.length)
    return (
      <>
        <PageHead kicker="Sobat Cabe · Metode Mas Udin" title="Selamat datang" />
        <Empty>
          <p>Aplikasi ini menyusun jadwal kocor, pupuk susulan, fungisida, dan spray cabai Ori 212 dari <b>tanggal tanam</b> Anda — lengkap dengan dosis per jumlah tanaman.</p>
          <Link to="/lahan?baru=1" className="btn primary">+ Tambah lahan pertama</Link>
          <p className="muted">Mau baca dulu? Buka <Link to="/panduan">Panduan</Link>.</p>
        </Empty>
      </>
    );

  type Item = { pid: string; pname: string; t: Task };
  const dueNow: Item[] = [];
  const soon: Item[] = [];
  for (const { p, tasks } of rows)
    for (const t of tasks) {
      const done = !!s.done[doneKey(p.id, t.key)];
      const d = diffDays(t.date, today);
      if (!done && d <= 0 && d >= -14) dueNow.push({ pid: p.id, pname: p.name, t });
      else if (d > 0 && d <= 7) soon.push({ pid: p.id, pname: p.name, t });
    }
  const byDate = (a: Item, b: Item) => a.t.date.localeCompare(b.t.date);
  dueNow.sort(byDate); soon.sort(byDate);

  const card = (i: Item) => (
    <TaskCard key={i.pid + i.t.key} task={i.t} planting={i.pname} today={today}
      done={!!s.done[doneKey(i.pid, i.t.key)]} onToggle={() => actions.toggleDone(i.pid, i.t.key, today)} />
  );

  return (
    <>
      <PageHead kicker={fmt(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} title="Tugas hari ini" />
      <section className="plots">
        {rows.map(({ p, tasks }) => {
          const hst = hstNow(p, today);
          const total = tasks.filter((t) => !t.optional).length;
          const done = tasks.filter((t) => s.done[doneKey(p.id, t.key)]).length;
          const nxt = tasks.find((t) => t.date >= today && !s.done[doneKey(p.id, t.key)]);
          return (
            <Link key={p.id} to={`/lahan/${p.id}`} className="plot">
              <div className="plot-top"><b>{p.name}</b><span className="pill">{hst < 0 ? `H${hst}` : `${hst} HST`}</span></div>
              <div className="muted">{stageOf(hst)} · {p.variety === 'rawit' ? 'Rawit' : 'Keriting'} · {p.plants.toLocaleString('id-ID')} tanaman</div>
              <div className="bar"><i style={{ width: `${Math.min(100, (done / total) * 100)}%` }} /></div>
              <div className="muted small">{done}/{total} tugas selesai{nxt ? ` · berikut: ${nxt.title} (${fmt(nxt.date, { day: 'numeric', month: 'short' })})` : ''}</div>
            </Link>
          );
        })}
      </section>

      <h2 className="sec">Perlu dikerjakan {dueNow.length > 0 && <span className="count">{dueNow.length}</span>}</h2>
      {dueNow.length ? dueNow.map(card) : <Empty>Tidak ada tugas tertunggak. 🎉</Empty>}

      <h2 className="sec">7 hari ke depan</h2>
      {soon.length ? soon.map(card) : <Empty>Tidak ada jadwal dalam 7 hari ke depan.</Empty>}
      <p className="muted small center">Sampai {fmt(addDays(today, 7), { day: 'numeric', month: 'long' })}</p>
    </>
  );
}
