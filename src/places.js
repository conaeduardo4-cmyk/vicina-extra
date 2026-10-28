// Luoghi vicini da OpenStreetMap (Overpass): gratuiti, senza chiave.
// La ricerca usa i tag (veloce, indicizzata) dentro un riquadro intorno a te; i nomi servono solo a riconoscere la categoria.
// Si chiede a più server insieme e vince il primo che risponde. Raggio che si allarga se intorno c'è poco. Cache 6 ore.

const EP = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];
const KEY = 'places:v2';
const TTL = 6 * 3600e3;
const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* pieno */ } } };

export const km = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, dLa = r(b.lat - a.lat), dLo = r(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
export const dist = k => k < 1 ? Math.round(k * 100) * 10 + ' m' : k.toFixed(k < 10 ? 1 : 0).replace('.', ',') + ' km';

// cosa chiedere a OpenStreetMap: solo filtri per tag (i filtri sul solo nome sono lentissimi)
const PARTS = [
  'nwr["amenity"="social_facility"]',
  'nwr["amenity"~"^(community_centre|social_centre|food_bank|youth_centre)$"]',
  'nwr["healthcare"="counselling"]',
  'nwr["healthcare"]["name"~"consultori",i]',
  'nwr["amenity"="clinic"]["name"~"consultori",i]',
  'nwr["office"~"^(employment_agency|association|ngo|charity|foundation|tax_advisor)$"]',
  'nwr["office"="government"]["name"~"social|abitativ|casa|impiego|lavoro|anagrafe|municipio|inps",i]',
  'nwr["club"]["name"~"anzian|giovan|disabil|popolar|volontar",i]',
  'nwr["leisure"~"^(sports_centre|fitness_centre|pitch|sports_hall)$"]["name"~"popolar|orator",i]',
  'nwr["amenity"="place_of_worship"]["name"~"orator",i]',
  'nwr["building"]["name"~"^orator",i]'
];
function query(me, r) {
  const dLa = r / 111.32, dLo = r / (111.32 * Math.cos(me.lat * Math.PI / 180));
  const bb = [me.lat - dLa, me.lng - dLo, me.lat + dLa, me.lng + dLo].map(x => x.toFixed(4)).join(',');
  return `[out:json][timeout:20][bbox:${bb}];(\n${PARTS.map(p => p + ';').join('\n')}\n);out center tags 900;`;
}

// riconosce la categoria dai tag: l'ordine conta (prima le più specifiche)
const has = (t, re) => re.test([t.name, t.official_name, t.operator, t.description, t['name:it']].filter(Boolean).join(' '));
export function classify(t) {
  const sf = t.social_facility || '', sfor = t['social_facility:for'] || '', am = t.amenity || '', of = t.office || '';
  if (sf === 'nursing_home' || sf === 'assisted_living' || sf === 'hospice') return null; // RSA e simili: non sono luoghi di incontro
  if (/women/.test(sfor) || has(t, /antiviolenza|casa delle donne|centro donn|casa rifugio|donne in difficolt/i)) return 'antiviolenza';
  if (t.healthcare === 'counselling' || has(t, /consultori/i)) return 'consultori';
  if (of === 'employment_agency' || has(t, /centr[oi] (per l.)?impiego|informalavoro|collocamento|job ?cent|porta futuro|sportello lavoro/i)) return 'lavoro';
  if (has(t, /\bA\.?T\.?E\.?R\b|\bALER\b|\bACER\b|\bARTE\b|sportello casa|emergenza abitativa|edilizia (residenziale|popolare)|\bSUNIA\b|\bSICET\b|\bUNIAT\b|inquilini|politiche abitative/i)) return 'casa';
  if (of === 'tax_advisor' || has(t, /patronato|\bC\.?A\.?F\b|assistenza fiscale|\bINCA\b|\bINAS\b|\bACLI\b|\bITAL\b|\bEPACA\b|\bENAPA\b|\bINAPA\b|\bEPASA\b|\bANMIL\b/i)) return 'patronati';
  if (/disabled|mental_health/.test(sfor) || has(t, /\bANFFAS\b|\bUILDM\b|\bUICI\b|\bENS\b|\bAIAS\b|\bANMIC\b|\bFISH\b|\bFAND\b|disabil|handicap|autis|sindrome di down|ciechi|sordi|non vedent|paraplegic|special olympics/i)) return 'disabilita';
  if (sf === 'outreach' || has(t, /servizi? social|segretariato sociale|politiche sociali|sportello sociale|welfare|assistenti sociali/i)) return 'sociali';
  if (['shelter', 'soup_kitchen', 'food_bank', 'clothing_bank', 'dairy_kitchen'].includes(sf) || am === 'food_bank' || /homeless/.test(sfor) || has(t, /\bmensa\b|dormitori|banco alimentare|emporio solidale|centro d.ascolto|senza (fissa )?dimora/i)) return 'accoglienza';
  if ((/senior/.test(sfor) && sf !== 'group_home') || t.community_centre === 'senior_centre' || has(t, /anzian|terza et|\bAUSER\b|\bANTEAS\b|\bANCeSCAO\b|over ?6\d|pensionat/i)) return 'anziani';
  if (has(t, /orator/i)) return 'oratori';
  if (t.community_centre === 'youth_centre' || am === 'youth_centre' || /juvenile|child/.test(sfor) || has(t, /informagiovani|giovan|aggregazione|youth|ludotec|spazio ragazzi|centro ragazzi/i)) return 'giovani';
  if (t.leisure || has(t, /palestra popolare|boxe popolare|sport popolare|polisportiva popolare/i)) return has(t, /popolar/i) ? 'palestre' : null;
  if (am === 'community_centre' || am === 'social_centre' || has(t, /centro (civico|sociale|culturale|di quartiere)|casa del quartiere|casa di quartiere/i)) return 'quartiere';
  if (/^(association|ngo|charity|foundation)$/.test(of) || t.club || has(t, /volontari|\bCSV\b|caritas|croce rossa|misericordia|pubblica assistenza|sant.egidio|\bonlus\b|\bodv\b|\baps\b/i)) return 'volontariato';
  if (am === 'social_facility') return 'sociali';
  return null;
}

function toPlace(e, me) {
  const t = e.tags || {}, lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
  const name = t.name || t.official_name || '';
  if (lat == null || !name) return null;
  const cat = classify(t); if (!cat) return null;
  const addr = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ');
  return {
    id: e.type + '/' + e.id, cat, name, lat, lng,
    addr: [addr, t['addr:city']].filter(Boolean).join(', '),
    phone: t.phone || t['contact:phone'] || '', web: t.website || t['contact:website'] || '', email: t.email || t['contact:email'] || '',
    hours: t.opening_hours || '', wheel: t.wheelchair || '', fee: t.fee || '', desc: t.description || '',
    d: me ? km(me, { lat, lng }) : null
  };
}

// chiede a tutti i server insieme: il primo che risponde bene vince, gli altri si fermano
async function race(body, ms) {
  const ctrls = EP.map(() => new AbortController());
  const t = setTimeout(() => ctrls.forEach(c => c.abort()), ms);
  try {
    return await Promise.any(EP.map(async (url, i) => {
      const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(body), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctrls[i].signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      if (!Array.isArray(j.elements)) throw new Error('risposta strana');
      if (!j.elements.length && /runtime error|timed out/i.test(j.remark || '')) throw new Error(j.remark);
      ctrls.forEach((c, k) => { if (k !== i) c.abort(); });
      return j;
    }));
  } catch (e) { throw (e && e.errors && e.errors[0]) || e; }
  finally { clearTimeout(t); }
}

function clean(items, me) {
  const seen = new Set();
  return items.filter(p => { const k = p.name.toLowerCase().replace(/\W+/g, '') + p.lat.toFixed(3) + p.lng.toFixed(3); if (seen.has(k)) return false; seen.add(k); return true; })
    .map(p => ({ ...p, d: km(me, p) })).sort((a, b) => a.d - b.d);
}

// luoghi intorno a me: 3 km, poi 7 e 15 se intorno c'è poco. onPartial mostra subito i primi risultati.
export async function nearby(me, { force = false, onPartial } = {}) {
  let c = null; try { c = JSON.parse(ls.get(KEY) || 'null'); } catch { /* */ }
  const fresh = c && Date.now() - c.at < TTL && km(c.at_pos, me) < 1;
  if (!force && fresh) return clean(c.items, me);
  let items = null, err = null;
  for (const r of [3, 7, 15]) {
    try {
      const j = await race(query(me, r), r < 5 ? 25000 : 35000);
      items = j.elements.map(e => toPlace(e, me)).filter(Boolean);
      items = clean(items, me);
      if (items.length >= 25 || r === 15) break;
      onPartial?.(items);
    } catch (e) { err = e; if (items) break; }
  }
  if (!items) { if (c?.items?.length) return clean(c.items, me); throw err || new Error('offline'); }
  ls.set(KEY, JSON.stringify({ at: Date.now(), at_pos: me, items }));
  return items;
}

export const dirUrl = p => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`;
export const hoursTxt = h => !h ? '' : h === '24/7' ? 'Aperto 24 ore su 24' : h.replace(/Mo/g, 'lun').replace(/Tu/g, 'mar').replace(/We/g, 'mer').replace(/Th/g, 'gio').replace(/Fr/g, 'ven').replace(/Sa/g, 'sab').replace(/Su/g, 'dom').replace(/PH/g, 'festivi').replace(/off/g, 'chiuso').replace(/;/g, ' · ');
