// Compatibilità: va importato per primo.
// 1) Aggiunge le funzioni che mancano sui telefoni più vecchi (WebView Android prima della 93, iPhone prima di iOS 15.4):
//    senza, la mappa e la ricerca dei luoghi si fermano con un errore.
// 2) Mette su <html> le classi che lo stile usa per adattarsi: ios / android / web, lite (telefoni lenti), no-flexgap.
import { Capacitor } from '@capacitor/core';

// serve davvero? (lo decidiamo prima di aggiungere le funzioni)
export const NEEDS_POLY = ![].at || !Object.hasOwn || !Promise.any;

// Scritta in JavaScript «vecchio» e senza riferimenti esterni: lo stesso codice viene passato, come testo,
// anche al motore della mappa, che lavora in un worker separato dove queste aggiunte non arriverebbero.
function poly() {
  var def = function (o, k, f) { try { if (o && !o[k]) Object.defineProperty(o, k, { value: f, writable: true, configurable: true }); } catch (e) { /* */ } };
  var at = function (n) { n = Math.trunc(n) || 0; if (n < 0) n += this.length; return n < 0 || n >= this.length ? undefined : this[n]; };
  def(Array.prototype, 'at', at);
  def(String.prototype, 'at', at);
  try { def(Object.getPrototypeOf(Int8Array.prototype), 'at', at); } catch (e) { /* */ }
  def(Object, 'hasOwn', function (o, k) { return Object.prototype.hasOwnProperty.call(Object(o), k); });
  def(Array.prototype, 'findLast', function (f, t) { for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return this[i]; });
  def(Array.prototype, 'findLastIndex', function (f, t) { for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return i; return -1; });
  def(String.prototype, 'replaceAll', function (a, b) {
    if (a instanceof RegExp) return this.replace(a, b);
    return this.replace(new RegExp(String(a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), typeof b === 'function' ? b : function () { return String(b); });
  });
  def(Promise, 'any', function (list) {
    var P = this;
    return new P(function (ok, ko) {
      var errs = [], left = 0, n = 0;
      var fail = function () { var e = new Error('All promises were rejected'); e.name = 'AggregateError'; e.errors = errs; ko(e); };
      Array.prototype.forEach.call(list, function (p) {
        var i = n++; left++;
        P.resolve(p).then(ok, function (e) { errs[i] = e; if (--left === 0) fail(); });
      });
      if (n === 0) fail();
    });
  });
}
poly();
export const WORKER_POLY = '(' + poly.toString() + ')();';

const de = document.documentElement, ua = navigator.userAgent || '';
export const PLAT = Capacitor.getPlatform();
export const IOS = PLAT === 'ios' || /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const ANDROID = PLAT === 'android' || (!IOS && /Android/.test(ua));
de.classList.add(IOS ? 'ios' : ANDROID ? 'android' : 'web');

// telefoni lenti o con un motore web vecchio: niente sfocature e niente animazioni continue
const chrome = +(/Chrome\/(\d+)/.exec(ua) || [])[1] || 0;
if ((navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (chrome && chrome < 88)) de.classList.add('lite');

// «gap» nei contenitori flex: manca prima di Chrome 84 e di iOS 14.5. Lo stile ha i margini di riserva (.no-flexgap).
try {
  const d = document.createElement('div');
  d.style.cssText = 'display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';
  d.appendChild(document.createElement('div')); d.appendChild(document.createElement('div'));
  (document.body || de).appendChild(d);
  if (d.scrollHeight !== 1) de.classList.add('no-flexgap');
  d.remove();
} catch { /* */ }

// iPhone: quando la tastiera si chiude la pagina può restare spostata verso l'alto. La rimettiamo a posto.
if (IOS) addEventListener('focusout', () => setTimeout(() => { const a = document.activeElement; if (!a || !/^(INPUT|TEXTAREA)$/.test(a.tagName)) window.scrollTo(0, 0); }, 80));

// copia negli appunti anche dove navigator.clipboard non c'è (WebView vecchie, pagine non sicure)
export async function copyText(t) {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(t); return true; } } catch { /* sotto */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-999px;top:0;opacity:0;font-size:16px';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length);
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch { return false; }
}
