export type Variety = 'rawit' | 'keriting';

export interface Planting {
  id: string;
  name: string;
  variety: Variety;
  plantDate: string; // YYYY-MM-DD = 0 HST
  plants: number;
  holes: 1 | 2; // lubang susulan per tanaman
  shift: number; // geser jadwal (hari, negatif = dimajukan) untuk fase setelah tanam
  includeSaran: boolean; // sertakan tugas opsional "SARAN SAYA"
  capital?: number; // modal (Rp)
  sprayTanks?: number; // tangki 16 L per aplikasi spray (perkiraan, untuk daftar belanja)
  createdAt: string;
}

export interface Harvest {
  id: string;
  plantingId: string;
  date: string;
  kg: number;
  price?: number; // Rp/kg
}

export type Category = 'persiapan' | 'tanam' | 'kocor' | 'susulan' | 'fungisida' | 'spray' | 'perawatan' | 'panen';
export type Source = 'SOP' | 'SARAN' | '920';

export interface Task {
  key: string;
  baseHst: number;
  hst: number;
  date: string;
  cat: Category;
  title: string;
  method: string;
  items: string[];
  note?: string;
  sources: Source[];
  optional?: boolean;
}

export interface Settings {
  notify: boolean;
  endHst: number; // akhir jadwal spray generatif
}

export type ProductCat = 'pupuk' | 'hayati' | 'nutrisi' | 'fungisida' | 'insektisida' | 'sarana';
export interface Product {
  id: string;
  name: string;
  cat: ProductCat;
  unit: 'kg' | 'L' | 'unit';
  desc?: string;
  refLow?: number; // patokan harga per unit dari panduan
  refHigh?: number;
  manual?: boolean; // tidak dihitung otomatis di daftar belanja
  custom?: boolean;
}
/** Catatan pembelian ('beli') atau pengecekan harga ('cek'). */
export interface Entry {
  id: string;
  kind: 'beli' | 'cek';
  date: string;
  productId: string;
  qty: number;
  total: number; // Rp untuk qty tsb
  store?: string;
  plantingId?: string;
  note?: string;
}

export interface AppState {
  plantings: Planting[];
  entries: Entry[];
  customProducts: Product[];
  shopDone: Record<string, boolean>; // `${plantingId}:${productId}`
  harvests: Harvest[];
  done: Record<string, string>; // `${plantingId}:${taskKey}` -> ISO tanggal selesai
  settings: Settings;
}
