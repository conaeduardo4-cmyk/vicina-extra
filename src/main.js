// Vicina Extra: servizi sociali, welfare e luoghi per stare insieme.
import '@fontsource-variable/manrope';
import './style.css';
import { Capacitor } from '@capacitor/core';
import { IC, CATS, CAT, INSIEME_CATS, NUM, SITUAZIONI, SIT, GRUPPI, quizSteps, qText, qOpts, quizResult, TUTELE, TUT } from './data.js';
import { nearby, dist, dirUrl, hoursTxt } from './places.js';
import { askAI, askDoc, askUpdate } from './ai.js';
import { acc, shrink } from './account.js';
import { XN, VICINA, installed, openVicina, installVicina, onLink, parseLink, fromVicina, saveFromVicina } from './sister.js';
import { LETTERE, SCADENZE, daysLeft } from './strumenti.js';

const NATIVE = Capacitor.isNativePlatform();
const VER = import.meta.env.VITE_APP_VERSION || '1.4.0';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const I = (n, c = '') => `<svg class="i ${c}"><use href="#i-${n}"/></svg>`;
const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* */ } } };
const lsJ = (k, d) => { try { return JSON.parse(ls.get(k) || 'null') ?? d; } catch { return d; } };
const sq = (c, ic, cls = '') => `<i class="sq ${cls}${Array.isArray(c) ? ' tint' : ''}"${Array.isArray(c) ? ` style="background:${c[0]};color:${c[1]}"` : ''}><svg class="i" viewBox="0 0 24 24"><path d="${ic}"/></svg></i>`;
const telHref = t => 'tel:' + String(t).replace(/[^\d+]/g, '');
const one = p => p.one || CAT[p.cat].one;

// icone come <symbol> riutilizzabili
$('#icons').innerHTML = Object.entries(IC).map(([k, d]) => `<symbol id="i-${k}" viewBox="0 0 24 24"><path d="${d}"/></symbol>`).join('');

/* ---------------- telefono ---------------- */
let Geo = null, Launcher = null, AppP = null;
if (NATIVE) {
  import('@capacitor/geolocation').then(m => { Geo = m.Geolocation; }).catch(() => {});
  import('@capacitor/app-launcher').then(m => { Launcher = m.AppLauncher; }).catch(() => {});
  import('@capacitor/app').then(m => { AppP = m.App; AppP.addListener('backButton', () => { if (!back()) AppP.exitApp(); }); }).catch(() => {});
  import('@capacitor/splash-screen').then(m => m.SplashScreen.hide()).catch(() => {});
  // margine sotto ora e notifiche se il telefono non lo comunica
  // barre di sistema: le misure vere le chiediamo al telefono (env() su Android spesso vale 0)
  const css = (k, v) => document.documentElement.style.setProperty(k, v + 'px');
  const syncInsets = async () => { try { const r = await XN?.insets(); if (r && r.top > 0) { css('--sat', r.top); css('--sab', r.bottom || 0); return true; } } catch { /* */ } return false; };
  [0, 400, 1200, 3000].forEach(ms => setTimeout(syncInsets, ms));
  addEventListener('resize', () => setTimeout(syncInsets, 150));
  setTimeout(() => { if ((parseFloat(document.documentElement.style.getPropertyValue('--sat')) || 0) < 12) { css('--sat', 32); css('--sab', 24); } }, 3500);
}
const openUrl = async u => { try { if (Launcher) { await Launcher.openUrl({ url: u }); return; } } catch { /* */ } window.open(u, '_blank'); };

let pos = lsJ('pos', null);
async function getPos(force) {
  if (pos && !force) return pos;
  try {
    let p;
    if (Geo) {
      const perm = await Geo.checkPermissions().catch(() => null);
      if (perm && perm.location !== 'granted') await Geo.requestPermissions().catch(() => null);
      p = await Geo.getCurrentPosition({ enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 });
    } else {
      p = await new Promise((ok, ko) => navigator.geolocation ? navigator.geolocation.getCurrentPosition(ok, ko, { timeout: 15000, maximumAge: 300000 }) : ko(new Error('no geo')));
    }
    pos = { lat: p.coords.latitude, lng: p.coords.longitude }; ls.set('pos', JSON.stringify(pos));
  } catch (e) { console.warn('posizione', e); }
  return pos;
}

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2600); }

/* ---------------- testo grande ---------------- */
const isBig = () => document.documentElement.classList.contains('big');
const setBig = v => { document.documentElement.classList.toggle('big', !!v); ls.set('big', v ? '1' : ''); };
setBig(ls.get('big') === '1');

/* ---------------- foglio dal basso ---------------- */
function sheet(html) { $('#sheet-body').innerHTML = html; $('#sheet').hidden = false; requestAnimationFrame(() => $('#sheet').classList.add('on')); }
function closeSheet() { const s = $('#sheet'); if (s.hidden) return false; s.classList.remove('on'); setTimeout(() => { s.hidden = true; }, 220); return true; }

/* ---------------- navigazione ---------------- */
const TABS = ['home', 'luoghi', 'aiuti', 'tutele', 'tu'];
let cur = 'home', stack = [];
// lettura ad alta voce: si ferma cambiando schermata o tornando indietro
function stopSpeak() {
  try { speechSynthesis.cancel(); } catch { /* */ }
  document.querySelectorAll('[data-a="speak"]').forEach(b => { b.innerHTML = I('sound') + 'Ascolta'; b.setAttribute('aria-pressed', 'false'); });
}
function show(id, push = true) {
  stopSpeak();
  if (push && cur !== id) stack.push(cur);
  cur = id;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === 's-' + id));
  const tab = TABS.includes(id);
  $('#nav').hidden = !tab;
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === id));
  const el = $('#s-' + id); el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  if (el.scrollTop) el.scrollTop = 0;
  if (id === 'luoghi') openMap();
}
function tab(t) { stack = []; R[t]?.(); show(t, false); }
function back() {
  stopSpeak();
  if (closeSheet()) return true;
  if (stack.length) { const p = stack.pop(); R[p]?.(); show(p, false); return true; }
  if (cur !== 'home') { tab('home'); return true; }
  return false;
}

/* ---------------- profilo (per chi) ---------------- */
const PROF = [['tutti', 'Per me'], ['giovani', 'Giovani'], ['famiglie', 'Famiglie'], ['anziani', 'Anziani'], ['disabilita', 'Disabilità']];
const PROF_CATS = {
  tutti: ['sociali', 'comune', 'consultori', 'quartiere', 'casa', 'lavoro', 'patronati', 'antiviolenza'],
  giovani: ['giovani', 'palestre', 'oratori', 'biblioteche', 'consultori', 'quartiere', 'volontariato', 'lavoro'],
  famiglie: ['consultori', 'sociali', 'casa', 'oratori', 'patronati', 'quartiere', 'antiviolenza', 'accoglienza'],
  anziani: ['anziani', 'quartiere', 'biblioteche', 'sociali', 'patronati', 'volontariato', 'comune', 'disabilita'],
  disabilita: ['disabilita', 'patronati', 'lavoro', 'sociali', 'quartiere', 'volontariato', 'palestre', 'casa']
};
let prof = ls.get('prof') || 'tutti';

/* ---------------- risposte salvate e luoghi salvati ---------------- */
let quiz = lsJ('quiz', null); // { r, at }
let saved = lsJ('saved', []);
const isSaved = id => saved.some(p => p.id === id);
const saveSaved = () => ls.set('saved', JSON.stringify(saved.slice(0, 100)));

/* ---------------- box «Chiedi all'assistente» ---------------- */
// in fondo a ogni guida: domande pronte e un campo per scrivere la propria, con l'argomento già indicato
function aiBox(topic, asks = [], title) {
  return `<div class="aibox"><div class="aib-h"><i class="ai-logo">${I('chat')}</i><div class="fl"><b>${esc(title || 'Hai un dubbio su questo?')}</b><span>Chiedi all’assistente su «${esc(topic)}»: ti risponde con parole semplici.</span></div></div>
    ${asks.length ? `<div class="aib-q">${asks.map(q => `<button data-a="ai-q" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>` : ''}
    <form class="aib-in" data-f="aibox" data-topic="${esc(topic)}"><input type="text" placeholder="Scrivi la tua domanda…" maxlength="600" enterkeyhint="send" aria-label="La tua domanda su ${esc(topic)}"><button aria-label="Chiedi">${I('send')}</button></form>
    <button class="link sm aib-make" data-a="crea" data-q="${esc(topic)}">${I('sparkle')}Crea una guida su misura su questo</button></div>`;
}

/* ================= HOME ================= */
// strumenti di uso immediato (in Home, come gli Strumenti di Vicina)
const TOOLS = [
  ['t-sos', IC.shield, ['#E5484D', '#fff'], 'SOS con Vicina', 'Avvisa la tua cerchia', 'red'],
  ['t-exit', IC.out, ['rgba(255,181,71,.16)', '#FFB547'], 'Uscita rapida', 'Nasconde l’app in un tocco'],
  ['t-near', IC.locate, ['rgba(96,165,250,.16)', '#93C5FD'], 'Il più vicino', 'Chiama o vai subito'],
  ['t-talk', IC.phone, ['rgba(52,211,153,.15)', '#34D399'], 'Parla con qualcuno', 'Linee di ascolto gratuite'],
  ['t-letters', IC.edit, ['rgba(156,140,255,.16)', '#B4A8FF'], 'Lettere pronte', 'Comune, bollette, affitto'],
  ['t-dead', IC.clock, ['rgba(244,114,182,.16)', '#F9A8D4'], 'Scadenze', 'NASpI, ISEE, maternità'],
  ['t-crea', IC.sparkle, ['rgba(124,108,255,.22)', '#C9C1FF'], 'Crea con l’AI', 'Lettere, guide e corsi su misura'],
  ['t-agg', IC.bolt, ['rgba(229,72,77,.16)', '#FF8A94'], 'Aggiornamenti', 'Da Vicina e dall’assistente']
];
const toolTile = ([a, ic, c, t, s2, cls]) => `<button class="tool${cls ? ' ' + cls : ''}" data-a="${a}">${sq(c, ic)}<span><b>${esc(t)}</b><small>${esc(s2)}</small></span></button>`;
const dateStr = () => new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, c => c.toUpperCase());
function rHome() {
  const h = new Date().getHours(), saluto = h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera';
  const nome = acc.p?.name ? ', ' + acc.p.name : '';
  const res = quiz ? quizResult(quiz.r) : null;
  const n = id => places ? places.filter(p => p.cat === id && p.d <= 6).length : null;
  $('#s-home').innerHTML = `
    <div class="glow violet"></div>
    <header class="h4x">
      <button class="avx" data-a="tab" data-t="tu" aria-label="Il tuo profilo">${avatar(acc.p)}</button>
      <div class="fl"><p class="h4x-date">${esc(dateStr())}</p><h1 class="h4x-name">${esc(saluto + nome)}</h1></div>
      <button class="sqbtn" data-a="big" aria-label="Testo più grande" aria-pressed="${isBig()}"><span>Aa</span></button>
      <button class="ask" data-a="ai"><i class="ai-logo">${I('chat')}</i><span>Chiedi</span></button>
    </header>
    <form class="search" data-f="home-q"><svg class="i"><use href="#i-search"/></svg><input id="h-q" type="search" placeholder="Affitto, consultorio, lavoro, ISEE…" autocomplete="off" enterkeyhint="search" aria-label="Cerca un servizio o un aiuto"></form>
    ${recentBanner()}
    ${res ? `<button class="qcard main" data-a="quiz-res">${sq(0, IC.sparkle, 'acc')}<span class="fl"><b>Le tue risposte</b><span>${res.sit.length === 1 ? '1 guida' : res.sit.length + ' guide'} agli aiuti e ${res.fun.length + res.cats.length} idee scelte per te.</span><span class="go">Rivedi</span></span></button>`
      : `<button class="qcard main" data-a="quiz">${sq(0, IC.sparkle, 'acc')}<span class="fl"><b>Scopri cosa ti spetta</b><span>Poche domande, diverse in base alla tua età e situazione. Restano sul telefono.</span><span class="go">Inizia · 2 minuti</span></span></button>`}
    <div class="sec"><h2>Strumenti</h2><button class="link" data-a="vicina">Con Vicina</button></div>
    <div class="tools">${TOOLS.map(toolTile).join('')}</div>
    ${res && res.fun.length ? `<div class="sec"><h2>Per il tuo tempo libero</h2></div><div class="funrow" style="margin-top:10px">${res.fun.slice(0, 3).map(funCard).join('')}</div>` : ''}
    <div class="sec"><h2>Vicino a te</h2><button class="link" data-a="tab" data-t="luoghi">Apri la mappa</button></div>
    <div class="chips">${PROF.map(([k, t]) => `<button class="${prof === k ? 'on' : ''}" data-a="prof" data-k="${k}" aria-pressed="${prof === k}">${esc(t)}</button>`).join('')}</div>
    <div class="catgrid" style="margin-top:10px">${PROF_CATS[prof].map(id => { const c = CAT[id], k = n(id); return `<button class="cat" data-a="cat" data-k="${id}">${sq(c.c, c.ic)}<span>${esc(c.t)}${k != null ? `<small>${k ? k + ' vicino a te' : 'Vedi sulla mappa'}</small>` : ''}</span></button>`; }).join('')}</div>
    <button class="row card" data-a="insieme">${sq(['rgba(52,211,153,.15)', '#34D399'], IC.people)}<span class="fl"><b>Non sentirti solo</b><span>Luoghi e linee di ascolto per stare in compagnia</span></span>${I('chev', 'chev')}</button>
    ${otherApp()}
    <p class="foot-note">In pericolo adesso? Chiama il <a href="tel:112">112</a> o apri Vicina.</p>`;
}
const funCard = f => { const c = CAT[f.cat]; return `<button class="fun" data-a="cat" data-k="${f.cat}">${sq(c.c, c.ic)}<span class="fl"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></span>${I('chev', 'chev')}</button>`; };

/* ---------- l'altra app: Vicina (SOS). Le due app si aprono a vicenda e si passano le informazioni ---------- */
let otherInstalled = null;
async function checkOther() { otherInstalled = await installed(); return otherInstalled; }
const otherApp = () => `<button class="otherapp" data-a="vicina">${sq(['#E5484D', '#fff'], IC.shield)}<span class="fl"><b>Vicina</b><span>SOS e aiuto in emergenza · ${otherInstalled ? 'Collegata' : 'Scopri come funziona'}</span></span>${I('chev', 'chev')}</button>`;
// quello che passiamo a Vicina quando la apriamo: le guide scelte per te e i luoghi salvati
const forVicina = () => {
  const r = quiz ? quizResult(quiz.r) : null;
  const dead = lsJ('scadenze', []).map(x => [SCADENZE.find(y => y.id === x.id)?.t || '', x.due]).filter(x => daysLeft(x[1]) >= 0).slice(0, 4);
  return { app: 'extra', v: 2, sit: (r?.sit || []).slice(0, 6).map(id => [id, SIT[id].t]), saved: saved.length, docs: lsJ('docs', []).slice(0, 4).map(d => d.title), dead, at: Date.now() };
};
async function goVicina(path = 'extra') {
  if (NATIVE && await checkOther() && await openVicina(path, forVicina())) return true;
  return false;
}
/* ================= LUOGHI ================= */
let mapApi = null, mapLoading = false, places = null, placesP = null, placesErr = false, mCat = '', mAcc = false, mQ = '';
async function openMap() {
  rMapUI();
  const me = await getPos();
  if (!me) { mapMsg('Attiva la posizione per vedere i luoghi vicino a te.', true); rList(); return; }
  $('#map-msg').hidden = true;
  // la mappa e i luoghi si caricano insieme
  if (!mapApi && !mapLoading) {
    mapLoading = true;
    import('./map.js').then(m => m.createMap($('#map'), { center: me, onPick: p => openPlace(p) }))
      .then(api => { mapApi = api; api.setMe(me); rList(); if (places) api.fit(filtered(), me); })
      .catch(e => { console.warn('mappa', e); if (cur === 'luoghi') toast('La mappa non si carica: vedi comunque la lista qui sotto'); })
      .finally(() => { mapLoading = false; });
  }
  mapApi?.resize();
  await loadPlaces(me);
}
function getPlaces(me, force) {
  if (placesP && !force) return placesP;
  placesErr = false;
  placesP = nearby(me, { force, onPartial: list => { places = list; if (cur === 'luoghi') rList(); } })
    .then(list => { places = list; return list; })
    .catch(e => { console.warn('luoghi', e); placesErr = true; placesP = null; places = places || null; throw e; });
  return placesP;
}
async function loadPlaces(me, force) {
  if (!places || force) rList(true);
  try { await getPlaces(me, force); } catch { /* messaggio nella lista */ }
  rList(); if (cur === 'luoghi' && mapApi && places) mapApi.fit(filtered().slice(0, 25), me);
}
function mapMsg(t, btn) { const m = $('#map-msg'); m.hidden = false; m.innerHTML = esc(t) + (btn ? `<button class="pillbtn light" data-a="pos">Attiva posizione</button>` : ''); }
function filtered() {
  const q = mQ.trim().toLowerCase();
  return (places || []).filter(p => (!mCat || p.cat === mCat) && (!mAcc || p.wheel === 'yes') &&
    (!q || (p.name + ' ' + CAT[p.cat].t + ' ' + one(p) + ' ' + CAT[p.cat].what.join(' ')).toLowerCase().includes(q)));
}
function rMapUI() {
  $('#m-filters').innerHTML = `<button class="${!mAcc ? 'on' : ''}" data-a="m-acc" data-v="0">Tutti</button><button class="${mAcc ? 'on' : ''}" data-a="m-acc" data-v="1">${I('access')}Accessibili</button>${pos ? `<button data-a="m-center" aria-label="Centra la mappa su di me">${I('locate')}Su di me</button>` : ''}${places ? `<button data-a="m-reload" aria-label="Aggiorna i luoghi">${I('search')}Aggiorna</button>` : ''}`;
  const n = id => places ? places.filter(p => p.cat === id).length : 0;
  $('#m-cats').innerHTML = `<button class="${!mCat ? 'on' : ''}" data-a="m-cat" data-k="">Tutte${places ? ` · ${places.length}` : ''}</button>` + CATS.map(c => `<button class="${mCat === c.id ? 'on' : ''}" data-a="m-cat" data-k="${c.id}">${esc(c.t)}${places && n(c.id) ? ` · ${n(c.id)}` : ''}</button>`).join('');
  const q = $('#m-q'); if (q.value !== mQ) q.value = mQ;
}
function rList(loading) {
  const list = filtered();
  mapApi?.setPlaces(list.slice(0, 120));
  rMapUI();
  if (loading || (places == null && placesP)) {
    $('#m-list').innerHTML = `<p class="muted pad">Cerco i servizi intorno a te…</p><div class="card list skel">${'<div class="row"><i class="sq lg"></i><span class="fl"><b></b><span></span></span></div>'.repeat(4)}</div>`;
    return;
  }
  if (places == null) {
    $('#m-list').innerHTML = placesErr ? `<div class="empty">${sq(['rgba(255,181,71,.16)', '#FFB547'], IC.globe, 'lg')}<b>I luoghi non arrivano</b><span>Il servizio delle mappe è lento o non c’è connessione. Riprova tra poco.</span><button class="btn white" data-a="m-reload">Riprova</button></div>` : '';
    return;
  }
  const far = list.length ? Math.max(1, Math.ceil(list[Math.min(list.length, 60) - 1].d || 1)) : 0;
  $('#m-list').innerHTML = list.length
    ? `<div class="m-count"><b>${list.length} ${list.length === 1 ? 'luogo' : 'luoghi'}</b><span>entro ${far} km</span></div><div class="card list" style="margin-top:10px">${list.slice(0, 60).map(placeRow).join('')}</div>${list.length > 60 ? `<p class="muted small pad">Ne mostro 60 su ${list.length}: scegli una categoria per vedere gli altri.</p>` : ''}<p class="muted small pad">Dati di OpenStreetMap: orari e numeri possono cambiare, verifica prima di andare.</p>`
    : `<div class="empty">${sq(['rgba(255,255,255,.08)', '#D4D4D8'], IC.search, 'lg')}<b>Nessun luogo trovato qui</b><span>Su OpenStreetMap non c’è ancora. I servizi sociali del tuo Comune conoscono tutti i servizi della zona.</span><button class="btn ghost" data-a="ai-q" data-q="Quali servizi ci sono vicino a me per: ${esc(mCat ? CAT[mCat].t : mQ || 'aiuto sociale')}?">${I('chat')}Chiedi all'assistente</button></div>`;
}
const placeRow = p => { const c = CAT[p.cat];
  return `<button class="row" data-a="place" data-id="${esc(p.id)}">${sq(c.c, c.ic, 'lg')}<span class="fl"><b>${esc(p.name)}</b><span>${esc(one(p))}${p.d != null ? ' · ' + dist(p.d) : ''}${p.wheel === 'yes' ? ' · accessibile' : ''}</span></span>${I('chev', 'chev')}</button>`; };

/* ---------- scheda luogo ---------- */
let curPlace = null;
function openPlace(p) {
  curPlace = p;
  const c = CAT[p.cat];
  const tags = [p.wheel === 'yes' ? 'Accessibile in carrozzina' : p.wheel === 'limited' ? 'Accesso in parte agevolato' : '', p.fee === 'no' ? 'Gratuito' : ''].filter(Boolean);
  $('#s-luogo').innerHTML = `
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><span class="fl"></span>
      <button class="roundbtn${isSaved(p.id) ? ' on' : ''}" data-a="save" aria-label="${isSaved(p.id) ? 'Togli dai salvati' : 'Salva questo luogo'}" aria-pressed="${isSaved(p.id)}">${I('bookmark')}</button></div>
    <div class="pl-head">${sq(c.c, c.ic, 'lg')}<div class="fl"><p class="eyebrow">${esc(one(p).toUpperCase())}</p><h1 class="h1">${esc(p.name)}</h1></div></div>
    <p class="pl-meta">${esc([p.addr, p.d != null ? dist(p.d) + ' da te' : '', p.fee === 'no' ? 'Gratuito' : ''].filter(Boolean).join(' · '))}</p>
    ${tags.length ? `<div class="tags">${tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
    <div class="acts3">
      ${p.phone ? `<a class="act white" href="${telHref(p.phone)}">${I('phone')}Chiama</a>` : `<button class="act white" data-a="ai-q" data-q="${esc('Come posso contattare ' + p.name + '?')}">${I('chat')}Contatti</button>`}
      <button class="act" data-a="url" data-u="${esc(dirUrl(p))}">${I('nav')}Percorso</button>
      ${p.web ? `<button class="act" data-a="url" data-u="${esc(/^https?:/.test(p.web) ? p.web : 'https://' + p.web)}">${I('globe')}Sito</button>` : `<button class="act" data-a="ai-q" data-q="${esc('Cosa fa un ' + one(p).toLowerCase() + ' e come ci si accede?')}">${I('chat')}Chiedi</button>`}
    </div>
    ${(() => { const info = [p.hours ? [IC.clock, hoursTxt(p.hours), 'Orari indicati su OpenStreetMap'] : null, p.wheel ? [IC.access, p.wheel === 'yes' ? 'Accessibile in carrozzina' : p.wheel === 'limited' ? 'Accesso in parte agevolato' : 'Non accessibile in carrozzina', ''] : null, p.phone ? [IC.phone, p.phone, 'Telefono'] : null].filter(Boolean);
      return info.length ? `<div class="label">Informazioni</div><div class="card list">${info.map(([ic, t, s2]) => `<div class="row">${sq(0, ic)}<span class="fl"><b>${esc(t)}</b>${s2 ? `<span>${esc(s2)}</span>` : ''}</span></div>`).join('')}</div>` : ''; })()}
    <div class="label">Cosa trovi qui</div>
    <div class="card list">${c.what.map(w => `<div class="row sm top">${I('check', 'ck')}<span class="fl"><span class="txt">${esc(w)}</span></span></div>`).join('')}</div>
    <div class="card note-card">${sq(0, IC.info)}<span>${esc(c.how)}</span></div>
    ${p.desc ? `<p class="muted pad">${esc(p.desc)}</p>` : ''}
    ${aiBox(one(p), ['A cosa serve un posto come questo?', 'Cosa devo portare la prima volta?', 'È gratuito? Serve un appuntamento?'])}
    <p class="muted small pad">Indicazioni generali per questo tipo di servizio: ogni sede può offrire servizi diversi. Dati del luogo: OpenStreetMap.</p>`;
  show('luogo');
}

/* ================= AIUTI ================= */
let aQ = '';
function rAiuti() {
  const q = aQ.trim().toLowerCase();
  const match = s => !q || (s.t + ' ' + s.intro + ' ' + s.misure.map(m => m.t + ' ' + m.s).join(' ')).toLowerCase().includes(q);
  const groups = GRUPPI.map(([g, t]) => [t, SITUAZIONI.filter(s => s.g === g && match(s))]).filter(x => x[1].length);
  $('#s-aiuti').innerHTML = `
    <header class="pagehead"><p class="eyebrow v">AIUTI E DIRITTI</p><h1 class="title">Cosa ti spetta</h1><p class="lead">${SITUAZIONI.length} guide con gli aiuti spiegati semplice: a chi spettano, cosa serve e dove si chiedono.</p></header>
    <form class="search" data-f="aiuti-q"><svg class="i"><use href="#i-search"/></svg><input id="a-q" type="search" value="${esc(aQ)}" placeholder="NASpI, affitto, 104, bollette…" autocomplete="off" enterkeyhint="search" aria-label="Cerca tra gli aiuti"></form>
    <button class="qcard" data-a="${quiz ? 'quiz-res' : 'quiz'}">${sq(0, IC.sparkle, 'acc')}<span class="fl"><b>${quiz ? 'I tuoi risultati' : 'Non sai da dove partire?'}</b><span>${quiz ? 'Gli aiuti scelti in base alle tue risposte.' : 'Rispondi a qualche domanda e ti mostro gli aiuti adatti a te.'}</span></span>${I('chev', 'chev')}</button>
    <div class="card warn">${sq(0, IC.doc, 'amber')}<span><b>Prima di tutto: l'ISEE.</b> Serve per quasi tutti gli aiuti. Lo fai gratis al CAF o online sul sito dell'INPS.</span><button class="link sm" data-a="ai-q" data-q="Come si fa l’ISEE e cosa serve?">Come si fa?</button></div>
    ${groups.length ? groups.map(([t, list]) => `<div class="label">${esc(t)}</div><div class="card list">${list.map(s => `<button class="row" data-a="sit" data-k="${s.id}">${sq(s.c, s.ic, 'lg')}<span class="fl"><b>${esc(s.t)}</b><span>${esc(s.misure.map(m => m.t).slice(0, 3).join(' · '))}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>`).join('')
      : `<div class="empty"><b>Nessuna guida con «${esc(aQ)}»</b><span>Prova con altre parole o chiedilo all’assistente.</span><button class="btn ghost" data-a="ai-q" data-q="${esc(aQ)}">${I('chat')}Chiedi all’assistente</button></div>`}
    ${aiBox('gli aiuti e i diritti', ['Cosa mi spetta se ho un ISEE basso?', 'Cos’è un patronato e quanto costa?', 'Come faccio lo SPID?'], 'Non trovi la tua situazione?')}
    <p class="muted small pad">Requisiti e importi cambiano spesso: verifica sempre su inps.it, con un patronato o con i servizi sociali.</p>`;
}
const canSpeak = () => 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function';
function openSit(id) {
  const s = SIT[id], done = lsJ('doc:' + id, []);
  const det = (lab, v) => v ? `<div class="mrow"><span>${lab}</span><p>${esc(v)}</p></div>` : '';
  $('#s-aiuto').innerHTML = `
    <div class="glow" style="--g:${s.c[1]}"></div>
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><span class="fl"></span>${canSpeak() ? `<button class="pillbtn" data-a="speak" aria-pressed="false">${I('sound')}Ascolta</button>` : ''}</div>
    <header class="pagehead"><p class="eyebrow" style="color:${s.c[1]}">${esc(s.t.toUpperCase())}</p><h1 class="h1">I tuoi diritti, spiegati semplice</h1><p class="lead">${esc(s.intro)}</p></header>
    <div class="label">Gli aiuti · tocca per i dettagli</div>
    <div class="stack">${s.misure.map((m, i) => `<div class="card mis${i === 0 ? ' open' : ''}">
      <button class="mis-h" data-a="mis" aria-expanded="${i === 0}"><span class="fl"><b>${esc(m.t)}</b><span>${esc(m.s)}</span></span>${I('chev', 'chev')}</button>
      <div class="mis-b">${det('A chi', m.chi)}${det('Cosa serve', m.serve)}${det('Dove si chiede', m.dove)}
        <div class="mis-acts">${m.url ? `<button class="link sm" data-a="url" data-u="${esc(m.url)}">${I('globe')}Fonte ufficiale</button>` : ''}<button class="link sm" data-a="ai-q" data-q="${esc(m.t + ': mi spetta? Come lo chiedo?')}">${I('chat')}Chiedi su questo</button></div></div></div>`).join('')}</div>
    <div class="label">Come fare</div>
    <div class="card list">${s.passi.map((p, i) => `<div class="row sm top"><i class="num" style="color:${s.c[1]};background:${s.c[0]}">${i + 1}</i><span class="fl"><span class="txt">${esc(p)}</span></span></div>`).join('')}</div>
    ${s.doc?.length ? `<div class="label">Documenti da preparare · ${done.length}/${s.doc.length}</div>
    <div class="card list">${s.doc.map((d, i) => `<button class="row sm chk${done.includes(i) ? ' on' : ''}" data-a="doc" data-k="${id}" data-i="${i}" aria-pressed="${done.includes(i)}"><i class="box">${I('check')}</i><span class="fl"><span class="txt">${esc(d)}</span></span></button>`).join('')}</div>` : ''}
    ${s.nota ? `<p class="muted small pad">${esc(s.nota)}</p>` : ''}
    ${aiBox(s.t, s.ask || [])}
    <div class="acts2">
      <button class="btn white" data-a="cat" data-k="patronati">Patronato o CAF vicino</button>
      <button class="btn ghost" data-a="cat" data-k="${s.tag}">${esc(CAT[s.tag].t)} vicino</button>
    </div>
    <p class="muted small pad">Requisiti e importi cambiano: verifica su inps.it, con un patronato (gratis) o con i servizi sociali.</p>`;
  show('aiuto');
}

/* ---------- domande che cambiano in base alle risposte ---------- */
let qz = { i: 0, r: {}, sel: [] };
function rQuiz() {
  const steps = quizSteps(qz.r), done = qz.i >= steps.length, q = steps[qz.i];
  const head = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Chiudi">${I('x')}</button>
      <div class="prog">${steps.map((_, k) => `<i class="${k < qz.i || done ? 'on' : ''}"></i>`).join('')}</div><span class="muted b">${done ? steps.length : qz.i + 1}/${steps.length}</span></div>`;
  if (done) { $('#s-quiz').innerHTML = head + resultHtml(qz.r); return; }
  const opts = qOpts(q, qz.r), sub = q.sub || '';
  if (q.multi && !qz.sel.length && Array.isArray(qz.r[q.id])) qz.sel = [...qz.r[q.id]];
  $('#s-quiz').innerHTML = head + `
    <header class="pagehead"><h1 class="h1">${esc(qText(q, qz.r))}</h1>${sub ? `<p class="lead">${esc(sub)}</p>` : ''}</header>
    <div class="stack">${opts.map(([k, t]) => q.multi
      ? `<button class="opt multi${qz.sel.includes(k) ? ' on' : ''}" data-a="qm" data-k="${k}" aria-pressed="${qz.sel.includes(k)}"><i class="box">${I('check')}</i>${esc(t)}</button>`
      : `<button class="opt${qz.r[q.id] === k ? ' on' : ''}" data-a="qa" data-k="${k}">${esc(t)}</button>`).join('')}</div>
    ${q.multi ? `<button class="btn white" data-a="qnext" ${qz.sel.length ? '' : 'disabled'}>Avanti</button>` : ''}
    ${qz.i ? `<button class="link center" data-a="qprev">Indietro</button>` : ''}`;
}
function quizAnswer(v) {
  const steps = quizSteps(qz.r), q = steps[qz.i];
  qz.r[q.id] = v; qz.sel = [];
  // le risposte a domande che non servono più (per esempio dopo aver cambiato età) si tolgono
  const ok = new Set(quizSteps(qz.r).map(x => x.id));
  Object.keys(qz.r).forEach(k => { if (!ok.has(k)) delete qz.r[k]; });
  qz.i++;
  if (qz.i >= quizSteps(qz.r).length) {
    quiz = { r: { ...qz.r }, at: Date.now() }; ls.set('quiz', JSON.stringify(quiz));
    const r = qz.r; prof = r.eta === 'u18' || r.eta === '18' ? 'giovani' : r.eta === '65' ? 'anziani' : r.dis === 'me' ? 'disabilita' : r.figli && r.figli !== 'no' ? 'famiglie' : 'tutti'; ls.set('prof', prof);
  }
  rQuiz();
  $('#s-quiz').scrollTop = 0;
}
function resultHtml(r) {
  const x = quizResult(r), young = r.eta === 'u18';
  const sitRow = id => { const s = SIT[id]; return `<button class="row" data-a="sit" data-k="${id}">${sq(s.c, s.ic, 'lg')}<span class="fl"><b>${esc(s.t)}</b><span>${esc(s.misure.map(m => m.t).slice(0, 3).join(' · '))}</span></span>${I('chev', 'chev')}</button>`; };
  return `
    <header class="pagehead"><p class="eyebrow v">IL TUO RISULTATO</p><h1 class="h1">${young ? 'Ecco cosa c’è per te' : 'Ecco cosa fa per te'}</h1>
      <p class="lead">${young ? 'Posti dove divertirti e persone con cui parlare se ti serve.' : 'Non è una garanzia: i requisiti precisi li verifica l’INPS o il patronato. Ma è un buon punto di partenza.'}</p></header>
    ${x.fun.length ? `<div class="label">${young ? 'Per svagarti' : 'Per il tuo tempo libero'}</div><div class="funrow">${x.fun.map(funCard).join('')}</div>` : ''}
    ${x.sit.length ? `<div class="label">${young ? 'I tuoi diritti' : 'Aiuti da guardare'}</div><div class="card list">${x.sit.map(sitRow).join('')}</div>` : ''}
    ${x.tut.length || x.num.length ? `<div class="label">Se ti serve parlarne</div>
      ${x.num.length ? `<div class="nums">${x.num.map((k, i) => numCard(k, i === 0)).join('')}</div>` : ''}
      ${x.tut.length ? `<div class="card list" style="margin-top:10px">${x.tut.map(id => { const t = TUT[id]; return `<button class="row" data-a="tut" data-k="${id}">${sq(t.c, t.ic, 'lg')}<span class="fl"><b>${esc(t.t)}</b><span>${esc(t.s)}</span></span>${I('chev', 'chev')}</button>`; }).join('')}</div>` : ''}` : ''}
    ${x.cats.length ? `<div class="label">Luoghi utili vicino a te</div><div class="catgrid">${x.cats.slice(0, 8).map(id => { const c = CAT[id]; return `<button class="cat" data-a="cat" data-k="${id}">${sq(c.c, c.ic)}<span>${esc(c.t)}</span></button>`; }).join('')}</div>` : ''}
    ${aiBox('il tuo risultato', young ? ['Cosa posso fare questo weekend vicino a me?', 'Come faccio a conoscere altri ragazzi?', 'Con chi posso parlare se sto male?'] : ['Da quale aiuto conviene partire?', 'Cosa devo preparare per il patronato?', 'Come si fa l’ISEE?'], 'Hai domande sul risultato?')}
    <button class="btn ghost" data-a="quiz">Rispondi di nuovo</button>`;
}

/* ================= TUTELE ================= */
const numCard = (k, hl) => { const n = NUM[k]; return `<a class="numc${hl ? ' hl' : ''}" href="${telHref(n.tel)}"><b>${esc(n.n)}</b><span>${esc(n.t)}</span></a>`; };
function rTutele() {
  $('#s-tutele').innerHTML = `
    <header class="pagehead"><p class="eyebrow v">TUTELE</p><h1 class="title">Come tutelarti</h1><p class="lead">Cosa fare e a chi rivolgerti, situazione per situazione.</p></header>
    <div class="nums">${numCard('n1522', true)}${numCard('n114')}${numCard('argento')}${numCard('amico')}</div>
    <div class="label">Situazioni</div>
    <div class="card list">${TUTELE.map(t => `<button class="row" data-a="tut" data-k="${t.id}">${sq(t.c, t.ic, 'lg')}<span class="fl"><b>${esc(t.t)}</b><span>${esc(t.s)}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>
    ${aiBox('come tutelarti', ['Qualcuno mi minaccia: cosa posso fare?', 'Come conservo le prove in modo sicuro?', 'Posso chiedere aiuto senza denunciare?'], 'Una situazione diversa?')}
    <p class="foot-note">In pericolo adesso? Chiama il <a href="tel:112">112</a> o usa l'SOS di Vicina.</p>`;
}
function openTut(id) {
  const t = TUT[id];
  $('#s-tutela').innerHTML = `
    <div class="glow" style="--g:${t.c[1]}"></div>
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button></div>
    <header class="pagehead"><p class="eyebrow" style="color:${t.c[1]}">TUTELE</p><h1 class="h1">${esc(t.t)}</h1></header>
    <div class="label">Come riconoscerla</div>
    <div class="card list">${t.segnali.map(s => `<div class="row sm top"><i class="dot" style="background:${t.c[1]}"></i><span class="fl"><span class="txt">${esc(s)}</span></span></div>`).join('')}</div>
    <div class="label">Cosa fare</div>
    <div class="card list">${t.fare.map((s, i) => `<div class="row sm top"><i class="num" style="color:${t.c[1]};background:${t.c[0]}">${i + 1}</i><span class="fl"><span class="txt">${esc(s)}</span></span></div>`).join('')}</div>
    ${t.num.length ? `<div class="label">Chiama</div><div class="nums">${t.num.map((k, i) => numCard(k, i === 0)).join('')}</div>` : ''}
    ${aiBox(t.t, t.ask || [])}
    <div class="acts2"><button class="btn white" data-a="cat" data-k="${t.tag}">${esc(CAT[t.tag].t)} vicino</button><button class="btn ghost" data-a="tab" data-t="aiuti">Aiuti e diritti</button></div>`;
  show('tutela');
}

/* ================= INSIEME ================= */
let iCat = '';
async function rInsieme() {
  const box = $('#s-insieme');
  box.innerHTML = `
    <div class="glow green"></div>
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button></div>
    <header class="pagehead"><p class="eyebrow g">INSIEME</p><h1 class="title">Non sentirti solo</h1><p class="lead">Luoghi vicino a te dove fare qualcosa con altre persone.</p></header>
    <div class="chips pad">${[['', 'Tutti'], ...INSIEME_CATS.map(id => [id, CAT[id].t])].map(([k, t]) => `<button class="${iCat === k ? 'on' : ''}" data-a="i-cat" data-k="${k}">${esc(t)}</button>`).join('')}</div>
    <div id="i-list"><p class="muted pad">Cerco intorno a te…</p></div>
    <div class="duo">
      <button class="tile" data-a="cat" data-k="volontariato">${I('hands')}<b>Fai volontariato</b></button>
      <a class="tile" href="${telHref(NUM.amico.tel)}">${I('chat')}<b>Parla con qualcuno adesso</b></a>
    </div>
    <div class="label">Linee di ascolto</div>
    <div class="card list">${['amico', 'argento', 'samaritans'].map(k => { const n = NUM[k]; return `<a class="row" href="${telHref(n.tel)}">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.phone, 'lg')}<span class="fl"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></span>${I('chev', 'chev')}</a>`; }).join('')}</div>
    ${aiBox('la solitudine', TUT.solitudine.ask, 'Vuoi parlarne?')}`;
  const me = await getPos();
  const el = $('#i-list'); if (!el) return;
  if (!me) { el.innerHTML = `<div class="empty"><b>Attiva la posizione</b><span>Così ti mostro centri, oratori, palestre popolari e associazioni vicino a te.</span><button class="btn white" data-a="pos">Attiva posizione</button></div>`; return; }
  try { if (!places) await getPlaces(me); } catch { el.innerHTML = `<div class="empty"><b>I luoghi non arrivano</b><span>Controlla la connessione e riprova.</span><button class="btn white" data-a="i-retry">Riprova</button></div>`; return; }
  const list = places.filter(p => iCat ? p.cat === iCat : INSIEME_CATS.includes(p.cat)).slice(0, 15);
  el.innerHTML = list.length ? `<div class="stack">${list.map(p => { const c = CAT[p.cat]; return `<button class="row card" data-a="place" data-id="${esc(p.id)}">${sq(c.c, c.ic, 'lg')}<span class="fl"><b>${esc(p.name)}</b><span>${esc(one(p))} · ${dist(p.d)}</span></span>${I('chev', 'chev')}</button>`; }).join('')}</div>`
    : `<div class="empty"><b>Nessun luogo trovato qui</b><span>Chiedi ai servizi sociali del Comune: sanno quali attività ci sono nella tua zona.</span></div>`;
}

/* ================= TU ================= */
const initials = p => ((p?.name || '')[0] || '') + ((p?.surname || '')[0] || '');
const avatar = (p, cls = '') => p?.avatar ? `<i class="av ${cls}" style="background-image:url('${esc(p.avatar)}')"></i>` : `<i class="av ${cls} ph">${initials(p) ? esc(initials(p).toUpperCase()) : I('user')}</i>`;
function meCard() {
  const p = acc.p, u = acc.user;
  if (!u) return `<div class="card pcard"><div class="pc-banner"></div>
    <div class="pc-main">${avatar(null, 'lg')}<button class="pillbtn light pc-edit" data-a="login">Accedi</button></div>
    <div class="pc-txt"><b>Ospite</b><span>Accedi con il tuo account Vicina: ritrovi nome, foto e banner.</span></div></div>`;
  const full = p ? p.name + ' ' + p.surname : u.email;
  return `<div class="card pcard"><div class="pc-banner${p?.banner ? ' img' : ''}" ${p?.banner ? `style="background-image:url('${esc(p.banner)}')"` : ''}></div>
    <div class="pc-main"><button data-a="edit" aria-label="Modifica la foto">${avatar(p, 'lg')}</button><button class="pillbtn pc-edit" data-a="edit">${I('edit')}Modifica</button></div>
    <div class="pc-txt"><b>${esc(full)}</b><span>${esc(p?.bio || p?.city || u.email || '')}</span></div></div>`;
}
const meRow = (a, ic, c, t, v = '', extra = '') => `<button class="row" data-a="${a}"${extra}>${sq(c, IC[ic])}<span class="fl"><b>${t}</b></span>${v ? `<span class="val">${v}</span>` : ''}${I('chev', 'chev')}</button>`;
const CL = { violet: ['rgba(156,140,255,.16)', '#B4A8FF'], green: ['rgba(52,211,153,.15)', '#34D399'], blue: ['rgba(96,165,250,.16)', '#93C5FD'], amber: ['rgba(255,181,71,.16)', '#FFB547'], rose: ['rgba(255,107,120,.16)', '#FF8A94'], gray: ['rgba(255,255,255,.08)', '#D4D4D8'] };
function rTu() {
  const age = { u18: 'Meno di 18', 18: '18 – 29', 30: '30 – 64', 65: '65 o più' }[quiz?.r?.eta];
  $('#s-tu').innerHTML = `
    ${meCard()}
    <div class="card list">
      ${meRow(quiz ? 'quiz-res' : 'quiz', 'sparkle', CL.violet, 'Le tue risposte', quiz ? esc(age || 'Fatto') : 'Da fare')}
      ${meRow('saved', 'bookmark', CL.amber, 'Luoghi salvati', String(saved.length))}
      ${meRow('ai-list', 'chat', CL.blue, 'Le tue chat con l’assistente', String(chats.length))}
    </div>
    <div class="card list">
      <button class="row" data-a="big">${sq(CL.green, IC.text)}<span class="fl"><b>Testo più grande</b><span>Ingrandisce testi e pulsanti</span></span><i class="sw${isBig() ? ' on' : ''}" role="switch" aria-checked="${isBig()}"></i></button>
      ${meRow('pos', 'locate', pos ? CL.green : CL.rose, 'Posizione', pos ? 'Attiva' : 'Da attivare')}
      ${meRow('prof-sheet', 'people', CL.violet, 'Cosa mostrare in Home', esc(PROF.find(x => x[0] === prof)?.[1] || ''))}
    </div>
    <div class="card list">
      ${meRow('insieme', 'heart', CL.green, 'Non sentirti solo')}
      ${meRow('nums', 'phone', CL.rose, 'Numeri utili')}
      <button class="row" data-a="vicina">${sq(['#E5484D', '#fff'], IC.shield)}<span class="fl"><b>Vicina, SOS ed emergenze</b><span>${otherInstalled ? 'Collegata · apri' : 'Scopri e installa'}</span></span>${I('chev', 'chev')}</button>
      ${meRow('info', 'info', CL.gray, 'Privacy e informazioni')}
    </div>
    ${acc.user ? `<div class="card list"><button class="row" data-a="logout">${sq(CL.gray, IC.out)}<span class="fl"><b>Esci</b><span>${esc(acc.user.email || '')}</span></span></button></div>`
      : `<div class="card list"><button class="row" data-a="login">${sq(CL.violet, IC.user)}<span class="fl"><b>Accedi o crea un account</b><span>Lo stesso account di Vicina</span></span>${I('chev', 'chev')}</button></div>`}
    <p class="foot-note">Vicina Extra ${esc(VER)} · Non sostituisce il 112</p>`;
}
function rSaved() {
  $('#s-saved').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Luoghi salvati</h1></div>
    ${saved.length ? `<div class="card list" style="margin-top:14px">${saved.map(p => { const c = CAT[p.cat]; return `<button class="row" data-a="place-s" data-id="${esc(p.id)}">${sq(c.c, c.ic, 'lg')}<span class="fl"><b>${esc(p.name)}</b><span>${esc(one(p))}${p.addr ? ' · ' + esc(p.addr) : ''}</span></span>${I('chev', 'chev')}</button>`; }).join('')}</div>`
      : `<div class="empty">${sq(CL.amber, IC.bookmark, 'lg')}<b>Nessun luogo salvato</b><span>Nella scheda di un luogo tocca il segnalibro per ritrovarlo qui, anche senza connessione.</span><button class="btn white" data-a="tab" data-t="luoghi">Apri la mappa</button></div>`}`;
}

/* ---------- accesso con l'account Vicina ---------- */
let authMode = 'in';
function rAuth() {
  const up = authMode === 'up';
  $('#s-auth').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button></div>
    <header class="pagehead"><i class="ai-logo xl">${I('shield')}</i><h1 class="h1" style="margin-top:18px">${up ? 'Crea il tuo account' : 'Accedi'}</h1>
      <p class="lead">${up ? 'Vale anche per Vicina, l’app per le emergenze.' : 'Usa l’email e la password del tuo account Vicina.'}</p></header>
    <div class="seg"><button class="${!up ? 'on' : ''}" data-a="auth-mode" data-k="in">Accedi</button><button class="${up ? 'on' : ''}" data-a="auth-mode" data-k="up">Registrati</button></div>
    <form data-f="auth" class="form">
      <label class="field"><span>Email</span><input id="au-em" type="email" inputmode="email" autocomplete="email" placeholder="nome@esempio.it" required></label>
      <label class="field"><span>Password</span><input id="au-pw" type="password" autocomplete="${up ? 'new-password' : 'current-password'}" placeholder="${up ? 'Almeno 8 caratteri' : 'La tua password'}" minlength="${up ? 8 : 1}" required></label>
      <p class="ferr" id="au-err" hidden></p>
      <button class="btn white" type="submit">${up ? 'Crea account' : 'Accedi'}</button>
    </form>
    ${!up ? `<button class="link center" data-a="auth-reset">Password dimenticata?</button>` : ''}
    <p class="muted small pad center">Se in Vicina entri con Google, imposta una password da Vicina (Password dimenticata) e usala qui.</p>`;
  show('auth', cur !== 'auth');
}
function rSetup() {
  $('#s-setup').innerHTML = `<header class="pagehead"><p class="eyebrow v">ULTIMO PASSO</p><h1 class="h1">Come ti chiami?</h1><p class="lead">Serve per il tuo profilo, lo stesso di Vicina.</p></header>
    <form data-f="setup" class="form">
      <label class="field"><span>Nome</span><input id="su-n" autocomplete="given-name" maxlength="40" required></label>
      <label class="field"><span>Cognome</span><input id="su-s" autocomplete="family-name" maxlength="40" required></label>
      <label class="field"><span>Data di nascita</span><input id="su-d" type="date" max="${new Date().toISOString().slice(0, 10)}" required></label>
      <div class="field"><span>Come vuoi che ti chiamiamo?</span><div class="seg"><button type="button" class="on" data-a="su-g" data-k="f">Al femminile</button><button type="button" data-a="su-g" data-k="m">Al maschile</button></div></div>
      <p class="ferr" id="su-err" hidden></p>
      <button class="btn white" type="submit">Continua</button>
    </form>`;
  show('setup', false);
}
function rEdit() {
  const p = acc.p || {};
  $('#s-edit').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Modifica profilo</h1></div>
    <div class="card pcard" style="margin-top:14px"><button class="pc-banner${p.banner ? ' img' : ''}" data-a="pick" data-k="banner" ${p.banner ? `style="background-image:url('${esc(p.banner)}')"` : ''} aria-label="Cambia il banner"><span class="pc-cam">${I('camera')}Banner</span></button>
      <div class="pc-main"><button data-a="pick" data-k="avatar" aria-label="Cambia la foto" class="pc-avbtn">${avatar(p, 'lg')}<span class="pc-cam sm">${I('camera')}</span></button>
        ${p.avatar || p.banner ? `<button class="pillbtn pc-edit" data-a="photo-del">Togli le foto</button>` : ''}</div></div>
    <form data-f="edit" class="form">
      <label class="field"><span>Nome</span><input id="ed-n" value="${esc(p.name)}" maxlength="40" required></label>
      <label class="field"><span>Cognome</span><input id="ed-s" value="${esc(p.surname)}" maxlength="40" required></label>
      <label class="field"><span>Qualcosa su di te</span><input id="ed-b" value="${esc(p.bio)}" maxlength="150" placeholder="Facoltativo"></label>
      <label class="field"><span>Città</span><input id="ed-c" value="${esc(p.city)}" maxlength="40" placeholder="Facoltativo"></label>
      <p class="ferr" id="ed-err" hidden></p>
      <button class="btn white" type="submit">Salva</button>
    </form>
    <p class="muted small pad center">Le modifiche valgono anche in Vicina.</p>
    <input type="file" id="ed-file" accept="image/*" hidden>`;
}
let pickKind = 'avatar', suG = 'f';
const ferr = (id, t) => { const e = $('#' + id); if (!e) return; e.hidden = !t; e.textContent = t || ''; };
async function busy(btn, fn) { if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = 'Attendi…'; } try { return await fn(); } finally { if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = btn.dataset.t; } } }
acc.onChange(u => {
  if (u) loadAgg().then(() => { if (cur === 'home') rHome(); else if (cur === 'agg') rAgg(); }); else { agg.data = null; invChats = null; }
  if (u && !acc.p && (cur === 'auth' || cur === 'tu')) { rSetup(); return; }
  if (cur === 'auth' || cur === 'setup') { stack = []; tab('tu'); if (u) toast('Ciao' + (acc.p?.name ? ' ' + acc.p.name : '') + '!'); }
  else if (cur === 'tu') rTu();
  else if (cur === 'home') rHome();
});

/* ================= VICINA: come funziona, installa, apri ================= */
const SHOTS = ['home', 'sos', 'tools', 'circle'].map(n => `altra/vicina-${n}.webp`);
function phone(shots, accent) {
  return `<div class="phone" style="--acc2:${accent}" aria-hidden="true"><div class="ph-screen">${shots.map((u, i) => `<img src="${u}" alt="" style="--i:${i};--n:${shots.length}" loading="lazy">`).join('')}</div><span class="ph-notch"></span></div>`;
}
function rVicina() {
  const v = fromVicina(), inst = otherInstalled;
  const ago = v?.got ? new Date(v.got).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '';
  $('#s-vicina').innerHTML = `
    <div class="glow" style="--g:#E5484D"></div>
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><span class="fl"></span><span class="chip-st${inst ? ' ok' : ''}">${inst ? 'Installata' : NATIVE ? 'Non installata' : 'App per Android'}</span></div>
    <div class="sis-hero">
      <div class="sis-txt"><p class="eyebrow">L’APP SORELLA</p><h1 class="title">Vicina</h1><p class="lead">Se sei in pericolo, tieni premuto un tasto: le persone di cui ti fidi ricevono subito dove sei e due foto.</p></div>
      ${phone(SHOTS, '#E5484D')}
    </div>
    <div class="acts-main">${inst ? `<button class="btn red" data-a="v-open">${I('shield')}Apri Vicina</button>` : `<button class="btn red" data-a="v-install" id="v-inst">${I('down')}${NATIVE ? 'Installa Vicina' : 'Scarica Vicina'}</button>`}</div>
    ${v ? `<div class="card sync">${sq(['rgba(52,211,153,.15)', '#34D399'], IC.check)}<span class="fl"><b>Collegata${ago ? ' · ' + esc(ago) : ''}</b><span>${[v.ready != null ? `Pronta per un’emergenza: ${v.ready}/${v.total || 5}` : '', v.circle != null ? `${v.circle} ${v.circle === 1 ? 'persona' : 'persone'} nella cerchia` : ''].filter(Boolean).join(' · ') || 'Le due app si sono scambiate le informazioni.'}</span></span></div>` : ''}
    <div class="label">Come funziona</div>
    <div class="steps">${[
      ['hold', 'Tieni premuto l’SOS', 'Basta un secondo e mezzo. Parte anche dal widget o scuotendo il telefono.'],
      ['send', 'La tua cerchia lo sa subito', 'Ricevono la tua posizione in tempo reale e due foto. Chi non ha l’app riceve un SMS.'],
      ['walk', 'Ti raggiungono o chiamano', 'Vedono dove sei sulla mappa e possono avvisare il 112.'],
      ['ok', 'Sono al sicuro', 'Quando è finita lo dici con un tocco e tutti si tranquillizzano.']
    ].map(([k, t2, s2], i) => `<div class="step" style="--d:${i}"><i class="st-ic st-${k}">${I(k === 'hold' ? 'shield' : k === 'send' ? 'send' : k === 'walk' ? 'pin' : 'check')}</i><span class="fl"><b>${i + 1}. ${t2}</b><span>${s2}</span></span></div>`).join('')}</div>
    <div class="label">Vicina e Vicina Extra insieme</div>
    <div class="card list">
      <div class="row">${sq(['rgba(255,107,120,.16)', '#FF8A94'], IC.shield)}<span class="fl"><b>SOS da qui</b><span>Lo strumento «SOS con Vicina» fa partire l’allarme di Vicina.</span></span></div>
      <div class="row">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.pin)}<span class="fl"><b>Da Vicina ai servizi</b><span>Da Vicina apri subito centri antiviolenza, servizi sociali e aiuti in Vicina Extra.</span></span></div>
      <div class="row">${sq(['rgba(96,165,250,.16)', '#93C5FD'], IC.sparkle)}<span class="fl"><b>Si scambiano le informazioni</b><span>Quando passi da un’app all’altra: le guide scelte per te, i luoghi salvati, se sei pronta per un’emergenza.</span></span></div>
      <div class="row">${sq(['rgba(52,211,153,.15)', '#34D399'], IC.user)}<span class="fl"><b>Stesso account</b><span>Nome, foto e banner sono gli stessi nelle due app.</span></span></div>
    </div>
    <div class="card list" style="margin-top:12px">
      <button class="row" data-a="t-agg">${sq(['rgba(229,72,77,.16)', '#FF8A94'], IC.bolt)}<span class="fl"><b>Aggiornamenti</b><span>SOS recenti e consigli dell’assistente</span></span>${I('chev', 'chev')}</button>
      <button class="row" data-a="invite">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.send)}<span class="fl"><b>Invita dalle chat di Vicina</b><span>Arriva con il tasto «Installa»</span></span>${I('chev', 'chev')}</button>
    </div>
    <p class="muted small pad center">Vicina non sostituisce il 112. L’APK arriva dalle release ufficiali su GitHub.</p>`;
}
async function doInstall(btn) {
  if (!NATIVE) { openUrl(VICINA.web); return; }
  const lab = btn.innerHTML; btn.disabled = true;
  try {
    const r = await installVicina(p => { btn.textContent = `Scarico Vicina… ${p}%`; });
    if (r === 'settings') toast('Consenti a Vicina Extra di installare app, poi tocca di nuovo «Installa»');
  } catch (e) { toast(e.message || 'Download non riuscito, riprova'); }
  finally { btn.disabled = false; btn.innerHTML = lab; }
}

/* ---------- strumenti ---------- */
async function toolSos() {
  if (NATIVE && await checkOther()) { if (await openVicina('sos', forVicina())) return; }
  sheet(`<h2>SOS</h2><p class="sub">${NATIVE ? 'Per avvisare la tua cerchia serve Vicina. Intanto, se sei in pericolo, chiama il 112.' : 'In pericolo adesso? Chiama il 112.'}</p>
    <button class="btn red" data-a="sos112">${I('phone')}Chiama il 112</button>
    <button class="btn ghost" data-a="vicina">${I('shield')}Scopri e installa Vicina</button>`);
}
// uscita rapida: copre l'app con una pagina neutra e la chiude. Al ritorno riparte dalla Home.
let exited = false;
function quickExit() {
  exited = true;
  try { speechSynthesis.cancel(); } catch { /* */ }
  stack = []; chat = null; closeSheet();
  $('#cover').hidden = false;
  if (NATIVE) import('@capacitor/app').then(m => m.App.minimizeApp()).catch(() => {});
}
// il clic che segue il secondo tocco cadrebbe sotto la copertura (magari su «Uscita rapida»): lo fermiamo
let swallowClick = 0;
document.addEventListener('click', e => { if (Date.now() < swallowClick) { e.stopPropagation(); e.preventDefault(); } }, true);
function leaveCover() { if (!exited) return; exited = false; swallowClick = Date.now() + 450; $('#cover').hidden = true; tab('home'); }
$('#cover').addEventListener('dblclick', leaveCover);
// sui telefoni il doppio tocco spesso non arriva come dblclick: lo riconosciamo noi (pointerup, e touchend dove manca)
{
  let lastTap = 0, lastEv = 0;
  const tap = e => {
    const n = Date.now();
    if (e.type === 'touchend' && n - lastEv < 60) return;   // lo stesso tocco arriva come pointerup e come touchend
    lastEv = n;
    if (n - lastTap < 350) { lastTap = 0; leaveCover(); } else lastTap = n;
  };
  $('#cover').addEventListener('pointerup', tap);
  $('#cover').addEventListener('touchend', tap, { passive: true });
}
if (NATIVE) import('@capacitor/app').then(m => m.App.addListener('resume', () => setTimeout(leaveCover, 400))).catch(() => {});

const NEAR = ['sociali', 'comune', 'consultori', 'antiviolenza', 'patronati', 'accoglienza', 'lavoro', 'anziani'];
async function nearSheet(cat) {
  const me = await getPos();
  if (!me) { sheet(`<h2>Il più vicino</h2><p class="sub">Attiva la posizione per trovare il servizio più vicino.</p><button class="btn white" data-a="pos">Attiva posizione</button>`); return; }
  const chips = `<div class="chips">${NEAR.map(id => `<button class="${cat === id ? 'on' : ''}" data-a="near-cat" data-k="${id}">${esc(CAT[id].t)}</button>`).join('')}</div>`;
  if (!cat) { sheet(`<h2>Il più vicino</h2><p class="sub">Scegli cosa ti serve: ti mostro il posto più vicino, con telefono e percorso.</p>${chips}`); return; }
  sheet(`<h2>${esc(CAT[cat].t)}</h2><p class="sub">Cerco il più vicino…</p>${chips}`);
  try { if (!places) await getPlaces(me); } catch { /* sotto */ }
  const p = (places || []).filter(x => x.cat === cat).sort((a, b) => a.d - b.d)[0];
  if (!$('#sheet').classList.contains('on')) return;
  $('#sheet-body').innerHTML = `<h2>${esc(CAT[cat].t)}</h2>${chips}` + (p ? `
    <div class="card near">${sq(CAT[cat].c, CAT[cat].ic)}<span class="fl"><b>${esc(p.name)}</b><span>${esc([one(p), dist(p.d), p.addr].filter(Boolean).join(' · '))}</span></span></div>
    <div class="acts2">${p.phone ? `<a class="btn white" href="${telHref(p.phone)}">${I('phone')}Chiama</a>` : `<button class="btn white" data-a="place" data-id="${esc(p.id)}">${I('info')}Scheda</button>`}<button class="btn ghost" data-a="url" data-u="${esc(dirUrl(p))}">${I('nav')}Percorso</button></div>`
    : `<p class="sub">Qui intorno non ne trovo. Chiedi ai servizi sociali del Comune.</p>`);
}
function talkSheet() {
  sheet(`<h2>Parla con qualcuno</h2><p class="sub">Linee gratuite, persone pronte ad ascoltarti. In pericolo: 112.</p><div class="card list">${['amico', 'samaritans', 'argento', 'n19696', 'n1522'].map(k => { const n = NUM[k]; return `<a class="row" href="${telHref(n.tel)}">${sq(['rgba(52,211,153,.15)', '#34D399'], IC.phone)}<span class="fl"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></span>${I('chev', 'chev')}</a>`; }).join('')}</div>`);
}
// lettere pronte
let curLetter = null;
function rLetters() {
  $('#s-letters').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Lettere pronte</h1></div>
    <p class="lead pad">Modelli da completare con i tuoi dati. Poi li copi, li mandi per email o li condividi. Restano sul telefono.</p>
    <div class="card list" style="margin-top:14px">${LETTERE.map(l => `<button class="row" data-a="letter" data-k="${l.id}">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.doc)}<span class="fl"><b>${esc(l.t)}</b><span>${esc(l.s)}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>
    <p class="muted small pad">Sono modelli generici: rileggili e adattali. Per questioni legali chiedi a un patronato, a un sindacato o a un avvocato.</p>`;
}
const letterVals = () => lsJ('lettere:dati', {});
function letterText(l, v) { return l.testo.replace(/\{(\w+)\}/g, (_, k) => k === 'data' ? new Date().toLocaleDateString('it-IT') : (v[k] || `[${(l.campi[k] || k).toLowerCase()}]`)); }
function rLetter(id) {
  const l = LETTERE.find(x => x.id === id); curLetter = l; const v = letterVals();
  if (!v.nome && acc.p) v.nome = acc.p.name + ' ' + acc.p.surname;
  $('#s-letter').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">${esc(l.t)}</h1></div>
    <form class="form" data-f="letter">${Object.entries(l.campi).map(([k, lab]) => `<label class="field"><span>${esc(lab)}</span>${k === 'motivo' || k === 'bisogno' ? `<textarea data-k="${k}" rows="3">${esc(v[k] || '')}</textarea>` : `<input data-k="${k}" value="${esc(v[k] || '')}">`}</label>`).join('')}</form>
    <div class="label">Anteprima</div>
    <pre class="card letter" id="l-prev">${esc(letterText(l, v))}</pre>
    <div class="acts3"><button class="act white" data-a="l-copy">${I('doc')}Copia</button><button class="act" data-a="l-mail">${I('send')}Email</button><button class="act" data-a="l-share">${I('ext')}Condividi</button></div>`;
}
async function letterOut(how) {
  const l = curLetter; if (!l) return; const txt = letterText(l, letterVals());
  if (how === 'mail') { openUrl(`mailto:?subject=${encodeURIComponent(l.oggetto)}&body=${encodeURIComponent(txt)}`); return; }
  if (how === 'share') {
    try { if (NATIVE) { const { Share } = await import('@capacitor/share'); await Share.share({ title: l.oggetto, text: txt, dialogTitle: l.t }); return; } if (navigator.share) { await navigator.share({ title: l.oggetto, text: txt }); return; } } catch (e) { if (/cancel/i.test(String(e?.message))) return; }
  }
  try { await navigator.clipboard.writeText(txt); toast('Lettera copiata'); } catch { toast('Copia non riuscita: seleziona il testo dall’anteprima'); }
}
// scadenze
function rDead() {
  const list = lsJ('scadenze', []).sort((a, b) => a.due - b.due);
  $('#s-dead').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Scadenze</h1></div>
    <p class="lead pad">Inserisci una data e ti dico entro quando fare la domanda. Le scadenze restano sul telefono.</p>
    ${list.length ? `<div class="label">Le tue scadenze</div><div class="card list">${list.map(x => { const d = daysLeft(x.due), sc = SCADENZE.find(y => y.id === x.id); return `<div class="row">${sq(d < 0 ? ['rgba(255,255,255,.08)', '#8C95A5'] : d <= 14 ? ['rgba(255,107,120,.16)', '#FF8A94'] : ['rgba(52,211,153,.15)', '#34D399'], IC.clock)}<span class="fl"><b>${esc(sc?.t || '')}</b><span>${d < 0 ? 'Scaduta il ' : 'Entro il '}${new Date(x.due).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}${d >= 0 ? ` · ${d === 0 ? 'oggi' : d === 1 ? 'domani' : 'tra ' + d + ' giorni'}` : ''}</span></span><button class="roundbtn sm" data-a="d-del" data-at="${x.at}" aria-label="Togli">${I('x')}</button></div>`; }).join('')}</div>` : ''}
    <div class="label">Calcola</div>
    <div class="stack">${SCADENZE.map(sc => `<form class="card dead" data-f="dead" data-k="${sc.id}"><b>${esc(sc.t)}</b><span class="muted">${esc(sc.s)}</span>
      <label class="field"><span>${esc(sc.q)}</span><input type="date" required max="${new Date().toISOString().slice(0, 10)}"></label>
      <div class="acts2"><button class="btn white" type="submit">Calcola e salva</button><button class="btn ghost" type="button" data-a="sit" data-k="${sc.sit}">La guida</button></div></form>`).join('')}</div>`;
}

/* ================= CREA CON L'AI: lettere, guide e corsi su misura ================= */
const KINDS = [['lettera', 'Lettera', 'Pronta da inviare a un ufficio, un’azienda, una persona'], ['guida', 'Guida', 'Passo passo, su qualsiasi cosa'], ['corso', 'Corso', 'Lezioni brevi con esempi ed esercizi']];
const crea = { kind: 'guida', q: '', busy: false };
let docs = lsJ('docs', []), curDoc = null;
const saveDocs = () => ls.set('docs', JSON.stringify(docs.slice(0, 40)));
const docMd = t => { // markdown semplice → HTML sicuro
  const lines = esc(t).split('\n'); let out = '', list = '';
  const close = () => { if (list) { out += `</${list}>`; list = ''; } };
  const inl = x => x.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([A-ZÀ-Ú0-9 '’.,/]+)\]/g, '<mark>[$1]</mark>');
  for (const l of lines) {
    let m;
    if ((m = /^#\s+(.*)/.exec(l))) { close(); out += `<h1>${inl(m[1])}</h1>`; }
    else if ((m = /^#{2,3}\s+(.*)/.exec(l))) { close(); out += `<h2>${inl(m[1])}</h2>`; }
    else if ((m = /^\s*[-•*]\s+(.*)/.exec(l))) { if (list !== 'ul') { close(); out += '<ul>'; list = 'ul'; } out += `<li>${inl(m[1])}</li>`; }
    else if ((m = /^\s*\d+[.)]\s+(.*)/.exec(l))) { if (list !== 'ol') { close(); out += '<ol>'; list = 'ol'; } out += `<li>${inl(m[1])}</li>`; }
    else if (!l.trim()) { close(); }
    else { close(); out += `<p>${inl(l)}</p>`; }
  }
  close(); return out;
};
const docTitle = t => (/^#\s+(.*)/m.exec(t)?.[1] || t.split('\n')[0] || 'Documento').replace(/\*\*/g, '').slice(0, 90);
function rCrea() {
  const ph = { lettera: 'Es. lettera al Comune per chiedere un contributo per l’affitto, sono senza lavoro da marzo', guida: 'Es. come preparare un colloquio di lavoro se non ne ho mai fatti', corso: 'Es. corso base per usare lo smartphone, per mia nonna di 80 anni' }[crea.kind];
  $('#s-crea').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Crea con l’AI</h1></div>
    <p class="lead pad">Scrivi cosa ti serve: l’assistente prepara un documento su misura da stampare, copiare, mandare o aprire con un’altra app.</p>
    <div class="kinds">${KINDS.map(([k, t2, s2]) => `<button class="kind${crea.kind === k ? ' on' : ''}" data-a="crea-kind" data-k="${k}" aria-pressed="${crea.kind === k}"><b>${t2}</b><span>${s2}</span></button>`).join('')}</div>
    <form class="form" data-f="crea"><label class="field"><span>Cosa ti serve?</span><textarea id="cr-q" rows="5" maxlength="2000" placeholder="${esc(ph)}">${esc(crea.q)}</textarea></label>
      <button class="btn white" type="submit" ${crea.busy ? 'disabled' : ''}>${I('sparkle')}${crea.busy ? 'Sto scrivendo…' : 'Crea ' + KINDS.find(x => x[0] === crea.kind)[1].toLowerCase()}</button></form>
    ${crea.busy ? `<div class="card gen"><i class="typing"><i></i><i></i><i></i></i><span>Ci vuole qualche secondo: sto scrivendo il documento.</span></div>` : ''}
    ${docs.length ? `<div class="label">I tuoi documenti</div><div class="card list">${docs.map(d => `<button class="row" data-a="doc-open" data-k="${d.id}">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], d.kind === 'lettera' ? IC.edit : d.kind === 'corso' ? IC.list : IC.doc)}<span class="fl"><b>${esc(d.title)}</b><span>${esc(KINDS.find(x => x[0] === d.kind)?.[1] || '')} · ${new Date(d.at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>` : ''}
    <p class="muted small pad">I documenti restano sul telefono. Rileggili sempre: l’AI può sbagliare, e i dati tra [PARENTESI] vanno completati da te.</p>`;
}
async function makeDoc(q) {
  if (crea.busy) return;
  crea.q = q; crea.busy = true; rCrea();
  try {
    const text = await askDoc(crea.kind, q);
    const d = { id: 'd' + Date.now(), kind: crea.kind, q, title: docTitle(text), text, at: Date.now() };
    docs.unshift(d); saveDocs(); crea.busy = false; crea.q = '';
    rDoc(d.id); show('doc');
  } catch (e) { crea.busy = false; rCrea(); toast(e.message); }
}
const docHtml = d => `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>${esc(d.title)}</title><style>
  body{font:12pt/1.55 Georgia,'Times New Roman',serif;color:#111;margin:2cm;max-width:17cm}
  h1{font:bold 18pt/1.25 Arial,sans-serif;margin:0 0 14pt}h2{font:bold 13pt/1.3 Arial,sans-serif;margin:18pt 0 6pt}
  p{margin:0 0 8pt}ul,ol{margin:0 0 10pt 18pt;padding:0}li{margin:0 0 4pt}mark{background:#FFF3B0}
  footer{margin-top:24pt;font:9pt Arial,sans-serif;color:#777}@page{margin:2cm}</style></head><body>${docMd(d.text)}<footer>Creato con Vicina Extra · ${new Date(d.at).toLocaleDateString('it-IT')}</footer></body></html>`;
function rDoc(id) {
  const d = docs.find(x => x.id === id); if (!d) return; curDoc = d;
  $('#s-doc').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><span class="fl"></span><button class="roundbtn" data-a="doc-del" aria-label="Elimina">${I('x')}</button></div>
    <article class="card docv">${docMd(d.text)}</article>
    <div class="docacts">
      <button class="act white" data-a="doc-print">${I('doc')}Stampa</button>
      <button class="act" data-a="doc-share">${I('send')}Manda</button>
      <button class="act" data-a="doc-file">${I('ext')}Apri con…</button>
      <button class="act" data-a="doc-copy">${I('list')}Copia</button>
      <button class="act" data-a="doc-mail">${I('chat')}Email</button>
      <button class="act" data-a="crea" data-q="${esc(d.q)}">${I('sparkle')}Rifai</button>
    </div>
    <p class="muted small pad">Stampa: si apre la stampa del telefono, dove puoi anche salvare in PDF. «Apri con…» salva un file che si apre con Word, Documenti, Drive e altre app.</p>`;
}
const plain = t => t.replace(/^#{1,3}\s+/gm, '').replace(/\*\*(.+?)\*\*/g, '$1');
async function docOut(how) {
  const d = curDoc; if (!d) return;
  try {
    if (how === 'copy') { await navigator.clipboard.writeText(plain(d.text)); toast('Copiato'); return; }
    if (how === 'mail') { openUrl(`mailto:?subject=${encodeURIComponent(d.title)}&body=${encodeURIComponent(plain(d.text).slice(0, 1800))}`); return; }
    if (how === 'print') {
      if (XN) { await XN.print({ html: docHtml(d), title: d.title }); return; }
      const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0'; document.body.appendChild(f);
      f.contentDocument.open(); f.contentDocument.write(docHtml(d)); f.contentDocument.close();
      setTimeout(() => { try { f.contentWindow.focus(); f.contentWindow.print(); } catch { toast('Stampa non disponibile qui: usa «Apri con…»'); } setTimeout(() => f.remove(), 3000); }, 300);
      return;
    }
    if (how === 'share') {
      if (NATIVE) { const { Share } = await import('@capacitor/share'); await Share.share({ title: d.title, text: plain(d.text), dialogTitle: 'Manda con…' }); return; }
      if (navigator.share) { await navigator.share({ title: d.title, text: plain(d.text) }); return; }
      await navigator.clipboard.writeText(plain(d.text)); toast('Copiato: incollalo dove vuoi'); return;
    }
    if (how === 'file') {
      const name = d.title.replace(/[^\w\sàèéìòù-]/gi, '').trim().replace(/\s+/g, '-').slice(0, 50) + '.doc';
      if (NATIVE) {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
        const w = await Filesystem.writeFile({ path: name, data: docHtml(d), directory: Directory.Cache, encoding: Encoding.UTF8 });
        const { Share } = await import('@capacitor/share');
        await Share.share({ title: d.title, files: [w.uri], dialogTitle: 'Apri con…' }); return;
      }
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([docHtml(d)], { type: 'application/msword' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }
  } catch (e) { if (!/cancel/i.test(String(e?.message))) toast('Non riuscito: ' + (e?.message || 'riprova')); }
}

/* ================= AGGIORNAMENTI tra Vicina e Vicina Extra (con l'AI da intermediario) ================= */
let agg = { data: null, err: '', loading: false, ai: lsJ('agg:ai', null) };
const ago = t => { const m = Math.round((Date.now() - new Date(t)) / 60000), h = Math.round(m / 60), d = Math.round(m / 1440); return m < 60 ? `${m} min fa` : m < 1440 ? (h === 1 ? '1 ora fa' : `${h} ore fa`) : (d === 1 ? 'ieri' : `${d} giorni fa`); };
const fmt = t => new Date(t).toLocaleString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const dur = (a, b) => { const m = Math.round((new Date(b) - new Date(a)) / 60000); return m < 60 ? m + ' min' : Math.round(m / 60) + ' ore'; };
async function loadAgg() {
  if (!acc.user) return null;
  agg.loading = true;
  try { agg.data = await acc.recent(30); agg.err = ''; } catch (e) { agg.err = e.message; }
  agg.loading = false; return agg.data;
}
function aggEvents() {
  const ev = [], d = agg.data, v = fromVicina();
  for (const x of d?.mine || []) ev.push({ t: x.created_at, ic: IC.shield, c: ['#E5484D', '#fff'], title: x.active ? 'SOS in corso' : 'Hai mandato un SOS', sub: `${fmt(x.created_at)}${x.resolved_at ? ' · chiuso dopo ' + dur(x.created_at, x.resolved_at) : x.active ? ' · ancora attivo' : ''}`, k: 'sos-mine', live: x.active });
  for (const x of d?.got || []) ev.push({ t: x.created_at, ic: IC.people, c: ['rgba(255,107,120,.16)', '#FF8A94'], title: `${x.from_name} ha chiesto aiuto`, sub: `${fmt(x.created_at)}${x.resolved_at ? ' · ora è al sicuro' : x.active ? ' · ancora attivo' : ''}`, k: 'sos-got', live: x.active });
  for (const x of d?.checks || []) ev.push({ t: x.created_at, ic: IC.people, c: ['rgba(156,140,255,.16)', '#B4A8FF'], title: 'Appello «State tutti bene?»', sub: `${fmt(x.created_at)} · ${x.answered || 0} risposte`, k: 'check' });
  if (v?.got) ev.push({ t: v.got, ic: IC.check, c: ['rgba(52,211,153,.15)', '#34D399'], title: 'Vicina collegata', sub: [v.ready != null ? `Pronta per un’emergenza: ${v.ready}/${v.total || 5}` : '', v.circle != null ? `${v.circle} nella cerchia` : ''].filter(Boolean).join(' · ') || fmt(v.got), k: 'link' });
  for (const x of lsJ('scadenze', [])) { const dd = daysLeft(x.due); if (dd >= 0 && dd <= 21) ev.push({ t: Date.now() - 1, ic: IC.clock, c: ['rgba(244,114,182,.16)', '#F9A8D4'], title: (SCADENZE.find(y => y.id === x.id)?.t || 'Scadenza'), sub: dd === 0 ? 'Scade oggi' : `Scade tra ${dd} giorni`, k: 'dead' }); }
  return ev.sort((a, b) => new Date(b.t) - new Date(a.t));
}
const recentSos = () => (agg.data?.mine || []).concat(agg.data?.got || []).find(x => Date.now() - new Date(x.created_at) < 7 * 864e5);
function recentBanner() {
  const x = recentSos(); if (!x) return '';
  const mine = !x.from_name;
  return `<button class="aggban" data-a="t-agg"><i class="ab-dot"></i><span class="fl"><b>${mine ? (x.active ? 'Il tuo SOS è attivo' : 'Dopo il tuo SOS') : esc(x.from_name) + ' ha chiesto aiuto'}</b><span>${ago(x.created_at)} · l’assistente ti suggerisce cosa fare adesso</span></span>${I('chev', 'chev')}</button>`;
}
function rAgg() {
  const ev = aggEvents();
  $('#s-agg').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Aggiornamenti</h1></div>
    <p class="lead pad">Cosa è successo di recente tra Vicina e Vicina Extra, e cosa puoi fare adesso.</p>
    ${!acc.user ? `<div class="card sync">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.user)}<span class="fl"><b>Accedi con l’account di Vicina</b><span>Così vedi qui i tuoi SOS e gli appelli degli ultimi 30 giorni.</span></span></div><button class="btn white" data-a="login">Accedi</button>` : ''}
    ${agg.err ? `<p class="muted pad">Non riesco a leggere gli aggiornamenti di Vicina: ${esc(agg.err)}</p>` : ''}
    <div class="aibox aggai"><div class="aib-h"><i class="ai-logo">${I('sparkle')}</i><div class="fl"><b>L’assistente fa da ponte</b><span>${agg.ai?.at ? 'Aggiornato ' + ago(agg.ai.at) : 'Legge cosa è successo e ti suggerisce i prossimi passi.'}</span></div></div>
      ${agg.ai?.text ? `<div class="msg bot aggtxt">${md(agg.ai.text)}</div>` : ''}
      <button class="btn ghost" data-a="agg-ai" id="agg-ai">${I('sparkle')}${agg.ai?.text ? 'Aggiorna il consiglio' : 'Cosa posso fare adesso?'}</button></div>
    <div class="label">Ultimi 30 giorni</div>
    ${ev.length ? `<div class="card list">${ev.map(e => `<div class="row">${sq(e.c, e.ic)}<span class="fl"><b>${esc(e.title)}${e.live ? ' <i class="live-dot"></i>' : ''}</b><span>${esc(e.sub)}</span></span></div>`).join('')}</div>`
      : `<div class="empty"><b>Nessun aggiornamento</b><span>Qui compaiono gli SOS e gli appelli di Vicina, le tue scadenze e il collegamento tra le app.</span></div>`}
    <div class="acts2"><button class="btn ghost" data-a="t-talk">${I('phone')}Parla con qualcuno</button><button class="btn ghost" data-a="v-open">${I('shield')}Apri Vicina</button></div>`;
  if (acc.user && !agg.data && !agg.loading) loadAgg().then(() => { if (cur === 'agg') rAgg(); if (cur === 'home') rHome(); });
}
async function aggAI(force) {
  const btn = $('#agg-ai'); if (btn) { btn.disabled = true; btn.textContent = 'L’assistente sta leggendo…'; }
  const ev = aggEvents().slice(0, 8);
  const ctx = ev.length ? 'Cosa è successo (dal più recente):\n' + ev.map(e => `- ${e.title}: ${e.sub}`).join('\n') : 'Nessun SOS né appello di recente. La persona vuole sapere come prepararsi e cosa offre Vicina Extra.';
  try { const text = await askUpdate(ctx); agg.ai = { text, at: Date.now() }; ls.set('agg:ai', JSON.stringify(agg.ai)); }
  catch (e) { toast(e.message); }
  if (cur === 'agg') rAgg();
}

/* ================= INVITA dalle chat di Vicina ================= */
let invChats = null, invSel = [], invErr = '';
async function rInvite() {
  const box = $('#s-invite');
  const head = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Invita su Vicina Extra</h1></div>
    <p class="lead pad">Manda l’invito nelle tue chat di Vicina: comparirà con il tasto «Installa». Su Android l’app si installa subito, su iPhone si scarica.</p>`;
  if (!acc.user) { box.innerHTML = head + `<div class="card sync">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.user)}<span class="fl"><b>Accedi con l’account di Vicina</b><span>Servono le tue chat di Vicina.</span></span></div><button class="btn white" data-a="login">Accedi</button>`; return; }
  if (!invChats) {
    box.innerHTML = head + `<p class="muted pad">Carico le tue chat…</p>`;
    try { invChats = await acc.chats(); invErr = ''; } catch (e) { invErr = e.message; invChats = []; }
  }
  box.innerHTML = head + (invErr ? `<p class="muted pad">${esc(invErr)}</p>` : '') + (invChats.length
    ? `<div class="card list" style="margin-top:12px">${invChats.map(c => `<button class="row pick${invSel.includes(c.id) ? ' on' : ''}" data-a="inv-pick" data-id="${esc(c.id)}" aria-pressed="${invSel.includes(c.id)}">${avatar({ name: c.name.split(' ')[0], surname: c.name.split(' ')[1] || '' })}<span class="fl"><b>${esc(c.name)}</b><span>${esc(c.kind)}</span></span><i class="box">${I('check')}</i></button>`).join('')}</div>
      <button class="btn white" id="inv-go" data-a="inv-go" ${invSel.length ? '' : 'disabled'}>${invSel.length ? `Invia l’invito (${invSel.length})` : 'Scegli almeno una chat'}</button>`
    : `<div class="empty"><b>Nessuna chat</b><span>Collegati con qualcuno in Vicina, poi torna qui.</span></div>`);
}
async function sendInvites(btn) {
  if (!invSel.length) return; btn.disabled = true; btn.textContent = 'Invio…';
  try { await acc.invite(invSel); toast(invSel.length === 1 ? 'Invito mandato' : `Invito mandato in ${invSel.length} chat`); invSel = []; back(); }
  catch (e) { toast(e.message); btn.disabled = false; btn.textContent = 'Riprova'; }
}

/* ================= link da Vicina ================= */
onLink(url => {
  const L = parseLink(url); if (!L) return;
  if (L.data && L.data.app === 'vicina') saveFromVicina(L.data);
  stack = [];
  switch (L.route) {
    case 'luoghi': mCat = CAT[L.arg] ? L.arg : ''; mQ = ''; show('luoghi', false); break;
    case 'aiuto': if (SIT[L.arg]) { tab('aiuti'); openSit(L.arg); } else tab('aiuti'); break;
    case 'tutela': if (TUT[L.arg]) { tab('tutele'); openTut(L.arg); } else tab('tutele'); break;
    case 'domande': qz = { i: 0, r: {}, sel: [] }; tab('home'); rQuiz(); show('quiz'); break;
    case 'ai': tab('home'); openAI(null, L.q.get('q') || ''); break;
    case 'vicina': checkOther().then(() => { tab('home'); rVicina(); show('vicina'); }); break;
    default: tab('home');
  }
  if (L.data) toast('Collegata a Vicina');
});

/* ================= ASSISTENTE ================= */
const AI_KEY = 'ai:chats';
let chats = lsJ(AI_KEY, []);
let chat = null, aiBusy = false;
const saveChats = () => ls.set(AI_KEY, JSON.stringify(chats.slice(0, 40)));
const AI_SUGG = [['Mi spetta un aiuto per l’affitto?', IC.home, ['rgba(255,181,71,.16)', '#FFB547']], ['Come si chiede la Legge 104?', IC.doc, ['rgba(96,165,250,.16)', '#93C5FD']], ['Il mio partner mi controlla il telefono', IC.shield, ['rgba(156,140,255,.16)', '#B4A8FF']], ['Mi sento solo, cosa posso fare qui vicino?', IC.people, ['rgba(52,211,153,.15)', '#34D399']]];
const md = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|\n)[-•] (.+)/g, '$1• $2').replace(/\n/g, '<br>');
function openAI(id, q) {
  chat = id ? chats.find(c => c.id === id) : null;
  rAI(); show('ai');
  if (q) sendAI(q);
}
function rAI() {
  const box = $('#ai-msgs'), msgs = chat?.msgs || [];
  $('#s-ai').classList.toggle('ai-empty', !msgs.length && !aiBusy);
  $('#ai-ttl').innerHTML = chat ? `<b>${esc(chat.title)}</b>` : '';
  if (!msgs.length && !aiBusy) {
    box.innerHTML = `<div class="ai-hero"><i class="ai-logo xl">${I('chat')}</i>
      <h1 class="ai-greet"><span>Ciao${acc.p?.name ? ' ' + esc(acc.p.name) : ''},</span><br><b>come posso aiutarti?</b></h1>
      <p class="ai-q">Servizi, aiuti, diritti: chiedimi pure.</p>
      <div class="stack">${AI_SUGG.map(([q, ic, c]) => `<button class="row card" data-a="ai-chip" data-q="${esc(q)}">${sq(c, ic)}<span class="fl"><b>${esc(q)}</b></span>${I('chev', 'chev')}</button>`).join('')}</div></div>`;
    return;
  }
  box.innerHTML = msgs.map(m => m.role === 'user' ? `<div class="msg me">${esc(m.text)}</div>` : m.role === 'err' ? `<div class="msg err">${esc(m.text)}<button class="retry" data-a="ai-retry">${I('send')}Riprova</button></div>` : `<div class="msg bot">${md(m.text)}</div>`).join('')
    + (aiBusy ? `<div class="msg bot typing"><i></i><i></i><i></i></div>` : '');
  box.scrollTop = box.scrollHeight;
}
async function sendAI(text) {
  text = String(text || '').trim(); if (!text || aiBusy) return;
  $('#ai-txt').value = '';
  if (!chat) { chat = { id: 'c' + Date.now(), title: text.slice(0, 60), at: Date.now(), msgs: [] }; chats.unshift(chat); }
  const c = chat; // se intanto esci o apri un'altra chat, la risposta va comunque nella sua
  c.msgs.push({ role: 'user', text }); c.at = Date.now(); aiBusy = true; rAI(); saveChats();
  try {
    const hist = c.msgs.filter(m => m.role === 'user' || m.role === 'model').slice(-12);
    const r = await askAI(hist, pos);
    c.msgs.push({ role: 'model', text: r });
  } catch (e) { c.msgs.push({ role: 'err', text: e.message || 'L’assistente non risponde. Riprova tra poco.' }); }
  aiBusy = false; saveChats(); if (cur === 'ai' && chat === c) rAI();
}
function rAIList() {
  $('#s-ailist').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Le tue chat</h1><button class="pillbtn light" data-a="ai-new">Nuova</button></div>
    ${chats.length ? `<div class="card list" style="margin-top:14px">${chats.map(c => `<button class="row" data-a="ai-open" data-id="${c.id}">${sq(['rgba(255,255,255,.08)', '#D4D4D8'], IC.chat)}<span class="fl"><b>${esc(c.title)}</b><span>${new Date(c.at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>
      <button class="link center" data-a="ai-clear">Cancella tutte le chat</button>` : `<p class="muted pad">Non hai ancora chat. Le chat restano solo su questo telefono.</p>`}`;
}
$('#ai-txt').addEventListener('keydown', e => { if (e.key === 'Enter') sendAI($('#ai-txt').value); });

/* ================= azioni ================= */
const R = { crea: rCrea, agg: rAgg, invite: rInvite, vicina: rVicina, letters: rLetters, dead: rDead, home: rHome, aiuti: rAiuti, tutele: rTutele, insieme: rInsieme, tu: rTu, saved: rSaved, quiz: rQuiz, luoghi: () => {} };
document.addEventListener('click', async e => {
  if (e.target.id === 'sheet') { closeSheet(); return; }
  const nb = e.target.closest('#nav button'); if (nb) { tab(nb.dataset.tab); return; }
  const t = e.target.closest('[data-a]'); if (!t || t.disabled) return;
  const a = t.dataset.a, k = t.dataset.k;
  if (t.closest('#sheet') && !['sheet-x', 'prof-set', 'near-cat'].includes(a)) closeSheet();
  switch (a) {
    case 'tab': tab(t.dataset.t); break;
    case 'back': back(); break;
    case 'sheet-x': closeSheet(); break;
    case 'big': setBig(!isBig()); R[cur]?.(); toast(isBig() ? 'Testo più grande' : 'Testo normale'); break;
    case 'prof': prof = k; ls.set('prof', k); rHome(); break;
    case 'prof-sheet': sheet(`<h2>Cosa mostrare in Home</h2><p class="sub">Scegli per chi sono i luoghi in evidenza.</p><div class="card list">${PROF.map(([k2, t2]) => `<button class="row" data-a="prof-set" data-k="${k2}"><span class="fl"><b>${t2}</b></span>${prof === k2 ? I('check', 'ok') : ''}</button>`).join('')}</div>`); break;
    case 'prof-set': prof = k; ls.set('prof', k); closeSheet(); rTu(); break;
    case 'cat': mCat = k; mQ = ''; stack = []; show('luoghi', false); break;
    case 'm-cat': mCat = k; rList(); if (mapApi && pos) mapApi.fit(filtered(), pos); break;
    case 'm-acc': mAcc = t.dataset.v === '1'; rList(); break;
    case 'm-center': if (mapApi && pos) mapApi.center(pos, 15); else toast('Attiva la posizione per centrare la mappa'); break;
    case 'm-sheet-toggle': { const sh = $('#m-sheet'); sh.classList.toggle('expanded'); t.setAttribute('aria-expanded', sh.classList.contains('expanded')); setTimeout(() => mapApi?.resize(), 320); break; }
    case 'm-reload': { const me = await getPos(); if (me) { places = null; loadPlaces(me, true); } break; }
    case 'place': { const p = (places || []).find(x => x.id === t.dataset.id); if (p) openPlace(p); break; }
    case 'place-s': { const p = saved.find(x => x.id === t.dataset.id); if (p) openPlace(p); break; }
    case 'save': { const p = curPlace; if (!p) break;
      if (isSaved(p.id)) { saved = saved.filter(x => x.id !== p.id); toast('Tolto dai salvati'); } else { saved.unshift({ ...p }); toast('Salvato: lo trovi in Tu'); }
      saveSaved(); const sc = $('#s-luogo').scrollTop; openPlace(p); stack.pop(); $('#s-luogo').scrollTop = sc; break; }
    case 'url': openUrl(t.dataset.u); break;
    case 'vicina': await checkOther(); rVicina(); show('vicina'); break;
    case 'v-open': if (!(await goVicina('extra'))) toast('Vicina non si apre: prova a installarla'); break;
    case 'v-install': doInstall(t); break;
    case 't-sos': toolSos(); break;
    case 't-crea': case 'crea': crea.q = t.dataset.q ? 'Una guida pratica su: ' + t.dataset.q : crea.q; rCrea(); show('crea'); break;
    case 'crea-kind': crea.kind = k; rCrea(); break;
    case 'doc-open': rDoc(k); show('doc'); break;
    case 'doc-del': docs = docs.filter(d => d.id !== curDoc?.id); saveDocs(); back(); toast('Documento eliminato'); break;
    case 'doc-copy': docOut('copy'); break;
    case 'doc-share': docOut('share'); break;
    case 'doc-print': docOut('print'); break;
    case 'doc-file': docOut('file'); break;
    case 'doc-mail': docOut('mail'); break;
    case 't-agg': rAgg(); show('agg'); break;
    case 'agg-ai': aggAI(true); break;
    case 'invite': rInvite(); show('invite'); break;
    case 'inv-pick': { const i = invSel.indexOf(t.dataset.id); if (i >= 0) invSel.splice(i, 1); else invSel.push(t.dataset.id); t.classList.toggle('on', i < 0); t.setAttribute('aria-pressed', i < 0); $('#inv-go').disabled = !invSel.length; $('#inv-go').textContent = invSel.length ? `Invia l’invito (${invSel.length})` : 'Scegli almeno una chat'; break; }
    case 'inv-go': sendInvites(t); break;
    case 't-exit': quickExit(); break;
    case 't-near': nearSheet(); break;
    case 'near-cat': nearSheet(k); break;
    case 't-talk': talkSheet(); break;
    case 't-letters': rLetters(); show('letters'); break;
    case 'letter': rLetter(k); show('letter'); break;
    case 'l-copy': letterOut('copy'); break;
    case 'l-share': letterOut('share'); break;
    case 'l-mail': letterOut('mail'); break;
    case 't-dead': rDead(); show('dead'); break;
    case 'd-del': { const d = lsJ('scadenze', []).filter(x => x.at !== +t.dataset.at); ls.set('scadenze', JSON.stringify(d)); rDead(); break; }
    case 'sos112': location.href = 'tel:112'; break;
    case 'pos': { const p = await getPos(true); if (!p) toast('Posizione non disponibile: attivala nelle impostazioni del telefono'); else { $('#map-msg').hidden = true; if (cur === 'luoghi') openMap(); else R[cur]?.(); } break; }
    case 'insieme': rInsieme(); show('insieme'); break;
    case 'i-retry': placesP = null; rInsieme(); break;
    case 'quiz': qz = { i: 0, r: {}, sel: [] }; rQuiz(); show('quiz', cur !== 'quiz'); break;
    case 'quiz-res': if (!quiz) break; qz = { i: 99, r: { ...quiz.r }, sel: [] }; rQuiz(); show('quiz'); break;
    case 'qa': quizAnswer(k); break;
    case 'qm': { const q = quizSteps(qz.r)[qz.i];
      if (k === 'nulla') qz.sel = qz.sel.includes('nulla') ? [] : ['nulla'];
      else { qz.sel = qz.sel.filter(x => x !== 'nulla'); qz.sel = qz.sel.includes(k) ? qz.sel.filter(x => x !== k) : [...qz.sel, k]; }
      if (q) { const sc = $('#s-quiz').scrollTop; rQuiz(); $('#s-quiz').scrollTop = sc; } break; }
    case 'qnext': if (qz.sel.length) quizAnswer([...qz.sel]); break;
    case 'qprev': qz.i = Math.max(0, qz.i - 1); qz.sel = []; rQuiz(); break;
    case 'sit': openSit(k); break;
    case 'mis': { const c = t.closest('.mis'); c.classList.toggle('open'); t.setAttribute('aria-expanded', c.classList.contains('open')); break; }
    case 'doc': { const i = +t.dataset.i, key = 'doc:' + k; let d = lsJ(key, []); d = d.includes(i) ? d.filter(x => x !== i) : [...d, i]; ls.set(key, JSON.stringify(d));
      t.classList.toggle('on', d.includes(i)); t.setAttribute('aria-pressed', d.includes(i));
      const lab = t.closest('.card').previousElementSibling; if (lab) lab.textContent = `Documenti da preparare · ${d.length}/${SIT[k].doc.length}`; break; }
    case 'speak': {
      if (t.getAttribute('aria-pressed') === 'true') { stopSpeak(); break; }
      const txt = $('#s-aiuto').innerText.replace(/Ascolta|Ferma|Fonte ufficiale|Chiedi su questo/g, '');
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(txt); u.lang = 'it-IT';
        u.onend = u.onerror = () => stopSpeak();
        speechSynthesis.speak(u);
        t.innerHTML = I('x') + 'Ferma'; t.setAttribute('aria-pressed', 'true');
      } catch { stopSpeak(); toast('Lettura non disponibile su questo telefono'); }
      break;
    }
    case 'tut': openTut(k); break;
    case 'i-cat': iCat = k; rInsieme(); break;
    case 'saved': rSaved(); show('saved'); break;
    case 'nums': sheet(`<h2>Numeri utili</h2><p class="sub">Gratuiti. In pericolo adesso chiama il 112.</p><div class="card list">${Object.values(NUM).map(n => `<a class="row" href="${telHref(n.tel)}">${sq(CL.rose, IC.phone)}<span class="fl"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></span><span class="val">${esc(n.n.length < 7 ? n.n : '')}</span></a>`).join('')}</div>`); break;
    case 'info': sheet(`<h2>Privacy e informazioni</h2><div class="prose">
      <p><b>Cosa resta sul telefono.</b> Le tue risposte alle domande, i luoghi salvati e le chat con l’assistente restano solo su questo telefono.</p>
      <p><b>Assistente.</b> Le domande vanno a un servizio di intelligenza artificiale per avere la risposta, con la tua zona arrotondata alla città. Non scrivere dati come codice fiscale o indirizzo.</p>
      <p><b>Account.</b> È lo stesso di Vicina: nome, foto e banner sono quelli del tuo profilo Vicina. Puoi usare l’app anche senza account.</p>
      <p><b>Luoghi.</b> Arrivano da OpenStreetMap: possono mancare o essere vecchi. Verifica sempre prima di andare.</p>
      <p><b>Aiuti.</b> Sono spiegazioni generali: i requisiti precisi li verificano INPS, patronati e servizi sociali.</p>
      <p>Vicina Extra ${esc(VER)} non sostituisce il 112.</p></div>`); break;
    case 'login': authMode = 'in'; rAuth(); break;
    case 'auth-mode': authMode = k; rAuth(); break;
    case 'auth-reset': { const em = $('#au-em').value.trim(); if (!em) { ferr('au-err', 'Scrivi la tua email e tocca di nuovo «Password dimenticata?».'); break; }
      try { await acc.reset(em); ferr('au-err', ''); toast('Ti abbiamo mandato un’email per cambiare la password'); } catch (er) { ferr('au-err', er.message); } break; }
    case 'su-g': suG = k; t.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === t)); break;
    case 'edit': rEdit(); show('edit'); break;
    case 'pick': pickKind = k; $('#ed-file').click(); break;
    case 'photo-del': try { await acc.removePhoto('avatar'); await acc.removePhoto('banner'); rEdit(); toast('Foto tolte'); } catch (er) { toast(er.message); } break;
    case 'logout': await acc.signOut(); acc.user = null; acc.p = null; rTu(); toast('Sei uscito'); break;
    case 'ai': openAI(null); break;
    case 'ai-q': openAI(null, t.dataset.q); break;
    case 'ai-chip': sendAI(t.dataset.q); break;
    case 'ai-retry': {
      if (!chat || aiBusy) break;
      while (chat.msgs.length && chat.msgs[chat.msgs.length - 1].role === 'err') chat.msgs.pop();
      const last = chat.msgs[chat.msgs.length - 1];
      if (last?.role === 'user') { chat.msgs.pop(); sendAI(last.text); }
      break;
    }
    case 'ai-send': sendAI($('#ai-txt').value); break;
    case 'ai-new': chat = null; if (cur !== 'ai') show('ai'); rAI(); break;
    case 'ai-list': rAIList(); show('ailist'); break;
    case 'ai-open': openAI(t.dataset.id); break;
    case 'ai-clear': chats = []; saveChats(); rAIList(); break;
  }
});
document.addEventListener('change', async e => {
  if (e.target.id !== 'ed-file') return;
  const f = e.target.files?.[0]; e.target.value = ''; if (!f) return;
  toast('Carico la foto…');
  try { const b = await shrink(f, pickKind === 'banner' ? 1400 : 600); await acc.photo(b, pickKind); rEdit(); toast(pickKind === 'banner' ? 'Banner aggiornato' : 'Foto aggiornata'); }
  catch (er) { toast(er.message || 'La foto non si carica, riprova'); }
});
document.addEventListener('submit', async e => {
  const f = e.target.closest('[data-f]'); if (!f) return; e.preventDefault();
  const btn = f.querySelector('[type=submit]');
  switch (f.dataset.f) {
    case 'home-q': {
      const q = $('#h-q').value.trim(); if (!q) return;
      const ql = q.toLowerCase();
      // le parole di un aiuto portano agli aiuti, le altre ai luoghi
      const cat = CATS.find(c => (c.t + ' ' + c.one).toLowerCase().includes(ql));
      const sit = SITUAZIONI.find(s => (s.t + ' ' + s.misure.map(m => m.t).join(' ')).toLowerCase().includes(ql));
      if (cat) { mCat = cat.id; mQ = ''; show('luoghi'); }
      else if (sit) openSit(sit.id);
      else { mCat = ''; mQ = q; show('luoghi'); }
      break;
    }
    case 'aiuti-q': aQ = $('#a-q').value; rAiuti(); $('#a-q').focus(); break;
    case 'crea': { const q = $('#cr-q').value.trim(); if (q.length < 6) { toast('Scrivi qualche parola in più su cosa ti serve'); return; } makeDoc(q); break; }
    case 'dead': {
      const sc = SCADENZE.find(x => x.id === f.dataset.k), v = f.querySelector('input').value; if (!sc || !v) return;
      const due = sc.calc(new Date(v + 'T12:00:00')).getTime(), list = lsJ('scadenze', []);
      list.push({ id: sc.id, due, at: Date.now() }); ls.set('scadenze', JSON.stringify(list.slice(-20)));
      const d = daysLeft(due); toast(d < 0 ? 'Attenzione: la scadenza è già passata' : `Hai tempo fino al ${new Date(due).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}`);
      rDead(); break;
    }
    case 'aibox': { const q = f.querySelector('input').value.trim(); if (!q) return; openAI(null, `A proposito di «${f.dataset.topic}»: ${q}`); break; }
    case 'auth': {
      const em = $('#au-em').value.trim(), pw = $('#au-pw').value;
      await busy(btn, async () => {
        try {
          if (authMode === 'up') { const r = await acc.signUp(em, pw); if (r.needsConfirm) { ferr('au-err', ''); toast('Controlla la tua email e tocca il link per confermare, poi accedi'); authMode = 'in'; rAuth(); } }
          else await acc.signIn(em, pw);
        } catch (er) { ferr('au-err', er.message); }
      });
      break;
    }
    case 'setup': {
      const d = { name: $('#su-n').value.trim(), surname: $('#su-s').value.trim(), dob: $('#su-d').value, gender: suG };
      if (!d.name || !d.surname || !d.dob) { ferr('su-err', 'Compila tutti i campi.'); return; }
      await busy(btn, async () => { try { await acc.create(d); stack = []; tab('tu'); toast('Benvenuto, ' + d.name + '!'); } catch (er) { ferr('su-err', er.message); } });
      break;
    }
    case 'edit': {
      const d = { name: $('#ed-n').value.trim(), surname: $('#ed-s').value.trim(), bio: $('#ed-b').value.trim(), city: $('#ed-c').value.trim() };
      if (!d.name || !d.surname) { ferr('ed-err', 'Nome e cognome servono.'); return; }
      await busy(btn, async () => { try { await acc.save(d); toast('Profilo salvato'); back(); } catch (er) { ferr('ed-err', er.message); } });
      break;
    }
  }
});
let qT = 0;
$('#m-q').addEventListener('input', e => { clearTimeout(qT); qT = setTimeout(() => { mQ = e.target.value; rList(); }, 250); });
document.addEventListener('input', e => {
  const lk = e.target.closest('[data-f="letter"] [data-k]');
  if (lk && curLetter) { const v = letterVals(); v[lk.dataset.k] = lk.value; ls.set('lettere:dati', JSON.stringify(v)); $('#l-prev').textContent = letterText(curLetter, v); return; }
  if (e.target.id === 'a-q') { clearTimeout(qT); qT = setTimeout(() => { aQ = e.target.value; const p = e.target.selectionStart; rAiuti(); const i = $('#a-q'); i.focus(); try { i.setSelectionRange(p, p); } catch { /* */ } }, 300); } });

/* ================= avvio ================= */
rHome(); rAiuti(); rTutele();
show('home', false);
// i luoghi si cercano subito in sottofondo, così la mappa è pronta quando la apri
if (pos) getPlaces(pos).then(() => { if (cur === 'home') rHome(); }).catch(() => {});
checkOther().then(() => { if (cur === 'home') rHome(); else if (cur === 'tu') rTu(); });
