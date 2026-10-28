// Prova la ricerca dei luoghi su alcune città: quanti risultati per categoria e quanto ci mette.
import { nearby } from '../src/places.js';
const CITTA = { 'Roma centro': [41.8986, 12.4769], 'Milano centro': [45.4642, 9.19], 'Napoli centro': [40.8518, 14.2681], 'Albano Laziale': [41.7296, 12.6597], 'Bologna': [44.4949, 11.3426] };
for (const [n, [lat, lng]] of Object.entries(CITTA)) {
  const t = Date.now();
  try {
    const it = await nearby({ lat, lng }, { force: true, onPartial: p => console.log(`  ${n}: parziale ${p.length}`) });
    const per = {}; it.forEach(p => { per[p.cat] = (per[p.cat] || 0) + 1; });
    console.log(`::notice title=${n}::${it.length} luoghi in ${((Date.now() - t) / 1000).toFixed(1)} s`, JSON.stringify(per));
    console.log(`::notice title=${n} esempi::` + it.slice(0, 8).map(p => `${p.cat}:${p.name}`).join(' | '));
  } catch (e) { console.log(`::error title=${n}::ERRORE dopo ${((Date.now() - t) / 1000).toFixed(1)} s`, e.message); }
}
