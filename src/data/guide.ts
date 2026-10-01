export type Block =
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'note'; tone: 'warn' | 'info' | 'ok'; text: string };

export interface Section { id: string; title: string; icon: string; summary: string; blocks: Block[] }

export const GUIDE: Section[] = [
  {
    id: 'ringkasan', title: 'Ringkasan satu halaman', icon: '📋', summary: 'Apa, kapan, berapa, di mana',
    blocks: [
      { t: 'p', text: 'Dosis mengikuti SOP asli (basis cabai rawit). Untuk cabai keriting, jadwal dimajukan menyesuaikan kondisi tanaman — gunakan kolom “geser jadwal” saat membuat lahan.' },
      { t: 'table', head: ['Umur', 'Aplikasi & dosis', 'Cara'], rows: [
        ['H-1', 'Trichoderma + Silica Carbon + Powersoil: 2–3 sdm tiap bahan / 16–20 L', 'Kocor lubang tanam'],
        ['0', 'Tanam bibit 21–28 hari (1–2 hari setelah kocor H-1)', 'Lubang tanam'],
        ['5, 10, 15', 'Mordenfol 100 ml + asam amino 50 ml / 20 L', 'Kocor 50–100 ml/lubang'],
        ['15 → 45 (4 hari)', 'Abamektin 10–20 ml + asam amino 50 ml / 16 L', 'Spray pagi'],
        ['20, 40, 60, 80', 'NPK Mutiara 16-16-16 / NPK+TE: 1 sdm/lubang (tabur) atau 3 sdm/16 L (kocor)', 'Lubang susulan'],
        ['21, 41, 61, 81', 'Mankozeb 2 sdm / 16–20 L (Cabrio Top bila tanaman tua)', 'Kocor 50–100 ml di lubang tanam'],
        ['45 → panen (4 hari)', 'Kalinet 100 ml + insektisida 20 ml / 16 L; Cal-Ha 2 sdm & Vitaron SL 25 ml bergantian (±2 minggu)', 'Spray pagi'],
        ['85', 'Asam amino', 'Spray'],
        ['Menjelang merah', 'Mankozeb 2 sdm / 16 L', 'Spray (cek interval panen)']
      ] },
      { t: 'note', tone: 'warn', text: 'Tiga hal yang sering terbalik: (1) pupuk susulan dan fungisida beda lubang dan beda hari; (2) fungisida di metode ini utamanya dikocor, bukan disemprot; (3) pupuk kandang harus matang — mentah = panas & membawa patogen.' }
    ]
  },
  {
    id: 'bedengan', title: 'Persiapan lahan & bedengan', icon: '🌱', summary: 'Pupuk dasar, pH, fermentasi',
    blocks: [
      { t: 'p', text: 'Menurut Mas Udin, penyakit hampir selalu bermula dari bawah (akar dan tanah), jadi tanah yang sehat lebih penting daripada obat yang banyak.' },
      { t: 'ol', items: [
        'Bajak 30–40 cm, jemur 7–14 hari untuk memutus siklus patogen.',
        'Cek pH, target 5,5–6,8. Bila < 5,5 beri dolomit 100–150 kg/1.000 m² (920 mdpl).',
        'Bentuk bedengan lebar 100–120 cm, tinggi 30–40 cm agar air hujan cepat pergi (920 mdpl).',
        'Tabur pupuk dasar, ratakan.',
        'Fermentasi di tempat: semprot kandang dengan M21 + molase (5 tutup + 5 tutup / 20 L), lalu tutup mulsa.',
        'Diamkan sampai tumbuh rumput di sela bedengan — tanda lahan siap.'
      ] },
      { t: 'table', head: ['Pupuk dasar (per 1.200 tanaman)', 'Dosis', 'Catatan'], rows: [
        ['Pupuk kandang kambing', '10 sak (±200 kg)', 'Harus matang/terfermentasi'],
        ['Phonska (Plus)', '25 kg', 'Kimia hanya seperlunya'],
        ['SP-36 / Phospat', '50 kg', 'Pemacu akar'],
        ['Dolomit', '100–150 kg', 'Hanya bila pH < 5,5']
      ] },
      { t: 'note', tone: 'info', text: 'Dasaran sengaja sedikit: kandang mentah membawa mikroba jahat (pemicu layu & busuk batang), dan nitrogen berlebih menjadi “makanan” jamur patogen saat hujan.' }
    ]
  },
  {
    id: 'lubang', title: 'Peta lubang tanam & susulan', icon: '🕳️', summary: 'Konsep yang paling sering membingungkan',
    blocks: [
      { t: 'p', text: 'Setiap tanaman punya satu lubang tanam (tempat akar) dan satu–dua lubang susulan kecil di sampingnya (±10–15 cm dari batang). Lubang susulan disiapkan sejak awal tanam agar akar terpancing menjangkau area baru.' },
      { t: 'table', head: ['', 'Lubang tanam', 'Lubang susulan'], rows: [
        ['Isi', 'Larutan cair: Mordenfol, asam amino, Powersoil, fungisida', 'NPK (tabur 1 sdm) atau larutan 3 sdm/16 L'],
        ['Kapan', '5, 10, 15 HST; 21, 41, 61, 81 HST', '20, 40, 60, 80 HST'],
        ['Volume', '50–100 ml larutan/lubang', '1 sdm/lubang'],
        ['Alasan', 'Nutrisi akar & melindungi zona akar dari jamur', 'Pupuk pekat tidak menumpuk di pangkal batang; akar tumbuh menuju lubang']
      ] },
      { t: 'note', tone: 'info', text: 'Variasi sumber: wawancara Mas Udin mengocor fungisida tepat di lubang tanam sehari setelah susulan. Satu artikel murid menyebut ke lubang samping. Aplikasi ini mengikuti wawancara Mas Udin.' }
    ]
  },
  {
    id: 'hayati', title: 'Kocor H-1 agen hayati', icon: '🦠', summary: 'Trichoderma, Silica Carbon, Powersoil',
    blocks: [
      { t: 'table', head: ['Bahan', 'Dosis', 'Fungsi'], rows: [
        ['Trichoderma', '2 sdm/20 L atau 3 sdm/16 L', 'Agen hayati penekan jamur tanah'],
        ['Silica Carbon', '1 sdm/20 L atau 3 sdm/16 L', 'Memperbaiki struktur tanah'],
        ['Powersoil (asam humat)', '2 sdm/20 L atau 3 sdm/16 L', 'Penyangga pH & pengikat hara'],
        ['M21 / EM4 (fermentasi)', '5 tutup/20 L', 'Mematangkan kandang'],
        ['Molase', '5 tutup/20 L (1:1 dengan M21)', 'Makanan awal mikroba']
      ] },
      { t: 'ul', items: [
        'Larutkan sebagian air dulu, masukkan bahan satu per satu, aduk perlahan, pakai dalam 2–4 jam.',
        'Tanam 1–2 hari setelah kocor. Volume per lubang ±100–200 ml (saran).',
        'Jangan campur dengan fungisida/insektisida kimia dalam sesi yang sama.'
      ] }
    ]
  },
  {
    id: 'semai', title: 'Persemaian bibit', icon: '🪴', summary: 'Siap tanam 21–28 hari',
    blocks: [
      { t: 'ol', items: [
        'Rendam benih air hangat kuku ±3 jam (boleh + POC/asam fosfit), buang yang mengapung.',
        'Semai di tray: tanah + kompos + sekam bakar (1:1:1), 1 benih/lubang.',
        'Tempat hangat & teduh 3–5 hari (920 mdpl), lalu sinar matahari pagi.',
        'Siap tanam umur 21–28 hari, 4–5 helai daun sejati. Di dataran tinggi bibit sedikit lebih lambat besar.'
      ] },
      { t: 'note', tone: 'info', text: 'Saran: celup akar bibit ke PGPR (Bacillus subtilis/Pseudomonas fluorescens) sesaat sebelum tanam, tanpa fungisida.' }
    ]
  },
  {
    id: 'rawat', title: 'Pindah tanam & perawatan', icon: '🧑‍🌾', summary: 'Wiwil, siram, jarak tanam',
    blocks: [
      { t: 'ul', items: [
        'Tanam sore hari atau pagi sebelum jam 9, saat tidak hujan deras.',
        'Pasang ajir ±1 minggu kemudian; ikat batang saat 25–30 HST.',
        'Musim hujan: JANGAN rempel tunas — bekas potongan jadi pintu masuk jamur/bakteri. Cukup pangkas daun tua bagian bawah. Wiwil hanya di musim kering/cerah.',
        'Siram 1× pagi bila hujan rutin. Akar cabai tidak suka tergenang.',
        'Buang buah busuk/patek segera; jangan tumpuk di bedengan.',
        'Jarak tanam renggang 60×70–70×80 cm di 920 mdpl agar udara mengalir.',
        'Cek daun bawah & pangkal batang tiap 2–3 hari: bercak, layu sebelah, kutu, keriting daun.'
      ] }
    ]
  },
  {
    id: 'kocor-spray', title: 'Kocor vs spray', icon: '💧', summary: 'Mana dikocor, mana disemprot',
    blocks: [
      { t: 'p', text: 'Yang urusannya di bawah tanah dikocor, yang urusannya di daun/bunga/buah disemprot. Kekhasan Mas Udin: fungisida utamanya dikocor.' },
      { t: 'table', head: ['Bahan', 'Cara', 'Alasan'], rows: [
        ['Mordenfol, Powersoil, asam amino (awal)', 'KOCOR', 'Membangun akar & batang di fase awal'],
        ['NPK susulan', 'TABUR/KOCOR', 'Makan dari bawah; kocor lebih efektif di kemarau'],
        ['Fungisida mankozeb', 'KOCOR', 'Sumber jamur diyakini dari bawah'],
        ['Insektisida', 'SPRAY', 'Hama penghisap ada di daun/pucuk'],
        ['Kalinet, Cal-Ha, Vitaron SL', 'SPRAY', 'Penunjang bunga & buah'],
        ['Trichoderma, Silica Carbon, M21', 'KOCOR', 'Bekerja di tanah & zona akar']
      ] },
      { t: 'note', tone: 'info', text: 'Pada satu kasus pemulihan antraknosa, kalsium disemprot tunggal 3 sdm/16 L tiap 4 hari dan dikocor bersama fungisida (2 kali). Itu terapi darurat, bukan jadwal rutin.' }
    ]
  },
  {
    id: 'mikroba', title: 'Fungisida & mikroba tanah', icon: '🔬', summary: 'Analisis & 9 aturan aman',
    blocks: [
      { t: 'note', tone: 'warn', text: 'Jawaban jujur: fungisida kocor bisa menekan sebagian mikroba di sekitar lubang untuk sementara — tetapi tidak membunuh semuanya dan tidak permanen.' },
      { t: 'table', head: ['Temuan', 'Isi ringkas'], rows: [
        ['Mankozeb cepat terurai', 'Waktu paruh di tanah ±1 hari (Minnesota), 2,9 hari (lapangan Filipina); residu ±12 hari di 2,5 cm tanah teratas.'],
        ['Bisa menekan mikroba saat masih ada', 'Kebun anggur Bordeaux (1983): 10 mg/kg tanah menurunkan bakteri, jamur, aktinomisetes; pulih setelah terurai.'],
        ['Trichoderma: tergantung strain', 'Sebagian strain tahan mankozeb dosis rendah. Fungisida sistemik umumnya jauh lebih menghambat. Metiram + piraklostrobin (Cabrio Top) ikut menurunkan pertumbuhan.']
      ] },
      { t: 'p', text: 'Batasan bukti: banyak studi memakai cawan petri. Di tanah dampak biasanya lebih kecil & singkat. Belum ada studi khusus metode Mas Udin pada cabai.' },
      { t: 'p', text: 'Hitungan kasar: 75 ml × 80% bahan aktif ≈ 60–115 mg per lubang ≈ 12–57 mg/kg tanah sesaat setelah kocor — penekanan lokal & sementara, hanya 4 kali per musim.' },
      { t: 'ol', items: [
        'Fungisida kocor rutin = mankozeb (kontak). Hindari kocor sistemik (karbendazim, heksakonazol, difenokonazol) secara rutin. [SOP+Saran]',
        'Jangan menaikkan dosis (2 sdm/16–20 L). [SOP]',
        'Kocor hanya di lubang tanam, 50–100 ml. [SOP]',
        'Jangan satu tangki dengan Trichoderma/M21/PGPR. [Saran]',
        'Beri jeda ≥ 7 hari antara fungisida kocor dan agen hayati. [Saran]',
        'Rawat mikroba: Powersoil, kandang matang, mulsa, tanah gembur. [SOP]',
        'Opsional: 7–10 hari setelah tiap fungisida (hari 28, 48, 68) kocor Trichoderma/M21 ringan. [Saran]',
        'Cabrio Top hanya bila tanaman tua/serangan berat. [SOP+Saran]',
        'Jangan menambah kocor fungisida di luar jadwal tanpa gejala; bila perlu gunakan spray daun. [Saran]'
      ] },
      { t: 'table', head: ['Strategi', 'Isi', 'Cocok untuk'], rows: [
        ['A. SOP asli + aturan', 'Jadwal Mas Udin penuh + aturan 1–9', 'Direkomendasikan 920 mdpl (lembap)'],
        ['B. Hayati dulu', 'Ganti fungisida kimia dengan Trichoderma berkala', 'Uji coba 1–2 bedengan musim kering']
      ] },
      { t: 'note', tone: 'info', text: 'Bila muncul layu/busuk batang pada pilihan B, segera kembali ke A. Layu tidak bisa “disembuhkan” setelah parah.' }
    ]
  },
  {
    id: 'spray', title: 'Spray daun', icon: '🌫️', summary: 'Vegetatif, generatif, thrips',
    blocks: [
      { t: 'table', head: ['Fase', 'Isi tangki 16 L', 'Catatan'], rows: [
        ['Vegetatif 15→45 HST', 'Abamektin 10–20 ml + asam amino 50 ml', 'Antisipasi thrips/tungau & virus'],
        ['Generatif 45 HST→panen', 'Kalinet 100 ml + insektisida 20 ml + Cal-Ha 2 sdm ATAU Vitaron SL 25 ml', 'Cal-Ha & Vitaron bergantian ±2 minggu'],
        ['85 HST', 'Asam amino', 'Pemulihan tanaman tua'],
        ['Menjelang buah merah', 'Mankozeb 2 sdm', 'Cek interval aman panen']
      ] },
      { t: 'ul', items: [
        'Interval baku 4 hari sekali, pagi 06.00–09.00 atau sore 16.00–18.00.',
        'Sasar bawah daun & pucuk sampai basah merata, tidak menetes berlebihan.',
        'Bergantian bahan aktif insektisida (abamektin → piridaben → lainnya).',
        'Habis sembuh dari serangan: tambah Vitaron SL 1–2 ml/L.'
      ] }
    ]
  },
  {
    id: 'campur', title: 'Matriks pencampuran', icon: '🧪', summary: 'Mana boleh satu tangki',
    blocks: [
      { t: 'table', head: ['', 'Insektisida', 'Fungisida kontak', 'Nutrisi daun*', 'Cal-Ha', 'Agen hayati**'], rows: [
        ['Insektisida', '—', 'BOLEH', 'BOLEH***', 'BOLEH', 'JANGAN'],
        ['Fungisida kontak', 'BOLEH', '—', 'BOLEH (pisah lebih efektif)', 'Kocor boleh; spray terapi tunggal', 'JANGAN'],
        ['Nutrisi daun*', 'BOLEH***', 'BOLEH (pisah lebih efektif)', '—', 'Kalinet OK; jangan dengan Mordenfol', 'BOLEH (asam amino & humat)'],
        ['Cal-Ha', 'BOLEH', 'Kocor boleh; spray terapi tunggal', 'Kalinet OK; jangan dengan Mordenfol', '—', 'Tidak ada data — pisahkan'],
        ['Agen hayati**', 'JANGAN', 'JANGAN', 'BOLEH (asam amino & humat)', 'Tidak ada data — pisahkan', '—']
      ] },
      { t: 'p', text: '* Nutrisi daun = Kalinet, Vitaron SL, Mordenfol, asam amino. ** Agen hayati = Trichoderma, M21/EM4, PGPR. *** Kecuali pestisida berformula larut air (SL, SP, SG, AS): pisahkan.' },
      { t: 'note', tone: 'warn', text: 'Uji dulu: campur sedikit di gelas bening, diamkan ±15 menit. Menggumpal, mengendap, berlapis, atau panas = jangan dicampur. Gunakan air jernih. Kalsium dengan fosfat pekat (Mordenfol) dapat mengendap.' }
    ]
  },
  {
    id: 'produk', title: 'Produk, padanan & harga', icon: '🛒', summary: 'Kandungan & pengganti',
    blocks: [
      { t: 'table', head: ['Produk', 'Kandungan', 'Fungsi', 'Padanan'], rows: [
        ['Mordenfol', 'Fosfat + Mg + Fe cair pekat', 'Akar, ketahanan, pembentukan bunga', 'Pupuk cair tinggi P (mis. Gandasil B)'],
        ['Powersoil', 'Asam humat larut air', 'Pembenah tanah', 'Asam humat lain'],
        ['Premino / Ambition', 'Asam amino (+ fulvat & mikro pada Ambition)', 'Pulihkan stres, kuatkan dinding sel', 'POC asam amino lain'],
        ['Kalinet', 'Kalium + Boron pekat', 'Kuantitas & kualitas buah', 'KNO3 + MKP'],
        ['Cal-Ha', 'Kalsium organik + humat (CaO 37%)', 'Cegah rontok bunga & busuk ujung buah', 'Kalsium nitrat / CaBor'],
        ['Vitaron SL', 'Mikro chelate', 'Regenerasi sel pasca stres', 'Mikro chelate lain'],
        ['Silica Carbon', 'Silika + karbon', 'Struktur tanah', 'Silika cair / arang sekam'],
        ['Trichoderma', 'Spora Trichoderma spp.', 'Penekan jamur tanah', 'Trico-G, Biotrico'],
        ['M21 / EM4', 'Konsorsium mikroba pengurai', 'Mematangkan kandang', 'EM4 (1:1 molase)']
      ] },
      { t: 'note', tone: 'info', text: 'Transparansi: Mordenfol, Powersoil, Kalinet, Cal-Ha, Vitaron SL, dan Premino adalah lini produk Mitra Bertani (kanal edukasi yang sama dengan Mas Udin), jadi ada unsur promosi. Produk berkandungan setara boleh dipakai.' },
      { t: 'table', head: ['Bahan', 'Kisaran harga'], rows: [
        ['M21 Decomposer 1 L', 'Rp 47.000–65.000'],
        ['Trichoderma bubuk 1 kg', 'Rp 70.000–90.000'],
        ['Molase 1 L', 'Rp 15.000–25.000'],
        ['EM4 pertanian 1 L', 'Rp 25.000–35.000']
      ] }
    ]
  },
  {
    id: 'hama', title: 'Hama, penyakit & thrips', icon: '🐛', summary: 'Bahan aktif & urutan kerja',
    blocks: [
      { t: 'table', head: ['Masalah', 'Bahan aktif', 'Contoh produk'], rows: [
        ['Antraknosa / patek', 'Difenokonazol, azoksistrobin (atau metalaksil + kalsium sebagai pemulihan)', 'Score, Amistar Top'],
        ['Busuk batang / Phytophthora', 'Propamokarb, fosetil-Al', 'Previcur N, Alliette'],
        ['Embun bulu', 'Metalaksil + mankozeb', 'Ridomil Gold MZ'],
        ['Kutu kebul (vektor virus)', 'Imidakloprid, tiametoksam', 'Confidor, Actara'],
        ['Thrips / tungau', 'Abamektin, piridaben, propargit', 'Demolish, Omite'],
        ['Ulat buah', 'Emamektin benzoat', 'Proclaim'],
        ['Lalat buah', 'Metil eugenol (perangkap) + spinosad', 'Petrogenol']
      ] },
      { t: 'note', tone: 'warn', text: 'Fungisida sistemik lebih menekan mikroba bermanfaat daripada mankozeb. Pakai hanya saat ada serangan, semprot ke daun/buah, bukan kocor rutin, dan jangan satu tangki dengan agen hayati.' },
      { t: 'ol', items: [
        'Kuatkan dulu: spray Kalinet 100 ml/16 L tiap 3 hari.',
        'Serang: abamektin 20 ml/16 L disemprot terpisah, pagi hari.',
        'Ganti bahan aktif (abamektin → imidakloprid → diafentiuron/piridaben).',
        'Pulihkan: Vitaron SL 1–2 ml/L.',
        'Interval 4 hari saat parah; 6–7 hari setelah terkendali.'
      ] }
    ]
  },
  {
    id: 'panen', title: 'Panen & estimasi biaya', icon: '🧺', summary: 'Contoh hasil SOP & biaya',
    blocks: [
      { t: 'ul', items: [
        'Panen pertama 95–115 HST di 920 mdpl (dataran rendah ±85–90 HST).',
        'Petik tiap 3–5 hari, 15–20 kali petik (±4–6 bulan).',
        'Semprot fungisida menjelang buah merah dan patuhi interval aman panen.',
        'Setelah petik: rawat luka petik.'
      ] },
      { t: 'p', text: 'Contoh SOP Mas Udin (1.200 tanaman): petik ke-4: 93 kg · ke-5: 85 kg · ke-6: 86 kg · ke-7: 100 kg+. Modal Rp 3.570.000 (balik modal di petik ke-5), harga saat itu Rp 15.000–20.000/kg. Hasil di 920 mdpl bisa lebih rendah.' },
      { t: 'table', head: ['Komponen (per 1.000–1.200 m²)', 'Perkiraan'], rows: [
        ['Benih Ori 212', 'Rp 60.000–100.000'],
        ['Kandang + Phonska + SP-36 (+ dolomit)', 'Rp 700.000–1.100.000'],
        ['Agen hayati & dekomposer', 'Rp 100.000–250.000'],
        ['Mordenfol + asam amino (kocor akar 3×)', 'Rp 150.000–250.000'],
        ['Mulsa plastik + ajir', 'Rp 650.000–950.000'],
        ['NPK susulan (4×)', 'Rp 500.000–800.000'],
        ['Fungisida & insektisida 1 musim', 'Rp 900.000–1.500.000'],
        ['Kalinet + Cal-Ha + Vitaron SL', 'Rp 350.000–600.000'],
        ['Total kasar', '±Rp 3,4–5,5 juta']
      ] }
    ]
  },
  {
    id: 'polybag', title: 'Lampiran: SOP polybag', icon: '🛍️', summary: 'Mas Eko Agung, Tegal',
    blocks: [
      { t: 'p', text: 'Penerapan metode Mas Udin pada polybag 35×35 cm (media tanah saja). Cocok untuk uji coba skala kecil.' },
      { t: 'table', head: ['Waktu', 'Tindakan', 'Dosis'], rows: [
        ['H-1', 'Kocor sterilisasi Rizotin + mankozeb, lalu Powersoil + Trichoderma + Silica Carbon', 'Sesuai label; Powersoil 3 sdm, Trichoderma 3 sdm, Silica Carbon 4 sdm / 20 L'],
        ['5 HST, lalu tiap 5 hari', 'Kocor Mordenfol + Ambition', '50 ml + 50 ml / 20 L'],
        ['Mingguan', 'Spray Mordenfol + Ambition + insektisida bergantian + mankozeb', 'Sesuai label'],
        ['20 HST dst.', 'NPK Mutiara 16-16-16 larutan stok', '1 sdm/2 L → kocor 100 ml/polybag'],
        ['Generatif', 'Spray Kalinet (+ Vitaron SL & Cal-Ha)', 'Kalinet 40 ml/16 L']
      ] },
      { t: 'note', tone: 'info', text: 'Beda dari lahan terbuka: di polybag, tunas air tetap dirempel bersih meski musim hujan. Hasil Mas Eko: panen sampai 7 bulan, modal ±Rp 1 juta untuk 700–800 tanaman.' }
    ]
  },
  {
    id: 'batasan', title: 'Koreksi, batasan & sumber', icon: 'ℹ️', summary: 'Catatan kejujuran',
    blocks: [
      { t: 'ul', items: [
        'Isi buku panduan Mas Udin belum dibaca penyusun; rujukan: wawancara & artikel Mitra Bertani, ringkasan SOP.',
        'Studi mikroba umumnya in vitro; belum ada uji khusus metode ini pada cabai.',
        'Semua hitungan adalah perkiraan; timbang sendok & ukur gelas Anda (1 sdm NPK ≈ 12–15 g).',
        'Untuk 920 mdpl semuanya adalah penyesuaian; uji sebagian lahan dulu bila ragu.',
        'Resep “1 sdm fungisida + 6 sdm Cal-Ha / 20 L” adalah terapi antraknosa, bukan resep rutin. Resep rutin: mankozeb 2 sdm/16–20 L.',
        'Patuhi label produk dan interval aman panen; gunakan APD saat menyemprot/mengocor.'
      ] },
      { t: 'p', text: 'Sumber: Mitra Bertani (wawancara Mas Udin & artikel studi kasus murid), ringkasan SOP Mas Udin, Soil Science 135(6) 1983, Int. J. Pest Management 39(2), Minnesota Dept. of Agriculture, Environ. Toxicol. Chem. 2022, studi kompatibilitas Trichoderma–fungisida.' }
    ]
  }
];

export const TROUBLE: { symptom: string; cause: string; action: string }[] = [
  { symptom: 'Layu mendadak, pangkal batang busuk', cause: 'Jamur tanah (Phytophthora/Fusarium), kandang mentah, genangan', action: 'Cabut & buang tanaman; kocor mankozeb di lubang sekitar; perbaiki drainase' },
  { symptom: 'Bercak cekung pada buah', cause: 'Antraknosa/patek (lembap)', action: 'Buang buah sakit; fungisida spray; kalsium; cek pH' },
  { symptom: 'Daun keriting ke atas, keperakan', cause: 'Thrips/tungau', action: 'Prosedur thrips: Kalinet 3 harian → abamektin terpisah → ganti bahan aktif → Vitaron SL' },
  { symptom: 'Daun menguning & keriting, kerdil', cause: 'Virus kuning (vektor kutu kebul)', action: 'Kendalikan kutu kebul; Vitaron SL + Ambition/Premino; cabut yang parah' },
  { symptom: 'Bunga & buah muda rontok', cause: 'Stres, kurang Ca/B, cuaca ekstrem', action: 'Cal-Ha + Kalinet; Vitaron SL; jaga penyiraman' },
  { symptom: 'Ujung buah menghitam', cause: 'Kekurangan kalsium', action: 'Cal-Ha spray/kocor' },
  { symptom: 'Daun terbakar mendadak (coklat-hitam)', cause: 'Fitotoksik: dosis terlalu pekat / campuran salah / cuaca terik', action: 'Berhenti semprot 2–3 hari, siram bersih, beri asam amino saat pulih; tinjau campuran & dosis' },
  { symptom: 'Tanaman kerdil, tidak tumbuh', cause: 'Tanah asam/liat padat, dasaran berlebih, akar rusak', action: 'Cek pH & dolomit; perbaiki struktur tanah; kocor akar' },
  { symptom: 'Daun bawah menguning & rontok', cause: 'Kurang hara / pH turun / genangan', action: 'Susulan sesuai jadwal; cek pH' }
];
