# Sobat Cabe — Metode Mas Udin (PWA)

Aplikasi penjadwalan & perawatan cabai Ori 212 (rawit/keriting) berdasarkan *Panduan Cabai Ori 212 Mas Udin, Edisi 3 (920 mdpl)*.

- Input tanggal tanam → jadwal otomatis H-14 … panen (olah lahan, pupuk dasar, kocor H-1, kocor akar, susulan, fungisida, spray vegetatif/generatif, Cal-Ha/Vitaron bergantian, dst.)
- Dosis dihitung dari jumlah tanaman; kalkulator kebutuhan
- Panduan lengkap (14 bagian), matriks pencampuran, diagnosa gejala
- Catatan panen & balik modal, cadangkan/pulihkan JSON
- Offline, bisa di-install (PWA), data tersimpan di perangkat

## Jalankan
```bash
npm install
npm run dev
npm run build   # tsc + vite build + service worker
npm run icons   # regenerasi ikon PNG
```

## Deploy ke Vercel
Impor repo di Vercel (preset **Vite**, build `npm run build`, output `dist`) atau `npx vercel --prod`. `vercel.json` sudah menangani SPA rewrite.
