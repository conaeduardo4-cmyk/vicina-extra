# Vicina Extra

App gratuita che aiuta giovani, adulti, anziani e persone con disabilità a trovare **servizi sociali, aiuti e diritti, luoghi di prevenzione e socializzazione**, a sapere come tutelarsi in situazioni di rischio e a sentirsi meno soli. È la sorella di [Vicina](https://github.com/conaeduardo4-cmyk/vicina-app), l'app per le emergenze.

## Cosa c'è
- **Home**: ricerca, profilo (per me, giovani, famiglie, anziani, disabilità), «Scopri cosa ti spetta» con domande che cambiano in base alle risposte (chi ha meno di 18 anni riceve idee per il tempo libero, non domande su lavoro e casa), idee per te, categorie vicino a te, testo grande (Aa).
- **Luoghi**: mappa con consultori, centri antiviolenza, servizi sociali, centri di quartiere, sportelli casa, centri per l'impiego, centri giovani, centri anziani, associazioni per la disabilità, mense e accoglienza, oratori, sport popolare, associazioni, patronati e CAF. Si possono salvare.
- **Aiuti**: 16 guide (lavoro, reddito, bollette, casa, senza casa, figli, separazione, disabilità, chi assiste un familiare, cure, dipendenze, minorenni, giovani, anziani, violenza, avvocato gratuito). Ogni aiuto dice a chi spetta, cosa serve e dove si chiede; documenti da spuntare; fonte ufficiale. Niente importi, perché cambiano ogni anno.
- **Tutele**: truffe, violenza nella coppia, discriminazione, sfratto, debiti e usura, bullismo, solitudine: segnali, cosa fare, chi chiamare.
- **Insieme**: luoghi per stare con altre persone e linee di ascolto.
- **Tu**: profilo con foto e banner (lo stesso account di Vicina), risposte, luoghi salvati, chat, testo grande, numeri utili, privacy.
- **Assistente**: risponde su servizi, welfare, tutele e solitudine (funzione Supabase `extra-assistente`). In fondo a ogni guida c'è un box per chiedere all'assistente proprio su quell'argomento.

## Luoghi: da dove arrivano
L'azione **Prepara i luoghi** (ogni lunedì, o a mano) scarica da OpenStreetMap i luoghi di tutta Italia e li salva in piccoli file nel ramo `dati` (`scripts/dati-luoghi.mjs`). L'app scarica solo i file della tua zona, quindi è veloce. Se non arrivano, chiede direttamente a OpenStreetMap (Overpass).
Dati © contributori di OpenStreetMap, licenza ODbL.

## Sviluppo
```
npm install
npm run dev
```

## Compilare l'APK
GitHub → **Actions → Compila Android → Run workflow**. L'APK finisce nelle Releases (`VicinaExtra.apk`).

Per firmarlo sempre con la stessa chiave (così gli aggiornamenti si installano sopra) aggiungi in **Settings → Secrets and variables → Actions**:
- `ANDROID_KEYSTORE_BASE64`: il file `.jks` in base64
- `ANDROID_KEYSTORE_PASSWORD`: la password
- `ANDROID_KEY_ALIAS`: l'alias (predefinito `vicinaextra`)

Senza questi secrets viene pubblicato l'APK di debug.

## Supabase
L'assistente usa la funzione `supabase/functions/extra-assistente` sul progetto di Vicina (stessi secrets `GROQ_API_KEY` / `GEMINI_API_KEY` / `OPENROUTER_API_KEY`). L'account è facoltativo ed è lo stesso di Vicina (tabella `profiles`, foto nel bucket `avatars`). Risposte alle domande, luoghi salvati e chat restano sul telefono.
