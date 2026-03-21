// gen-icons.js — generates icon16.png, icon48.png, icon128.png using Node stdlib only
const zlib = require("zlib");
const fs   = require("fs");
const path = require("path");

// ── CRC32 (needed for PNG chunks) ────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  const out = Buffer.alloc(4 + 4 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(crcInput), 8 + data.length);
  return out;
}

function makePNG(size, rgba) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA

  // Raw scanlines: 1 filter byte + 4 bytes/pixel per row
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * (size * 4 + 1) + 1 + x * 4;
      raw[dst] = rgba[src]; raw[dst+1] = rgba[src+1];
      raw[dst+2] = rgba[src+2]; raw[dst+3] = rgba[src+3];
    }
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Point-in-polygon (ray casting) ───────────────────────────────────────────
function inPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

// ── Icon renderer ─────────────────────────────────────────────────────────────
function drawIcon(size) {
  const s = size;
  const r = s * 0.22; // corner radius

  // Feather-Icons lightning bolt polygon (unit fractions)
  const BOLT_F = [
    [0.54, 0.10],  // top tip
    [0.14, 0.58],  // far left mid
    [0.50, 0.58],  // inner notch left
    [0.46, 0.90],  // bottom tip
    [0.86, 0.42],  // far right mid
    [0.50, 0.42],  // inner notch right
  ];
  const bolt = BOLT_F.map(([fx, fy]) => [fx * s, fy * s]);

  const rgba = new Uint8Array(s * s * 4);

  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const px = x + 0.5, py = y + 0.5;
      const i  = (y * s + x) * 4;

      // Rounded-rect signed distance (negative = inside)
      const qx = Math.abs(px - s / 2) - (s / 2 - r);
      const qy = Math.abs(py - s / 2) - (s / 2 - r);
      const dist =
        Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) +
        Math.min(Math.max(qx, qy), 0) - r;

      if (dist > 1.0) { rgba[i+3] = 0; continue; } // fully outside

      // Gradient: top-left #a78bf8 → bottom-right #4e38c4
      const t  = (px + py) / (2 * s);
      const bgR = Math.round(167 + (78  - 167) * t);
      const bgG = Math.round(139 + (56  - 139) * t);
      const bgB = Math.round(248 + (196 - 248) * t);

      // Alpha for antialiased rounded corner
      const alpha = dist < -0.5
        ? 255
        : Math.round(255 * Math.max(0, 1 - (dist + 0.5)));

      if (inPolygon(px, py, bolt)) {
        rgba[i] = 255; rgba[i+1] = 255; rgba[i+2] = 255;
      } else {
        rgba[i] = bgR; rgba[i+1] = bgG; rgba[i+2] = bgB;
      }
      rgba[i+3] = alpha;
    }
  }

  return rgba;
}

// ── Write files ───────────────────────────────────────────────────────────────
const iconsDir = path.join(__dirname, "icons");

for (const size of [16, 48, 128]) {
  const pixels = drawIcon(size);
  const png    = makePNG(size, pixels);
  const dest   = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(dest, png);
  console.log(`✓ ${dest}  (${png.length} bytes)`);
}

console.log("\nDone. Reload the extension in chrome://extensions ↺");
