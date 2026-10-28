// Assistente di Vicina Extra: le domande vanno alla funzione "extra-assistente" su Supabase (le chiavi dell'IA restano lì).
const env = import.meta.env;
const URL = env.VITE_SUPABASE_URL || 'https://zebdtcndbaydhxdpmtlo.supabase.co';
// chiave pubblica (anon): è fatta per stare dentro le app
const KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplYmR0Y25kYmF5ZGh4ZHBtdGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExODg4MzAsImV4cCI6MjEwNjc2NDgzMH0.OXw_ExEZC6AO2zJ-IBdaKvtwDbNBhW8E4VuKUotP12s';

const device = (() => {
  try { let d = localStorage.getItem('dev'); if (!d) { d = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('dev', d); } return d; } catch { return 'anon'; }
})();

export async function askAI(messages, pos) {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 60000);
  let r;
  try {
    r = await fetch(URL + '/functions/v1/extra-assistente', {
      method: 'POST', signal: ac.signal,
      headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY },
      // la posizione arriva solo arrotondata (città), per consigliare i servizi della zona
      body: JSON.stringify({ messages: messages.map(m => ({ role: m.role, text: m.text })), device, area: pos ? { lat: +pos.lat.toFixed(2), lng: +pos.lng.toFixed(2) } : null })
    });
  } catch { throw new Error('Non riesco a collegarmi: controlla la connessione e riprova.'); }
  finally { clearTimeout(t); }
  let j = {}; try { j = await r.json(); } catch { /* */ }
  if (!r.ok || !j.reply) throw new Error(j.error || 'L’assistente non risponde in questo momento. Riprova tra poco.');
  return j.reply;
}
