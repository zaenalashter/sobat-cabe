import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { isDarkNow, setTheme, useTheme } from './lib/theme';
import type { Source, Task } from './lib/types';
import { CAT } from './lib/schedule';
import type { Block } from './data/guide';
import { fmtShort, relative } from './lib/date';

const SRC: Record<Source, { label: string; cls: string }> = {
  SOP: { label: 'SOP ASLI', cls: 'b-sop' },
  SARAN: { label: 'SARAN', cls: 'b-saran' },
  '920': { label: '920 MDPL', cls: 'b-920' }
};

export const Badge = ({ s }: { s: Source }) => <span className={'badge ' + SRC[s].cls}>{SRC[s].label}</span>;

export function PageHead({ kicker, title, back, children }: { kicker?: string; title: string; back?: { to: string; label: string }; children?: ReactNode }) {
  const theme = useTheme();
  const dark = isDarkNow(theme);
  return (
    <header className="hero">
      <button className="theme-btn" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}>
        {dark ? '☀' : '☾'}
      </button>
      {back && <Link to={back.to} className="back">‹ {back.label}</Link>}
      {kicker && <div className="kicker">{kicker}</div>}
      <h1>{title}</h1>
      {children}
    </header>
  );
}

const ICONS: Record<string, string> = {
  home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
  sprout: 'M12 21v-8m0 0c0-4 3-6 7-6 0 4-3 6-7 6zm0 2c0-3-2.5-5-6-5 0 3 2.5 5 6 5z',
  cart: 'M3 4h2l2.4 11h10.2L20 8H6.5M9 20h.01M17 20h.01',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zM8 7h8',
  sliders: 'M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4'
};
export const Icon = ({ n }: { n: keyof typeof ICONS }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={ICONS[n]} /></svg>
);

export function TaskCard({
  task, done, onToggle, planting, today
}: { task: Task; done: boolean; onToggle: () => void; planting?: string; today: string }) {
  const [open, setOpen] = useState(false);
  const c = CAT[task.cat];
  const overdue = !done && task.date < today;
  return (
    <article className={'task' + (done ? ' done' : '') + (overdue ? ' late' : '')} style={{ ['--c' as string]: c.color }}>
      <div className="task-row">
        <button className="check" onClick={onToggle} aria-label={done ? 'Tandai belum selesai' : 'Tandai selesai'} aria-pressed={done}>
          {done ? '✓' : ''}
        </button>
        <button className="task-main" onClick={() => setOpen(!open)} aria-expanded={open}>
          <div className="task-meta">
            <span className="chip" style={{ background: c.color }}>{c.label}</span>
            <span>{task.hst < 0 ? `H${task.hst}` : `${task.hst} HST`}</span>
            <span>· {fmtShort(task.date)}{overdue ? ` (${relative(task.date, today)})` : ''}</span>
            {overdue && <span className="late-tag">⚠ terlambat</span>}
          </div>
          <div className="task-title">{task.title}</div>
          {planting && <div className="task-sub">{planting} · {task.method}</div>}
          {!planting && <div className="task-sub">{task.method}</div>}
        </button>
      </div>
      {open && (
        <div className="task-body">
          <ul>{task.items.map((i, k) => <li key={k}>{i}</li>)}</ul>
          {task.note && <p className="task-note">{task.note}</p>}
          <div className="badges">{task.sources.map((s) => <Badge key={s} s={s} />)}</div>
        </div>
      )}
    </article>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p': return <p key={i} className="prose">{b.text}</p>;
          case 'ul': return <ul key={i} className="prose-list">{b.items.map((x, k) => <li key={k}>{x}</li>)}</ul>;
          case 'ol': return <ol key={i} className="prose-list">{b.items.map((x, k) => <li key={k}>{x}</li>)}</ol>;
          case 'note': return <div key={i} className={'callout ' + b.tone}>{b.text}</div>;
          case 'table':
            return (
              <div key={i} className="table-wrap">
                <table>
                  <thead><tr>{b.head.map((h, k) => <th key={k}>{h}</th>)}</tr></thead>
                  <tbody>
                    {b.rows.map((r, k) => (
                      <tr key={k}>{r.map((c, j) => <td key={j} className={/^(JANGAN)/.test(c) ? 'no' : /^BOLEH/.test(c) ? 'yes' : ''}>{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}

export const Empty = ({ children }: { children: ReactNode }) => <div className="empty">{children}</div>;
