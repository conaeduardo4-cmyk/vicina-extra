// Vicina ↔ Vicina Extra: le due app si aprono a vicenda e si passano le informazioni nel link,
// direttamente sul telefono (niente server). Se l'altra app non c'è, la si installa dall'APK su GitHub:
// si apre la schermata di installazione di Android.
import { Capacitor, registerPlugin } from '@capacitor/core';

const NATIVE = Capacitor.isNativePlatform(), ANDROID = Capacitor.getPlatform() === 'android';
export const VICINA = {
  pkg: 'it.vicina.app', scheme: 'vicina://',
  apk: 'https://github.com/conaeduardo4-cmyk/vicina-app/releases/latest/download/Vicina.apk',
  web: 'https://vicina.netlify.app'
};
const Apk = ANDROID ? registerPlugin('ApkUpdater') : null;
let Launcher = null;
const launcher = async () => Launcher || (Launcher = NATIVE ? (await import('@capacitor/app-launcher')).AppLauncher : null);

const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* */ } } };

// dati in un link: JSON in base64 «da URL»
export const pack = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const unpack = s => { try { return JSON.parse(decodeURIComponent(escape(atob(String(s).replace(/-/g, '+').replace(/_/g, '/'))))); } catch { return null; } };

// quello che Vicina ci ha mandato l'ultima volta
export const fromVicina = () => { try { return JSON.parse(ls.get('vicina:info') || 'null'); } catch { return null; } };
export const saveFromVicina = d => { if (d && typeof d === 'object') ls.set('vicina:info', JSON.stringify({ ...d, got: Date.now() })); };

export async function installed() {
  if (!ANDROID) return false;
  try { const L = await launcher(); return !!(await L.canOpenUrl({ url: VICINA.pkg })).value; } catch { return false; }
}

// apre Vicina su una sezione (sos, walk, siren, extra…) passando le nostre informazioni
export async function openVicina(path = 'extra', data) {
  const url = VICINA.scheme + path + (data ? (path.includes('?') ? '&' : '?') + 'd=' + pack(data) : '');
  const L = await launcher();
  if (L) { try { await L.openUrl({ url }); return true; } catch { /* sotto */ } try { await L.openUrl({ url: VICINA.pkg }); return true; } catch { /* */ } }
  return false;
}

// installa Vicina: scarica l'APK dall'ultima release su GitHub e apre l'installer di Android
export async function installVicina(onProgress) {
  if (!Apk) { window.open(VICINA.web, '_blank'); return 'web'; }
  const info = await Apk.info().catch(() => ({ canInstall: true }));
  if (info.canInstall === false) { await Apk.openInstallSettings().catch(() => {}); return 'settings'; }
  const h = await Apk.addListener('progress', e => onProgress?.(e.percent));
  try { await Apk.downloadAndInstall({ url: VICINA.apk, name: 'vicina.apk' }); return 'ok'; }
  finally { h.remove(); }
}

// link in arrivo: vicinaextra://luoghi/antiviolenza?d=…
export function parseLink(url) {
  const m = /^vicinaextra:\/\/([^?#]*)(?:\?([^#]*))?/i.exec(url || ''); if (!m) return null;
  const parts = m[1].split('/').filter(Boolean), q = new URLSearchParams(m[2] || '');
  return { route: parts[0] || 'home', arg: decodeURIComponent(parts[1] || ''), q, data: q.get('d') ? unpack(q.get('d')) : null };
}
export async function onLink(cb) {
  if (!NATIVE) {   // prova nel browser: #vx=luoghi/consultori
    const h = () => { const m = location.hash.match(/vx=([^&]+)/); if (m) { cb('vicinaextra://' + decodeURIComponent(m[1])); history.replaceState(null, '', location.pathname); } };
    addEventListener('hashchange', h); setTimeout(h, 600); return;
  }
  try {
    const { App } = await import('@capacitor/app');
    App.addListener('appUrlOpen', e => cb(e.url));
    const l = await App.getLaunchUrl(); if (l?.url) cb(l.url);
  } catch { /* */ }
}
