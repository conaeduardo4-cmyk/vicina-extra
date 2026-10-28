// Diagnosi: quanto ci mette ogni server di OpenStreetMap a rispondere, con query piccole e medie.
import { PARTS } from '../src/places.js';
const EP = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const UA = 'VicinaExtra/1.1 (+https://github.com/conaeduardo4-cmyk/vicina-extra)';
const q = bb => `[out:json][timeout:90][bbox:${bb}];(\n${PARTS.map(p => p + ';').join('\n')}\n);out center tags;`;
const TESTS = { 'Roma 0.25': '41.75,12.375,42,12.625', 'Milano 0.25': '45.375,9.125,45.625,9.375', 'Roma 0.5': '41.5,12.25,42,12.75' };
const out = [];
for (const [n, bb] of Object.entries(TESTS)) for (const url of EP) {
  const t = Date.now();
  try {
    const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(q(bb)), headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA }, signal: AbortSignal.timeout(100000) });
    const txt = await r.text(); let n2 = '?'; try { n2 = JSON.parse(txt).elements.length; } catch { n2 = txt.slice(0, 60).replace(/\s+/g, ' '); }
    out.push(`${n} ${new URL(url).host}: ${r.status} ${n2} in ${((Date.now() - t) / 1000).toFixed(1)}s`);
  } catch (e) { out.push(`${n} ${new URL(url).host}: ERR ${e.message} in ${((Date.now() - t) / 1000).toFixed(1)}s`); }
}
console.log('::notice title=Server OSM::' + out.join(' || '));
