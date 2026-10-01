import { useState, type ReactNode } from 'react';
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

export function PageHead({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <header className="head">
      {kicker && <div className="kicker">{kicker}</div>}
      <h1>{title}</h1>
      {children}
    </header>
  );
}

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
            <span>· {fmtShort(task.date)}</span>
            {overdue && <span className="late-tag">terlambat {relative(task.date, today)}</span>}
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
