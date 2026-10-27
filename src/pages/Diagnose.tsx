import { useState } from 'react';
import { TROUBLE } from '../data/guide';
import { PageHead } from '../components';

export default function Diagnose() {
  const [q, setQ] = useState('');
  const l = q.trim().toLowerCase();
  const list = l ? TROUBLE.filter((t) => (t.symptom + t.cause + t.action).toLowerCase().includes(l)) : TROUBLE;
  return (
    <>
      <PageHead back={{ to: '/panduan', label: 'Panduan' }} kicker="Solusi cepat" title="Diagnosa gejala" />
      <input className="search" type="search" placeholder="Cari gejala: layu, keriting, rontok…" value={q} onChange={(e) => setQ(e.target.value)} />
      {list.map((t) => (
        <article key={t.symptom} className="card diag-card">
          <h3>{t.symptom}</h3>
          <div><span className="lab">Kemungkinan penyebab</span>{t.cause}</div>
          <div><span className="lab">Tindakan</span>{t.action}</div>
        </article>
      ))}
      <p className="callout info">Gejala bisa punya penyebab ganda. Bila ragu, foto dan bawa ke PPL/Dinas Pertanian setempat.</p>
    </>
  );
}
