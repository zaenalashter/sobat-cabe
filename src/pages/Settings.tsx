import { useRef, useState } from 'react';
import { actions, useStore } from '../lib/store';
import { PageHead } from '../components';
import { requestNotify } from '../lib/notify';

export default function SettingsPage() {
  const s = useStore();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  const backup = () => {
    const url = URL.createObjectURL(new Blob([actions.exportJSON()], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = `sobat-cabe-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHead kicker="Aplikasi" title="Pengaturan" />
      <section className="card">
        <h2 className="sec first">Pengingat</h2>
        <label className="check-row">
          <input type="checkbox" checked={s.settings.notify} onChange={async (e) => {
            if (e.target.checked) {
              const ok = await requestNotify();
              actions.setSettings({ notify: ok });
              setMsg(ok ? 'Pengingat aktif: muncul saat aplikasi dibuka bila ada tugas hari ini.' : 'Izin notifikasi ditolak browser.');
            } else actions.setSettings({ notify: false });
          }} />
          <span>Notifikasi tugas hari ini (saat aplikasi dibuka)</span>
        </label>
        <p className="muted small">Pengingat berjalan lokal tanpa server, jadi hanya muncul ketika aplikasi dibuka.</p>
        {msg && <p className="callout info">{msg}</p>}
      </section>
      <section className="card form">
        <h2 className="sec first">Jadwal</h2>
        <label>Spray generatif dijadwalkan sampai (HST)
          <input type="number" min={100} max={300} value={s.settings.endHst} onChange={(e) => actions.setSettings({ endHst: Math.max(100, Math.min(300, parseInt(e.target.value) || 180)) })} />
          <small>Masa produktif ±6 bulan ≈ 180 HST.</small>
        </label>
      </section>
      <section className="card">
        <h2 className="sec first">Data</h2>
        <p className="muted small">Data tersimpan di perangkat ini (offline). Cadangkan secara berkala atau pindahkan ke perangkat lain.</p>
        <div className="row">
          <button className="btn" onClick={backup}>Cadangkan (.json)</button>
          <button className="btn" onClick={() => file.current?.click()}>Pulihkan</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            try { actions.importJSON(await f.text()); setMsg('Data berhasil dipulihkan.'); } catch { setMsg('Berkas tidak valid.'); }
            e.target.value = '';
          }} />
        </div>
        <button className="btn danger" onClick={() => confirm('Hapus semua data lahan, jadwal, dan panen?') && actions.reset()}>Hapus semua data</button>
      </section>
      <p className="muted small center">Sobat Cabe 1.0 · berdasarkan Panduan Cabai Ori 212 Mas Udin, Edisi 3 (920 mdpl).<br />Patuhi label produk, gunakan APD, dan cocokkan dengan kondisi lahan Anda.</p>
    </>
  );
}
