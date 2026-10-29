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
  sparkle: 'M12 3l1.8 4.6L18.5 9.4l-4.7 1.8L12 16l-1.8-4.8L5.5 9.4l4.7-1.8z',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  out: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5v.5',
  text: 'M4 7V5h16v2M12 5v14M9 19h6',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z'
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
  { id: 'comune', t: 'Comune e Municipio', one: 'Comune o Municipio', c: C.blue, ic: IC.building,
    what: ['Segretariato sociale e assistenti sociali', 'Anagrafe: residenza, carta d’identità, certificati', 'Bandi per casa, affitto e contributi', 'Uffici per famiglie, scuola e disabilità'],
    how: 'Chiedi all’ingresso o all’URP dov’è il segretariato sociale: spesso si prenota per telefono o online.' },
  { id: 'biblioteche', t: 'Biblioteche', one: 'Biblioteca', c: C.teal, ic: IC.doc,
    what: ['Prestito gratuito di libri, film e giornali', 'Sale studio e Wi-Fi', 'Letture, gruppi, corsi e incontri', 'Aiuto con il computer e lo SPID in molte sedi'],
    how: 'Iscrizione gratuita con un documento. Aperte a tutti, anche ai ragazzi.' },
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
export const INSIEME_CATS = ['quartiere', 'biblioteche', 'giovani', 'anziani', 'oratori', 'palestre', 'volontariato', 'disabilita'];

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
// ogni misura: t nome · s cos'è · chi a chi si rivolge · serve cosa preparare · dove dove si chiede · url fonte ufficiale
// Niente importi né soglie precise: cambiano ogni anno. La fonte ufficiale e il patronato confermano i requisiti.
export const GRUPPI = [['soldi', 'Soldi e lavoro'], ['casa', 'Casa'], ['famiglia', 'Famiglia e figli'], ['salute', 'Salute e disabilità'], ['eta', 'Giovani e anziani'], ['difficili', 'Situazioni difficili']];
const INPS = 'https://www.inps.it';
export const SITUAZIONI = [
  { id: 'lavoro', g: 'soldi', t: 'Ho perso il lavoro', c: C.green, ic: IC.work, tag: 'lavoro',
    intro: 'Ci sono sostegni economici e percorsi gratuiti per ritrovare lavoro. Alcuni hanno una scadenza: muoviti nei primi giorni.',
    misure: [
      { t: 'NASpI (disoccupazione)', s: 'Un’indennità mensile per chi era dipendente e ha perso il lavoro senza volerlo (licenziamento, contratto scaduto, dimissioni per giusta causa).', chi: 'Lavoratori dipendenti, anche a tempo determinato, con abbastanza settimane di contributi negli ultimi anni.', serve: 'Documento, codice fiscale, IBAN, la lettera di licenziamento o la data di fine contratto.', dove: 'Online sul sito INPS con SPID o CIE, oppure gratis con un patronato. Entro 68 giorni dalla fine del lavoro.', url: INPS },
      { t: 'DIS-COLL', s: 'L’indennità di disoccupazione per collaboratori (co.co.co.), assegnisti e dottorandi con borsa.', chi: 'Chi aveva una collaborazione iscritta alla Gestione separata INPS.', serve: 'Documento, codice fiscale, IBAN, dati del contratto.', dove: 'INPS online o patronato, entro 68 giorni.', url: INPS },
      { t: 'Iscrizione al centro per l’impiego (DID)', s: 'Dichiari di essere disponibile a lavorare: ti dà accesso a corsi gratuiti, orientamento, offerte e ad alcuni sostegni.', chi: 'Chiunque sia senza lavoro, anche se non ha mai lavorato.', serve: 'Documento e codice fiscale.', dove: 'Online sul portale del lavoro della tua regione o al centro per l’impiego.', url: 'https://www.lavoro.gov.it' },
      { t: 'Supporto per la formazione e il lavoro', s: 'Un’indennità mensile mentre segui corsi, tirocini o progetti per il lavoro.', chi: 'Persone tra 18 e 59 anni con ISEE basso che non hanno diritto all’Assegno di inclusione.', serve: 'ISEE valido, SPID o CIE.', dove: 'Sul sito INPS o con un patronato; poi si firma il patto con il centro per l’impiego.', url: INPS }
    ],
    passi: ['Fai la domanda di NASpI (o DIS-COLL) entro 68 giorni: se aspetti perdi dei giorni di indennità.', 'Iscriviti al centro per l’impiego: online bastano pochi minuti.', 'Fai l’ISEE e chiedi al patronato se ti spettano altri aiuti.', 'Chiedi al centro per l’impiego dei corsi gratuiti della tua regione.'],
    doc: ['Documento d’identità', 'Codice fiscale', 'IBAN intestato a te', 'Ultime buste paga e lettera di fine lavoro', 'SPID o CIE'],
    ask: ['Ho perso il lavoro: mi spetta la NASpI?', 'Mi sono dimesso: posso avere la disoccupazione?', 'Come mi iscrivo al centro per l’impiego?'] },
  { id: 'reddito', g: 'soldi', t: 'Non arrivo a fine mese', c: C.amber, ic: IC.euro, tag: 'sociali',
    intro: 'Se i soldi non bastano per le spese di base non sei solo: ci sono sostegni dello Stato, del Comune e delle associazioni. Il primo passo è quasi sempre l’ISEE.',
    misure: [
      { t: 'Assegno di inclusione', s: 'Un sostegno mensile per le famiglie con ISEE basso, con una carta per le spese.', chi: 'Famiglie in cui c’è almeno una persona minorenne, con disabilità, con 60 anni o più, oppure seguita dai servizi sociali.', serve: 'ISEE valido, SPID o CIE, dati di residenza.', dove: 'Sul sito INPS, con un patronato o un CAF.', url: INPS },
      { t: 'Contributi economici del Comune', s: 'Aiuti una tantum o per un periodo: per bollette, affitto, spese urgenti, buoni spesa.', chi: 'Chi ha difficoltà economiche e vive in quel Comune; ogni Comune ha regole sue.', serve: 'ISEE e documenti delle spese.', dove: 'Segretariato sociale del Comune o del Municipio.', url: '' },
      { t: 'Empori solidali e pacchi alimentari', s: 'Spesa gratuita o quasi, con una tessera a punti o un pacco periodico.', chi: 'Famiglie e persone in difficoltà, di solito su segnalazione di servizi sociali o centri d’ascolto.', serve: 'A volte ISEE o una lettera dei servizi sociali.', dove: 'Centri d’ascolto Caritas, parrocchie, associazioni, servizi sociali.', url: '' },
      { t: 'Bonus sociale bollette', s: 'Uno sconto su luce, gas e acqua che arriva da solo in bolletta.', chi: 'Chi ha un ISEE sotto la soglia prevista o riceve l’Assegno di inclusione.', serve: 'Solo l’ISEE aggiornato ogni anno.', dove: 'Nessuna domanda: basta fare l’ISEE.', url: 'https://www.arera.it' }
    ],
    passi: ['Fai l’ISEE gratis al CAF o online sul sito INPS (ISEE precompilato).', 'Prendi appuntamento al segretariato sociale del Comune e racconta la tua situazione.', 'Chiedi al patronato se puoi avere l’Assegno di inclusione.', 'Per la spesa di questi giorni vai a un centro d’ascolto o a un emporio solidale.'],
    doc: ['Documento e codice fiscale di tutta la famiglia', 'Contratto d’affitto o mutuo', 'Redditi e saldo dei conti (per l’ISEE)', 'Bollette e spese da pagare'],
    ask: ['Non riesco a fare la spesa: a chi mi rivolgo?', 'Come si fa l’ISEE?', 'Cosa sono gli empori solidali?'] },
  { id: 'bollette', g: 'soldi', t: 'Le bollette sono troppo care', c: C.violet, ic: IC.bolt, tag: 'patronati',
    intro: 'Il bonus sociale abbassa luce, gas e acqua e arriva da solo, basta avere l’ISEE aggiornato. Se sei già indietro con i pagamenti puoi chiedere di rateizzare.',
    misure: [
      { t: 'Bonus sociale luce, gas e acqua', s: 'Uno sconto automatico in bolletta.', chi: 'Chi ha un ISEE sotto soglia (più alta per le famiglie con almeno 4 figli) o riceve l’Assegno di inclusione.', serve: 'ISEE aggiornato ogni anno.', dove: 'Nessuna domanda: i dati arrivano da soli al fornitore.', url: 'https://www.arera.it' },
      { t: 'Bonus per disagio fisico', s: 'Uno sconto sulla luce se in casa usi apparecchi medici elettrici salvavita.', chi: 'Chi usa apparecchi come respiratori, concentratori di ossigeno o simili, senza limiti di ISEE.', serve: 'Certificato dell’ASL sugli apparecchi usati.', dove: 'Comune o CAF.', url: 'https://www.arera.it' },
      { t: 'Rateizzazione delle bollette', s: 'Se una bolletta è molto più alta del solito o sei indietro, puoi chiedere di pagarla a rate.', chi: 'Tutti i clienti, in particolare per conguagli alti.', serve: 'La bolletta e il codice cliente.', dove: 'Al servizio clienti del fornitore, per iscritto.', url: 'https://www.arera.it' }
    ],
    passi: ['Fai o aggiorna l’ISEE (gratis al CAF o online).', 'Controlla in bolletta la voce del bonus.', 'Se sei indietro, chiedi per iscritto la rateizzazione prima del distacco.', 'Per un aiuto in più chiedi ai servizi sociali del Comune.'],
    doc: ['Ultime bollette', 'Codice cliente (POD per la luce, PDR per il gas)', 'ISEE'],
    ask: ['Come faccio ad avere il bonus sociale?', 'Mi è arrivata una bolletta altissima, cosa faccio?', 'Possono staccarmi la luce se non pago?'] },
  { id: 'casa', g: 'casa', t: 'Faccio fatica con l’affitto', c: C.amber, ic: IC.home, tag: 'casa',
    intro: 'Se il canone pesa troppo o rischi di perdere la casa, chiedi aiuto il prima possibile: prima si interviene, più strade ci sono.',
    misure: [
      { t: 'Contributo per l’affitto', s: 'Un aiuto per pagare il canone se hai un reddito basso.', chi: 'Inquilini con contratto registrato e ISEE sotto la soglia del bando.', serve: 'Contratto registrato, ricevute dell’affitto, ISEE.', dove: 'Bando del Comune o della Regione, di solito una volta all’anno.', url: '' },
      { t: 'Fondo per la morosità incolpevole', s: 'Un aiuto per evitare lo sfratto se non paghi perché hai perso il lavoro o parte del reddito.', chi: 'Inquilini con sfratto per morosità causata da un calo di reddito non voluto.', serve: 'Atto di sfratto, documenti sul calo di reddito, ISEE.', dove: 'Comune (ufficio casa o servizi sociali).', url: '' },
      { t: 'Case popolari (ERP)', s: 'Alloggi a canone basso assegnati con una graduatoria.', chi: 'Residenti o lavoratori nel Comune con reddito basso e senza altre case adatte.', serve: 'ISEE, documenti della famiglia, eventuali certificati di invalidità o sfratto (danno punti).', dove: 'Bando del Comune o dell’ente casa regionale (ATER, ALER, ACER…).', url: '' },
      { t: 'Emergenza abitativa', s: 'Una sistemazione temporanea se resti senza casa.', chi: 'Famiglie e persone senza alloggio, con priorità a chi ha minori, anziani o persone fragili.', serve: 'Documenti e, se c’è, l’atto di sfratto.', dove: 'Servizi sociali del Comune.', url: '' }
    ],
    passi: ['Fai l’ISEE: serve per quasi tutti i bandi.', 'Chiedi al segretariato sociale del Comune quali bandi sono aperti.', 'Se è arrivata una lettera di sfratto, parla subito con un sindacato degli inquilini (SUNIA, SICET, UNIAT).', 'Prova a proporre al proprietario un piano di rientro per iscritto.'],
    doc: ['Contratto d’affitto registrato', 'Ricevute dei pagamenti', 'ISEE', 'Eventuali lettere dell’avvocato o del tribunale'],
    ask: ['Mi spetta un contributo per l’affitto?', 'Come si fa domanda per una casa popolare?', 'Il proprietario vuole sfrattarmi: cosa posso fare?'] },
  { id: 'senzacasa', g: 'casa', t: 'Sono senza casa', c: C.rose, ic: IC.hands, tag: 'accoglienza',
    intro: 'Anche senza casa hai diritti: puoi avere la residenza, il medico di base e l’aiuto dei servizi sociali. Ci sono posti dove mangiare e dormire gratis.',
    misure: [
      { t: 'Mense e dormitori', s: 'Pasti caldi, docce, vestiti e posti letto gratuiti.', chi: 'Chiunque ne abbia bisogno.', serve: 'Spesso niente; per dormire a volte serve passare da un centro d’ascolto.', dove: 'Caritas, Comunità di Sant’Egidio, associazioni e servizi sociali. Guarda in «Luoghi».', url: '' },
      { t: 'Residenza fittizia', s: 'Ogni Comune ha un indirizzo «virtuale» per chi non ha casa. Con la residenza puoi avere medico di base, documenti e aiuti.', chi: 'Chi vive in strada o senza dimora stabile in quel Comune.', serve: 'Un documento, se ce l’hai.', dove: 'Ufficio anagrafe o servizi sociali del Comune.', url: '' },
      { t: 'Unità di strada', s: 'Operatori e volontari che girano di notte con coperte, pasti e ascolto, e possono trovarti un posto.', chi: 'Chi dorme fuori.', serve: 'Niente.', dove: 'Servizi sociali, Caritas o il numero per l’emergenza freddo del tuo Comune, quando c’è.', url: '' }
    ],
    passi: ['Vai a un centro d’ascolto (per esempio Caritas) o ai servizi sociali: ti indicano mense e posti letto.', 'Chiedi la residenza fittizia all’anagrafe: apre la strada al medico e agli aiuti.', 'Con la residenza puoi chiedere l’Assegno di inclusione con un patronato.', 'Se stai male chiama il 112.'],
    doc: ['Documento d’identità, anche scaduto', 'Codice fiscale o tessera sanitaria'],
    ask: ['Dove posso dormire stanotte?', 'Come si chiede la residenza fittizia?', 'Senza casa posso avere il medico di base?'] },
  { id: 'figli', g: 'famiglia', t: 'Aspetto un figlio o ho figli', c: C.rose, ic: IC.baby, tag: 'consultori',
    intro: 'Dalla gravidanza in poi ci sono aiuti economici e servizi gratuiti per te e per i tuoi figli.',
    misure: [
      { t: 'Assegno unico universale', s: 'Un assegno mensile per ogni figlio. L’importo dipende dall’ISEE; senza ISEE si prende la cifra minima.', chi: 'Dal settimo mese di gravidanza fino ai 21 anni del figlio (senza limite di età se ha una disabilità).', serve: 'IBAN, codici fiscali dei figli, ISEE (consigliato).', dove: 'Sul sito INPS, con un patronato o al contact center INPS. Si fa una volta, poi si rinnova da solo.', url: INPS },
      { t: 'Bonus asilo nido', s: 'Un rimborso per le rette del nido, o un aiuto per l’assistenza a casa per bambini con malattie gravi.', chi: 'Genitori di bambini sotto i 3 anni.', serve: 'Ricevute delle rette, ISEE.', dove: 'Sul sito INPS.', url: INPS },
      { t: 'Assegno di maternità dei Comuni', s: 'Un assegno per le mamme che non hanno altre tutele di maternità.', chi: 'Mamme con ISEE basso senza indennità di maternità dal lavoro (o con una molto bassa).', serve: 'ISEE, documenti del bambino.', dove: 'Al Comune, entro 6 mesi dalla nascita.', url: '' },
      { t: 'Consultorio familiare', s: 'Visite in gravidanza, corso pre-parto, allattamento, sostegno dopo la nascita e per la coppia. Gratis.', chi: 'Tutti, anche senza impegnativa.', serve: 'Tessera sanitaria.', dove: 'Consultorio dell’ASL del tuo quartiere.', url: '' },
      { t: 'Congedi per i genitori', s: 'Maternità, paternità e congedo parentale per stare con i figli piccoli, in parte pagati.', chi: 'Genitori che lavorano, dipendenti e in alcuni casi autonomi.', serve: 'Certificato di gravidanza o di nascita.', dove: 'Sul sito INPS o con un patronato, avvisando il datore di lavoro.', url: INPS }
    ],
    passi: ['Fai l’ISEE.', 'Chiedi l’Assegno unico all’INPS (online o con un patronato).', 'Prenota al consultorio per la gravidanza e il corso pre-parto.', 'Se lavori, chiedi al patronato quali congedi ti spettano.'],
    doc: ['Documenti e codici fiscali dei genitori', 'Codice fiscale del bambino', 'IBAN', 'ISEE'],
    ask: ['Come si chiede l’Assegno unico?', 'Quanto dura il congedo di paternità?', 'Il consultorio è gratis anche senza medico?'] },
  { id: 'genitore', g: 'famiglia', t: 'Mi sto separando o cresco i figli da solo', c: C.pink, ic: IC.people, tag: 'consultori',
    intro: 'Una separazione è dura, ma ci sono servizi gratuiti per affrontarla e per proteggere i figli.',
    misure: [
      { t: 'Mediazione familiare', s: 'Un professionista neutrale aiuta i genitori ad accordarsi su figli, casa e spese, senza litigare in tribunale.', chi: 'Coppie che si separano, sposate o no.', serve: 'Niente: basta prenotare.', dove: 'Consultori familiari e centri per le famiglie, spesso gratis.', url: '' },
      { t: 'Avvocato gratuito (gratuito patrocinio)', s: 'Lo Stato paga l’avvocato se hai un reddito basso.', chi: 'Chi ha un reddito sotto la soglia di legge.', serve: 'Dichiarazione dei redditi della famiglia, documento.', dove: 'Al Consiglio dell’ordine degli avvocati della tua città, o tramite un avvocato che aderisce.', url: 'https://www.giustizia.it' },
      { t: 'Assegno unico per i figli', s: 'Spetta al genitore che vive con i figli, o diviso tra i due genitori.', chi: 'Tutti i genitori di figli sotto i 21 anni.', serve: 'ISEE, IBAN.', dove: 'INPS o patronato: va aggiornato se cambia la situazione.', url: INPS }
    ],
    passi: ['Parla con il consultorio: offre sostegno psicologico e mediazione.', 'Se ci sono violenza o minacce, rivolgiti a un centro antiviolenza o chiama il 1522.', 'Chiedi all’ordine degli avvocati se puoi avere il gratuito patrocinio.', 'Aggiorna l’Assegno unico e l’ISEE con la nuova famiglia.'],
    doc: ['Documenti e redditi', 'Certificati dei figli'],
    ask: ['Cos’è la mediazione familiare?', 'Posso avere un avvocato gratis?', 'L’assegno unico a chi spetta dopo la separazione?'] },
  { id: 'disabilita', g: 'salute', t: 'Ho una disabilità', c: C.sky, ic: IC.access, tag: 'disabilita',
    intro: 'Ci sono riconoscimenti che aprono la strada a sostegni economici, permessi e lavoro. Si chiedono con una sola domanda all’INPS.',
    misure: [
      { t: 'Invalidità civile', s: 'Riconosce la tua condizione con una percentuale. In base alla percentuale e al reddito può dare assegno o pensione, esenzione dai ticket, protesi e ausili.', chi: 'Persone con una malattia o una menomazione che riduce la capacità di lavorare o di fare le cose di tutti i giorni.', serve: 'Certificato medico introduttivo (lo manda il medico all’INPS), documenti sanitari.', dove: 'Domanda INPS online o, gratis, con un patronato; poi visita della commissione.', url: INPS },
      { t: 'Indennità di accompagnamento', s: 'Un sostegno mensile per chi non è autonomo, senza limiti di reddito.', chi: 'Chi ha un’invalidità totale e non riesce a camminare senza aiuto o a fare da solo gli atti quotidiani.', serve: 'Si chiede insieme all’invalidità.', dove: 'INPS o patronato.', url: INPS },
      { t: 'Indennità di frequenza', s: 'Un aiuto per bambini e ragazzi con disabilità che vanno a scuola, a terapie o a centri.', chi: 'Minorenni con difficoltà persistenti a svolgere le attività della loro età.', serve: 'Certificato medico e iscrizione a scuola o ai trattamenti.', dove: 'INPS o patronato.', url: INPS },
      { t: 'Legge 104', s: 'Riconosce l’handicap. Se è grave dà diritto a 3 giorni di permesso retribuito al mese per te o per chi ti assiste, al congedo straordinario per il familiare e ad agevolazioni fiscali.', chi: 'Persone con disabilità e i loro familiari.', serve: 'Si chiede con la stessa domanda dell’invalidità.', dove: 'INPS o patronato.', url: INPS },
      { t: 'Collocamento mirato (Legge 68)', s: 'Le aziende devono riservare posti di lavoro alle persone con disabilità.', chi: 'Chi ha un’invalidità civile sopra il 45% e vuole lavorare.', serve: 'Verbale di invalidità.', dove: 'Ufficio collocamento mirato del centro per l’impiego.', url: 'https://www.lavoro.gov.it' },
      { t: 'Contrassegno per il parcheggio (CUDE)', s: 'Ti fa usare i posti riservati e le zone a traffico limitato.', chi: 'Persone con capacità di camminare molto ridotta o non vedenti.', serve: 'Certificato della ASL.', dove: 'Al Comune.', url: '' }
    ],
    passi: ['Il medico di base invia all’INPS il certificato medico introduttivo.', 'Fai la domanda all’INPS online o con un patronato: puoi chiedere invalidità e Legge 104 insieme.', 'Vai alla visita della commissione con tutti i documenti sanitari.', 'Con il verbale chiedi al patronato tutto quello che ti spetta.'],
    doc: ['Certificato medico introduttivo (numero di protocollo)', 'Referti, cartelle cliniche, terapie', 'Documento e tessera sanitaria'],
    nota: 'In alcune province è in prova la nuova procedura unica della riforma sulla disabilità: il patronato ti dice se vale anche per te.',
    ask: ['Come si chiede l’invalidità civile?', 'Cosa mi dà la Legge 104?', 'Come funziona il collocamento mirato?'] },
  { id: 'caregiver', g: 'salute', t: 'Mi prendo cura di un familiare', c: C.teal, ic: IC.hands, tag: 'sociali',
    intro: 'Se assisti una persona cara non autosufficiente hai diritto a permessi, congedi e aiuti, e a un po’ di respiro per te.',
    misure: [
      { t: 'Permessi Legge 104', s: '3 giorni al mese di permesso retribuito per assistere il familiare.', chi: 'Lavoratori dipendenti che assistono un familiare con handicap grave riconosciuto.', serve: 'Verbale della Legge 104 del familiare.', dove: 'INPS o patronato, e lo comunichi al datore di lavoro.', url: INPS },
      { t: 'Congedo straordinario', s: 'Fino a 2 anni retribuiti, anche frazionati, nell’arco della vita lavorativa.', chi: 'Familiari conviventi di una persona con handicap grave, secondo un ordine di priorità.', serve: 'Verbale della Legge 104, stato di famiglia.', dove: 'INPS o patronato.', url: INPS },
      { t: 'Assistenza domiciliare e centri diurni', s: 'Operatori che vengono a casa o centri dove la persona passa la giornata: tu puoi lavorare o riposare.', chi: 'Persone anziane o con disabilità e le loro famiglie.', serve: 'ISEE e valutazione dei servizi.', dove: 'Servizi sociali del Comune o ASL (punto unico di accesso).', url: '' },
      { t: 'Contributi per chi assiste', s: 'Molte Regioni danno contributi per i caregiver familiari o per pagare un’assistente.', chi: 'Dipende dalla Regione.', serve: 'ISEE, documenti sanitari.', dove: 'Servizi sociali o sito della tua Regione.', url: '' }
    ],
    passi: ['Fai riconoscere invalidità e Legge 104 del tuo familiare.', 'Chiedi al patronato permessi e congedo.', 'Chiedi ai servizi sociali una valutazione per l’assistenza a casa.', 'Cerca un gruppo di auto-aiuto per familiari: non sei solo.'],
    doc: ['Verbale di invalidità e Legge 104', 'Stato di famiglia', 'ISEE'],
    ask: ['Quali permessi ho per assistere mia madre?', 'Come funziona il congedo straordinario?', 'Esistono contributi per chi assiste un familiare?'] },
  { id: 'cure', g: 'salute', t: 'Non riesco a pagare le cure', c: C.rose, ic: IC.heart, tag: 'consultori',
    intro: 'Molte cure sono gratuite o con ticket ridotto se hai un reddito basso, una malattia cronica o un’invalidità.',
    misure: [
      { t: 'Esenzione dal ticket per reddito', s: 'Non paghi il ticket su visite ed esami.', chi: 'Bambini sotto i 6 anni e persone sopra i 65 con reddito familiare basso, disoccupati, chi ha l’assegno sociale o una pensione minima.', serve: 'Autocertificazione.', dove: 'ASL o medico di base.', url: 'https://www.salute.gov.it' },
      { t: 'Esenzione per malattia o invalidità', s: 'Esenzione per le cure legate a malattie croniche e rare, o per invalidità.', chi: 'Chi ha una delle malattie dell’elenco o un’invalidità riconosciuta.', serve: 'Certificato dello specialista o verbale.', dove: 'ASL.', url: 'https://www.salute.gov.it' },
      { t: 'Bonus psicologo', s: 'Un contributo per pagare le sedute di psicoterapia.', chi: 'Chi ha un ISEE fino a 50.000 euro; più è basso, più alto il contributo.', serve: 'ISEE, SPID o CIE.', dove: 'Sul sito INPS quando apre la domanda (di solito una volta all’anno).', url: INPS },
      { t: 'Centro di salute mentale e consultorio', s: 'Psicologi e psichiatri del servizio pubblico, gratis o con ticket.', chi: 'Tutti.', serve: 'Tessera sanitaria; spesso non serve l’impegnativa.', dove: 'CSM e consultorio della tua ASL.', url: '' },
      { t: 'Ambulatori solidali', s: 'Visite gratuite con medici volontari, anche per chi non ha la tessera sanitaria.', chi: 'Persone in difficoltà.', serve: 'Niente.', dove: 'Poliambulatori di associazioni (Caritas, Emergency e altre). Chiedi ai servizi sociali.', url: '' }
    ],
    passi: ['Chiedi al medico di base se puoi avere un’esenzione.', 'Fai l’ISEE: serve per il bonus psicologo e altri aiuti.', 'Per il supporto psicologico prova il consultorio o il CSM.', 'Se hai un’invalidità chiedi all’ASL l’esenzione collegata.'],
    doc: ['Tessera sanitaria', 'Referti e certificati', 'ISEE'],
    ask: ['Posso avere l’esenzione dal ticket?', 'Come funziona il bonus psicologo?', 'Dove trovo uno psicologo gratis?'] },
  { id: 'dipendenze', g: 'salute', t: 'Alcol, droghe o gioco', c: C.violet, ic: IC.shield, tag: 'sociali',
    intro: 'Chiedere aiuto per una dipendenza è un passo di coraggio. I servizi pubblici sono gratuiti e rispettano la tua riservatezza.',
    misure: [
      { t: 'SerD (Servizio per le dipendenze)', s: 'Medici, psicologi ed educatori per alcol, droghe, gioco d’azzardo e altre dipendenze. Gratis.', chi: 'Chiunque, anche familiari che vogliono capire come aiutare.', serve: 'Non serve l’impegnativa; puoi chiedere l’anonimato.', dove: 'SerD della tua ASL.', url: '' },
      { t: 'Gruppi di auto-aiuto', s: 'Incontri con persone che vivono lo stesso problema, per sostenersi a vicenda.', chi: 'Chi ha una dipendenza e i suoi familiari.', serve: 'Niente.', dove: 'Associazioni come Alcolisti Anonimi, Club alcologici territoriali, Giocatori Anonimi.', url: '' }
    ],
    passi: ['Chiama o vai al SerD della tua ASL: puoi andare anche solo per parlare.', 'Coinvolgi una persona di cui ti fidi.', 'Se hai debiti per il gioco, guarda anche la sezione Tutele su debiti e usura.'],
    doc: ['Tessera sanitaria (se non chiedi l’anonimato)'],
    ask: ['Come funziona il SerD?', 'Mio figlio beve troppo, cosa posso fare?', 'Ho debiti per il gioco, chi mi aiuta?'] },
  { id: 'ragazzi', g: 'eta', t: 'Ho meno di 18 anni', c: C.pink, ic: IC.young, tag: 'giovani',
    intro: 'Anche da minorenne hai diritti e posti dove andare: per stare con gli altri, per parlare con qualcuno, per farti aiutare.',
    misure: [
      { t: 'Centri giovani e di aggregazione', s: 'Spazi gratuiti per stare con gli amici, suonare, studiare, fare laboratori, con educatori.', chi: 'Ragazze e ragazzi, di solito dai 14 anni.', serve: 'Niente: passa negli orari di apertura.', dove: 'Guarda in «Luoghi» o chiedi all’Informagiovani.', url: '' },
      { t: 'Spazio giovani del consultorio', s: 'Puoi parlare di corpo, relazioni, sessualità e contraccezione con persone preparate, in modo riservato.', chi: 'Ragazze e ragazzi, anche minorenni.', serve: 'Tessera sanitaria.', dove: 'Consultorio della tua zona.', url: '' },
      { t: 'Telefono Azzurro e 114', s: 'Puoi parlare con qualcuno se sei in difficoltà, a casa, a scuola o online.', chi: 'Bambini e ragazzi; anche i genitori.', serve: 'Niente.', dove: '19696 (anche in chat) e 114 per le emergenze.', url: 'https://azzurro.it' },
      { t: 'Sport a basso costo', s: 'Palestre popolari, oratori e polisportive con quote piccole o gratis.', chi: 'Tutti.', serve: 'A volte un certificato medico per lo sport (dal tuo pediatra o medico).', dove: 'Guarda in «Luoghi» o in «Insieme».', url: '' }
    ],
    passi: ['Scegli un posto in «Insieme» e passaci con un amico.', 'Se qualcosa ti fa stare male, parlane con un adulto di cui ti fidi o chiama il 19696.', 'Se sei in pericolo adesso, chiama il 112 o il 114.'],
    doc: [],
    ask: ['Cosa posso fare nel tempo libero vicino a me?', 'Posso andare al consultorio senza i miei genitori?', 'Mi prendono in giro a scuola, cosa faccio?'] },
  { id: 'giovani', g: 'eta', t: 'Ho tra 18 e 35 anni', c: C.pink, ic: IC.young, tag: 'giovani',
    intro: 'Esperienze pagate, sconti, borse di studio e servizi per orientarti tra studio, lavoro e casa.',
    misure: [
      { t: 'Servizio civile universale', s: 'Un anno in un progetto utile (assistenza, ambiente, cultura, protezione civile) con un rimborso mensile.', chi: 'Chi ha tra 18 e 28 anni.', serve: 'SPID per la domanda.', dove: 'Sul sito del servizio civile quando esce il bando.', url: 'https://www.scelgoilserviziocivile.gov.it' },
      { t: 'Borse di studio per l’università', s: 'Soldi, posto letto e mensa per studenti con ISEE basso.', chi: 'Studenti universitari che rispettano i requisiti di reddito e di merito.', serve: 'ISEE per prestazioni universitarie.', dove: 'Ente regionale per il diritto allo studio, con bando di solito in estate.', url: '' },
      { t: 'Carta Giovani Nazionale', s: 'Sconti e agevolazioni su cultura, sport, viaggi.', chi: 'Chi ha tra 18 e 35 anni.', serve: 'App IO.', dove: 'Nell’app IO.', url: 'https://giovani2030.it' },
      { t: 'Carte per chi compie 18 anni', s: 'La Carta della cultura Giovani e la Carta del merito danno un bonus per libri, musica, cinema e corsi.', chi: 'Chi compie 18 anni: la prima con ISEE basso, la seconda con il diploma con 100.', serve: 'SPID o CIE.', dove: 'Sul sito del Ministero della Cultura nell’anno dopo i 18 anni.', url: '' },
      { t: 'Informagiovani', s: 'Sportelli gratuiti per lavoro, studio, viaggi e volontariato.', chi: 'Giovani.', serve: 'Niente.', dove: 'Nel tuo Comune.', url: '' }
    ],
    passi: ['Guarda i bandi del servizio civile quando escono.', 'Attiva la Carta Giovani nell’app IO.', 'Se studi all’università, controlla il bando di borse di studio della tua regione.', 'Passa all’Informagiovani della tua città.'],
    doc: ['SPID o CIE', 'ISEE'],
    ask: ['Come funziona il servizio civile?', 'Posso avere una borsa di studio per l’università?', 'Ci sono aiuti per i giovani che cercano casa?'] },
  { id: 'anziani', g: 'eta', t: 'Ho più di 65 anni', c: C.teal, ic: IC.clock, tag: 'anziani',
    intro: 'Sostegni per chi ha un reddito basso, aiuto in casa e tanti luoghi dove non stare da soli.',
    misure: [
      { t: 'Assegno sociale', s: 'Un sostegno mensile per chi ha un reddito basso o nullo.', chi: 'Dai 67 anni, se vivi in Italia da almeno 10 anni.', serve: 'Redditi tuoi e del coniuge.', dove: 'INPS online o patronato.', url: INPS },
      { t: 'Carta acquisti', s: 'Una carta ricaricata ogni due mesi per spesa e bollette.', chi: 'Chi ha più di 65 anni (o figli sotto i 3 anni) e un reddito molto basso.', serve: 'ISEE, modulo.', dove: 'Uffici postali.', url: INPS },
      { t: 'Prestazione universale', s: 'Un aiuto in più per pagare l’assistenza (badante o servizi) per le persone molto anziane e non autosufficienti. È in prova.', chi: 'Chi ha più di 80 anni, l’indennità di accompagnamento e un ISEE molto basso.', serve: 'ISEE socio-sanitario.', dove: 'INPS o patronato.', url: INPS },
      { t: 'Assistenza domiciliare', s: 'Aiuto in casa per igiene, spesa, pasti e cure.', chi: 'Anziani non del tutto autonomi.', serve: 'ISEE e valutazione.', dove: 'Servizi sociali del Comune o ASL.', url: '' },
      { t: 'Centri anziani e Filo d’Argento', s: 'Attività e compagnia vicino a casa; al telefono il Filo d’Argento di Auser (800 995 988).', chi: 'Tutti.', serve: 'Iscrizione, spesso gratuita.', dove: 'Guarda in «Luoghi» e in «Insieme».', url: '' }
    ],
    passi: ['Fai l’ISEE o fatti aiutare da un CAF.', 'Chiedi al patronato se ti spetta l’assegno sociale o altri aiuti.', 'Per l’aiuto in casa rivolgiti ai servizi sociali.', 'Prova un centro anziani vicino: si fa amicizia in fretta.'],
    doc: ['Documento e tessera sanitaria', 'Modello della pensione (ObisM o cedolino)', 'ISEE'],
    ask: ['Mi spetta l’assegno sociale?', 'Come si chiede l’assistenza a casa?', 'Ci sono attività per anziani vicino a me?'] },
  { id: 'violenza', g: 'difficili', t: 'Sto uscendo da una situazione di violenza', c: C.violet, ic: IC.shield, tag: 'antiviolenza',
    intro: 'Non sei sola. Ci sono persone formate che ti aiutano gratis e sostegni per ricominciare.',
    misure: [
      { t: 'Centri antiviolenza e 1522', s: 'Ascolto, consulenza legale e psicologica gratuita, case rifugio.', chi: 'Donne che subiscono violenza fisica, psicologica, economica o stalking, e i loro figli.', serve: 'Niente: puoi andare anche senza denunciare.', dove: 'Chiama il 1522 (24 ore su 24, anche in chat) o il centro più vicino.', url: 'https://www.1522.eu' },
      { t: 'Reddito di libertà', s: 'Un contributo mensile per aiutarti a diventare autonoma.', chi: 'Donne seguite da un centro antiviolenza e dai servizi sociali.', serve: 'Dichiarazione del centro antiviolenza e dei servizi sociali.', dove: 'Tramite il Comune, che fa la domanda all’INPS.', url: INPS },
      { t: 'Congedo per le vittime di violenza', s: 'Fino a 3 mesi di astensione dal lavoro, retribuiti.', chi: 'Lavoratrici inserite in un percorso di protezione.', serve: 'Certificazione del centro antiviolenza, dei servizi sociali o della casa rifugio.', dove: 'INPS e datore di lavoro.', url: INPS },
      { t: 'Avvocato gratuito', s: 'Per le vittime di violenza domestica e stalking l’avvocato è pagato dallo Stato, a prescindere dal reddito.', chi: 'Vittime di maltrattamenti, violenza sessuale, stalking.', serve: 'Domanda al Consiglio dell’ordine degli avvocati.', dove: 'Il centro antiviolenza ti aiuta a farla.', url: 'https://www.giustizia.it' }
    ],
    passi: ['Chiama il 1522 o contatta il centro antiviolenza più vicino.', 'Con loro decidi cosa fare, anche senza denunciare.', 'Conserva messaggi, foto e referti in un posto sicuro.', 'Se sei in pericolo adesso chiama il 112.'],
    doc: ['Documenti tuoi e dei figli (se puoi)', 'Referti medici, messaggi, foto'],
    ask: ['Come funziona un centro antiviolenza?', 'Cos’è il reddito di libertà?', 'Posso andare via di casa con i miei figli?'] },
  { id: 'legale', g: 'difficili', t: 'Mi serve un avvocato o un consiglio legale', c: C.gray, ic: IC.doc, tag: 'patronati',
    intro: 'Non serve essere ricchi per difendere i propri diritti: ci sono avvocati pagati dallo Stato e sportelli gratuiti.',
    misure: [
      { t: 'Gratuito patrocinio', s: 'Lo Stato paga l’avvocato nelle cause civili e penali.', chi: 'Chi ha un reddito sotto la soglia di legge; per le vittime di violenza domestica senza limiti di reddito.', serve: 'Dichiarazione dei redditi della famiglia.', dove: 'Consiglio dell’ordine degli avvocati (cause civili) o giudice (penali).', url: 'https://www.giustizia.it' },
      { t: 'Sportelli legali gratuiti', s: 'Un primo consiglio gratuito su casa, lavoro, famiglia, debiti.', chi: 'Tutti.', serve: 'I documenti del problema.', dove: 'Comuni, sindacati, associazioni dei consumatori, università.', url: '' },
      { t: 'Sindacati e patronati', s: 'Per problemi di lavoro (paga, licenziamento, contratti) e con l’INPS.', chi: 'Lavoratori e pensionati.', serve: 'Contratto, buste paga, lettere ricevute.', dove: 'Sedi dei sindacati e patronati.', url: '' }
    ],
    passi: ['Raccogli tutti i documenti e le lettere ricevute.', 'Chiedi un primo consiglio a uno sportello gratuito.', 'Se serve una causa, chiedi il gratuito patrocinio.'],
    doc: ['Documento', 'Redditi', 'Lettere, contratti, messaggi'],
    ask: ['Posso avere un avvocato gratis?', 'Il mio datore non mi paga: cosa faccio?', 'Ho ricevuto una lettera dal tribunale, cosa significa?'] }
];
export const SIT = Object.fromEntries(SITUAZIONI.map(s => [s.id, s]));

// ---------- «Scopri cosa ti spetta»: domande che cambiano in base alle risposte ----------
// when: la domanda compare solo se serve; multi: si possono scegliere più risposte
const giovane = r => r.eta === 'u18';
const adulto = r => r.eta === '18' || r.eta === '30';
export const QUIZ = [
  { id: 'eta', q: 'Quanti anni hai?', sub: 'Così ti mostro solo quello che ti riguarda.', a: [['u18', 'Meno di 18'], ['18', '18 – 29'], ['30', '30 – 64'], ['65', '65 o più']] },
  // ragazzi
  { id: 'fun', when: giovane, multi: true, q: 'Cosa ti andrebbe di fare nel tempo libero?', sub: 'Puoi sceglierne più di una.', a: [['sport', 'Sport'], ['musica', 'Musica, arte, teatro'], ['amici', 'Conoscere persone nuove'], ['aiutare', 'Aiutare gli altri'], ['studio', 'Studiare in compagnia'], ['giochi', 'Giochi e videogiochi insieme']] },
  { id: 'umore', when: giovane, q: 'Come va in questo periodo?', a: [['bene', 'Abbastanza bene'], ['giu', 'Mi sento giù o da solo'], ['bulli', 'Ho problemi con altri ragazzi o online'], ['casa', 'A casa ci sono problemi'], ['corpo', 'Ho dubbi su corpo, relazioni o sessualità']] },
  // adulti
  { id: 'lav', when: r => r.eta === '18', q: 'Cosa fai adesso?', a: [['studio', 'Studio'], ['lavoro', 'Lavoro'], ['cerco', 'Cerco lavoro'], ['perso', 'Ho perso il lavoro da poco'], ['niente', 'Né studio né lavoro']] },
  { id: 'lav', when: r => r.eta === '30', q: 'Come va con il lavoro?', a: [['lavoro', 'Lavoro'], ['cerco', 'Cerco lavoro'], ['perso', 'Ho perso il lavoro da poco'], ['salute', 'Non posso lavorare per salute'], ['cura', 'Mi occupo di un familiare']] },
  { id: 'soldi', when: r => r.eta !== 'u18', q: r => r.eta === '65' ? 'La pensione ti basta per le spese?' : 'Arrivi a fine mese?', a: [['ok', 'Sì, senza problemi'], ['fatica', 'A fatica'], ['no', 'No, non ce la faccio']] },
  { id: 'casa', when: adulto, q: 'E con la casa?', a: r => [...(r.eta === '18' ? [['fam', 'Vivo con la mia famiglia']] : []), ['ok', 'Tutto bene'], ['affitto', 'Faccio fatica con affitto o mutuo'], ['rischio', 'Rischio di restare senza casa'], ['senza', 'Non ho una casa']] },
  { id: 'figli', when: adulto, q: 'Hai figli o ne aspetti uno?', a: [['si', 'Sì'], ['solo', 'Sì, e li cresco da solo/a'], ['no', 'No']] },
  // anziani
  { id: 'vive', when: r => r.eta === '65', q: 'Vivi da solo o da sola?', a: [['si', 'Sì'], ['no', 'No']] },
  { id: 'aiuto', when: r => r.eta === '65', q: 'Hai bisogno di aiuto nelle cose di tutti i giorni?', a: [['no', 'No, faccio da solo'], ['poco', 'Ogni tanto'], ['si', 'Sì, spesso']] },
  // tutti
  { id: 'dis', q: r => giovane(r) ? 'Tu o qualcuno in famiglia avete una disabilità?' : 'Tu o qualcuno che segui avete una disabilità?', a: [['me', 'Sì, io'], ['fam', 'Sì, un familiare'], ['no', 'No']] },
  { id: 'insieme', when: r => !giovane(r), multi: true, q: 'Ti va di fare qualcosa con altre persone?', sub: 'Puoi sceglierne più di una.', a: [['sport', 'Sport o ginnastica'], ['cultura', 'Corsi, cultura, incontri'], ['aiutare', 'Volontariato'], ['compagnia', 'Solo un po’ di compagnia'], ['nulla', 'Per ora no']] },
  { id: 'preoc', when: r => !giovane(r), multi: true, q: 'C’è qualcosa che ti preoccupa?', sub: 'Puoi sceglierne più di una. Resta solo sul tuo telefono.', a: [['violenza', 'Qualcuno mi controlla o mi fa paura'], ['debiti', 'Debiti o prestiti'], ['cure', 'Pagare medicine e visite'], ['dipendenze', 'Alcol, droghe o gioco'], ['nulla', 'Niente di questo']] }
];
// domande che toccano a questa persona (cambiano con le risposte già date)
export const quizSteps = r => QUIZ.filter(q => !q.when || q.when(r));
export const qText = (q, r) => typeof q.q === 'function' ? q.q(r) : q.q;
export const qOpts = (q, r) => typeof q.a === 'function' ? q.a(r) : q.a;

// risultato: aiuti, attività per il tempo libero, luoghi utili, tutele e numeri
export function quizResult(r) {
  const sit = new Set(), fun = [], cats = new Set(), tut = new Set(), num = new Set();
  const arr = v => Array.isArray(v) ? v : v ? [v] : [];
  const F = (id, t, s, cat) => fun.push({ id, t, s, cat });
  if (r.eta === 'u18') {
    sit.add('ragazzi');
    const f = arr(r.fun);
    if (f.includes('sport')) { F('sport', 'Fai sport spendendo poco', 'Palestre popolari, oratori e polisportive: boxe, calcio, ginnastica a pochi euro o gratis.', 'palestre'); F('oratori', 'Campi e tornei all’oratorio', 'Calcetto, pallavolo e campi estivi aperti a tutti.', 'oratori'); }
    if (f.includes('musica')) F('musica', 'Suona, disegna, fai teatro', 'Nei centri giovani ci sono sale prove e laboratori gratuiti.', 'giovani');
    if (f.includes('amici') || f.includes('giochi')) F('amici', 'Conosci altri ragazzi', 'Centri di aggregazione e ludoteche: giochi, tornei, uscite con educatori.', 'giovani');
    if (f.includes('aiutare')) F('aiutare', 'Dai una mano', 'Molte associazioni accolgono ragazzi dai 14-16 anni, anche solo per qualche ora.', 'volontariato');
    if (f.includes('studio')) F('studio', 'Studia in compagnia', 'Doposcuola gratuiti in oratori, centri giovani e centri di quartiere.', 'quartiere');
    if (!fun.length) F('amici', 'Scopri cosa c’è vicino', 'Centri giovani, oratori e sport popolare a due passi da te.', 'giovani');
    if (r.umore === 'giu') { tut.add('solitudine'); num.add('n19696'); cats.add('consultori'); }
    if (r.umore === 'bulli') { tut.add('bullismo'); num.add('n19696'); }
    if (r.umore === 'casa') { num.add('n114'); num.add('n19696'); cats.add('consultori'); }
    if (r.umore === 'corpo') cats.add('consultori');
    fun.forEach(f => cats.add(f.cat)); cats.add('giovani'); cats.add('consultori');
  } else {
    if (r.eta === '18') sit.add('giovani');
    if (r.eta === '65') { sit.add('anziani'); cats.add('anziani'); }
    if (r.lav === 'perso' || r.lav === 'cerco' || r.lav === 'niente') { sit.add('lavoro'); cats.add('lavoro'); }
    if (r.lav === 'cura') sit.add('caregiver');
    if (r.lav === 'salute') sit.add('cure');
    if (r.soldi === 'fatica' || r.soldi === 'no') { sit.add('reddito'); sit.add('bollette'); cats.add('sociali'); cats.add('patronati'); }
    if (r.soldi === 'no') cats.add('accoglienza');
    if (r.casa === 'affitto' || r.casa === 'rischio') { sit.add('casa'); cats.add('casa'); }
    if (r.casa === 'rischio') tut.add('sfratto');
    if (r.casa === 'senza') { sit.add('senzacasa'); cats.add('accoglienza'); }
    if (r.figli === 'si' || r.figli === 'solo') { sit.add('figli'); cats.add('consultori'); }
    if (r.figli === 'solo') sit.add('genitore');
    if (r.vive === 'si') { tut.add('truffe'); num.add('argento'); }
    if (r.aiuto === 'poco' || r.aiuto === 'si') { sit.add('caregiver'); cats.add('sociali'); }
    const ins = arr(r.insieme);
    if (ins.includes('sport')) F('sport', r.eta === '65' ? 'Ginnastica dolce e camminate' : 'Sport a prezzi popolari', r.eta === '65' ? 'Nei centri anziani e nelle polisportive ci sono corsi pensati per te.' : 'Palestre popolari e polisportive con quote basse.', r.eta === '65' ? 'anziani' : 'palestre');
    if (ins.includes('cultura')) F('cultura', 'Corsi e incontri vicino a casa', 'Centri civici e di quartiere: lingue, computer, cinema, feste.', 'quartiere');
    if (ins.includes('aiutare')) F('aiutare', 'Fai volontariato', 'Dare una mano fa bene anche a te: c’è posto per qualsiasi età.', 'volontariato');
    if (ins.includes('compagnia')) { F('compagnia', 'Un po’ di compagnia', r.eta === '65' ? 'Centri anziani e Filo d’Argento: c’è sempre qualcuno con cui parlare.' : 'Centri di quartiere e associazioni: si conosce gente in fretta.', r.eta === '65' ? 'anziani' : 'quartiere'); tut.add('solitudine'); num.add(r.eta === '65' ? 'argento' : 'amico'); }
    const pr = arr(r.preoc);
    if (pr.includes('violenza')) { sit.add('violenza'); tut.add('coppia'); num.add('n1522'); cats.add('antiviolenza'); }
    if (pr.includes('debiti')) { tut.add('debiti'); sit.add('legale'); }
    if (pr.includes('cure')) sit.add('cure');
    if (pr.includes('dipendenze')) sit.add('dipendenze');
  }
  if (r.dis === 'me' || r.dis === 'fam') { sit.add('disabilita'); cats.add('disabilita'); if (r.dis === 'fam' && r.eta !== 'u18') sit.add('caregiver'); }
  if (!sit.size) sit.add('bollette');
  return { sit: [...sit], fun, cats: [...cats], tut: [...tut], num: [...num] };
}

// ---------- tutele: situazioni di rischio ----------
export const TUTELE = [
  { id: 'truffe', t: 'Truffe a casa o al telefono', s: 'Falsi tecnici, finti carabinieri, «nipoti» in difficoltà', c: C.amber, ic: IC.phone, tag: 'sociali',
    segnali: ['Qualcuno ha fretta e ti mette paura («suo figlio ha avuto un incidente»)', 'Ti chiedono contanti, gioielli o codici', 'Dicono di essere tecnici, operatori o forze dell’ordine senza preavviso'],
    fare: ['Non aprire e non dare soldi: nessun ente vero chiede contanti a casa', 'Chiudi la chiamata e richiama tu un familiare o il numero ufficiale', 'Chiama il 112: verificano subito', 'Se è successo, denuncia: non è colpa tua'],
    num: ['n112', 'argento'], ask: ['Mi ha chiamato un finto carabiniere, cosa faccio?', 'Come riconosco una truffa al telefono?', 'Ho già dato dei soldi: posso riaverli?'] },
  { id: 'coppia', t: 'Controllo o violenza in coppia', s: 'Anche psicologica ed economica', c: C.violet, ic: IC.heart, tag: 'antiviolenza',
    segnali: ['Ti controlla il telefono, i soldi o con chi esci', 'Ti allontana da amici e famiglia', 'Ti insulta, ti umilia, ti minaccia o ti fa paura', 'Ti impedisce di lavorare o di avere un conto tuo'],
    fare: ['Parlane con un centro antiviolenza: è gratuito e riservato, anche senza denunciare', 'Conserva messaggi, foto, referti in un posto sicuro', 'Prepara un piano: una persona di fiducia, documenti e un po’ di soldi pronti', 'Se sei in pericolo adesso chiama il 112'],
    num: ['n1522', 'n112'], ask: ['Il mio partner mi controlla il telefono: è normale?', 'Come preparo un piano per andarmene?', 'Posso parlare con un centro senza denunciare?'] },
  { id: 'discriminazione', t: 'Discriminazione per disabilità', s: 'Al lavoro, a scuola, nei servizi', c: C.sky, ic: IC.access, tag: 'disabilita',
    segnali: ['Ti negano un servizio o l’accesso a un luogo', 'Al lavoro non ti danno gli adattamenti di cui hai bisogno', 'Ti trattano peggio degli altri per la tua condizione'],
    fare: ['Annota cosa è successo, quando e chi c’era', 'Chiedi per iscritto il motivo del rifiuto', 'Rivolgiti a un’associazione delle persone con disabilità, a un sindacato o a un patronato', 'Puoi segnalare il caso anche al Garante nazionale dei diritti delle persone con disabilità'],
    num: [], ask: ['Al lavoro non mi danno gli adattamenti: cosa posso fare?', 'A chi segnalo una discriminazione?', 'Mi hanno negato l’accesso a un locale: è legale?'] },
  { id: 'sfratto', t: 'Rischio di sfratto', s: 'Chi chiamare prima che sia tardi', c: C.rose, ic: IC.home, tag: 'casa',
    segnali: ['Sei indietro con l’affitto e non riesci a recuperare', 'È arrivata una lettera dell’avvocato o del tribunale'],
    fare: ['Non aspettare: parla subito con un sindacato degli inquilini (SUNIA, SICET, UNIAT)', 'Chiedi ai servizi sociali del Comune del Fondo per la morosità incolpevole', 'Prova ad accordarti con il proprietario per un piano di rientro, per iscritto'],
    num: [], ask: ['Mi è arrivata la lettera di sfratto: quanto tempo ho?', 'Cos’è la morosità incolpevole?', 'Come propongo un piano di rientro?'] },
  { id: 'debiti', t: 'Debiti e prestiti pericolosi', s: 'Usura, finanziarie, rate che non finiscono', c: C.green, ic: IC.euro, tag: 'volontariato',
    segnali: ['Qualcuno ti presta soldi con interessi altissimi o senza contratto', 'Ricevi minacce per restituire', 'Paghi una rata per coprirne un’altra'],
    fare: ['Non firmare niente sotto pressione', 'Rivolgiti a uno sportello o a una fondazione antiusura: l’aiuto è gratuito', 'Se i debiti sono troppi esiste una procedura di legge per il sovraindebitamento: chiedi a un Organismo di composizione della crisi (OCC)', 'Se ti minacciano chiama il 112'],
    num: ['n112'], ask: ['Come riconosco l’usura?', 'Cos’è la procedura di sovraindebitamento?', 'Ho troppe rate: da dove comincio?'] },
  { id: 'bullismo', t: 'Bullismo e cyberbullismo', s: 'Per ragazzi e per i genitori', c: C.pink, ic: IC.phoneSm, tag: 'giovani',
    segnali: ['Prese in giro continue, esclusione, minacce', 'Foto o messaggi su di te pubblicati senza permesso', 'Paura di andare a scuola o di usare il telefono'],
    fare: ['Parlane con un adulto di cui ti fidi', 'Salva le prove (screenshot) e blocca chi ti attacca', 'Segnala i contenuti alla piattaforma; dai 14 anni puoi chiedere tu stesso di toglierli', 'Puoi rivolgerti alla Polizia Postale (commissariatodips.it)'],
    num: ['n19696', 'n114'], ask: ['Mi prendono in giro sui social: cosa faccio?', 'Come chiedo di togliere un contenuto su di me?', 'Mio figlio è vittima di bullismo: come lo aiuto?'] },
  { id: 'solitudine', t: 'Solitudine e momenti difficili', s: 'Quando ti senti solo o non ce la fai', c: C.teal, ic: IC.chat, tag: 'anziani',
    segnali: ['Passi giorni senza parlare con nessuno', 'Ti senti giù, inutile o senza via d’uscita'],
    fare: ['Chiama una linea di ascolto: c’è sempre qualcuno pronto a parlare con te', 'Prova un luogo vicino: centro anziani, centro giovani, associazioni, palestre popolari', 'Parlane con il tuo medico di base', 'Se pensi di farti del male, chiama subito il 112'],
    num: ['amico', 'samaritans', 'argento'], ask: ['Mi sento solo, cosa posso fare vicino a me?', 'Come faccio a conoscere persone nuove?', 'Mia madre anziana è sempre sola: come la aiuto?'] }
];
export const TUT = Object.fromEntries(TUTELE.map(t => [t.id, t]));
