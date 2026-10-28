# Vicina Extra

App gratuita che aiuta giovani, adulti, anziani e persone con disabilità a trovare **servizi sociali, aiuti e diritti, luoghi di prevenzione e socializzazione**, a sapere come tutelarsi in situazioni di rischio e a sentirsi meno soli. È la sorella di [Vicina](https://github.com/conaeduardo4-cmyk/vicina-app), l'app per le emergenze.

## Cosa c'è
- **Home**: ricerca, profilo (per me, giovani, famiglie, anziani, disabilità), «Scopri cosa ti spetta» in 5 domande, categorie vicino a te, testo grande (Aa).
- **Luoghi**: mappa con consultori, centri antiviolenza, servizi sociali, sportelli casa, centri per l'impiego, centri giovani, centri anziani, associazioni per la disabilità, oratori, palestre popolari, volontariato, patronati e CAF. Dati di OpenStreetMap (Overpass), senza chiavi.
- **Scheda luogo**: chiama, indicazioni, sito, cosa trovi in quel tipo di servizio, accessibilità.
- **Aiuti**: situazioni (disabilità, affitto, lavoro, figli, over 65, bollette, giovani, uscire dalla violenza) con le misure spiegate semplici, i passi e la fonte ufficiale. Contenuti in `src/data.js`: niente importi, perché cambiano ogni anno.
- **Tutele**: truffe, violenza nella coppia, discriminazione, sfratto, debiti e usura, bullismo, solitudine: segnali, cosa fare, chi chiamare.
- **Insieme**: luoghi per stare con altre persone e linee di ascolto.
- **Assistente**: risponde su servizi, welfare, tutele e solitudine (funzione Supabase `extra-assistente`, stessi fornitori gratuiti dell'assistente di Vicina).

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
L'assistente usa la funzione `supabase/functions/extra-assistente` sul progetto di Vicina (stessi secrets `GROQ_API_KEY` / `GEMINI_API_KEY` / `OPENROUTER_API_KEY`). L'app non ha account: nessun dato personale viene salvato sul server; le chat restano sul telefono.
