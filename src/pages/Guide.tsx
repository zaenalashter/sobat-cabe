import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { GUIDE } from '../data/guide';
import { Blocks, Badge, PageHead } from '../components';

function plain(s: (typeof GUIDE)[number]) {
  return (s.title + ' ' + s.summary + ' ' + JSON.stringify(s.blocks)).toLowerCase();
}

export default function Guide() {
  const { id } = useParams();
  const [q, setQ] = useState('');
  const sec = GUIDE.find((g) => g.id === id);

  if (sec) {
    const i = GUIDE.indexOf(sec);
    const prev = GUIDE[i - 1], next = GUIDE[i + 1];
    return (
      <>
        <PageHead back={{ to: '/panduan', label: 'Panduan' }} kicker={`Bagian ${i + 1} dari ${GUIDE.length}`} title={sec.title} />
        <Blocks blocks={sec.blocks} />
        <div className="pager">
          {prev ? <Link to={`/panduan/${prev.id}`}>‹ {prev.title}</Link> : <span />}
          {next ? <Link to={`/panduan/${next.id}`}>{next.title} ›</Link> : <span />}
        </div>
      </>
    );
  }

  const list = q.trim() ? GUIDE.filter((g) => plain(g).includes(q.trim().toLowerCase())) : GUIDE;
  return (
    <>
      <PageHead kicker="Referensi" title="Panduan Mas Udin" />
      <input className="search" type="search" placeholder="Cari: mankozeb, thrips, pH…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="two">
        <Link to="/diagnosa" className="plot diag"><div className="plot-top"><b>Diagnosa gejala</b></div><div className="muted small">Gejala → penyebab → tindakan</div></Link>
        <Link to="/kalkulator" className="plot diag"><div className="plot-top"><b>Kalkulator</b></div><div className="muted small">Kebutuhan larutan & pupuk</div></Link>
      </div>
      <div className="legend">
        <span><Badge s="SOP" /> dari SOP/wawancara</span>
        <span><Badge s="SARAN" /> saran tambahan</span>
        <span><Badge s="920" /> penyesuaian lahan</span>
      </div>
      {list.map((g) => (
        <Link key={g.id} to={`/panduan/${g.id}`} className="plot guide">
          <span className="gi" aria-hidden>{g.icon}</span>
          <div><b>{g.title}</b><div className="muted small">{g.summary}</div></div>
        </Link>
      ))}
      {!list.length && <p className="muted center">Tidak ada hasil.</p>}
    </>
  );
}
