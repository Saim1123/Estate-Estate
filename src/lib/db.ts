import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const databaseUrl = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.DATABASE_URL;

export function getDb() {
	if (!databaseUrl) throw new Error('DATABASE_URL is not configured.');
	return drizzle(neon(databaseUrl), { schema });
}
