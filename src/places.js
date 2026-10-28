// Luoghi vicini da OpenStreetMap (Overpass): gratuiti, senza chiave. Risultati in cache per 6 ore.
import { CATS } from './data.js';

const EP = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
const KEY = 'places:v1';
const TTL = 6 * 3600e3;

export const km = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, dLa = r(b.lat - a.lat), dLo = r(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
export const dist = k => k < 1 ? Math.round(k * 100) * 10 + ' m' : k.toFixed(k < 10 ? 1 : 0).replace('.', ',') + ' km';

const cacheGet = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
const cacheSet = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* pieno */ } };

function query(lat, lng, radius) {
  const around = `(around:${radius},${lat.toFixed(5)},${lng.toFixed(5)})`;
  const parts = CATS.flatMap(c => c.q.map(q => q + around + ';')).join('\n');
  return `[out:json][timeout:25];(\n${parts}\n);out center tags 400;`;
}

async function fetchOne(url, body, ms) {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(body), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ac.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

function toPlace(e, me) {
  const t = e.tags || {}, lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
  if (lat == null || !t.name) return null;
  const cat = CATS.find(c => c.m(t)); if (!cat) return null;
  const addr = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ');
  return {
    id: e.type + '/' + e.id, cat: cat.id, name: t.name, lat, lng,
    addr: [addr, t['addr:city']].filter(Boolean).join(', '),
    phone: t.phone || t['contact:phone'] || '', web: t.website || t['contact:website'] || '', email: t.email || t['contact:email'] || '',
    hours: t.opening_hours || '', wheel: t.wheelchair || '', fee: t.fee || '', desc: t.description || '',
    d: me ? km(me, { lat, lng }) : null
  };
}

// luoghi intorno a me (5 km, se pochi 12 km)
export async function nearby(me, { force = false } = {}) {
  const c = cacheGet();
  if (!force && c && Date.now() - c.at < TTL && km(c.at_pos, me) < 1.5) return c.items.map(p => ({ ...p, d: km(me, p) })).sort((a, b) => a.d - b.d);
  let items = null, err = null;
  for (const radius of [5000, 12000]) {
    const body = query(me.lat, me.lng, radius);
    for (const url of EP) {
      try { const j = await fetchOne(url, body, 30000); items = (j.elements || []).map(e => toPlace(e, me)).filter(Boolean); break; }
      catch (e) { err = e; }
    }
    if (items && items.length >= 8) break;
  }
  if (!items) { if (c) return c.items.map(p => ({ ...p, d: km(me, p) })).sort((a, b) => a.d - b.d); throw err || new Error('offline'); }
  const seen = new Set(); items = items.filter(p => { const k = p.name.toLowerCase() + p.lat.toFixed(3); if (seen.has(k)) return false; seen.add(k); return true; });
  items.sort((a, b) => a.d - b.d);
  cacheSet({ at: Date.now(), at_pos: me, items });
  return items;
}

export const dirUrl = p => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`;
export const hoursTxt = h => !h ? '' : h === '24/7' ? 'Aperto 24 ore su 24' : h.replace(/Mo/g, 'lun').replace(/Tu/g, 'mar').replace(/We/g, 'mer').replace(/Th/g, 'gio').replace(/Fr/g, 'ven').replace(/Sa/g, 'sab').replace(/Su/g, 'dom').replace(/PH/g, 'festivi').replace(/off/g, 'chiuso').replace(/;/g, ' · ');
