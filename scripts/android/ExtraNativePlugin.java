package __PACKAGE__;

// Funzioni native di Vicina Extra:
// - insets: altezza della barra di stato e della barra di navigazione (per non mettere tasti sotto le barre)
// - installed / openApp: c'è Vicina? Aprila passandole un link (l'intent va solo a Vicina)
// - print: stampa un documento (lettera o guida) con la finestra di stampa di Android, anche «Salva come PDF»
// - speak / stopSpeak: lettura ad alta voce con la voce del telefono (nel WebView di Android quella del browser non c'è)
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "ExtraNative")
public class ExtraNativePlugin extends Plugin {
    private WebView printView; // tenuta in vita finché la stampa è aperta
    private TextToSpeech tts;
    private boolean ttsReady;

    // legge un testo ad alta voce; quando ha finito avvisa la pagina con l'evento «speakEnd»
    @PluginMethod
    public void speak(final PluginCall call) {
        final String text = call.getString("text", "");
        if (text == null || text.length() == 0) { call.reject("Niente da leggere"); return; }
        getActivity().runOnUiThread(() -> {
            try {
                if (tts != null && ttsReady) { say(text); call.resolve(); return; }
                tts = new TextToSpeech(getContext().getApplicationContext(), status -> {
                    if (status != TextToSpeech.SUCCESS || tts == null) { tts = null; ttsReady = false; call.reject("Lettura non disponibile su questo telefono"); return; }
                    ttsReady = true;
                    try { tts.setLanguage(java.util.Locale.ITALIAN); } catch (Exception ignored) { }
                    tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                        @Override public void onStart(String id) { }
                        @Override public void onDone(String id) { if ("vx-last".equals(id)) notifyListeners("speakEnd", new JSObject()); }
                        @Override public void onError(String id) { notifyListeners("speakEnd", new JSObject()); }
                    });
                    try { say(text); call.resolve(); } catch (Exception e) { call.reject("Lettura non disponibile: " + e.getMessage()); }
                });
            } catch (Exception e) { call.reject("Lettura non disponibile: " + e.getMessage()); }
        });
    }

    // il motore vocale accetta testi fino a qualche migliaio di caratteri: i testi lunghi vanno a pezzi, tagliati sul punto
    private void say(String text) {
        int max = Math.max(500, TextToSpeech.getMaxSpeechInputLength() - 200);
        int i = 0, n = text.length();
        boolean first = true;
        while (i < n) {
            int end = Math.min(n, i + max);
            if (end < n) { int cut = text.lastIndexOf('.', end); if (cut > i + 200) end = cut + 1; }
            tts.speak(text.substring(i, end), first ? TextToSpeech.QUEUE_FLUSH : TextToSpeech.QUEUE_ADD, null, end >= n ? "vx-last" : "vx-part");
            first = false; i = end;
        }
    }

    @PluginMethod
    public void stopSpeak(PluginCall call) {
        try { if (tts != null) tts.stop(); } catch (Exception ignored) { }
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        try { if (tts != null) { tts.stop(); tts.shutdown(); } } catch (Exception ignored) { }
        tts = null; ttsReady = false;
    }

    @PluginMethod
    public void insets(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            JSObject r = new JSObject();
            int t = 0, b = 0;
            try {
                android.content.res.Resources res = getContext().getResources();
                float d = res.getDisplayMetrics().density;
                android.view.View root = getActivity().getWindow().getDecorView();
                androidx.core.view.WindowInsetsCompat ins = androidx.core.view.ViewCompat.getRootWindowInsets(root);
                if (ins != null) {
                    androidx.core.graphics.Insets s = ins.getInsets(androidx.core.view.WindowInsetsCompat.Type.systemBars() | androidx.core.view.WindowInsetsCompat.Type.displayCutout());
                    androidx.core.graphics.Insets ime = ins.getInsets(androidx.core.view.WindowInsetsCompat.Type.ime());
                    t = Math.round(s.top / d);
                    b = ime.bottom > s.bottom ? 0 : Math.round(s.bottom / d);
                }
                if (t == 0) { int id = res.getIdentifier("status_bar_height", "dimen", "android"); if (id > 0) t = Math.round(res.getDimensionPixelSize(id) / d); }
                if (ins == null) { int id = res.getIdentifier("navigation_bar_height", "dimen", "android"); if (id > 0) b = Math.round(res.getDimensionPixelSize(id) / d); }
            } catch (Exception ignored) { }
            r.put("top", t); r.put("bottom", b);
            call.resolve(r);
        });
    }

    private boolean has(String pkg) {
        PackageManager pm = getContext().getPackageManager();
        try { pm.getPackageInfo(pkg, 0); return true; } catch (Exception e) { /* sotto */ }
        try { return pm.getLaunchIntentForPackage(pkg) != null; } catch (Exception e) { return false; }
    }

    @PluginMethod
    public void installed(PluginCall call) {
        String pkg = call.getString("pkg", "");
        JSObject r = new JSObject();
        r.put("value", pkg.length() > 0 && has(pkg));
        call.resolve(r);
    }

    // apre l'app indicata: con un link (vicina://…) se c'è, altrimenti la sua schermata principale
    @PluginMethod
    public void openApp(PluginCall call) {
        String pkg = call.getString("pkg", ""), url = call.getString("url", "");
        Context ctx = getContext();
        try {
            Intent i;
            if (url.length() > 0) { i = new Intent(Intent.ACTION_VIEW, Uri.parse(url)); i.setPackage(pkg); }
            else i = ctx.getPackageManager().getLaunchIntentForPackage(pkg);
            if (i == null) { call.reject("App non installata"); return; }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { ctx.startActivity(i); }
            catch (Exception e) {
                Intent l = ctx.getPackageManager().getLaunchIntentForPackage(pkg);
                if (l == null) throw e;
                l.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); ctx.startActivity(l);
            }
            call.resolve();
        } catch (Exception e) { call.reject("Non riesco ad aprire l'app: " + e.getMessage()); }
    }

    @PluginMethod
    public void print(PluginCall call) {
        final String html = call.getString("html", ""), title = call.getString("title", "Documento");
        getActivity().runOnUiThread(() -> {
            try {
                WebView w = new WebView(getActivity());
                printView = w;
                w.setWebViewClient(new WebViewClient() {
                    @Override public void onPageFinished(WebView v, String u) {
                        PrintManager pm = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
                        PrintDocumentAdapter a = v.createPrintDocumentAdapter(title);
                        pm.print(title, a, new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
                        call.resolve();
                    }
                });
                w.loadDataWithBaseURL(null, html, "text/html", "utf-8", null);
            } catch (Exception e) { call.reject("Stampa non disponibile: " + e.getMessage()); }
        });
    }
}
