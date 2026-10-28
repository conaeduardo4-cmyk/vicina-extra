// Account: è lo stesso di Vicina (stesso progetto Supabase). Chi ha già Vicina entra con la stessa email e password
// e ritrova nome, foto e banner. Chi non ce l'ha può crearlo qui. Senza account l'app funziona lo stesso.
import { createClient } from '@supabase/supabase-js';
import { SB_URL, SB_KEY } from './ai.js';

const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'vicina-extra-auth' } });

const MSG = {
  invalid_credentials: 'Email o password sbagliate.', user_already_exists: 'C’è già un account con questa email: accedi.', email_exists: 'C’è già un account con questa email: accedi.',
  weak_password: 'Password troppo debole: usa almeno 8 caratteri.', email_address_invalid: 'Controlla l’email.', validation_failed: 'Controlla email e password.',
  over_email_send_rate_limit: 'Troppi tentativi: riprova tra qualche minuto.', over_request_rate_limit: 'Troppi tentativi: riprova tra qualche minuto.',
  email_not_confirmed: 'Prima conferma l’email: ti abbiamo mandato un link.', otp_expired: 'Il codice è scaduto: chiedine un altro.', same_password: 'Scegli una password diversa dalla precedente.'
};
const err = e => {
  const m = String(e?.message || '');
  if (/fetch|network|Load failed/i.test(m)) return new Error('Non riesco a collegarmi: controlla la connessione.');
  if (/Invalid login/i.test(m)) return new Error(MSG.invalid_credentials);
  return new Error(MSG[e?.code] || m || 'Qualcosa non ha funzionato, riprova.');
};
const pub = (uid, tok) => `${SB_URL}/storage/v1/object/public/avatars/${uid}/${tok}.jpg`;
const token = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), b => 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 56]).join('');

export const acc = {
  user: null, p: null,
  onChange(cb) {
    let last;
    sb.auth.onAuthStateChange((_e, s) => {
      const u = s?.user ? { uid: s.user.id, email: s.user.email } : null;
      if ((u?.uid || null) === last) return; last = u?.uid || null;
      this.user = u; this.p = null;
      setTimeout(async () => { if (u) await this.load().catch(() => {}); cb(u); }, 0);
    });
  },
  async load() {
    if (!this.user) return null;
    const { data, error } = await sb.from('profiles').select('name,surname,bio,city,avatar,banner,gender').eq('id', this.user.uid).maybeSingle();
    if (error) throw err(error);
    const uid = this.user.uid;
    this.p = data ? { ...data, avatar: data.avatar ? pub(uid, data.avatar) : '', banner: data.banner ? pub(uid, data.banner) : '' } : null;
    return this.p;
  },
  async signIn(email, password) { const { error } = await sb.auth.signInWithPassword({ email, password }); if (error) throw err(error); },
  async signUp(email, password) { const { data, error } = await sb.auth.signUp({ email, password }); if (error) throw err(error); return { needsConfirm: !data.session }; },
  async reset(email) { const { error } = await sb.auth.resetPasswordForEmail(email); if (error) throw err(error); },
  async signOut() { const { error } = await sb.auth.signOut(); if (error) await sb.auth.signOut({ scope: 'local' }); },
  // profilo nuovo (chi crea l'account da qui): stessi campi obbligatori di Vicina
  async create(d) {
    const { error } = await sb.from('profiles').insert({ id: this.user.uid, name: d.name, surname: d.surname, dob: d.dob, gender: d.gender, phone: '' });
    if (error) throw err(error);
    await this.load();
  },
  async save(d) {
    const { error } = await sb.rpc('set_profile', { p_name: d.name, p_surname: d.surname, p_bio: d.bio || '', p_city: d.city || '', p_show_bday: !!d.showBday });
    if (error) throw err(error);
    await this.load();
  },
  // foto profilo e banner: stessa cartella e stesse funzioni di Vicina
  async photo(blob, kind) {
    const uid = this.user.uid, tok = (kind === 'banner' ? 'bn_' : '') + token();
    const up = await sb.storage.from('avatars').upload(`${uid}/${tok}.jpg`, blob, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false });
    if (up.error) throw err(up.error);
    const r = await sb.rpc(kind === 'banner' ? 'set_banner' : 'set_avatar', kind === 'banner' ? { p_banner: tok } : { p_avatar: tok });
    if (r.error) throw err(r.error);
    // toglie le immagini vecchie dello stesso tipo
    try {
      const { data } = await sb.storage.from('avatars').list(uid, { limit: 50 });
      const old = (data || []).filter(f => (kind === 'banner') === f.name.startsWith('bn_') && f.name !== tok + '.jpg').map(f => `${uid}/${f.name}`);
      if (old.length) await sb.storage.from('avatars').remove(old);
    } catch { /* non importa */ }
    await this.load();
  },
  async removePhoto(kind) {
    const r = await sb.rpc(kind === 'banner' ? 'set_banner' : 'set_avatar', kind === 'banner' ? { p_banner: null } : { p_avatar: null });
    if (r.error) throw err(r.error);
    await this.load();
  }
};

// ridimensiona una foto scelta dal telefono in JPEG
export function shrink(file, max) {
  return new Promise((ok, ko) => {
    const img = new Image(), u = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      c.toBlob(b => b ? ok(b) : ko(new Error('foto')), 'image/jpeg', 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(u); ko(new Error('Questa immagine non si apre.')); };
    img.src = u;
  });
}
