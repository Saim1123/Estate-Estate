import { randomBytes } from "node:crypto";
import {
  permissionKeys,
  type Account,
  type AccountRole,
  type Permission,
} from "~/types/access";
import {
  assertSameOrigin,
  requirePermission,
  safeAccount,
} from "../../../utils/auth";
import { audit, getPrototypeStore } from "../../../utils/demo-store";
import { isValidEmail } from "~/utils/authValidation";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  const actor = requirePermission(event, "users.create");
  const body = await readBody<{
    name?: string;
    email?: string;
    role?: AccountRole;
    permissions?: Permission[];
  }>(event);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "")
    .trim()
    .toLowerCase();
  const role = body?.role || "staff";
  if (name.length < 2 || name.length > 100 || !isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Enter a name and a valid email address.",
    });
  }
  if (!["staff", "property_manager"].includes(role)) {
    throw createError({
      statusCode: 403,
      statusMessage: "System administrator accounts are protected.",
    });
  }
  const store = getPrototypeStore();
  if (store.users.some((user) => user.email.toLowerCase() === email)) {
    throw createError({
      statusCode: 409,
      statusMessage: "An account already uses that email address.",
    });
  }
  const requested = Array.isArray(body.permissions) ? body.permissions : [];
  const permissions = normalizePermissions(requested, actor);
  const account: Account = {
    id: `U-${randomBytes(4).toString("hex").toUpperCase()}`,
    name,
    email,
    role: role as AccountRole,
    status: "Active",
    permissions,
    lastActive: "Never",
  };
  store.users.push(account);
  audit("created account for", account.name, actor);
  return { user: safeAccount(account) };
});

function normalizePermissions(
  value: Permission[],
  actor: Account,
): Permission[] {
  return [
    ...new Set(
      value.filter((permission): permission is Permission =>
        permissionKeys.includes(permission),
      ),
    ),
  ].filter((permission) => {
    if (
      permission === "users.manage_permissions" &&
      actor.role !== "system_admin"
    )
      return false;
    return (
      actor.role === "system_admin" || actor.permissions.includes(permission)
    );
  });
}
