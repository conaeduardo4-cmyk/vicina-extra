// Edge Function "extra-assistente": l'assistente di Vicina Extra (servizi sociali, welfare, tutele, solitudine).
// Usa gli stessi fornitori gratuiti dell'assistente di Vicina (secrets GROQ_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY).
// Vicina Extra non ha account: la chiamata arriva con la chiave pubblica dell'app e un identificativo anonimo del telefono.
// Limite: AI_EXTRA_LIMIT messaggi al giorno per telefono (predefinito 40), contati in memoria dal server.
const env = (k: string, d = '') => (Deno.env.get(k) || d).trim();
const KEYS: Record<string, string> = { groq: env('GROQ_API_KEY'), gemini: env('GEMINI_API_KEY'), openrouter: env('OPENROUTER_API_KEY') };
const list = (k: string, d: string) => env(k, d).split(',').map(x => x.trim()).filter(Boolean);
const PROVIDERS = list('AI_PROVIDERS', 'groq,gemini,openrouter').map(x => x.toLowerCase()).filter(p => KEYS[p]);
const MODELS: Record<string, string[]> = {
  groq: list('GROQ_MODELS', 'llama-3.3-70b-versatile,openai/gpt-oss-120b,llama-3.1-8b-instant'),
  gemini: list('GEMINI_MODELS', 'gemini-flash-latest,gemini-flash-lite-latest'),
  openrouter: list('OPENROUTER_MODELS', 'meta-llama/llama-3.3-70b-instruct:free,openrouter/free')
};
const LIMIT = Math.max(1, Number(env('AI_EXTRA_LIMIT', '40')) || 40);
const BUDGET_MS = 45000;
const FUORI = 'Posso aiutarti con servizi sociali, aiuti e diritti, luoghi dove stare in compagnia e come tutelarti in situazioni difficili. Su questo argomento non so risponderti: vuoi chiedermi qualcosa di questi temi?';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'Content-Type': 'application/json' } });

const SYSTEM = `Sei l'Assistente di Vicina Extra, un'app italiana che aiuta giovani, adulti, anziani e persone con disabilità a trovare servizi sociali, aiuti economici, diritti e luoghi di prevenzione e socializzazione, e a sentirsi meno sole.
Parli sempre in italiano semplice, caldo e rispettoso, con frasi brevi (di norma 3-8 frasi o un elenco corto). Dai del tu. Non giudicare mai.

DI COSA PARLI:
- Servizi e luoghi: consultori familiari, centri antiviolenza, servizi sociali del Comune (segretariato sociale), welfare abitativo (case popolari, contributi affitto, morosità incolpevole, emergenza abitativa), centri per l'impiego e collocamento mirato, centri di aggregazione giovanile e Informagiovani, centri anziani, oratori, palestre popolari, volontariato, associazioni delle persone con disabilità, patronati e CAF.
- Aiuti e diritti dei cittadini in Italia: ISEE, Assegno unico, Assegno di inclusione, Supporto formazione e lavoro, NASpI, invalidità civile, indennità di accompagnamento, Legge 104, Legge 68/99, assegno sociale, carta acquisti, bonus sociale bollette, bonus nido, assegno di maternità dei Comuni, reddito di libertà, servizio civile, carta giovani e simili. Spiega cosa sono, a chi si rivolgono in generale e dove si chiedono (INPS online, patronato gratuito, CAF, Comune, ASL).
- Come tutelarsi: truffe, violenza o controllo nella coppia (anche psicologica ed economica), discriminazioni, sfratto, debiti e usura, bullismo e cyberbullismo, solitudine.
- Ascolto: se la persona si sente sola, triste o in difficoltà, ascoltala con calore, poi proponi passi concreti (una linea di ascolto, un luogo vicino, il medico di base).

REGOLE:
1. Pericolo adesso (violenza in corso, minacce, malore, idee di farsi del male): come prima riga di' di chiamare subito il 112. Per violenza e stalking c'è anche il 1522 (gratuito, 24 ore su 24). Poi poche indicazioni pratiche.
2. Non inventare importi, soglie ISEE, scadenze o requisiti precisi: cambiano ogni anno. Dai l'idea generale e consiglia di verificare su inps.it, con un patronato (gratuito) o con i servizi sociali. Se non sei sicuro, dillo.
3. Non inventare nomi, indirizzi o numeri di uffici locali. Puoi dire di cercare nella sezione "Luoghi" dell'app o di chiedere al Comune.
4. Numeri che puoi dare: 112 emergenze, 1522 antiviolenza e stalking, 114 emergenza infanzia, 19696 Telefono Azzurro, Telefono Amico 02 2327 2327, Filo d'Argento (Auser) 800 995 988, Samaritans 06 7720 8977.
5. Non chiedere dati personali (nome completo, codice fiscale, indirizzo). Non dare consigli medici o legali come certi: indirizza al medico, a un patronato, a un avvocato o a un centro antiviolenza.
6. Se la domanda non c'entra con questi temi (compiti, ricette, sport, programmazione, notizie, giochi…) rispondi SOLO con la parola FUORI_TEMA.
7. Niente markdown complesso: al massimo **grassetto** ed elenchi con "- ".`;

type Turn = { role: 'user' | 'model'; text: string };
const counts = new Map<string, { day: string; n: number }>();
function take(k: string) {
  const day = new Date().toISOString().slice(0, 10), c = counts.get(k);
  if (!c || c.day !== day) { counts.set(k, { day, n: 1 }); return LIMIT - 1; }
  c.n++; return LIMIT - c.n;
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method === 'GET') return json({ ok: PROVIDERS.length > 0, configurati: PROVIDERS });
  if (req.method !== 'POST') return json({ error: 'Metodo non supportato' }, 405);
  let body: { messages?: Turn[]; device?: string; area?: { lat: number; lng: number } | null } = {};
  try { body = await req.json(); } catch { /* vuoto */ }
  const msgs: Turn[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string' && m.text.trim())
    .slice(-12).map(m => ({ role: m.role, text: m.text.slice(0, 1500) }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return json({ error: 'Scrivi una domanda.' }, 400);

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  const dev = String(body.device || '').slice(0, 60) || ip;
  if (take('d:' + dev) < 0 || take('i:' + ip) < -LIMIT * 4) return json({ error: `Hai usato i ${LIMIT} messaggi di oggi con l'assistente. Riprova domani. In emergenza chiama il 112.` }, 429);
  if (!PROVIDERS.length) return json({ error: "L'assistente non è configurato sul server." }, 503);

  const a = body.area && isFinite(body.area.lat) && isFinite(body.area.lng) ? `\nL'utente si trova in Italia vicino alle coordinate ${body.area.lat}, ${body.area.lng} (zona approssimativa): se serve, puoi dire che servizi del genere sono di solito gestiti dal Comune o dalla Regione di quella zona, senza inventare indirizzi.` : '';
  const { reply } = await ask(SYSTEM + a, msgs);
  if (!reply) return json({ error: "L'assistente non risponde in questo momento. Riprova tra un minuto. In emergenza chiama il 112." }, 502);
  let out = reply;
  if (/FUORI[_ ]TEMA/i.test(out) && out.length < 40) out = FUORI;
  return json({ reply: out });
});

async function ask(system: string, msgs: Turn[]) {
  const t0 = Date.now(), errors: string[] = [];
  for (const prov of PROVIDERS) {
    let down = false;
    for (const model of MODELS[prov] || []) {
      if (down) break;
      for (let attempt = 0; attempt < 2; attempt++) {
        const left = BUDGET_MS - (Date.now() - t0);
        if (left < 3000) return { reply: '', errors };
        try {
          const r = await callModel(prov, model, system, msgs, Math.min(15000, left));
          if (r) return { reply: r, errors };
          break;
        } catch (e) {
          const m = String((e as Error)?.message || e); errors.push(`${prov}/${model}: ${m.slice(0, 160)}`);
          if (/timed out|abort|network|connection|dns|HTTP 401|HTTP 403/i.test(m)) { down = true; break; }
          if (attempt === 0 && /HTTP (429|500|502|503|504)/.test(m)) { await new Promise(r => setTimeout(r, 900)); continue; }
          break;
        }
      }
    }
  }
  console.error('extra-assistente', errors);
  return { reply: '', errors };
}
function callModel(prov: string, model: string, system: string, msgs: Turn[], ms: number) {
  if (prov === 'gemini') return askGemini(model, system, msgs, ms);
  const url = prov === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions';
  return askOpenAI(url, KEYS[prov], model, system, msgs, ms, prov === 'openrouter');
}
async function withTimeout(url: string, init: RequestInit, ms: number) {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(new Error('timed out')), ms);
  try { return await fetch(url, { ...init, signal: ac.signal }); } finally { clearTimeout(t); }
}
async function askOpenAI(url: string, key: string, model: string, system: string, msgs: Turn[], ms: number, openrouter: boolean) {
  const body: Record<string, unknown> = { model, temperature: 0.4, max_tokens: 2048,
    messages: [{ role: 'system', content: system }, ...msgs.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text }))] };
  if (/gpt-oss/.test(model)) body.reasoning_effort = 'low';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key };
  if (openrouter) { headers['HTTP-Referer'] = 'https://vicina.app'; headers['X-Title'] = 'Vicina Extra'; }
  const r = await withTimeout(url, { method: 'POST', headers, body: JSON.stringify(body) }, ms);
  if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  return clean(String(d?.choices?.[0]?.message?.content || ''));
}
async function askGemini(model: string, system: string, msgs: Turn[], ms: number) {
  const base = { systemInstruction: { parts: [{ text: system }] }, contents: msgs.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
    safetySettings: ['HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT'].map(category => ({ category, threshold: 'BLOCK_ONLY_HIGH' })) };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const headers = { 'Content-Type': 'application/json', 'x-goog-api-key': KEYS.gemini };
  const tries = [{ ...base, generationConfig: { temperature: 0.4, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 } } }, { ...base, generationConfig: { temperature: 0.4, maxOutputTokens: 8192 } }];
  let last = '';
  for (const b of tries) {
    const r = await withTimeout(url, { method: 'POST', headers, body: JSON.stringify(b) }, ms);
    if (!r.ok) { last = `HTTP ${r.status} ${(await r.text()).slice(0, 200)}`; if (r.status === 400 && /thinking/i.test(last)) continue; throw new Error(last); }
    const d = await r.json();
    const text = (d?.candidates?.[0]?.content?.parts || []).filter((x: { thought?: boolean }) => !x.thought).map((x: { text?: string }) => x.text || '').join('');
    if (text.trim()) return clean(text);
    last = 'vuota';
  }
  throw new Error(last);
}
const clean = (t: string) => t.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
