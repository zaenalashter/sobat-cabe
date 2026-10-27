import type { Product, ProductCat } from '../lib/types';

export const PCAT: Record<ProductCat, string> = {
  pupuk: 'Pupuk & pembenah',
  hayati: 'Agen hayati',
  nutrisi: 'Nutrisi & ZPT',
  fungisida: 'Fungisida',
  insektisida: 'Insektisida',
  sarana: 'Sarana lain'
};

// Harga acuan (refLow/refHigh) hanya yang tercantum di panduan hal. 19; sisanya diisi dari catatan Anda.
export const CATALOG: Product[] = [
  { id: 'kandang', name: 'Pupuk kandang kambing matang', cat: 'pupuk', unit: 'kg', desc: 'Pupuk dasar. 1 sak ≈ 20 kg. Harus matang.' },
  { id: 'phonska', name: 'Phonska (Plus)', cat: 'pupuk', unit: 'kg', desc: 'Pupuk dasar' },
  { id: 'sp36', name: 'SP-36 / Phospat', cat: 'pupuk', unit: 'kg', desc: 'Pupuk dasar, pemacu akar' },
  { id: 'npk', name: 'NPK Mutiara 16-16-16 / NPK+TE', cat: 'pupuk', unit: 'kg', desc: 'Pupuk susulan 20/40/60/80 HST' },
  { id: 'dolomit', name: 'Dolomit', cat: 'pupuk', unit: 'kg', desc: 'Hanya bila pH < 5,5 (100–150 kg/1.000 m²)', manual: true },
  { id: 'powersoil', name: 'Powersoil (asam humat)', cat: 'pupuk', unit: 'kg', desc: 'Kocor H-1' },
  { id: 'silica', name: 'Silica Carbon', cat: 'pupuk', unit: 'kg', desc: 'Kocor H-1, struktur tanah' },
  { id: 'trichoderma', name: 'Trichoderma', cat: 'hayati', unit: 'kg', desc: 'Kocor H-1. Padanan: Trico-G, Biotrico', refLow: 70000, refHigh: 90000 },
  { id: 'm21', name: 'M21 Decomposer', cat: 'hayati', unit: 'L', desc: 'Fermentasi kandang (5 tutup/20 L)', refLow: 47000, refHigh: 65000, manual: true },
  { id: 'em4', name: 'EM4 pertanian (pengganti M21)', cat: 'hayati', unit: 'L', desc: 'Dicampur molase 1:1', refLow: 25000, refHigh: 35000, manual: true },
  { id: 'molase', name: 'Molase / tetes tebu', cat: 'hayati', unit: 'L', desc: 'Atau gula merah 1 kg dalam 2 L air panas', refLow: 15000, refHigh: 25000, manual: true },
  { id: 'mordenfol', name: 'Mordenfol', cat: 'nutrisi', unit: 'L', desc: 'Kocor akar. Padanan: pupuk cair tinggi P (Gandasil B)' },
  { id: 'amino', name: 'Asam amino (Premino/Ambition)', cat: 'nutrisi', unit: 'L', desc: 'Kocor akar & spray' },
  { id: 'kalinet', name: 'Kalinet (K + Boron)', cat: 'nutrisi', unit: 'L', desc: 'Spray generatif. Padanan: KNO3 + MKP' },
  { id: 'calha', name: 'Cal-Ha (kalsium organik)', cat: 'nutrisi', unit: 'kg', desc: 'Spray generatif. Padanan: kalsium nitrat/CaBor' },
  { id: 'vitaron', name: 'Vitaron SL (mikro chelate)', cat: 'nutrisi', unit: 'L', desc: 'Regenerasi sel pasca stres' },
  { id: 'mankozeb', name: 'Mankozeb (WP)', cat: 'fungisida', unit: 'kg', desc: 'Kocor 21/41/61/81 HST & spray menjelang merah' },
  { id: 'cabrio', name: 'Cabrio Top', cat: 'fungisida', unit: 'kg', desc: 'Hanya bila tanaman tua / serangan berat', manual: true },
  { id: 'abamektin', name: 'Abamektin', cat: 'insektisida', unit: 'L', desc: 'Spray vegetatif (thrips & tungau)' },
  { id: 'insektisida', name: 'Insektisida pergantian', cat: 'insektisida', unit: 'L', desc: 'Spray generatif; gilir bahan aktif (piridaben, imidakloprid, dll.)' },
  { id: 'benih', name: 'Benih Ori 212', cat: 'sarana', unit: 'unit', desc: 'Sachet/pak', manual: true },
  { id: 'mulsa', name: 'Mulsa plastik', cat: 'sarana', unit: 'unit', desc: 'Roll', manual: true },
  { id: 'ajir', name: 'Ajir', cat: 'sarana', unit: 'unit', desc: 'Batang', manual: true }
];

// Estimasi biaya per 1.000–1.200 m² (panduan hal. 22)
export const BUDGET: [string, number, number][] = [
  ['Benih Ori 212', 60000, 100000],
  ['Kandang + Phonska + SP-36 (+ dolomit)', 700000, 1100000],
  ['Agen hayati & dekomposer', 100000, 250000],
  ['Mordenfol + asam amino (kocor akar 3×)', 150000, 250000],
  ['Mulsa plastik + ajir', 650000, 950000],
  ['NPK susulan (4×)', 500000, 800000],
  ['Fungisida & insektisida 1 musim', 900000, 1500000],
  ['Kalinet + Cal-Ha + Vitaron SL', 350000, 600000]
];
