// Staff sign-in: one shared password (the STAFF_PASSWORD secret). A signed cookie keeps
// the kitchen tablet logged in for 12 hours. Changing the password signs everyone out.
const COOKIE = 'oakwell_staff';
export const SESSION_SECONDS = 12 * 60 * 60;
const enc = new TextEncoder();

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/** Compares two strings without leaking where they differ. */
export async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all([a, b].map((s) => crypto.subtle.digest('SHA-256', enc.encode(s))));
  const ax = new Uint8Array(x);
  const ay = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ax.length; i++) diff |= ax[i] ^ ay[i];
  return diff === 0;
}

export async function sessionCookie(secret: string, now = Date.now()) {
  const expires = Math.floor(now / 1000) + SESSION_SECONDS;
  const token = `${expires}.${await hmac(secret, `staff:${expires}`)}`;
  return `${COOKIE}=${token}; Path=/api/orders; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export const clearCookie = `${COOKIE}=; Path=/api/orders; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function isStaff(request: Request, secret: string | undefined, now = Date.now()) {
  if (!secret) return false;
  const match = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;
  const [expires, sig] = match[1].split('.');
  if (!expires || !sig || Number(expires) * 1000 < now) return false;
  return safeEqual(sig, await hmac(secret, `staff:${expires}`));
}
