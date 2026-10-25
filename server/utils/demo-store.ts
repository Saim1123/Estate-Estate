import { randomBytes, scryptSync } from "node:crypto";
import {
  initialActivity,
  initialProperties,
  initialUsers,
  type DemoRole,
} from "~/data/adminDemo";
import {
  defaultRolePermissions,
  type Account,
  type Permission,
} from "~/types/access";

export interface PasswordRecord {
  salt: string;
  hash: string;
}

export interface ResetRecord {
  userId: string;
  tokenHash: string;
  expiresAt: number;
}

export interface PrototypeStore {
  users: Account[];
  properties: Record<string, any>[];
  activity: Record<string, any>[];
  passwords: Map<string, PasswordRecord>;
  resetTokens: Map<string, ResetRecord>;
  profile: { name: string; email: string; phone: string };
  preferences: { currency: string; timezone: string; emailUpdates: boolean };
}

const stateKey = "estate-estate-prototype-store";
const globalState = globalThis as typeof globalThis & {
  [stateKey]?: PrototypeStore;
  __estatePrototypeAdminEmail?: string;
};

function toAccountRole(role: DemoRole): Account["role"] {
  if (role === "System Administrator") return "system_admin";
  if (role === "Property Manager") return "property_manager";
  return "staff";
}

function toPermissions(role: DemoRole): Permission[] {
  if (role === "System Administrator") return [];
  if (role === "Property Manager")
    return [...defaultRolePermissions.property_manager];
  return [...defaultRolePermissions.staff];
}

export function getPrototypeStore(): PrototypeStore {
  if (!globalState[stateKey]) {
    globalState[stateKey] = {
      users: structuredClone(initialUsers).map((user) => ({
        ...user,
        role: toAccountRole(user.role),
        status: user.status as Account["status"],
        permissions: toPermissions(user.role),
      })),
      properties: structuredClone(initialProperties),
      activity: structuredClone(initialActivity),
      passwords: new Map(),
      resetTokens: new Map(),
      profile: {
        name: "Amina Shah",
        email: "saimtahir3211@gmail.com",
        phone: "+92 300 123 4567",
      },
      preferences: {
        currency: "PKR",
        timezone: "Asia/Karachi",
        emailUpdates: true,
      },
    };
  }
  return globalState[stateKey]!;
}

export function seedPrototypeAdmin(email: string, password: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = getPrototypeStore().users.find(
    (user) =>
      user.role === "system_admin" &&
      user.email.toLowerCase() === normalizedEmail,
  );
  if (!admin) {
    throw createError({
      statusCode: 503,
      statusMessage:
        "The configured development administrator email must match a seeded system administrator account.",
    });
  }

  if (globalState.__estatePrototypeAdminEmail === normalizedEmail) return;
  getPrototypeStore().passwords.set(admin.id, hashPassword(password));
  globalState.__estatePrototypeAdminEmail = normalizedEmail;
}

export function hashPassword(password: string): PasswordRecord {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function audit(action: string, record: string, actor: Account): void {
  const store = getPrototypeStore();
  store.activity.unshift({
    id: randomBytes(8).toString("hex"),
    actor: actor.name,
    action,
    record,
    kind: action.includes("permission") ? "Permissions" : "Account",
    at: new Date().toLocaleString("en-PK", {
      timeZone: "Asia/Karachi",
      dateStyle: "medium",
      timeStyle: "short",
    }),
  });
}
