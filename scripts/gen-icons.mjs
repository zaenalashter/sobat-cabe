// Membuat ikon PNG tanpa dependensi (zlib bawaan Node).
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const crcT = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (b) => { let c = ~0; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return ~c >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const png = (w, px) => {
  const raw = Buffer.alloc((w * 4 + 1) * w);
  for (let y = 0; y < w; y++) { raw[y * (w * 4 + 1)] = 0; px.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(w, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const BG = hex('#1f3a2e'), SUN = hex('#a67f2a'), RED = hex('#b83a2e'), GREEN = hex('#5b8a47');
const sm = (e, x) => Math.min(1, Math.max(0, 0.5 - x / e)); // coverage dari jarak bertanda

function render(size, scale) { // scale<1 untuk area aman maskable
  const px = Buffer.alloc(size * size * 4);
  const e = 1.5 / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let u = ((x + 0.5) / size - 0.5) / scale, v = ((y + 0.5) / size - 0.5) / scale;
    let c = BG.slice();
    const mix = (col, a) => { c = c.map((k, i) => k * (1 - a) + col[i] * a); };
    mix(SUN, sm(e / scale, Math.hypot(u - 0.2, v + 0.22) - 0.14));
    // cabai: elips diputar -40°
    const th = (-40 * Math.PI) / 180, du = u + 0.02, dv = v - 0.04;
    const ru = du * Math.cos(th) - dv * Math.sin(th), rv = du * Math.sin(th) + dv * Math.cos(th);
    const t = Math.min(1, Math.abs(ru) / 0.32);
    const w = 0.12 * Math.sqrt(1 - t * t) * (0.45 + 0.55 * Math.min(1, Math.max(0, (0.32 - ru) / 0.64)));
    mix(RED, sm(e / scale, Math.abs(rv) - w + (Math.abs(ru) > 0.32 ? 1 : 0)));
    // tangkai
    mix(GREEN, sm(e / scale, Math.hypot(u - 0.25, v - 0.02) - 0.075));
    const o = (y * size + x) * 4; px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255;
  }
  return png(size, px);
}
writeFileSync('public/icons/icon-192.png', render(192, 1));
writeFileSync('public/icons/icon-512.png', render(512, 1));
writeFileSync('public/icons/maskable-512.png', render(512, 0.72));
writeFileSync('public/icons/apple-touch-icon.png', render(180, 0.9));
console.log('ikon dibuat');
