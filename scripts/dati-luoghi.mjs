// Prepara i luoghi di tutta Italia in piccoli riquadri (0,25° × 0,25°), così l'app li scarica in un attimo
// invece di chiedere ogni volta a OpenStreetMap. Gira su GitHub Actions (vedi .github/workflows/dati-luoghi.yml).
// Uscita: <cartella>/t/<lat>_<lng>.json (lat e lng dell'angolo in basso a sinistra, in quarti di grado) e indice.json
import { mkdirSync, writeFileSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { PARTS, classify, TILE } from '../src/places.js';

const OUT = process.argv[2] || 'dati';
const EP = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
const UA = 'VicinaExtra/1.1 (+https://github.com/conaeduardo4-cmyk/vicina-extra)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
mkdirSync(OUT + '/t', { recursive: true });

// blocchi di 1° che coprono l'Italia (quelli in mare tornano vuoti in fretta)
const BLOCKS = [];
for (let la = 36; la < 47.2; la++) for (let lo = 6; lo < 19; lo++) BLOCKS.push([la, lo]);
const ONLY = process.env.SOLO ? process.env.SOLO.split(';').map(x => x.split(',').map(Number)) : null;

async function ask(body) {
  let last;
  for (let tent = 0; tent < 6; tent++) {
    const url = EP[tent % EP.length];
    try {
      const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(body), headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(200000) });
      if (!r.ok) throw new Error(url + ' HTTP ' + r.status);
      const j = await r.json();
      if (j.remark && /runtime error|timed out|out of memory/i.test(j.remark)) throw new Error(url + ' ' + j.remark);
      return j.elements || [];
    } catch (e) { last = e; console.log('  riprovo:', e.message); await sleep(5000 * (tent + 1)); }
  }
  throw last;
}

const tiles = new Map(); let tot = 0, fail = [];
// i riquadri della volta prima restano se un blocco non risponde
for (const f of readdirSync(OUT + '/t')) { try { tiles.set(f.replace('.json', ''), new Map(JSON.parse(readFileSync(`${OUT}/t/${f}`, 'utf8')).map(r => [r[0], r]))); } catch { /* */ } }
const inBlock = (k, la, lo) => { const [a, b] = k.split('_').map(Number); return a * TILE >= la - 1e-9 && a * TILE < la + 1 - 1e-9 && b * TILE >= lo - 1e-9 && b * TILE < lo + 1 - 1e-9; };
const t0 = Date.now();
for (const [la, lo] of BLOCKS) {
  if (ONLY && !ONLY.some(([a, b]) => a === la && b === lo)) continue;
  const q = `[out:json][timeout:180][maxsize:1073741824][bbox:${la},${lo},${la + 1},${lo + 1}];(\n${PARTS.map(p => p + ';').join('\n')}\n);out center tags;`;
  let els;
  try { els = await ask(q); } catch (e) { fail.push(`${la},${lo}`); console.log(`blocco ${la},${lo}: ERRORE ${e.message}`); continue; }
  for (const k of [...tiles.keys()]) if (inBlock(k, la, lo)) tiles.delete(k);
  let n = 0;
  for (const e of els) {
    const t = e.tags || {}, lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon, name = t.name || t.official_name;
    if (lat == null || !name) continue;
    const cat = classify(t); if (!cat) continue;
    const k = Math.floor(lat / TILE) + '_' + Math.floor(lng / TILE);
    const addr = [[t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' '), t['addr:city']].filter(Boolean).join(', ');
    const one = cat === 'lavoro' && !/impiego|collocamento|informalavoro|porta futuro/i.test(name + ' ' + (t.operator || '')) ? 'Agenzia per il lavoro' : '';
    // formato compatto: [id, cat, nome, lat, lng, indirizzo, telefono, sito, orari, accessibile, gratuito, descrizione, etichetta]
    const row = [e.type[0] + e.id, cat, name, +lat.toFixed(5), +lng.toFixed(5), addr, t.phone || t['contact:phone'] || '', t.website || t['contact:website'] || '', t.opening_hours || '', t.wheelchair || '', t.fee || '', (t.description || '').slice(0, 200), one];
    if (!tiles.has(k)) tiles.set(k, new Map());
    tiles.get(k).set(row[0], row); n++;
  }
  tot += n;
  console.log(`blocco ${la},${lo}: ${els.length} elementi, ${n} luoghi`);
  await sleep(1500);
}
rmSync(OUT + '/t', { recursive: true, force: true }); mkdirSync(OUT + '/t', { recursive: true });
const idx = {}; tot = 0;
for (const [k, m] of tiles) { const rows = [...m.values()]; if (!rows.length) continue; writeFileSync(`${OUT}/t/${k}.json`, JSON.stringify(rows)); idx[k] = rows.length; tot += rows.length; }
writeFileSync(`${OUT}/indice.json`, JSON.stringify({ at: new Date().toISOString(), tile: TILE, tiles: idx, totale: tot, falliti: fail }));
console.log(`::notice title=Luoghi pronti::${tot} luoghi in ${tiles.size} riquadri, ${((Date.now() - t0) / 60000).toFixed(1)} minuti. Blocchi falliti: ${fail.join(' ') || 'nessuno'}`);
if (tot === 0) process.exit(1);
