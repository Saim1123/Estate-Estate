const encoder = new TextEncoder();
const cookieName = 'ee_staff_session';
const SESSION_SECONDS = 60 * 60 * 8;
type Env = Record<string, string | undefined>;
const env = (): Env => (globalThis as typeof globalThis & { process?: { env?: Env } }).process?.env ?? {};
const toBase64Url = (value: Uint8Array) => btoa(String.fromCharCode(...value)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const fromBase64Url = (value: string) => Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4)), (c) => c.charCodeAt(0));

export function staffCredentialsConfigured() {
	const e = env();
	return Boolean(e.STAFF_EMAIL && e.STAFF_PASSWORD && e.SESSION_SECRET && e.SESSION_SECRET.length >= 32);
}

async function hmacKey() {
	const secret = env().SESSION_SECRET;
	if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must be configured with at least 32 characters.');
	return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function equal(a: string, b: string) {
	let diff = a.length ^ b.length;
	for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
	return diff === 0;
}

export async function checkStaffCredentials(email: string, password: string) {
	const e = env();
	if (!staffCredentialsConfigured()) return false;
	const emailMatches = equal(email.toLowerCase(), e.STAFF_EMAIL!.toLowerCase());
	const passwordMatches = equal(password, e.STAFF_PASSWORD!);
	return emailMatches && passwordMatches;
}

export async function createStaffCookie(secure: boolean) {
	const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
	const payload = toBase64Url(encoder.encode(`${env().STAFF_EMAIL!.toLowerCase()}:${expiry}`));
	const signature = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(payload)));
	return `${cookieName}=${payload}.${toBase64Url(signature)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure ? '; Secure' : ''}`;
}

export async function hasStaffSession(request: Request) {
	try {
		const raw = request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
		if (!raw) return false;
		const [payload, signature] = raw.split('.');
		if (!payload || !signature || !await crypto.subtle.verify('HMAC', await hmacKey(), fromBase64Url(signature), encoder.encode(payload))) return false;
		const [email, expiry] = new TextDecoder().decode(fromBase64Url(payload)).split(':');
		return email === env().STAFF_EMAIL?.toLowerCase() && Number(expiry) > Math.floor(Date.now() / 1000);
	} catch { return false; }
}

export const clearStaffCookie = (secure: boolean) => `${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? '; Secure' : ''}`;

export function secureCookie(request: Request, url: URL) {
	return url.protocol === 'https:' || request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() === 'https' || env().NODE_ENV === 'production';
}

export function isSameOrigin(request: Request, origin: string) {
	return request.headers.get('origin') === origin;
}
