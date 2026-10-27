import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { actions, useStore } from '../lib/store';
import { BUDGET, CATALOG, PCAT } from '../data/products';
import { seasonNeeds } from '../lib/needs';
import { fmtQty, priceFor, statsFor, unitPrice } from '../lib/prices';
import { nf, rp } from '../lib/calc';
import { fmt, todayISO } from '../lib/date';
import { Empty, PageHead } from '../components';
import type { Entry, Product, ProductCat } from '../lib/types';

type Tab = 'daftar' | 'catatan' | 'harga';
const CATS = Object.keys(PCAT) as ProductCat[];

export default function Shop() {
  const s = useStore();
  const [tab, setTab] = useState<Tab>('daftar');
  const [pid, setPid] = useState(s.plantings[0]?.id ?? '');
  const [draft, setDraft] = useState<Partial<Entry> | null>(null);
  const products = useMemo(() => [...CATALOG, ...s.customProducts], [s.customProducts]);
  const planting = s.plantings.find((p) => p.id === pid) ?? s.plantings[0];

  const record = (d: Partial<Entry>) => { setDraft({ plantingId: planting?.id, ...d }); setTab('catatan'); };

  return (
    <>
      <PageHead kicker="Anggaran" title="Belanja & harga obat" />
      <div className="tabs" role="tablist">
        {([['daftar', 'Daftar belanja'], ['catatan', 'Catatan'], ['harga', 'Harga']] as [Tab, string][]).map(([t, l]) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>
      {tab === 'daftar' && <ShopList products={products} pid={planting?.id} setPid={setPid} onBuy={record} />}
      {tab === 'catatan' && <Ledger products={products} draft={draft} clearDraft={() => setDraft(null)} />}
      {tab === 'harga' && <Prices products={products} onRecord={record} />}
    </>
  );
}

const pname = (id: string, ps: Product[]) => ps.find((p) => p.id === id);

/* ---------------- Daftar belanja ---------------- */
function ShopList({ products, pid, setPid, onBuy }: {
  products: Product[]; pid?: string; setPid: (id: string) => void; onBuy: (d: Partial<Entry>) => void;
}) {
  const s = useStore();
  const p = s.plantings.find((x) => x.id === pid);
  const needs = useMemo(() => (p ? seasonNeeds(p, s.settings.endHst) : []), [p, s.settings.endHst]);
  if (!p) return <Empty><p>Buat lahan dulu agar kebutuhan bahan bisa dihitung.</p><Link to="/lahan?baru=1" className="btn primary">+ Tambah lahan</Link></Empty>;

  const rows = needs.map((n) => {
    const prod = pname(n.productId, products)!;
    const pr = priceFor(prod, s.entries);
    return { n, prod, pr, cost: n.qty * pr.value };
  });
  const manual = products.filter((x) => x.manual && !x.custom);
  const total = rows.reduce((a, r) => a + r.cost, 0);
  const missing = rows.filter((r) => r.pr.src === 'none').length;
  const spent = s.entries.filter((e) => e.kind === 'beli' && e.plantingId === p.id).reduce((a, e) => a + e.total, 0);
  const key = (id: string) => s.shopDone[`${p.id}:${id}`];
  const boughtN = [...rows.map((r) => r.prod.id), ...manual.map((m) => m.id)].filter(key).length;

  return (
    <>
      {s.plantings.length > 1 && (
        <select className="plain" value={p.id} onChange={(e) => setPid(e.target.value)} aria-label="Pilih lahan">
          {s.plantings.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      )}
      <section className="hero-card">
        <div className="muted small">Estimasi bahan satu musim · {nf(p.plants)} tanaman</div>
        <div className="big-num">{rp(total)}</div>
        <div className="stats">
          <div><b>{rp(spent)}</b><span>sudah dibelanjakan</span></div>
          <div><b>{p.capital ? rp(p.capital) : '—'}</b><span>modal</span></div>
          <div><b>{boughtN}/{rows.length + manual.length}</b><span>item terbeli</span></div>
        </div>
        {missing > 0 && <p className="note-soft">{missing} bahan belum punya harga, jadi belum masuk estimasi. Catat harga di tab Harga atau Catatan.</p>}
      </section>
      <p className="muted small">Jumlah dihitung dari jadwal & dosis SOP. Spray memakai <b>{p.sprayTanks ?? Math.max(1, Math.round(p.plants / 300))} tangki 16 L</b> per aplikasi (perkiraan; ubah di Info lahan). 1 sdm serbuk ≈ 12,5 g.</p>

      {CATS.map((c) => {
        const list = rows.filter((r) => r.prod.cat === c);
        const man = manual.filter((m) => m.cat === c);
        if (!list.length && !man.length) return null;
        return (
          <section key={c}>
            <h2 className="sec">{PCAT[c]}</h2>
            {list.map(({ n, prod, pr, cost }) => (
              <div className={'item' + (key(prod.id) ? ' done' : '')} key={prod.id}>
                <button className="tick" aria-pressed={!!key(prod.id)} aria-label="Tandai sudah dibeli" onClick={() => actions.toggleShop(p.id, prod.id)} />
                <div className="grow">
                  <div className="item-title">{prod.name}</div>
                  <div className="muted small">Butuh <b>{fmtQty(n.qty, prod.unit)}</b>{' · '}
                    {pr.src === 'none' ? 'harga belum ada' : <>{rp(pr.value)}/{prod.unit} <span className={'src ' + pr.src}>{pr.src === 'catatan' ? 'harga terakhir' : 'patokan panduan'}</span></>}
                  </div>
                  <details><summary>Rincian</summary><ul>{n.basis.map((b, i) => <li key={i}>{b}</li>)}</ul></details>
                </div>
                <div className="right">
                  <b>{pr.src === 'none' ? '—' : rp(cost)}</b>
                  <button className="link" onClick={() => onBuy({ productId: prod.id, qty: Math.ceil(n.qty * 10) / 10, kind: 'beli' })}>Catat beli</button>
                </div>
              </div>
            ))}
            {man.map((m) => (
              <div className={'item' + (key(m.id) ? ' done' : '')} key={m.id}>
                <button className="tick" aria-pressed={!!key(m.id)} aria-label="Tandai sudah dibeli" onClick={() => actions.toggleShop(p.id, m.id)} />
                <div className="grow">
                  <div className="item-title">{m.name}</div>
                  <div className="muted small">{m.desc} · jumlah tergantung luas lahan</div>
                </div>
                <div className="right"><button className="link" onClick={() => onBuy({ productId: m.id, kind: 'beli' })}>Catat beli</button></div>
              </div>
            ))}
          </section>
        );
      })}

      <h2 className="sec">Pembanding anggaran panduan</h2>
      <p className="muted small">Estimasi biaya per 1.000–1.200 m² (panduan hal. 22), kisaran umum.</p>
      <div className="table-wrap"><table>
        <tbody>
          {BUDGET.map(([n, a, b]) => <tr key={n}><td>{n}</td><td className="num">{rp(a)}–{nf(b)}</td></tr>)}
          <tr><td><b>Total kasar</b></td><td className="num"><b>±Rp 3,4–5,5 juta</b></td></tr>
        </tbody>
      </table></div>
    </>
  );
}

/* ---------------- Catatan pembelian ---------------- */
function Ledger({ products, draft, clearDraft }: { products: Product[]; draft: Partial<Entry> | null; clearDraft: () => void }) {
  const s = useStore();
  const [kind, setKind] = useState<Entry['kind']>(draft?.kind ?? 'beli');
  const [productId, setProductId] = useState(draft?.productId ?? 'mankozeb');
  const [date, setDate] = useState(todayISO());
  const [qty, setQty] = useState(draft?.qty ? String(draft.qty) : '');
  const [total, setTotal] = useState('');
  const [store, setStore] = useState('');
  const [plantingId, setPlantingId] = useState(draft?.plantingId ?? '');
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState('all');

  const prod = pname(productId, products);
  const q = parseFloat(qty.replace(',', '.')) || 0;
  const t = parseFloat(total) || 0;
  const stores = [...new Set(s.entries.map((e) => e.store).filter(Boolean))] as string[];

  const list = s.entries.filter((e) => filter === 'all' || e.plantingId === filter).sort((a, b) => b.date.localeCompare(a.date));
  const buys = list.filter((e) => e.kind === 'beli');
  const spend = buys.reduce((a, e) => a + e.total, 0);
  const byCat = CATS.map((c) => ({ c, v: buys.filter((e) => pname(e.productId, products)?.cat === c).reduce((a, e) => a + e.total, 0) })).filter((x) => x.v > 0);

  return (
    <>
      <section className="hero-card">
        <div className="muted small">Total belanja{filter !== 'all' ? ' (lahan terpilih)' : ''}</div>
        <div className="big-num">{rp(spend)}</div>
        {byCat.map(({ c, v }) => (
          <div className="catbar" key={c}>
            <span>{PCAT[c]}</span><div className="bar"><i style={{ width: `${(v / spend) * 100}%` }} /></div><b>{rp(v)}</b>
          </div>
        ))}
        {!byCat.length && <p className="muted small">Belum ada pembelian tercatat.</p>}
      </section>

      <form className="card form" onSubmit={(e) => {
        e.preventDefault();
        if (!q || !t) return;
        actions.addEntry({ kind, date, productId, qty: q, total: t, store: store.trim() || undefined, plantingId: plantingId || undefined, note: note.trim() || undefined });
        setQty(''); setTotal(''); setNote(''); clearDraft();
      }}>
        <h2 className="sec first">Catat harga / pembelian</h2>
        <div className="seg">
          <button type="button" className={kind === 'beli' ? 'on' : ''} onClick={() => setKind('beli')}>Beli</button>
          <button type="button" className={kind === 'cek' ? 'on' : ''} onClick={() => setKind('cek')}>Cek harga (tidak beli)</button>
        </div>
        <label>Produk
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {CATS.map((c) => <optgroup key={c} label={PCAT[c]}>{products.filter((x) => x.cat === c).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</optgroup>)}
          </select>
        </label>
        <div className="two">
          <label>Tanggal<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
          <label>Jumlah ({prod?.unit})<input inputMode="decimal" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="mis. 1" required /></label>
        </div>
        <label>Total harga (Rp)<input type="number" inputMode="numeric" min={0} value={total} onChange={(e) => setTotal(e.target.value)} placeholder="mis. 85000" required /></label>
        {q > 0 && t > 0 && <p className="note-soft">Harga per {prod?.unit}: <b>{rp(t / q)}</b></p>}
        <label>Toko / penjual
          <input list="stores" value={store} onChange={(e) => setStore(e.target.value)} placeholder="mis. Toko Tani Makmur" />
          <datalist id="stores">{stores.map((x) => <option key={x} value={x} />)}</datalist>
        </label>
        {s.plantings.length > 0 && (
          <label>Untuk lahan
            <select value={plantingId} onChange={(e) => setPlantingId(e.target.value)}>
              <option value="">— umum —</option>
              {s.plantings.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </label>
        )}
        <label>Catatan<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="kemasan, merek, diskon, no. nota…" /></label>
        <button className="btn primary" type="submit">Simpan catatan</button>
      </form>

      {s.plantings.length > 1 && (
        <select className="plain" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter lahan">
          <option value="all">Semua lahan</option>
          {s.plantings.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      )}
      <h2 className="sec">Riwayat</h2>
      {!list.length && <Empty>Belum ada catatan.</Empty>}
      {list.map((e) => {
        const pr = pname(e.productId, products);
        const pl = s.plantings.find((x) => x.id === e.plantingId);
        return (
          <div className="item" key={e.id}>
            <div className="grow">
              <div className="item-title">{pr?.name ?? 'Produk dihapus'} <span className={'tag ' + e.kind}>{e.kind === 'beli' ? 'Beli' : 'Cek harga'}</span></div>
              <div className="muted small">{fmt(e.date)} · {nf(e.qty, 2)} {pr?.unit}{e.store ? ` · ${e.store}` : ''}{pl ? ` · ${pl.name}` : ''}</div>
              {e.note && <div className="small">{e.note}</div>}
            </div>
            <div className="right"><b>{rp(e.total)}</b><div className="muted small">{rp(unitPrice(e))}/{pr?.unit}</div></div>
            <button className="x" aria-label="Hapus" onClick={() => confirm('Hapus catatan ini?') && actions.removeEntry(e.id)}>×</button>
          </div>
        );
      })}
    </>
  );
}

/* ---------------- Katalog harga ---------------- */
function Prices({ products, onRecord }: { products: Product[]; onRecord: (d: Partial<Entry>) => void }) {
  const s = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<ProductCat | 'all'>('all');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [pc, setPc] = useState<ProductCat>('fungisida');
  const [unit, setUnit] = useState<Product['unit']>('L');
  const l = q.trim().toLowerCase();
  const list = products.filter((p) => (cat === 'all' || p.cat === cat) && (!l || (p.name + (p.desc ?? '')).toLowerCase().includes(l)));

  return (
    <>
      <input className="search" type="search" placeholder="Cari produk…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="chips">
        <button className={'chipbtn' + (cat === 'all' ? ' on' : '')} onClick={() => setCat('all')}>Semua</button>
        {CATS.map((c) => <button key={c} className={'chipbtn' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{PCAT[c]}</button>)}
      </div>
      {list.map((p) => {
        const st = statsFor(s.entries, p.id);
        const lp = st.latest ? unitPrice(st.latest) : 0;
        const pp = st.prev ? unitPrice(st.prev) : 0;
        const delta = pp ? ((lp - pp) / pp) * 100 : 0;
        return (
          <details className="pcard" key={p.id}>
            <summary>
              <div className="grow">
                <div className="item-title">{p.name}</div>
                <div className="muted small">{p.desc}</div>
              </div>
              <div className="right">
                {st.latest ? <><b>{rp(lp)}</b><div className="muted small">/{p.unit}</div></>
                  : p.refLow ? <><b className="ref">{rp(p.refLow)}–{nf(p.refHigh!)}</b><div className="muted small">/{p.unit} · patokan</div></>
                  : <span className="muted small">belum ada harga</span>}
              </div>
            </summary>
            <div className="pbody">
              {st.n > 0 && (
                <div className="stats">
                  <div><b>{rp(unitPrice(st.min!))}</b><span>termurah{st.min?.store ? ` · ${st.min.store}` : ''}</span></div>
                  <div><b>{rp(st.avg)}</b><span>rata-rata ({st.n}×)</span></div>
                  <div><b>{rp(unitPrice(st.max!))}</b><span>termahal{st.max?.store ? ` · ${st.max.store}` : ''}</span></div>
                </div>
              )}
              {st.prev && <p className={'trend ' + (delta > 0 ? 'up' : 'down')}>{delta > 0 ? '▲' : delta < 0 ? '▼' : '='} {nf(Math.abs(delta), 1)}% dibanding catatan sebelumnya</p>}
              {p.refLow && <p className="muted small">Patokan panduan: {rp(p.refLow)}–{nf(p.refHigh!)} per {p.unit}. Harga di toko Anda bisa berbeda.</p>}
              {st.history.slice(0, 6).map((e) => (
                <div className="hist" key={e.id}><span>{fmt(e.date)}{e.store ? ` · ${e.store}` : ''}</span><b>{rp(unitPrice(e))}/{p.unit}</b></div>
              ))}
              <div className="row">
                <button className="btn primary" onClick={() => onRecord({ productId: p.id, kind: 'cek' })}>Catat harga</button>
                {p.custom && <button className="btn danger" onClick={() => confirm(`Hapus “${p.name}” beserta catatannya?`) && actions.removeProduct(p.id)}>Hapus produk</button>}
              </div>
            </div>
          </details>
        );
      })}
      {!list.length && <p className="muted center">Tidak ada produk.</p>}

      {adding ? (
        <form className="card form" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; actions.addProduct({ name: name.trim(), cat: pc, unit }); setName(''); setAdding(false); }}>
          <h2 className="sec first">Produk baru</h2>
          <label>Nama / merek<input value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Score 250 EC" required /></label>
          <div className="two">
            <label>Kategori<select value={pc} onChange={(e) => setPc(e.target.value as ProductCat)}>{CATS.map((c) => <option key={c} value={c}>{PCAT[c]}</option>)}</select></label>
            <label>Satuan<select value={unit} onChange={(e) => setUnit(e.target.value as Product['unit'])}><option value="L">L</option><option value="kg">kg</option><option value="unit">unit</option></select></label>
          </div>
          <div className="row"><button className="btn primary" type="submit">Tambah</button><button type="button" className="btn" onClick={() => setAdding(false)}>Batal</button></div>
        </form>
      ) : <button className="btn block" onClick={() => setAdding(true)}>+ Tambah produk lain (mis. fungisida sistemik)</button>}
    </>
  );
}
