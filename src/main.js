// Vicina Extra: servizi sociali, welfare e luoghi per stare insieme.
import '@fontsource-variable/manrope';
import './style.css';
import { Capacitor } from '@capacitor/core';
import { IC, CATS, CAT, INSIEME_CATS, NUM, SITUAZIONI, SIT, QUIZ, quizResult, TUTELE, TUT } from './data.js';
import { nearby, km, dist, dirUrl, hoursTxt } from './places.js';
import { askAI } from './ai.js';

const NATIVE = Capacitor.isNativePlatform();
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const I = (n, c = '') => `<svg class="i ${c}"><use href="#i-${n}"/></svg>`;
const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* */ } } };
const sq = (c, ic, cls = '') => `<i class="sq ${cls}" style="background:${c[0]};color:${c[1]}"><svg class="i" viewBox="0 0 24 24"><path d="${ic}"/></svg></i>`;
const telHref = t => 'tel:' + String(t).replace(/[^\d+]/g, '');

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

let pos = (() => { try { return JSON.parse(ls.get('pos') || 'null'); } catch { return null; } })();
let posAsked = false;
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
  posAsked = true;
  return pos;
}

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2600); }

/* ---------------- testo grande ---------------- */
const setBig = v => { document.documentElement.classList.toggle('big', !!v); ls.set('big', v ? '1' : ''); };
setBig(ls.get('big') === '1');

/* ---------------- navigazione ---------------- */
const TABS = ['home', 'luoghi', 'aiuti', 'tutele', 'insieme'];
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
  if (cur === 'ai' && aiBusy) return true;
  if (stack.length) { const p = stack.pop(); R[p]?.(); show(p, false); return true; }
  if (cur !== 'home') { tab('home'); return true; }
  return false;
}

/* ---------------- profilo (per chi) ---------------- */
const PROF = [['tutti', 'Per me'], ['giovani', 'Giovani'], ['famiglie', 'Famiglie'], ['anziani', 'Anziani'], ['disabilita', 'Disabilità']];
const PROF_CATS = {
  tutti: ['consultori', 'antiviolenza', 'sociali', 'casa', 'lavoro', 'giovani', 'anziani', 'disabilita'],
  giovani: ['giovani', 'consultori', 'lavoro', 'palestre', 'oratori', 'volontariato', 'antiviolenza', 'sociali'],
  famiglie: ['consultori', 'sociali', 'casa', 'lavoro', 'oratori', 'patronati', 'antiviolenza', 'volontariato'],
  anziani: ['anziani', 'sociali', 'patronati', 'volontariato', 'casa', 'disabilita', 'consultori', 'palestre'],
  disabilita: ['disabilita', 'patronati', 'lavoro', 'sociali', 'casa', 'volontariato', 'palestre', 'giovani']
};
let prof = ls.get('prof') || 'tutti';

/* ================= HOME ================= */
function rHome() {
  const h = new Date().getHours(), saluto = h < 13 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera';
  $('#s-home').innerHTML = `
    <div class="glow violet"></div>
    <header class="top">
      <div class="fl"><p class="eyebrow">VICINA EXTRA</p><h1 class="hello">${saluto}</h1></div>
      <button class="sqbtn" data-a="big" aria-label="Testo più grande" aria-pressed="${document.documentElement.classList.contains('big')}">Aa</button>
      <button class="ask" data-a="ai"><i class="ai-logo">${I('chat')}</i><span>Chiedi</span></button>
    </header>
    <form class="search" data-f="home-q"><svg class="i"><use href="#i-search"/></svg><input id="h-q" type="search" placeholder="Affitto, consultorio, lavoro, compagnia…" autocomplete="off" enterkeyhint="search" aria-label="Cerca un servizio"></form>
    <div class="chips pad">${PROF.map(([k, t]) => `<button class="${prof === k ? 'on' : ''}" data-a="prof" data-k="${k}">${t}</button>`).join('')}</div>
    <button class="hero violet" data-a="quiz"><span class="deco"></span><span class="tag">AIUTI E DIRITTI</span><b>Scopri cosa ti può spettare: rispondi a 5 domande</b><span class="sub">Bonus, sostegni, agevolazioni. Senza dati personali.</span></button>
    <div class="sec"><h2>Vicino a te</h2><button class="link" data-a="tab" data-t="luoghi">Mappa</button></div>
    <div class="catgrid">${PROF_CATS[prof].map(id => { const c = CAT[id]; return `<button class="cat" data-a="cat" data-k="${id}">${sq(c.c, c.ic)}<span>${esc(c.t)}</span></button>`; }).join('')}</div>
    <button class="row card" data-a="tab" data-t="insieme">${sq(['rgba(52,211,153,.15)', '#34D399'], IC.people, 'lg')}<span class="fl"><b>Non sentirti solo</b><span>Luoghi e linee di ascolto per stare in compagnia</span></span>${I('chev', 'chev')}</button>
    <p class="foot-note">In pericolo adesso? Chiama il <a href="tel:112">112</a> o usa l'SOS di Vicina.</p>`;
}

/* ================= LUOGHI ================= */
let mapApi = null, mapLoading = false, places = null, mCat = '', mAcc = false, mQ = '';
async function openMap() {
  rMapUI();
  const me = await getPos();
  if (!me) { mapMsg('Attiva la posizione per vedere i luoghi vicino a te.', true); rList(); return; }
  if (!mapApi && !mapLoading) {
    mapLoading = true;
    try { const m = await import('./map.js'); mapApi = await m.createMap($('#map'), { center: me, onPick: p => openPlace(p) }); mapApi.setMe(me); }
    catch (e) { console.warn('mappa', e); mapMsg('Mappa non disponibile senza connessione.'); }
    mapLoading = false;
  }
  mapApi?.resize();
  await loadPlaces(me);
}
async function loadPlaces(me, force) {
  if (!places || force) {
    $('#m-list').innerHTML = `<p class="muted pad">Cerco i servizi intorno a te…</p>`;
    try { places = await nearby(me, { force }); } catch (e) { places = places || []; mapMsg('I dati dei luoghi non arrivano: controlla la connessione e riprova.'); }
  }
  rList(); if (cur === 'luoghi' && mapApi) mapApi.fit(filtered().slice(0, 25), me);
}
function mapMsg(t, btn) { const m = $('#map-msg'); m.hidden = false; m.innerHTML = esc(t) + (btn ? `<button class="pillbtn light" data-a="pos">Attiva posizione</button>` : ''); }
function filtered() {
  const q = mQ.trim().toLowerCase();
  return (places || []).filter(p => (!mCat || p.cat === mCat) && (!mAcc || p.wheel === 'yes') &&
    (!q || (p.name + ' ' + CAT[p.cat].t + ' ' + CAT[p.cat].one + ' ' + CAT[p.cat].what.join(' ')).toLowerCase().includes(q)));
}
function rMapUI() {
  $('#m-filters').innerHTML = `<button class="${!mAcc ? 'on' : ''}" data-a="m-acc" data-v="0">Tutti</button><button class="${mAcc ? 'on' : ''}" data-a="m-acc" data-v="1">${I('access')}Accessibili</button>`;
  $('#m-cats').innerHTML = `<button class="${!mCat ? 'on' : ''}" data-a="m-cat" data-k="">Tutte</button>` + CATS.map(c => `<button class="${mCat === c.id ? 'on' : ''}" data-a="m-cat" data-k="${c.id}" style="--cc:${c.c[1]}">${esc(c.t)}</button>`).join('');
  const q = $('#m-q'); if (q.value !== mQ) q.value = mQ;
}
function rList() {
  const list = filtered();
  mapApi?.setPlaces(list.slice(0, 80));
  if (places == null) return;
  $('#m-list').innerHTML = list.length
    ? `<div class="card list">${list.slice(0, 40).map(placeRow).join('')}</div><p class="muted small pad">Dati di OpenStreetMap: orari e numeri possono cambiare, verifica prima di andare.</p>`
    : `<div class="empty">${sq(['rgba(255,255,255,.08)', '#D4D4D8'], IC.search, 'lg')}<b>Nessun luogo trovato qui</b><span>Prova un'altra categoria o chiedi ai servizi sociali del tuo Comune: conoscono tutti i servizi della zona.</span><button class="btn ghost" data-a="ai-q" data-q="Quali servizi ci sono vicino a me per: ${esc(mCat ? CAT[mCat].t : mQ || 'aiuto sociale')}?">${I('chat')}Chiedi all'assistente</button></div>`;
}
const placeRow = p => { const c = CAT[p.cat];
  return `<button class="row" data-a="place" data-id="${esc(p.id)}">${sq(c.c, c.ic, 'lg')}<span class="fl"><b>${esc(p.name)}</b><span>${esc(c.one)}${p.d != null ? ' · ' + dist(p.d) : ''}${p.wheel === 'yes' ? ' · accessibile' : ''}</span></span>${I('chev', 'chev')}</button>`; };

/* ---------- scheda luogo ---------- */
function openPlace(p) {
  const c = CAT[p.cat];
  const tags = [p.wheel === 'yes' ? 'Accessibile in carrozzina' : p.wheel === 'limited' ? 'Accesso in parte agevolato' : '', p.fee === 'no' ? 'Gratuito' : ''].filter(Boolean);
  $('#s-luogo').innerHTML = `
    <div class="cover" style="--c1:${c.c[1]};--c2:${c.c[2]}"><span class="deco"></span>
      <div class="cover-top"><button class="roundbtn dark" data-a="back" aria-label="Indietro">${I('back')}</button></div></div>
    <div class="pl-id"><i class="pl-ic" style="background:${c.c[2]}"><svg class="i" viewBox="0 0 24 24"><path d="${c.ic}"/></svg></i>
      <p class="eyebrow" style="color:${c.c[1]}">${esc(c.one.toUpperCase())}</p><h1 class="h1">${esc(p.name)}</h1>
      <p class="muted">${esc([p.addr, p.d != null ? dist(p.d) + ' da te' : ''].filter(Boolean).join(' · '))}</p>
      ${tags.length ? `<div class="tags">${tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}</div>
    <div class="acts3">
      ${p.phone ? `<a class="act white" href="${telHref(p.phone)}">${I('phone')}Chiama</a>` : `<button class="act white" data-a="ai-q" data-q="${esc('Come posso contattare ' + p.name + '?')}">${I('chat')}Contatti</button>`}
      <button class="act" data-a="url" data-u="${esc(dirUrl(p))}">${I('nav')}Indicazioni</button>
      ${p.web ? `<button class="act" data-a="url" data-u="${esc(/^https?:/.test(p.web) ? p.web : 'https://' + p.web)}">${I('globe')}Sito</button>` : `<button class="act" data-a="ai-q" data-q="${esc('Cosa fa un ' + c.one.toLowerCase() + ' e come ci si accede?')}">${I('chat')}Chiedi</button>`}
    </div>
    <div class="label">Cosa puoi trovare qui</div>
    <div class="card list">${c.what.map(w => `<div class="row sm"><i class="dot" style="background:${c.c[1]}"></i><span class="fl"><b>${esc(w)}</b></span></div>`).join('')}</div>
    <div class="card note-card">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.clock)}<span>${p.hours ? `<b>Orari:</b> ${esc(hoursTxt(p.hours))}<br>` : ''}${esc(c.how)}</span></div>
    ${p.desc ? `<p class="muted pad">${esc(p.desc)}</p>` : ''}
    <p class="muted small pad">Indicazioni generali per questo tipo di servizio: ogni sede può offrire servizi diversi. Dati del luogo: OpenStreetMap.</p>`;
  show('luogo');
}

/* ================= AIUTI ================= */
function rAiuti() {
  $('#s-aiuti').innerHTML = `
    <header class="pagehead"><p class="eyebrow v">AIUTI E DIRITTI</p><h1 class="title">Cosa ti spetta</h1></header>
    <div class="card warn">${sq(['rgba(255,181,71,.2)', '#FFB547'], IC.doc, 'lg')}<span><b>Prima di tutto: l'ISEE.</b> Serve per quasi tutti gli aiuti. Lo fai gratis al CAF o online sul sito dell'INPS.</span></div>
    <button class="hero violet slim" data-a="quiz"><span class="deco"></span><b>Non sai da dove partire?</b><span class="sub">Rispondi a 5 domande e ti mostro gli aiuti adatti a te.</span></button>
    <div class="label">La tua situazione</div>
    <div class="stack">${SITUAZIONI.map(s => `<button class="row card" data-a="sit" data-k="${s.id}">${sq(s.c, s.ic, 'lg')}<span class="fl"><b>${esc(s.t)}</b><span>${esc(s.misure.map(m => m.t).slice(0, 3).join(' · '))}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>
    <p class="muted small pad">Requisiti e importi cambiano spesso: verifica sempre su inps.it, con un patronato o con i servizi sociali.</p>`;
}
const canSpeak = () => 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function';
function openSit(id) {
  const s = SIT[id];
  $('#s-aiuto').innerHTML = `
    <div class="glow" style="--g:${s.c[1]}"></div>
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Indietro">${I('back')}</button><span class="fl"></span>${canSpeak() ? `<button class="pillbtn" data-a="speak">${I('sound')}Ascolta</button>` : ''}</div>
    <header class="pagehead"><p class="eyebrow" style="color:${s.c[1]}">${esc(s.t.toUpperCase())}</p><h1 class="h1">I tuoi diritti, spiegati semplice</h1><p class="lead">${esc(s.intro)}</p></header>
    <div class="stack">${s.misure.map(m => `<div class="card mis"><b>${esc(m.t)}</b><p>${esc(m.s)}</p>${m.url ? `<button class="link sm" data-a="url" data-u="${esc(m.url)}">${I('globe')}Fonte ufficiale</button>` : ''}</div>`).join('')}</div>
    <div class="label">Come fare</div>
    <div class="card list">${s.passi.map((p, i) => `<div class="row sm top"><i class="num" style="color:${s.c[1]};background:${s.c[0]}">${i + 1}</i><span class="fl"><span class="txt">${esc(p)}</span></span></div>`).join('')}</div>
    ${s.nota ? `<p class="muted small pad">${esc(s.nota)}</p>` : ''}
    <div class="acts2">
      <button class="btn white" data-a="cat" data-k="patronati">Patronato o CAF vicino</button>
      <button class="btn ghost" data-a="cat" data-k="${s.tag}">${esc(CAT[s.tag].t)} vicino</button>
    </div>
    <button class="btn ghost" data-a="ai-q" data-q="${esc(s.t + ': cosa mi spetta e come lo chiedo?')}">${I('chat')}Chiedi all'assistente</button>`;
  show('aiuto');
}

/* ---------- 5 domande ---------- */
let qz = { i: 0, r: {} };
function rQuiz() {
  const done = qz.i >= QUIZ.length, q = QUIZ[qz.i];
  $('#s-quiz').innerHTML = `
    <div class="bar"><button class="roundbtn" data-a="back" aria-label="Chiudi">${I('x')}</button>
      <div class="prog">${QUIZ.map((_, k) => `<i class="${k < qz.i || done ? 'on' : ''}"></i>`).join('')}</div><span class="muted b">${done ? QUIZ.length : qz.i + 1}/${QUIZ.length}</span></div>
    ${done ? (() => { const ids = quizResult(qz.r); return `
      <header class="pagehead"><p class="eyebrow v">IL TUO RISULTATO</p><h1 class="h1">Ecco gli aiuti da guardare</h1><p class="lead">Non è una garanzia: i requisiti precisi li verifica l'INPS o il patronato. Ma è un buon punto di partenza.</p></header>
      <div class="stack">${ids.map(id => { const s = SIT[id]; return `<button class="row card" data-a="sit" data-k="${id}">${sq(s.c, s.ic, 'lg')}<span class="fl"><b>${esc(s.t)}</b><span>${esc(s.misure.map(m => m.t).join(' · '))}</span></span>${I('chev', 'chev')}</button>`; }).join('')}</div>
      <button class="btn ghost" data-a="quiz">Ricomincia</button>`; })()
    : `<header class="pagehead"><h1 class="h1">${esc(q.q)}</h1></header>
      <div class="stack">${q.a.map(([k, t]) => `<button class="opt" data-a="qa" data-k="${k}">${esc(t)}</button>`).join('')}</div>
      ${qz.i ? `<button class="link center" data-a="qprev">Indietro</button>` : ''}`}`;
}

/* ================= TUTELE ================= */
const numCard = (k, hl) => { const n = NUM[k]; return `<a class="numc${hl ? ' hl' : ''}" href="${telHref(n.tel)}"><b>${esc(n.n)}</b><span>${esc(n.t)}</span></a>`; };
function rTutele() {
  $('#s-tutele').innerHTML = `
    <header class="pagehead"><p class="eyebrow v">TUTELE</p><h1 class="title">Come tutelarti</h1><p class="lead">Cosa fare e a chi rivolgerti, situazione per situazione.</p></header>
    <div class="nums">${numCard('n1522', true)}${numCard('n114')}${numCard('argento')}${numCard('amico')}</div>
    <div class="label">Situazioni</div>
    <div class="card list">${TUTELE.map(t => `<button class="row" data-a="tut" data-k="${t.id}">${sq(t.c, t.ic, 'lg')}<span class="fl"><b>${esc(t.t)}</b><span>${esc(t.s)}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>
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
    <div class="acts2"><button class="btn white" data-a="cat" data-k="${t.tag}">${esc(CAT[t.tag].t)} vicino</button><button class="btn ghost" data-a="ai-q" data-q="${esc(t.t + ': cosa posso fare?')}">${I('chat')}Chiedi</button></div>`;
  show('tutela');
}

/* ================= INSIEME ================= */
let iCat = '';
async function rInsieme() {
  const box = $('#s-insieme');
  box.innerHTML = `
    <div class="glow green"></div>
    <header class="pagehead"><p class="eyebrow g">INSIEME</p><h1 class="title">Non sentirti solo</h1><p class="lead">Luoghi vicino a te dove fare qualcosa con altre persone.</p></header>
    <div class="chips pad">${[['', 'Tutti'], ...INSIEME_CATS.map(id => [id, CAT[id].t])].map(([k, t]) => `<button class="${iCat === k ? 'on' : ''}" data-a="i-cat" data-k="${k}">${esc(t)}</button>`).join('')}</div>
    <div id="i-list"><p class="muted pad">Cerco intorno a te…</p></div>
    <div class="duo">
      <button class="hero green mini" data-a="cat" data-k="volontariato"><span class="deco"></span>${I('hands')}<b>Fai volontariato</b></button>
      <a class="tile" href="${telHref(NUM.amico.tel)}">${I('chat')}<b>Parla con qualcuno adesso</b></a>
    </div>
    <div class="label">Linee di ascolto</div>
    <div class="card list">${['amico', 'argento', 'samaritans'].map(k => { const n = NUM[k]; return `<a class="row" href="${telHref(n.tel)}">${sq(['rgba(156,140,255,.16)', '#B4A8FF'], IC.phone, 'lg')}<span class="fl"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></span>${I('chev', 'chev')}</a>`; }).join('')}</div>`;
  const me = await getPos();
  const el = $('#i-list'); if (!el) return;
  if (!me) { el.innerHTML = `<div class="empty"><b>Attiva la posizione</b><span>Così ti mostro centri, oratori, palestre popolari e associazioni vicino a te.</span><button class="btn white" data-a="pos">Attiva posizione</button></div>`; return; }
  try { if (!places) places = await nearby(me); } catch { el.innerHTML = `<p class="muted pad">I dati dei luoghi non arrivano: controlla la connessione.</p>`; return; }
  const list = places.filter(p => iCat ? p.cat === iCat : INSIEME_CATS.includes(p.cat)).slice(0, 12);
  el.innerHTML = list.length ? `<div class="stack">${list.map(p => { const c = CAT[p.cat]; return `<button class="row card" data-a="place" data-id="${esc(p.id)}">${sq(c.c, c.ic, 'lg')}<span class="fl"><b>${esc(p.name)}</b><span>${esc(c.one)} · ${dist(p.d)}</span></span>${I('chev', 'chev')}</button>`; }).join('')}</div>`
    : `<div class="empty"><b>Nessun luogo trovato qui</b><span>Chiedi ai servizi sociali del Comune: sanno quali attività ci sono nella tua zona.</span></div>`;
}

/* ================= ASSISTENTE ================= */
const AI_KEY = 'ai:chats';
let chats = (() => { try { return JSON.parse(ls.get(AI_KEY) || '[]'); } catch { return []; } })();
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
      <h1 class="ai-greet"><span>Ciao,</span><br><b>come posso aiutarti?</b></h1>
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
    ${chats.length ? `<div class="card list">${chats.map(c => `<button class="row" data-a="ai-open" data-id="${c.id}">${sq(['rgba(255,255,255,.08)', '#D4D4D8'], IC.chat)}<span class="fl"><b>${esc(c.title)}</b><span>${new Date(c.at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span></span>${I('chev', 'chev')}</button>`).join('')}</div>
      <button class="link center" data-a="ai-clear">Cancella tutte le chat</button>` : `<p class="muted pad">Non hai ancora chat. Le chat restano solo su questo telefono.</p>`}`;
}
$('#ai-txt').addEventListener('keydown', e => { if (e.key === 'Enter') sendAI($('#ai-txt').value); });

/* ================= azioni ================= */
const R = { home: rHome, aiuti: rAiuti, tutele: rTutele, insieme: rInsieme, luoghi: () => {} };
document.addEventListener('click', async e => {
  const nb = e.target.closest('#nav button'); if (nb) { tab(nb.dataset.tab); return; }
  const t = e.target.closest('[data-a]'); if (!t) return;
  const a = t.dataset.a, k = t.dataset.k;
  switch (a) {
    case 'tab': tab(t.dataset.t); break;
    case 'back': back(); break;
    case 'big': setBig(!document.documentElement.classList.contains('big')); rHome(); toast(document.documentElement.classList.contains('big') ? 'Testo più grande' : 'Testo normale'); break;
    case 'prof': prof = k; ls.set('prof', k); rHome(); break;
    case 'cat': mCat = k; mQ = ''; stack = []; show('luoghi', false); break;
    case 'm-cat': mCat = k; rMapUI(); rList(); if (mapApi && pos) mapApi.fit(filtered(), pos); break;
    case 'm-acc': mAcc = t.dataset.v === '1'; rMapUI(); rList(); break;
    case 'place': { const p = (places || []).find(x => x.id === t.dataset.id); if (p) openPlace(p); break; }
    case 'url': openUrl(t.dataset.u); break;
    case 'pos': { const p = await getPos(true); if (!p) toast('Posizione non disponibile: attivala nelle impostazioni del telefono'); else { $('#map-msg').hidden = true; if (cur === 'luoghi') openMap(); else R[cur]?.(); } break; }
    case 'quiz': qz = { i: 0, r: {} }; rQuiz(); show('quiz', cur !== 'quiz'); break;
    case 'qa': qz.r[QUIZ[qz.i].id] = k; qz.i++; rQuiz(); break;
    case 'qprev': qz.i = Math.max(0, qz.i - 1); rQuiz(); break;
    case 'sit': openSit(k); break;
    case 'speak': { const txt = $('#s-aiuto').innerText.replace(/Ascolta|Fonte ufficiale/g, ''); try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'it-IT'; speechSynthesis.speak(u); } catch { toast('Lettura non disponibile su questo telefono'); } break; }
    case 'tut': openTut(k); break;
    case 'i-cat': iCat = k; rInsieme(); break;
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
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-f="home-q"]'); if (!f) return; e.preventDefault();
  const q = $('#h-q').value.trim(); if (!q) return;
  // le parole di un aiuto portano agli aiuti, le altre ai luoghi
  const sit = SITUAZIONI.find(s => (s.t + ' ' + s.misure.map(m => m.t).join(' ')).toLowerCase().includes(q.toLowerCase()));
  const cat = CATS.find(c => (c.t + ' ' + c.one).toLowerCase().includes(q.toLowerCase()));
  if (cat) { mCat = cat.id; mQ = ''; show('luoghi'); }
  else if (sit) openSit(sit.id);
  else { mCat = ''; mQ = q; show('luoghi'); }
});
let qT = 0;
$('#m-q').addEventListener('input', e => { clearTimeout(qT); qT = setTimeout(() => { mQ = e.target.value; rList(); }, 250); });

/* ================= avvio ================= */
rHome(); rAiuti(); rTutele();
show('home', false);
