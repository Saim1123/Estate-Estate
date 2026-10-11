import type { APIRoute } from 'astro';
import { hasStaffSession } from '../../../lib/auth';

export const prerender = false;
const env = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export const POST: APIRoute = async ({ request }) => {
	if (!await hasStaffSession(request)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
	if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
		return new Response(JSON.stringify({ error: 'Cloudinary is not configured. Use an image URL or configure Cloudinary credentials.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
	}
	try {
		const incoming = await request.formData();
		const file = incoming.get('file');
		if (!(file instanceof File) || !file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
			return new Response(JSON.stringify({ error: 'Choose an image smaller than 10 MB.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}
		const timestamp = Math.floor(Date.now() / 1000).toString();
		const signatureInput = `timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
		const digest = new Uint8Array(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(signatureInput)));
		const signature = [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');
		const upload = new FormData();
		upload.set('file', file);
		upload.set('api_key', env.CLOUDINARY_API_KEY);
		upload.set('timestamp', timestamp);
		upload.set('signature', signature);
		const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)}/image/upload`, { method: 'POST', body: upload });
		if (!response.ok) return new Response(JSON.stringify({ error: 'The image could not be uploaded.' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
		const result = await response.json() as { secure_url?: string };
		if (!result.secure_url) throw new Error('Cloudinary did not return an image URL.');
		return new Response(JSON.stringify({ url: result.secure_url }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch {
		return new Response(JSON.stringify({ error: 'The image could not be uploaded.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
};
