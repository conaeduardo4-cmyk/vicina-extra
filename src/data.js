// Contenuti di Vicina Extra: categorie dei luoghi, aiuti e diritti, tutele.
// Gli aiuti cambiano spesso (requisiti, importi, scadenze): qui c'è la spiegazione semplice e dove chiederli,
// non gli importi. Ogni scheda rimanda alla fonte ufficiale.

// ---------- icone (tracciati SVG 24×24) ----------
export const IC = {
  home: 'M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z',
  pin: 'M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12zM12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  people: 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3 3 0 010 6M21 20c0-2.6-1.7-4.8-4-5.6',
  heart: 'M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z',
  building: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6',
  work: 'M4 8h16v11H4zM9 8V5h6v3',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  access: 'M12 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 8h6l-1 6h-3M10 14a4 4 0 107 3',
  church: 'M12 3v4M10 5h4M6 21V11l6-4 6 4v10M10 21v-5h4v5',
  gym: 'M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12',
  hands: 'M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10zM9.5 11.5l2 2 3-3.5',
  desk: 'M4 6h16v11H4zM8 21h8M12 17v4',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  chat: 'M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  chev: 'M9 6l6 6-6 6',
  back: 'M15 5l-7 7 7 7',
  x: 'M6 6l12 12M18 6L6 18',
  nav: 'M3 11l18-8-8 18-2-8z',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z',
  send: 'M12 19V5M5 12l7-7 7 7',
  menu: 'M4 6h16M4 12h16M4 18h10',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
  baby: 'M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  euro: 'M17 6.5A6 6 0 007 12a6 6 0 0010 5.5M5 10h8M5 14h8',
  phoneSm: 'M7 3h10v18H7zM11 18h2',
  sound: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6',
  star: 'M12 3l2.6 5.6 6 .6-4.5 4 1.3 6-5.4-3.2L6.6 19l1.3-6-4.5-4 6-.6z',
  locate: 'M12 2v3M12 19v3M2 12h3M19 12h3M12 17a5 5 0 100-10 5 5 0 000 10z',
  young: 'M12 8a3 3 0 100-6 3 3 0 000 6zM7 22l2-9h6l2 9M9 13l-2-3M15 13l2-3',
  sparkle: 'M12 3l1.8 4.6L18.5 9.4l-4.7 1.8L12 16l-1.8-4.8L5.5 9.4l4.7-1.8z'
};

// colori: [sfondo icona, colore icona, colore segnaposto sulla mappa]
const C = {
  rose: ['rgba(255,107,120,.16)', '#FF8A94', '#E8577A'],
  violet: ['rgba(156,140,255,.16)', '#B4A8FF', '#5B43F0'],
  blue: ['rgba(96,165,250,.16)', '#60A5FA', '#1F6FE0'],
  amber: ['rgba(255,181,71,.16)', '#FFB547', '#D98A0B'],
  green: ['rgba(52,211,153,.15)', '#34D399', '#16A36A'],
  pink: ['rgba(244,114,182,.16)', '#F9A8D4', '#DB2777'],
  teal: ['rgba(94,234,212,.15)', '#5EEAD4', '#0F9488'],
  sky: ['rgba(147,197,253,.16)', '#93C5FD', '#2563EB'],
  gray: ['rgba(255,255,255,.08)', '#D4D4D8', '#52525B']
};

// ---------- categorie dei luoghi (dati OpenStreetMap: la ricerca e il riconoscimento sono in places.js) ----------
export const CATS = [
  { id: 'consultori', t: 'Consultori', one: 'Consultorio', c: C.rose, ic: IC.heart,
    what: ['Visite ginecologiche e contraccezione', 'Gravidanza, corso pre-parto e allattamento', 'Colloqui con psicologi e assistenti sociali', 'Spazio giovani, riservato anche ai minorenni'],
    how: 'Di solito gratuito e senza impegnativa del medico. Chiama per un appuntamento.' },
  { id: 'antiviolenza', t: 'Antiviolenza', one: 'Centro antiviolenza', c: C.violet, ic: IC.shield,
    what: ['Ascolto e accoglienza, anche senza denunciare', 'Consulenza legale e psicologica gratuita', 'Aiuto per uscire di casa in sicurezza (case rifugio)', 'Supporto per figli e figlie'],
    how: 'Gratuito e riservato. Puoi chiamare anche il 1522, attivo 24 ore su 24, che ti mette in contatto con il centro più vicino.' },
  { id: 'sociali', t: 'Servizi sociali', one: 'Servizi sociali', c: C.blue, ic: IC.building,
    what: ['Segretariato sociale: ti orientano tra gli aiuti', 'Sostegno economico e per la casa', 'Assistenza domiciliare per anziani e persone con disabilità', 'Aiuto a famiglie e minori'],
    how: 'Rivolgiti al segretariato sociale del tuo Comune o Municipio: è gratuito.' },
  { id: 'quartiere', t: 'Centri di quartiere', one: 'Centro civico o sociale', c: C.violet, ic: IC.people,
    what: ['Corsi, laboratori e incontri spesso gratuiti', 'Feste, cinema, mercatini, iniziative del quartiere', 'Sportelli di ascolto e informazione', 'Un posto dove conoscere i vicini'],
    how: 'Guarda il calendario delle attività o passa a chiedere: di solito sono aperti a tutti.' },
  { id: 'casa', t: 'Casa', one: 'Sportello casa', c: C.amber, ic: IC.home,
    what: ['Case popolari e graduatorie', 'Contributi per l’affitto', 'Emergenza abitativa', 'Sindacati degli inquilini per sfratti e contratti'],
    how: 'Per case popolari e contributi segui i bandi del Comune e dell’ente casa della tua regione.' },
  { id: 'lavoro', t: 'Lavoro', one: 'Centro per l’impiego', c: C.green, ic: IC.work,
    what: ['Iscrizione come disoccupato (DID)', 'Corsi di formazione gratuiti', 'Collocamento mirato per persone con disabilità', 'Orientamento e offerte di lavoro'],
    how: 'Gratuito. Porta un documento e il codice fiscale; spesso si prenota online.' },
  { id: 'giovani', t: 'Centri giovani', one: 'Centro giovani', c: C.pink, ic: IC.music,
    what: ['Spazi per stare insieme, studiare e suonare', 'Laboratori e attività gratuite', 'Informagiovani: lavoro, studio, servizio civile', 'Educatori con cui parlare'],
    how: 'Di solito per ragazze e ragazzi tra 14 e 29 anni. Passa a trovarli negli orari di apertura.' },
  { id: 'anziani', t: 'Centri anziani', one: 'Centro anziani', c: C.teal, ic: IC.clock,
    what: ['Attività, gite e feste', 'Ginnastica dolce e corsi', 'Compagnia e nuove amicizie', 'Informazioni su servizi e aiuti'],
    how: 'Iscrizione quasi sempre gratuita o con una piccola quota annuale.' },
  { id: 'disabilita', t: 'Disabilità', one: 'Associazione per la disabilità', c: C.sky, ic: IC.access,
    what: ['Informazioni su diritti, invalidità e Legge 104', 'Gruppi di auto-aiuto per persone e famiglie', 'Attività, sport e tempo libero accessibili', 'Aiuto con le pratiche'],
    how: 'Le associazioni ti aiutano gratis anche solo a capire da dove cominciare.' },
  { id: 'accoglienza', t: 'Mense e accoglienza', one: 'Mensa o accoglienza', c: C.rose, ic: IC.hands,
    what: ['Pasti caldi gratuiti', 'Posti per dormire e docce', 'Vestiti, pacchi alimentari, empori solidali', 'Ascolto e aiuto per ripartire'],
    how: 'Spesso serve passare prima da un centro d’ascolto (per esempio Caritas) o dai servizi sociali.' },
  { id: 'oratori', t: 'Oratori', one: 'Oratorio', c: C.amber, ic: IC.church,
    what: ['Attività per bambini e ragazzi', 'Sport e campi estivi', 'Gruppi e incontri', 'Spazio aperto a tutti'],
    how: 'Chiedi in parrocchia orari e attività.' },
  { id: 'palestre', t: 'Sport popolare', one: 'Palestra popolare', c: C.green, ic: IC.gym,
    what: ['Sport a prezzi bassi o a offerta libera', 'Boxe, ginnastica, arti marziali, calcio', 'Un posto per conoscere persone'],
    how: 'Di solito gestite da volontari: passa durante gli allenamenti.' },
  { id: 'volontariato', t: 'Associazioni', one: 'Associazione', c: C.blue, ic: IC.hands,
    what: ['Puoi dare una mano come volontario', 'Puoi ricevere aiuto: ascolto, pacchi alimentari, vestiti', 'Attività e gruppi per stare insieme'],
    how: 'Il Centro di servizio per il volontariato (CSV) della tua zona ti dice chi cerca volontari.' },
  { id: 'patronati', t: 'Patronati e CAF', one: 'Patronato o CAF', c: C.gray, ic: IC.desk,
    what: ['ISEE gratuito', 'Domande all’INPS: invalidità, NASpI, Assegno unico, pensioni', 'Controllo dei tuoi diritti', 'Aiuto con i documenti'],
    how: 'I patronati sono gratuiti per le domande all’INPS. Porta documento, codice fiscale e i documenti richiesti.' }
];
export const CAT = Object.fromEntries(CATS.map(c => [c.id, c]));
export const INSIEME_CATS = ['quartiere', 'giovani', 'anziani', 'oratori', 'palestre', 'volontariato', 'disabilita'];

// ---------- numeri utili ----------
export const NUM = {
  n112: { n: '112', tel: '112', t: 'Emergenze', s: 'Carabinieri, polizia, ambulanza, vigili del fuoco' },
  n1522: { n: '1522', tel: '1522', t: 'Antiviolenza e stalking', s: 'Gratuito, 24 ore su 24, anche in chat su 1522.eu' },
  n114: { n: '114', tel: '114', t: 'Emergenza infanzia', s: 'Bambini e ragazzi in pericolo' },
  n19696: { n: '19696', tel: '19696', t: 'Telefono Azzurro', s: 'Ascolto per bambini e adolescenti' },
  amico: { n: 'Telefono Amico', tel: '0223272327', t: 'Telefono Amico', s: 'Ascolto per chi si sente solo o in difficoltà: 02 2327 2327' },
  argento: { n: 'Filo d’Argento', tel: '800995988', t: 'Filo d’Argento (Auser)', s: 'Ascolto e compagnia per persone anziane: 800 995 988' },
  samaritans: { n: 'Samaritans', tel: '0677208977', t: 'Samaritans', s: 'Ascolto nei momenti difficili: 06 7720 8977' }
};

// ---------- aiuti e diritti ----------
// ogni misura: t nome, s cos'è, chi a chi spetta, come dove si chiede, url fonte ufficiale
export const SITUAZIONI = [
  { id: 'disabilita', t: 'Ho una disabilità', c: C.sky, ic: IC.access, tag: 'disabilita',
    intro: 'Ci sono riconoscimenti che aprono la strada a sostegni economici, permessi e lavoro. Si chiedono con una sola domanda all’INPS.',
    misure: [
      { t: 'Invalidità civile', s: 'Riconosce la tua condizione con una percentuale. In base alla percentuale e al reddito può dare un assegno o una pensione, l’indennità di accompagnamento (se non sei autonomo, senza limiti di reddito), esenzioni dai ticket, protesi e ausili.', url: 'https://www.inps.it' },
      { t: 'Legge 104', s: 'Riconosce l’handicap. Se è grave dà diritto a 3 giorni di permesso retribuito al mese per te o per un familiare che ti assiste, al congedo straordinario per il familiare e ad agevolazioni fiscali (per esempio sull’acquisto dell’auto).', url: 'https://www.inps.it' },
      { t: 'Collocamento mirato', s: 'Con un’invalidità sopra il 45% ti iscrivi al centro per l’impiego: le aziende devono riservare dei posti alle persone con disabilità (Legge 68/1999).', url: 'https://www.lavoro.gov.it' },
      { t: 'Contrassegno per il parcheggio', s: 'Il contrassegno europeo (CUDE) ti fa usare i posti riservati e le zone a traffico limitato. Si chiede al Comune.', url: '' }
    ],
    passi: ['Il medico (di solito quello di base) invia all’INPS il certificato medico introduttivo.', 'Fai la domanda all’INPS online o, gratis, con un patronato. Puoi chiedere invalidità e Legge 104 insieme.', 'Ti chiamano per la visita della commissione medica: porta i documenti sanitari che hai.'],
    nota: 'In alcune province è in prova la nuova procedura unica della riforma sulla disabilità: il patronato ti dice se vale anche per te.' },
  { id: 'casa', t: 'Faccio fatica con l’affitto', c: C.amber, ic: IC.home, tag: 'casa',
    intro: 'Se il canone pesa troppo o rischi di perdere la casa, chiedi aiuto il prima possibile: prima si interviene, più strade ci sono.',
    misure: [
      { t: 'Contributo per l’affitto', s: 'Un aiuto per pagare il canone se hai un reddito basso. Lo danno Comuni e Regioni con un bando, di solito una volta all’anno.', url: '' },
      { t: 'Fondo per la morosità incolpevole', s: 'Se non riesci a pagare perché hai perso il lavoro o parte del reddito, può aiutarti a evitare lo sfratto. Si chiede al Comune.', url: '' },
      { t: 'Case popolari (ERP)', s: 'Alloggi a canone basso assegnati con una graduatoria. Si partecipa al bando del Comune o dell’ente casa regionale.', url: '' },
      { t: 'Emergenza abitativa', s: 'Se resti senza casa, i servizi sociali possono trovarti una sistemazione temporanea.', url: '' }
    ],
    passi: ['Fai l’ISEE: serve per quasi tutti i bandi.', 'Chiedi al segretariato sociale del Comune quali bandi sono aperti.', 'Se è arrivata una lettera di sfratto, parla subito con un sindacato degli inquilini (SUNIA, SICET, UNIAT).'], nota: '' },
  { id: 'lavoro', t: 'Ho perso il lavoro', c: C.green, ic: IC.work, tag: 'lavoro',
    intro: 'Ci sono sostegni economici e percorsi gratuiti per ritrovare lavoro. Alcuni hanno scadenze: muoviti presto.',
    misure: [
      { t: 'NASpI', s: 'L’indennità di disoccupazione per chi era dipendente e ha perso il lavoro senza volerlo. Va chiesta all’INPS entro 68 giorni dalla fine del lavoro.', url: 'https://www.inps.it' },
      { t: 'Assegno di inclusione', s: 'Un sostegno per le famiglie con ISEE basso in cui ci sono minori, persone con disabilità, persone dai 60 anni in su o seguite dai servizi sociali.', url: 'https://www.inps.it' },
      { t: 'Supporto per la formazione e il lavoro', s: 'Per chi ha tra 18 e 59 anni e un ISEE basso: un’indennità mensile mentre segui corsi o progetti per il lavoro.', url: 'https://www.inps.it' },
      { t: 'Centro per l’impiego', s: 'Ti iscrivi come disoccupato, accedi a corsi gratuiti e all’orientamento.', url: '' }
    ],
    passi: ['Fai la domanda di NASpI all’INPS (online o con un patronato) entro 68 giorni.', 'Iscriviti al centro per l’impiego.', 'Fai l’ISEE e chiedi al patronato se hai diritto anche ad altri sostegni.'], nota: '' },
  { id: 'figli', t: 'Aspetto un figlio o ho figli', c: C.rose, ic: IC.baby, tag: 'consultori',
    intro: 'Dalla gravidanza in poi ci sono aiuti economici e servizi gratuiti per te e per i tuoi figli.',
    misure: [
      { t: 'Assegno unico universale', s: 'Un assegno mensile per ogni figlio, dal settimo mese di gravidanza fino ai 21 anni (senza limite di età se il figlio ha una disabilità). L’importo dipende dall’ISEE.', url: 'https://www.inps.it' },
      { t: 'Bonus asilo nido', s: 'Un rimborso per le rette del nido per i bambini sotto i 3 anni.', url: 'https://www.inps.it' },
      { t: 'Assegno di maternità dei Comuni', s: 'Per le mamme che non hanno altre tutele di maternità e hanno un ISEE basso. Si chiede al Comune entro 6 mesi dalla nascita.', url: '' },
      { t: 'Consultorio familiare', s: 'Visite in gravidanza, corso pre-parto, allattamento e sostegno dopo la nascita, gratis.', url: '' }
    ],
    passi: ['Fai l’ISEE.', 'Chiedi l’Assegno unico all’INPS (online o con un patronato).', 'Prenota al consultorio per gravidanza e corso pre-parto.'], nota: '' },
  { id: 'anziani', t: 'Ho più di 65 anni', c: C.teal, ic: IC.clock, tag: 'anziani',
    intro: 'Sostegni per chi ha un reddito basso, aiuto in casa e tanti luoghi dove non stare da soli.',
    misure: [
      { t: 'Assegno sociale', s: 'Dai 67 anni, se hai un reddito basso o nullo e vivi in Italia da almeno 10 anni. Si chiede all’INPS.', url: 'https://www.inps.it' },
      { t: 'Carta acquisti', s: 'Una carta per la spesa e le bollette per chi ha più di 65 anni (o figli sotto i 3) e un reddito molto basso. Si chiede agli uffici postali.', url: '' },
      { t: 'Assistenza domiciliare', s: 'Aiuto in casa per l’igiene, la spesa e le cure. Si chiede ai servizi sociali del Comune o all’ASL.', url: '' },
      { t: 'Centri anziani e Filo d’Argento', s: 'Attività e compagnia vicino a casa; al telefono il Filo d’Argento di Auser (800 995 988).', url: '' }
    ],
    passi: ['Fai l’ISEE o fatti aiutare da un CAF.', 'Chiedi al patronato se ti spetta l’assegno sociale.', 'Per l’aiuto in casa rivolgiti ai servizi sociali.'], nota: '' },
  { id: 'bollette', t: 'Le bollette sono troppo care', c: C.violet, ic: IC.bolt, tag: 'patronati',
    intro: 'Il bonus sociale abbassa luce, gas e acqua. Spesso arriva da solo, basta avere l’ISEE aggiornato.',
    misure: [
      { t: 'Bonus sociale luce, gas e acqua', s: 'Uno sconto in bolletta automatico se il tuo ISEE è sotto la soglia o se ricevi l’Assegno di inclusione. Devi solo rifare l’ISEE ogni anno.', url: 'https://www.arera.it' },
      { t: 'Bonus per disagio fisico', s: 'Se in casa usi apparecchi medici elettrici (per esempio per respirare), hai uno sconto sulla luce. Si chiede al Comune o al CAF.', url: 'https://www.arera.it' }
    ],
    passi: ['Fai o aggiorna l’ISEE (gratis al CAF o online sul sito INPS).', 'Il bonus arriva in bolletta senza altre domande.'], nota: '' },
  { id: 'giovani', t: 'Ho tra 18 e 35 anni', c: C.pink, ic: IC.young, tag: 'giovani',
    intro: 'Esperienze pagate, sconti e servizi per orientarti tra studio e lavoro.',
    misure: [
      { t: 'Servizio civile universale', s: 'Un anno in un progetto utile (assistenza, ambiente, cultura) per chi ha tra 18 e 28 anni, con un rimborso mensile.', url: 'https://www.scelgoilserviziocivile.gov.it' },
      { t: 'Carta Giovani Nazionale', s: 'Sconti e agevolazioni per chi ha tra 18 e 35 anni, nell’app IO.', url: 'https://giovani2030.it' },
      { t: 'Informagiovani', s: 'Sportelli gratuiti per lavoro, studio, viaggi e volontariato.', url: '' }
    ],
    passi: ['Guarda i bandi del servizio civile quando escono.', 'Attiva la Carta Giovani nell’app IO.', 'Passa all’Informagiovani della tua città.'], nota: '' },
  { id: 'violenza', t: 'Sto uscendo da una situazione di violenza', c: C.violet, ic: IC.shield, tag: 'antiviolenza',
    intro: 'Non sei sola. Ci sono persone formate che ti aiutano gratis e sostegni per ricominciare.',
    misure: [
      { t: 'Centri antiviolenza e 1522', s: 'Ascolto, consulenza legale e psicologica gratuita, case rifugio. Il 1522 risponde 24 ore su 24.', url: 'https://www.1522.eu' },
      { t: 'Reddito di libertà', s: 'Un contributo per le donne seguite da un centro antiviolenza, per aiutarle a diventare autonome. Si chiede tramite il Comune.', url: 'https://www.inps.it' },
      { t: 'Congedo per le vittime di violenza', s: 'Le lavoratrici seguite da un centro antiviolenza o dai servizi sociali possono astenersi dal lavoro per 3 mesi, retribuiti.', url: 'https://www.inps.it' }
    ],
    passi: ['Chiama il 1522 o contatta il centro antiviolenza più vicino.', 'Con loro decidi cosa fare, anche senza denunciare.', 'Se sei in pericolo adesso chiama il 112.'], nota: '' }
];
export const SIT = Object.fromEntries(SITUAZIONI.map(s => [s.id, s]));

// «Scopri cosa ti spetta»: 5 domande → situazioni consigliate
export const QUIZ = [
  { id: 'eta', q: 'Quanti anni hai?', a: [['u18', 'Meno di 18'], ['18', '18 – 35'], ['36', '36 – 64'], ['65', '65 o più']] },
  { id: 'figli', q: 'Hai figli o ne aspetti uno?', a: [['si', 'Sì'], ['no', 'No']] },
  { id: 'dis', q: 'Tu o qualcuno in famiglia avete una disabilità?', a: [['si', 'Sì'], ['no', 'No']] },
  { id: 'lav', q: 'Come va con il lavoro?', a: [['ok', 'Lavoro'], ['perso', 'Ho perso il lavoro'], ['cerco', 'Lo sto cercando'], ['pens', 'Sono in pensione']] },
  { id: 'casa', q: 'E con la casa?', a: [['ok', 'Tutto bene'], ['affitto', 'Faccio fatica con l’affitto'], ['senza', 'Rischio di restare senza casa']] }
];
export function quizResult(r) {
  const out = new Set();
  if (r.dis === 'si') out.add('disabilita');
  if (r.casa && r.casa !== 'ok') out.add('casa');
  if (r.lav === 'perso' || r.lav === 'cerco') out.add('lavoro');
  if (r.figli === 'si') out.add('figli');
  if (r.eta === '65' || r.lav === 'pens') out.add('anziani');
  if (r.eta === '18') out.add('giovani');
  out.add('bollette');
  return [...out];
}

// ---------- tutele: situazioni di rischio ----------
export const TUTELE = [
  { id: 'truffe', t: 'Truffe a casa o al telefono', s: 'Falsi tecnici, finti carabinieri, «nipoti» in difficoltà', c: C.amber, ic: IC.phone, tag: 'sociali',
    segnali: ['Qualcuno ha fretta e ti mette paura («suo figlio ha avuto un incidente»)', 'Ti chiedono contanti, gioielli o codici', 'Dicono di essere tecnici, operatori o forze dell’ordine senza preavviso'],
    fare: ['Non aprire e non dare soldi: nessun ente vero chiede contanti a casa', 'Chiudi la chiamata e richiama tu un familiare o il numero ufficiale', 'Chiama il 112: verificano subito', 'Se è successo, denuncia: non è colpa tua'],
    num: ['n112', 'argento'] },
  { id: 'coppia', t: 'Controllo o violenza in coppia', s: 'Anche psicologica ed economica', c: C.violet, ic: IC.heart, tag: 'antiviolenza',
    segnali: ['Ti controlla il telefono, i soldi o con chi esci', 'Ti allontana da amici e famiglia', 'Ti insulta, ti umilia, ti minaccia o ti fa paura', 'Ti impedisce di lavorare o di avere un conto tuo'],
    fare: ['Parlane con un centro antiviolenza: è gratuito e riservato, anche senza denunciare', 'Conserva messaggi, foto, referti in un posto sicuro', 'Prepara un piano: una persona di fiducia, documenti e un po’ di soldi pronti', 'Se sei in pericolo adesso chiama il 112'],
    num: ['n1522', 'n112'] },
  { id: 'discriminazione', t: 'Discriminazione per disabilità', s: 'Al lavoro, a scuola, nei servizi', c: C.sky, ic: IC.access, tag: 'disabilita',
    segnali: ['Ti negano un servizio o l’accesso a un luogo', 'Al lavoro non ti danno gli adattamenti di cui hai bisogno', 'Ti trattano peggio degli altri per la tua condizione'],
    fare: ['Annota cosa è successo, quando e chi c’era', 'Chiedi per iscritto il motivo del rifiuto', 'Rivolgiti a un’associazione delle persone con disabilità, a un sindacato o a un patronato', 'Puoi segnalare il caso anche al Garante nazionale dei diritti delle persone con disabilità'],
    num: [] },
  { id: 'sfratto', t: 'Rischio di sfratto', s: 'Chi chiamare prima che sia tardi', c: C.rose, ic: IC.home, tag: 'casa',
    segnali: ['Sei indietro con l’affitto e non riesci a recuperare', 'È arrivata una lettera dell’avvocato o del tribunale'],
    fare: ['Non aspettare: parla subito con un sindacato degli inquilini (SUNIA, SICET, UNIAT)', 'Chiedi ai servizi sociali del Comune del Fondo per la morosità incolpevole', 'Prova ad accordarti con il proprietario per un piano di rientro, per iscritto'],
    num: [] },
  { id: 'debiti', t: 'Debiti e prestiti pericolosi', s: 'Usura, finanziarie, rate che non finiscono', c: C.green, ic: IC.euro, tag: 'volontariato',
    segnali: ['Qualcuno ti presta soldi con interessi altissimi o senza contratto', 'Ricevi minacce per restituire', 'Paghi una rata per coprirne un’altra'],
    fare: ['Non firmare niente sotto pressione', 'Rivolgiti a uno sportello o a una fondazione antiusura: l’aiuto è gratuito', 'Se i debiti sono troppi esiste una procedura di legge per il sovraindebitamento: chiedi a un Organismo di composizione della crisi (OCC)', 'Se ti minacciano chiama il 112'],
    num: ['n112'] },
  { id: 'bullismo', t: 'Bullismo e cyberbullismo', s: 'Per ragazzi e per i genitori', c: C.pink, ic: IC.phoneSm, tag: 'giovani',
    segnali: ['Prese in giro continue, esclusione, minacce', 'Foto o messaggi su di te pubblicati senza permesso', 'Paura di andare a scuola o di usare il telefono'],
    fare: ['Parlane con un adulto di cui ti fidi', 'Salva le prove (screenshot) e blocca chi ti attacca', 'Segnala i contenuti alla piattaforma; dai 14 anni puoi chiedere tu stesso di toglierli', 'Puoi rivolgerti alla Polizia Postale (commissariatodips.it)'],
    num: ['n19696', 'n114'] },
  { id: 'solitudine', t: 'Solitudine e momenti difficili', s: 'Quando ti senti solo o non ce la fai', c: C.teal, ic: IC.chat, tag: 'anziani',
    segnali: ['Passi giorni senza parlare con nessuno', 'Ti senti giù, inutile o senza via d’uscita'],
    fare: ['Chiama una linea di ascolto: c’è sempre qualcuno pronto a parlare con te', 'Prova un luogo vicino: centro anziani, centro giovani, associazioni, palestre popolari', 'Parlane con il tuo medico di base', 'Se pensi di farti del male, chiama subito il 112'],
    num: ['amico', 'samaritans', 'argento'] }
];
export const TUT = Object.fromEntries(TUTELE.map(t => [t.id, t]));
