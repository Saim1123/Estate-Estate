import { assertSameOrigin, requirePermission } from "../../utils/auth";
import { getPrototypeStore } from "../../utils/demo-store";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  requirePermission(event, "settings.manage");
  const body = await readBody<{
    profile?: { name?: string; email?: string; phone?: string };
    preferences?: {
      currency?: string;
      timezone?: string;
      emailUpdates?: boolean;
    };
  }>(event);
  const store = getPrototypeStore();
  if (body.profile) {
    const { name, email, phone } = body.profile;
    if (name !== undefined)
      store.profile.name = String(name).trim().slice(0, 100);
    if (email !== undefined) {
      const normalized = String(email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Enter a valid email address.",
        });
      }
      store.profile.email = normalized;
    }
    if (phone !== undefined)
      store.profile.phone = String(phone).trim().slice(0, 32);
  }
  if (body.preferences) {
    const { currency, timezone, emailUpdates } = body.preferences;
    if (currency && ["PKR", "USD"].includes(currency))
      store.preferences.currency = currency;
    if (timezone && ["Asia/Karachi", "UTC"].includes(timezone))
      store.preferences.timezone = timezone;
    if (typeof emailUpdates === "boolean")
      store.preferences.emailUpdates = emailUpdates;
  }
  return { profile: store.profile, preferences: store.preferences };
});
