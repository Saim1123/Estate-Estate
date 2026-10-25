import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { H3Event } from "h3";
import type { Account, Permission } from "~/types/access";
import {
  getPrototypeStore,
  seedPrototypeAdmin,
  type PasswordRecord,
} from "./demo-store";

const sessionCookie = "estate_demo_session";
const sessionLifetimeSeconds = 60 * 60 * 12;
const rememberLifetimeSeconds = 60 * 60 * 24 * 30;

interface SessionPayload {
  sub: string;
  exp: number;
}

export function prototypeConfig(event: H3Event) {
  const config = useRuntimeConfig(event);
  const secret = String(config.authSecret || "");
  const email = String(config.authDemoAdminEmail || "")
    .trim()
    .toLowerCase();
  const password = String(config.authDemoAdminPassword || "");
  const ready =
    process.env.NODE_ENV !== "production" &&
    config.authMode === "development-prototype" &&
    secret.length >= 32 &&
    email.length > 0 &&
    password.length >= 12;

  if (ready) seedPrototypeAdmin(email, password);
  return { ready, secret, email, password };
}

export function requirePrototype(event: H3Event) {
  const config = prototypeConfig(event);
  if (!config.ready) {
    throw createError({
      statusCode: 503,
      statusMessage:
        "Development prototype authentication is unavailable. Configure the local prototype environment to enable it.",
    });
  }
  return config;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function equalText(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function verifyPassword(
  password: string,
  record: PasswordRecord,
): boolean {
  const derived = scryptSync(password, record.salt, 64).toString("hex");
  return equalText(derived, record.hash);
}

function publicAccount(account: Account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    status: account.status,
    permissions: [...account.permissions],
    lastActive: account.lastActive,
  };
}

export function safeAccount(account: Account) {
  return publicAccount(account);
}

export function createSession(
  event: H3Event,
  account: Account,
  remember: boolean,
): void {
  const { secret } = requirePrototype(event);
  const ttl = remember ? rememberLifetimeSeconds : sessionLifetimeSeconds;
  const payload: SessionPayload = {
    sub: account.id,
    exp: Math.floor(Date.now() / 1000) + ttl,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const value = `${encoded}.${sign(encoded, secret)}`;
  setCookie(event, sessionCookie, value, {
    httpOnly: true,
    secure: getRequestURL(event).protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: ttl,
  });
}

export function clearDemoSession(event: H3Event): void {
  setCookie(event, sessionCookie, "", {
    httpOnly: true,
    secure: getRequestURL(event).protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export function currentAccount(event: H3Event): Account | null {
  const config = prototypeConfig(event);
  if (!config.ready) return null;
  const value = getCookie(event, sessionCookie);
  if (!value) return null;
  const [encoded, signature, extra] = value.split(".");
  if (!encoded || !signature || extra) return null;
  if (!equalText(signature, sign(encoded, config.secret))) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (!payload.sub || payload.exp <= Math.floor(Date.now() / 1000))
      return null;
    const account = getPrototypeStore().users.find(
      (user) => user.id === payload.sub && user.status === "Active",
    );
    return account || null;
  } catch {
    return null;
  }
}

export function requireAccount(event: H3Event): Account {
  requirePrototype(event);
  const account = currentAccount(event);
  if (!account) {
    throw createError({ statusCode: 401, statusMessage: "Sign in required." });
  }
  return account;
}

export function requirePermission(
  event: H3Event,
  permission: Permission,
): Account {
  const account = requireAccount(event);
  if (
    account.role !== "system_admin" &&
    !account.permissions.includes(permission)
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have permission to do that.",
    });
  }
  return account;
}

export function assertSameOrigin(event: H3Event): void {
  const origin = getRequestHeader(event, "origin");
  if (!origin || new URL(origin).origin !== getRequestURL(event).origin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Invalid request origin.",
    });
  }
}

export function createResetToken(userId: string): string {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  getPrototypeStore().resetTokens.set(userId, {
    userId,
    tokenHash,
    expiresAt: Date.now() + 20 * 60 * 1000,
  });
  return token;
}

export function consumeResetToken(token: string): Account | null {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const store = getPrototypeStore();
  for (const [userId, record] of store.resetTokens) {
    if (record.expiresAt <= Date.now()) {
      store.resetTokens.delete(userId);
      continue;
    }
    if (equalText(record.tokenHash, tokenHash)) {
      store.resetTokens.delete(userId);
      return store.users.find((user) => user.id === userId) || null;
    }
  }
  return null;
}

export function storePassword(userId: string, password: string): void {
  getPrototypeStore().passwords.set(userId, hashPassword(password));
}

function hashPassword(password: string): PasswordRecord {
  const salt = randomBytes(16).toString("hex");
  return { salt, hash: scryptSync(password, salt, 64).toString("hex") };
}
