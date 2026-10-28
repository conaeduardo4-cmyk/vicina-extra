// Vicina Extra: servizi sociali, welfare e luoghi per stare insieme.
import '@fontsource-variable/manrope';
import './style.css';
import { Capacitor } from '@capacitor/core';
import { IC, CATS, CAT, INSIEME_CATS, NUM, SITUAZIONI, SIT, GRUPPI, quizSteps, qText, qOpts, quizResult, TUTELE, TUT } from './data.js';
import { nearby, dist, dirUrl, hoursTxt } from './places.js';
import { askAI } from './ai.js';
import { acc, shrink } from './account.js';

const NATIVE = Capacitor.isNativePlatform();
const VER = import.meta.env.VITE_APP_VERSION || '1.1.0';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const I = (n, c = '') => `<svg class="i ${c}"><use href="#i-${n}"/></svg>`;
const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* */ } } };
const lsJ = (k, d) => { try { return JSON.parse(ls.get(k) || 'null') ?? d; } catch { return d; } };
const sq = (c, ic, cls = '') => `<i class="sq ${cls}" style="background:${c[0]};color:${c[1]}"><svg class="i" viewBox="0 0 24 24"><path d="${ic}"/></svg></i>`;
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
  setTimeout(() => { const v = getComputedStyle(document.documentElement).getPropertyValue('--sat'); if (!/\d/.test(v) || parseFloat(v) < 12) { document.documentElement.style.setProperty('--sat', '32px'); document.documentElement.style.setProperty('--sab', '18px'); } }, 2500);
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
function show(id, push = true) {
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
  if (closeSheet()) return true;
  if (cur === 'ai' && aiBusy) return true;
  if (stack.length) { const p = stack.pop(); R[p]?.(); show(p, false); return true; }
  if (cur !== 'home') { tab('home'); return true; }
  return false;
}

/* ---------------- profilo (per chi) ---------------- */
const PROF = [['tutti', 'Per me'], ['giovani', 'Giovani'], ['famiglie', 'Famiglie'], ['anziani', 'Anziani'], ['disabilita', 'Disabilità']];
const PROF_CATS = {
  tutti: ['sociali', 'consultori', 'quartiere', 'casa', 'lavoro', 'antiviolenza', 'patronati', 'volontariato'],
  giovani: ['giovani', 'palestre', 'oratori', 'consultori', 'quartiere', 'volontariato', 'lavoro', 'antiviolenza'],
  famiglie: ['consultori', 'sociali', 'casa', 'oratori', 'patronati', 'quartiere', 'antiviolenza', 'accoglienza'],
  anziani: ['anziani', 'quartiere', 'sociali', 'patronati', 'volontariato', 'disabilita', 'accoglienza', 'consultori'],
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
    <form class="aib-in" data-f="aibox" data-topic="${esc(topic)}"><input type="text" placeholder="Scrivi la tua domanda…" maxlength="600" enterkeyhint="send" aria-label="La tua domanda su ${esc(topic)}"><button aria-label="Chiedi">${I('send')}</button></form></div>`;
}

/* ================= HOME ================= */
function rHome() {
  const h = new Date().getHours(), saluto = h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera';
  const nome = acc.p?.name ? ', ' + acc.p.name : '';
  const res = quiz ? quizResult(quiz.r) : null;
  $('#s-home').innerHTML = `
    <div class="glow violet"></div>
    <header class="top">
      <div class="fl"><p class="eyebrow">VICINA EXTRA</p><h1 class="hello">${esc(saluto + nome)}</h1></div>
      <button class="sqbtn" data-a="big" aria-label="Testo più grande" aria-pressed="${isBig()}"><span>Aa</span></button>
      <button class="ask" data-a="ai"><i class="ai-logo">${I('chat')}</i><span>Chiedi</span></button>
    </header>
    <form class="search" data-f="home-q"><svg class="i"><use href="#i-search"/></svg><input id="h-q" type="search" placeholder="Affitto, consultorio, lavoro, compagnia…" autocomplete="off" enterkeyhint="search" aria-label="Cerca un servizio"></form>
    <div class="chips pad">${PROF.map(([k, t]) => `<button class="${prof === k ? 'on' : ''}" data-a="prof" data-k="${k}">${t}</button>`).join('')}</div>
    ${res ? `<button class="hero violet slim" data-a="quiz-res"><span class="deco"></span><span class="tag">PER TE</span><b>${res.sit.length === 1 ? '1 guida' : res.sit.length + ' guide'} e ${res.fun.length + res.cats.length} idee per te</b><span class="sub">Tocca per rivedere i risultati delle tue risposte.</span></button>`
      : `<button class="hero violet" data-a="quiz"><span class="deco"></span><span class="tag">AIUTI E DIRITTI</span><b>Scopri cosa ti può spettare: rispondi a qualche domanda</b><span class="sub">Le domande cambiano in base a te. Niente dati personali.</span></button>`}
    ${res && res.fun.length ? `<div class="sec"><h2>Per il tuo tempo libero</h2></div><div class="funrow">${res.fun.slice(0, 4).map(funCard).join('')}</div>` : ''}
    <div class="sec"><h2>Vicino a te</h2><button class="link" data-a="tab" data-t="luoghi">Mappa</button></div>
    <div class="catgrid">${PROF_CATS[prof].map(id => { const c = CAT[id]; return `<button class="cat" data-a="cat" data-k="${id}">${sq(c.c, c.ic)}<span>${esc(c.t)}</span></button>`; }).join('')}</div>
    <button class="row card" data-a="insieme">${sq(['rgba(52,211,153,.15)', '#34D399'], IC.people, 'lg')}<span class="fl"><b>Non sentirti solo</b><span>Luoghi e linee di ascolto per stare in compagnia</span></span>${I('chev', 'chev')}</button>
    <p class="foot-note">In pericolo adesso? Chiama il <a href="tel:112">112</a> o usa l'SOS di Vicina.</p>`;
}
const funCard = f => { const c = CAT[f.cat]; return `<button class="fun" data-a="cat" data-k="${f.cat}" style="--c1:${c.c[1]};--c2:${c.c[2]}"><span class="deco"></span>${sq(['rgba(255,255,255,.2)', '#fff'], c.ic)}<b>${esc(f.t)}</b><span>${esc(f.s)}</span></button>`; };

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
  $('#m-filters').innerHTML = `<button class="${!mAcc ? 'on' : ''}" data-a="m-acc" data-v="0">Tutti</button><button class="${mAcc ? 'on' : ''}" data-a="m-acc" data-v="1">${I('access')}Accessibili</button>${places ? `<button data-a="m-reload" aria-label="Aggiorna i luoghi">${I('locate')}Aggiorna</button>` : ''}`;
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
  $('#m-list').innerHTML = list.length
    ? `<div class="card list">${list.slice(0, 60).map(placeRow).join('')}</div>${list.length > 60 ? `<p class="muted small pad">Ne mostro 60 su ${list.length}: scegli una categoria per vedere gli altri.</p>` : ''}<p class="muted small pad">Dati di OpenStreetMap: orari e numeri possono cambiare, verifica prima di andare.</p>`
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
    <div class="cover" style="--c1:${c.c[1]};--c2:${c.c[2]}"><span class="deco"></span>
      <div class="cover-top"><button class="roundbtn dark" data-a="back" aria-label="Indietro">${I('back')}</button><span class="fl"></span>
        <button class="roundbtn dark${isSaved(p.id) ? ' on' : ''}" data-a="save" aria-label="${isSaved(p.id) ? 'Togli dai salvati' : 'Salva questo luogo'}" aria-pressed="${isSaved(p.id)}">${I('bookmark')}</button></div></div>
    <div class="pl-id"><i class="pl-ic" style="background:${c.c[2]}"><svg class="i" viewBox="0 0 24 24"><path d="${c.ic}"/></svg></i>
      <p class="eyebrow" style="color:${c.c[1]}">${esc(one(p).toUpperCase())}</p><h1 class="h1">${esc(p.name)}</h1>
      <p class="muted">${esc([p.addr, p.d != null ? dist(p.d) + ' da te' : ''].filter(Boolean).join(' · '))}</p>
      ${tags.length ? `<div class="tags">${tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}</div>
    <div class="acts3">
      ${p.phone ? `<a class="act white" href="${telHref(p.phone)}">${I('phone')}Chiama</a>` : `<button class="act white" data-a="ai-q" data-q="${esc('Come posso contattare ' + p.name + '?')}">${I('chat')}Contatti</button>`}
      <button class="act" data-a="url" data-u="${esc(dirUrl(p))}">${I('nav')}Indicazioni</button>
      ${p.web ? `<button class="act" data-a="url" data-u="${esc(/^https?:/.test(p.web) ? p.web : 'https://' + p.web)}">${I('globe')}Sito</button>` : `<button class="act" data-a="save">${I('bookmark')}${isSaved(p.id) ? 'Salvato' : 'Salva'}</button>`}
    </div>
    <div class="label">Cosa puoi trovare qui</div>
    <div class="card list">${c.what.map(w => `<div class="row sm"><i class="dot" style="background:${c.c[1]}"></i><span class="fl"><b>${esc(w)}</b></span></div>`).join('')}</div>
    <div class="card note-card">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.clock)}<span>${p.hours ? `<b>Orari:</b> ${esc(hoursTxt(p.hours))}<br>` : ''}${esc(c.how)}</span></div>
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
    <button class="hero violet slim" data-a="${quiz ? 'quiz-res' : 'quiz'}"><span class="deco"></span><b>${quiz ? 'I tuoi risultati' : 'Non sai da dove partire?'}</b><span class="sub">${quiz ? 'Gli aiuti scelti in base alle tue risposte.' : 'Rispondi a qualche domanda e ti mostro gli aiuti adatti a te.'}</span></button>
    <div class="card warn">${sq(['rgba(255,181,71,.2)', '#FFB547'], IC.doc, 'lg')}<span><b>Prima di tutto: l'ISEE.</b> Serve per quasi tutti gli aiuti. Lo fai gratis al CAF o online sul sito dell'INPS.</span><button class="link sm" data-a="ai-q" data-q="Come si fa l’ISEE e cosa serve?">Come si fa?</button></div>
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
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><span class="fl"></span>${canSpeak() ? `<button class="pillbtn" data-a="speak">${I('sound')}Ascolta</button>` : ''}</div>
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
      <button class="hero green mini" data-a="cat" data-k="volontariato"><span class="deco"></span>${I('hands')}<b>Fai volontariato</b></button>
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
      ${meRow('url', 'shield', CL.rose, 'Vicina, l’app per le emergenze', '', ' data-u="https://vicina.netlify.app"')}
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
  if (u && !acc.p && (cur === 'auth' || cur === 'tu')) { rSetup(); return; }
  if (cur === 'auth' || cur === 'setup') { stack = []; tab('tu'); if (u) toast('Ciao' + (acc.p?.name ? ' ' + acc.p.name : '') + '!'); }
  else if (cur === 'tu') rTu();
  else if (cur === 'home') rHome();
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
  box.innerHTML = msgs.map(m => m.role === 'user' ? `<div class="msg me">${esc(m.text)}</div>` : m.role === 'err' ? `<div class="msg err">${esc(m.text)}</div>` : `<div class="msg bot">${md(m.text)}</div>`).join('')
    + (aiBusy ? `<div class="msg bot typing"><i></i><i></i><i></i></div>` : '');
  box.scrollTop = box.scrollHeight;
}
async function sendAI(text) {
  text = String(text || '').trim(); if (!text || aiBusy) return;
  $('#ai-txt').value = '';
  if (!chat) { chat = { id: 'c' + Date.now(), title: text.slice(0, 60), at: Date.now(), msgs: [] }; chats.unshift(chat); }
  chat.msgs.push({ role: 'user', text }); chat.at = Date.now(); aiBusy = true; rAI(); saveChats();
  try {
    const hist = chat.msgs.filter(m => m.role === 'user' || m.role === 'model').slice(-12);
    const r = await askAI(hist, pos);
    chat.msgs.push({ role: 'model', text: r });
  } catch (e) { chat.msgs.push({ role: 'err', text: e.message || 'L’assistente non risponde. Riprova tra poco.' }); }
  aiBusy = false; saveChats(); rAI();
}
function rAIList() {
  $('#s-ailist').innerHTML = `<div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><h1 class="bar-t">Le tue chat</h1><button class="pillbtn light" data-a="ai-new">Nuova</button></div>
    ${chats.length ? `<div class="card list" style="margin-top:14px">${chats.map(c => `<button class="row" data-a="ai-open" data-id="${c.id}">${sq(['rgba(255,255,255,.08)', '#D4D4D8'], IC.chat)}<span class="fl"><b>${esc(c.title)}</b><span>${new Date(c.at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>
      <button class="link center" data-a="ai-clear">Cancella tutte le chat</button>` : `<p class="muted pad">Non hai ancora chat. Le chat restano solo su questo telefono.</p>`}`;
}
$('#ai-txt').addEventListener('keydown', e => { if (e.key === 'Enter') sendAI($('#ai-txt').value); });

/* ================= azioni ================= */
const R = { home: rHome, aiuti: rAiuti, tutele: rTutele, insieme: rInsieme, tu: rTu, saved: rSaved, quiz: rQuiz, luoghi: () => {} };
document.addEventListener('click', async e => {
  if (e.target.id === 'sheet') { closeSheet(); return; }
  const nb = e.target.closest('#nav button'); if (nb) { tab(nb.dataset.tab); return; }
  const t = e.target.closest('[data-a]'); if (!t || t.disabled) return;
  const a = t.dataset.a, k = t.dataset.k;
  if (t.closest('#sheet') && !['sheet-x', 'prof-set'].includes(a)) closeSheet();
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
    case 'm-reload': { const me = await getPos(); if (me) { places = null; loadPlaces(me, true); } break; }
    case 'place': { const p = (places || []).find(x => x.id === t.dataset.id); if (p) openPlace(p); break; }
    case 'place-s': { const p = saved.find(x => x.id === t.dataset.id); if (p) openPlace(p); break; }
    case 'save': { const p = curPlace; if (!p) break;
      if (isSaved(p.id)) { saved = saved.filter(x => x.id !== p.id); toast('Tolto dai salvati'); } else { saved.unshift({ ...p }); toast('Salvato: lo trovi in Tu'); }
      saveSaved(); const sc = $('#s-luogo').scrollTop; openPlace(p); stack.pop(); $('#s-luogo').scrollTop = sc; break; }
    case 'url': openUrl(t.dataset.u); break;
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
    case 'speak': { const txt = $('#s-aiuto').innerText.replace(/Ascolta|Fonte ufficiale|Chiedi su questo/g, ''); try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'it-IT'; speechSynthesis.speak(u); } catch { toast('Lettura non disponibile su questo telefono'); } break; }
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
document.addEventListener('input', e => { if (e.target.id === 'a-q') { clearTimeout(qT); qT = setTimeout(() => { aQ = e.target.value; const p = e.target.selectionStart; rAiuti(); const i = $('#a-q'); i.focus(); try { i.setSelectionRange(p, p); } catch { /* */ } }, 300); } });

/* ================= avvio ================= */
rHome(); rAiuti(); rTutele();
show('home', false);
// i luoghi si cercano subito in sottofondo, così la mappa è pronta quando la apri
if (pos) getPlaces(pos).catch(() => {});
