const env = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

export const businessDetails = {
	email: env.BUSINESS_EMAIL?.trim() || '',
	phone: env.BUSINESS_PHONE?.trim() || '',
	address: env.BUSINESS_ADDRESS?.trim() || '',
	serviceArea: env.BUSINESS_SERVICE_AREA?.trim() || '',
};
