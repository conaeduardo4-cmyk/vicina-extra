// Mappa (MapLibre + OpenFreeMap): stessa cartina scura di Vicina.
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { darkPhysical, OFM } from './map-style.js';
import { CAT } from './data.js';

async function pickStyle() {
  try { const r = await fetch(OFM + '/planet', { cache: 'force-cache' }); if (r.ok) return darkPhysical({ relief: true }); } catch { /* offline */ }
  return null;
}

export async function createMap(el, { center, onPick }) {
  const style = await pickStyle();
  if (!style) throw new Error('offline');
  const map = new maplibregl.Map({
    container: el, style, center: [center.lng, center.lat], zoom: 14,
    attributionControl: { compact: true }, dragRotate: false, pitchWithRotate: false,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2), fadeDuration: 0, maxTileCacheSize: 60
  });
  map.touchZoomRotate.disableRotation();
  await new Promise(r => (map.loaded() ? r() : map.once('load', r)));
  el.querySelectorAll('.maplibregl-compact-show').forEach(x => x.classList.remove('maplibregl-compact-show'));
  try { new ResizeObserver(() => map.resize()).observe(el); } catch { /* vecchio */ }

  let me = null; const marks = new Map();
  function setMe(p) {
    if (!p) return;
    if (!me) { const e = document.createElement('div'); e.className = 'pin-me'; me = new maplibregl.Marker({ element: e }).setLngLat([p.lng, p.lat]).addTo(map); }
    else me.setLngLat([p.lng, p.lat]);
  }
  function setPlaces(list) {
    const seen = new Set();
    for (const p of list) {
      seen.add(p.id);
      if (marks.has(p.id)) continue;
      const c = CAT[p.cat], e = document.createElement('button');
      e.className = 'pin-place'; e.type = 'button'; e.style.background = c.c[2];
      e.setAttribute('aria-label', c.one + ': ' + p.name);
      e.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${c.ic}"/></svg>`;
      e.addEventListener('click', ev => { ev.stopPropagation(); onPick?.(p); });
      marks.set(p.id, new maplibregl.Marker({ element: e }).setLngLat([p.lng, p.lat]).addTo(map));
    }
    for (const [id, m] of marks) if (!seen.has(id)) { m.remove(); marks.delete(id); }
  }
  return {
    setMe, setPlaces,
    center(p, z = 14.5) { map.flyTo({ center: [p.lng, p.lat], zoom: z, duration: 600 }); },
    fit(list, p) {
      const pts = list.slice(0, 25).map(x => [x.lng, x.lat]); if (p) pts.push([p.lng, p.lat]);
      if (pts.length < 2) return;
      const b = pts.reduce((bb, q) => bb.extend(q), new maplibregl.LngLatBounds(pts[0], pts[0]));
      map.fitBounds(b, { padding: { top: 150, bottom: 60, left: 40, right: 40 }, maxZoom: 15.5, duration: 500 });
    },
    resize() { map.resize(); }
  };
}
