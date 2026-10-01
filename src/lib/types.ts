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

export interface AppState {
  plantings: Planting[];
  harvests: Harvest[];
  done: Record<string, string>; // `${plantingId}:${taskKey}` -> ISO tanggal selesai
  settings: Settings;
}
