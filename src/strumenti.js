// Strumenti di uso immediato di Vicina Extra: lettere pronte e scadenze.
// Le lettere sono modelli generici da adattare: i campi tra {graffe} si compilano nell'app.

export const LETTERE = [
  { id: 'sociali', t: 'Appuntamento ai servizi sociali', s: 'Email o PEC al Comune per chiedere un colloquio',
    oggetto: 'Richiesta di appuntamento con il servizio sociale',
    campi: { nome: 'Nome e cognome', indirizzo: 'Indirizzo di residenza', telefono: 'Telefono', motivo: 'In breve, perché chiedi aiuto' },
    testo: `Al Servizio sociale del Comune di residenza

Oggetto: richiesta di appuntamento con il servizio sociale

Io sottoscritto/a {nome}, residente in {indirizzo}, chiedo un appuntamento con un assistente sociale per il seguente motivo:
{motivo}

Resto a disposizione per qualsiasi documento utile.
Potete contattarmi al numero {telefono}.

Cordiali saluti,
{nome}
{data}` },
  { id: 'bolletta', t: 'Rateizzare una bolletta', s: 'Per luce, gas o acqua troppo alte',
    oggetto: 'Richiesta di rateizzazione',
    campi: { nome: 'Nome e cognome', fornitore: 'Fornitore (es. il gestore della luce)', codice: 'Codice cliente o numero di fornitura', bolletta: 'Numero o data della bolletta', importo: 'Importo in euro', telefono: 'Telefono' },
    testo: `Spett.le {fornitore}

Oggetto: richiesta di rateizzazione — codice cliente {codice}

Io sottoscritto/a {nome}, intestatario/a della fornitura con codice {codice}, chiedo di poter pagare a rate la bolletta {bolletta} di {importo} euro, perché in questo momento non riesco a saldarla in un’unica soluzione.

Chiedo inoltre di non sospendere la fornitura mentre la richiesta viene valutata.
Potete contattarmi al numero {telefono}.

Cordiali saluti,
{nome}
{data}` },
  { id: 'affitto', t: 'Piano di rientro per l’affitto', s: 'Proposta al proprietario se sei in ritardo',
    oggetto: 'Proposta di piano di rientro dei canoni arretrati',
    campi: { nome: 'Nome e cognome', proprietario: 'Nome del proprietario', indirizzo: 'Indirizzo dell’appartamento', arretrato: 'Arretrato in euro', rata: 'Rata in più al mese, in euro', mesi: 'Per quanti mesi' },
    testo: `Gentile {proprietario},

le scrivo per l’appartamento in {indirizzo}, di cui sono inquilino/a.
Per difficoltà economiche non sono riuscito/a a pagare canoni per un totale di {arretrato} euro.

Le propongo di saldare l’arretrato versando, oltre al canone normale, {rata} euro al mese per {mesi} mesi, a partire dal prossimo mese.

Sono disponibile a mettere l’accordo per iscritto e a parlarne di persona.

Cordiali saluti,
{nome}
{data}` },
  { id: 'lavoro', t: 'Adattamenti sul lavoro', s: 'Richiesta al datore per una disabilità o malattia',
    oggetto: 'Richiesta di accomodamenti ragionevoli',
    campi: { nome: 'Nome e cognome', datore: 'Azienda o datore di lavoro', ruolo: 'La tua mansione', bisogno: 'Cosa ti servirebbe (orari, postazione, strumenti…)' },
    testo: `Spett.le {datore}

Oggetto: richiesta di accomodamenti ragionevoli

Io sottoscritto/a {nome}, dipendente con mansione di {ruolo}, a causa della mia condizione di salute chiedo di valutare i seguenti adattamenti per svolgere al meglio il mio lavoro:
{bisogno}

Resto disponibile per un incontro, anche con il medico competente, e per fornire la documentazione necessaria.

Cordiali saluti,
{nome}
{data}` }
];

// scadenze: da una data, quando scade e quanti giorni restano
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
export const SCADENZE = [
  { id: 'naspi', t: 'Domanda di NASpI', s: 'Entro 68 giorni dalla fine del lavoro', q: 'Quando è finito il lavoro?', calc: d => addDays(d, 68), sit: 'lavoro' },
  { id: 'maternita', t: 'Assegno di maternità del Comune', s: 'Entro 6 mesi dalla nascita', q: 'Quando è nato il bambino?', calc: d => addMonths(d, 6), sit: 'figli' },
  { id: 'isee', t: 'Rinnovo dell’ISEE', s: 'L’ISEE vale fino al 31 dicembre', q: 'Quando hai fatto l’ISEE?', calc: d => new Date(new Date(d).getFullYear(), 11, 31), sit: 'reddito' },
  { id: 'discoll', t: 'Domanda di DIS-COLL', s: 'Entro 68 giorni dalla fine della collaborazione', q: 'Quando è finita la collaborazione?', calc: d => addDays(d, 68), sit: 'lavoro' }
];
export const daysLeft = d => Math.ceil((new Date(d).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5);
