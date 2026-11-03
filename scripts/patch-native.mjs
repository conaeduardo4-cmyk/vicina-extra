// Prepara il progetto Android dopo "npx cap add android": permessi, tutto schermo, testo al 100%, sfondo scuro.
// Si può rilanciare senza danni.
import fs from 'fs';

const read = p => fs.readFileSync(p, 'utf8');
const log = m => console.log('  ✓ ' + m);

const man = 'android/app/src/main/AndroidManifest.xml';
if (fs.existsSync(man)) {
  console.log('Android');
  let s = read(man);
  for (const p of ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'INTERNET', 'REQUEST_INSTALL_PACKAGES'])
    if (!s.includes(`android.permission.${p}"`)) s = s.replace('</manifest>', `    <uses-permission android:name="android.permission.${p}" />\n</manifest>`);
  if (!s.includes('"android.hardware.location.gps"')) s = s.replace('</manifest>', '    <uses-feature android:name="android.hardware.location.gps" android:required="false" />\n</manifest>');
  // tel:, geo: e mappe: servono per aprire telefono e navigatore da Android 11 in su
  if (!s.includes('<queries>')) s = s.replace('</manifest>', `    <queries>
        <intent><action android:name="android.intent.action.DIAL" /></intent>
        <intent><action android:name="android.intent.action.VIEW" /><data android:scheme="geo" /></intent>
        <intent><action android:name="android.intent.action.VIEW" /><data android:scheme="https" /></intent>
        <intent><action android:name="android.intent.action.VIEW" /><data android:scheme="vicina" /></intent>
        <package android:name="it.vicina.app" />
    </queries>\n</manifest>`);
  // link vicinaextra://… (da Vicina: apre una sezione e passa le informazioni)
  if (!s.includes('android:scheme="vicinaextra"'))
    s = s.replace(/(<activity[\s\S]*?android:name="\.MainActivity"[^>]*>)/, `$1
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="vicinaextra" />
            </intent-filter>`);
  fs.writeFileSync(man, s); log('permessi');

  const findMain = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = dir + '/' + e.name;
      if (e.isDirectory()) { const r = findMain(f); if (r) return r; }
      else if (e.name === 'MainActivity.java') return f;
    }
    return null;
  };
  const mainAct = fs.existsSync('android/app/src/main/java') ? findMain('android/app/src/main/java') : null;
  if (mainAct) {
    let m = read(mainAct);
    const pkg = (m.match(/^package\s+([\w.]+);/m) || [])[1];
    const dir = mainAct.slice(0, mainAct.lastIndexOf('/'));
    fs.writeFileSync(dir + '/EdgeToEdge.java', read('scripts/android/EdgeToEdge.java').replace('__PACKAGE__', pkg));
    fs.writeFileSync(dir + '/ExtraNativePlugin.java', read('scripts/android/ExtraNativePlugin.java').replace('__PACKAGE__', pkg));
    fs.writeFileSync(dir + '/ApkUpdaterPlugin.java', read('scripts/android/ApkUpdaterPlugin.java').replace('__PACKAGE__', pkg));
    if (!/onCreate\s*\(/.test(m)) {
      if (!m.includes('import android.os.Bundle;')) m = m.replace(/(package[^;]+;)/, '$1\n\nimport android.os.Bundle;');
      m = m.replace(/extends BridgeActivity\s*\{\s*\}/, `extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }
}`);
    }
    if (!m.includes('EdgeToEdge.apply')) m = m.replace(/super\.onCreate\(savedInstanceState\);/, `super.onCreate(savedInstanceState);
        EdgeToEdge.apply(this);
        try { getBridge().getWebView().getSettings().setTextZoom(100); } catch (Exception ignored) { }`);
    // il plugin va registrato prima di super.onCreate
    if (!m.includes('ApkUpdaterPlugin')) m = m.replace(/(onCreate\s*\([^)]*\)\s*\{)/, '$1\n        registerPlugin(ApkUpdaterPlugin.class);');
    if (!m.includes('ExtraNativePlugin')) m = m.replace('registerPlugin(ApkUpdaterPlugin.class);', 'registerPlugin(ApkUpdaterPlugin.class);\n        registerPlugin(ExtraNativePlugin.class);');
    fs.writeFileSync(mainAct, m);
    log(m.includes('ApkUpdaterPlugin') ? 'installazione di Vicina (plugin ApkUpdater)' : 'ATTENZIONE: plugin ApkUpdater non registrato');
    log(m.includes('EdgeToEdge.apply') ? 'tutto schermo e testo al 100%' : 'ATTENZIONE: MainActivity non modificata');
  }

  // cartella dove si scarica l'APK da installare (FileProvider di Capacitor)
  const fp = 'android/app/src/main/res/xml/file_paths.xml';
  if (fs.existsSync(fp)) {
    let x = read(fp);
    if (!/<cache-path[^>]*path="\."/.test(x) && !x.includes('name="updates"')) x = x.replace('</paths>', '    <cache-path name="updates" path="updates/" />\n</paths>');
    fs.writeFileSync(fp, x);
  } else {
    fs.mkdirSync('android/app/src/main/res/xml', { recursive: true });
    fs.writeFileSync(fp, '<?xml version="1.0" encoding="utf-8"?>\n<paths xmlns:android="http://schemas.android.com/apk/res/android">\n    <cache-path name="updates" path="updates/" />\n</paths>\n');
  }
  log('cartella per gli APK scaricati');

  const styles = 'android/app/src/main/res/values/styles.xml';
  if (fs.existsSync(styles)) {
    let st = read(styles);
    if (!st.includes('android:windowBackground">#09090B'))
      st = st.replace(/(<style name="AppTheme.NoActionBar"[^>]*>)/, `$1\n        <item name="android:windowBackground">#09090B</item>`);
    fs.writeFileSync(styles, st); log('sfondo scuro');
  }
}
