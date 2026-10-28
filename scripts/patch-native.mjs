// Prepara il progetto Android dopo "npx cap add android": permessi, tutto schermo, testo al 100%, sfondo scuro.
// Si può rilanciare senza danni.
import fs from 'fs';

const read = p => fs.readFileSync(p, 'utf8');
const log = m => console.log('  ✓ ' + m);

const man = 'android/app/src/main/AndroidManifest.xml';
if (fs.existsSync(man)) {
  console.log('Android');
  let s = read(man);
  for (const p of ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'INTERNET'])
    if (!s.includes(`android.permission.${p}"`)) s = s.replace('</manifest>', `    <uses-permission android:name="android.permission.${p}" />\n</manifest>`);
  if (!s.includes('"android.hardware.location.gps"')) s = s.replace('</manifest>', '    <uses-feature android:name="android.hardware.location.gps" android:required="false" />\n</manifest>');
  // tel:, geo: e mappe: servono per aprire telefono e navigatore da Android 11 in su
  if (!s.includes('<queries>')) s = s.replace('</manifest>', `    <queries>
        <intent><action android:name="android.intent.action.DIAL" /></intent>
        <intent><action android:name="android.intent.action.VIEW" /><data android:scheme="geo" /></intent>
        <intent><action android:name="android.intent.action.VIEW" /><data android:scheme="https" /></intent>
    </queries>\n</manifest>`);
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
    fs.writeFileSync(mainAct, m);
    log(m.includes('EdgeToEdge.apply') ? 'tutto schermo e testo al 100%' : 'ATTENZIONE: MainActivity non modificata');
  }

  const styles = 'android/app/src/main/res/values/styles.xml';
  if (fs.existsSync(styles)) {
    let st = read(styles);
    if (!st.includes('android:windowBackground">#09090B'))
      st = st.replace(/(<style name="AppTheme.NoActionBar"[^>]*>)/, `$1\n        <item name="android:windowBackground">#09090B</item>`);
    fs.writeFileSync(styles, st); log('sfondo scuro');
  }
}
