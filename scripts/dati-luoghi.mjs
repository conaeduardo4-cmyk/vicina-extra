// Prepara i luoghi di tutta Italia in piccoli riquadri (0,25° × 0,25°), così l'app li scarica in un attimo
// invece di chiedere ogni volta a OpenStreetMap. Gira su GitHub Actions (vedi .github/workflows/dati-luoghi.yml):
// l'estratto dell'Italia di Geofabrik viene filtrato con osmium e qui si riconoscono le categorie.
// Uso: node scripts/dati-luoghi.mjs luoghi.geojsonseq cartella-di-uscita
import { createReadStream, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { classify, relevant, TILE } from '../src/places.js';

const [IN, OUT = 'out'] = process.argv.slice(2);
rmSync(OUT + '/t', { recursive: true, force: true }); mkdirSync(OUT + '/t', { recursive: true });

// centro approssimato di una geometria GeoJSON
function center(g) {
  if (!g) return null;
  if (g.type === 'Point') return g.coordinates;
  const pts = []; const walk = c => { if (typeof c[0] === 'number') pts.push(c); else c.forEach(walk); }; walk(g.coordinates);
  if (!pts.length) return null;
  let x = 0, y = 0; for (const p of pts) { x += p[0]; y += p[1]; }
  return [x / pts.length, y / pts.length];
}

const tiles = new Map(), per = {}; let tot = 0, seen = 0;
const rl = createInterface({ input: createReadStream(IN), crlfDelay: Infinity });
for await (let line of rl) {
  line = line.replace(/^\x1e/, '').trim(); if (!line) continue;
  let f; try { f = JSON.parse(line); } catch { continue; }
  seen++;
  const t = f.properties || {}, name = t.name || t.official_name;
  if (!name || !relevant(t)) continue;
  const cat = classify(t); if (!cat) continue;
  const c = center(f.geometry); if (!c) continue;
  const [lng, lat] = c;
  const id = String(f.id ?? t['@id'] ?? (t['@type'] || 'x') + name + lat.toFixed(4));
  const k = Math.floor(lat / TILE) + '_' + Math.floor(lng / TILE);
  const addr = [[t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' '), t['addr:city']].filter(Boolean).join(', ');
  const one = cat === 'lavoro' && !/impiego|collocamento|informalavoro|porta futuro/i.test(name + ' ' + (t.operator || '')) ? 'Agenzia per il lavoro' : '';
  // formato compatto: [id, cat, nome, lat, lng, indirizzo, telefono, sito, orari, accessibile, gratuito, descrizione, etichetta]
  const row = [id, cat, name, +lat.toFixed(5), +lng.toFixed(5), addr, t.phone || t['contact:phone'] || '', t.website || t['contact:website'] || '', t.opening_hours || '', t.wheelchair || '', t.fee || '', String(t.description || '').slice(0, 200), one];
  if (!tiles.has(k)) tiles.set(k, new Map());
  const m = tiles.get(k), dk = name.toLowerCase().replace(/\W+/g, '') + row[3].toFixed(3) + row[4].toFixed(3);
  if (m.has(dk)) continue;
  m.set(dk, row); tot++; per[cat] = (per[cat] || 0) + 1;
}
const idx = {};
for (const [k, m] of tiles) { const rows = [...m.values()]; writeFileSync(`${OUT}/t/${k}.json`, JSON.stringify(rows)); idx[k] = rows.length; }
writeFileSync(`${OUT}/indice.json`, JSON.stringify({ at: new Date().toISOString(), tile: TILE, totale: tot, categorie: per, tiles: idx }));
console.log(`::notice title=Luoghi pronti::${tot} luoghi (da ${seen} oggetti) in ${tiles.size} riquadri. ${JSON.stringify(per)}`);
// controllo: alcune città devono avere luoghi
const chk = { Roma: [41.9, 12.49], Milano: [45.46, 9.19], Napoli: [40.85, 14.27], Palermo: [38.12, 13.36], Albano: [41.73, 12.66] };
console.log('::notice title=Controllo città::' + Object.entries(chk).map(([n, [la, lo]]) => `${n}: ${idx[Math.floor(la / TILE) + '_' + Math.floor(lo / TILE)] || 0}`).join(', '));
if (tot < 1000) { console.log('::error::Troppo pochi luoghi, non pubblico'); process.exit(1); }
