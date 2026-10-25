import {
  permissionKeys,
  type AccountRole,
  type AccountStatus,
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
  const actor = requirePermission(event, "users.manage_permissions");
  const store = getPrototypeStore();
  const account = store.users.find(
    (user) => user.id === getRouterParam(event, "id"),
  );
  if (!account)
    throw createError({ statusCode: 404, statusMessage: "Account not found." });
  if (account.role === "system_admin" && actor.id !== account.id) {
    throw createError({
      statusCode: 403,
      statusMessage: "The system administrator account is protected.",
    });
  }

  const body = await readBody<{
    name?: string;
    email?: string;
    role?: AccountRole;
    status?: AccountStatus;
    permissions?: Permission[];
  }>(event);
  const changesPermissions = Object.hasOwn(body || {}, "permissions");
  if (
    account.id === actor.id &&
    (changesPermissions || body.role || body.status === "Inactive")
  ) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "You cannot change your own role, permissions, or active status.",
    });
  }
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (name.length < 2 || name.length > 100)
      throw createError({
        statusCode: 400,
        statusMessage: "Enter a name between 2 and 100 characters.",
      });
    account.name = name;
  }
  if (body.email !== undefined) {
    if (account.role === "system_admin") {
      throw createError({
        statusCode: 403,
        statusMessage: "The system administrator email is protected.",
      });
    }
    const email = String(body.email).trim().toLowerCase();
    if (!isValidEmail(email))
      throw createError({
        statusCode: 400,
        statusMessage: "Enter a valid email address.",
      });
    if (
      store.users.some(
        (user) => user.id !== account.id && user.email.toLowerCase() === email,
      )
    ) {
      throw createError({
        statusCode: 409,
        statusMessage: "An account already uses that email address.",
      });
    }
    account.email = email;
  }
  if (body.role !== undefined) {
    if (!["staff", "property_manager"].includes(body.role))
      throw createError({
        statusCode: 403,
        statusMessage: "The system administrator role is protected.",
      });
    account.role = body.role;
  }
  if (body.status !== undefined) {
    if (!["Active", "Inactive"].includes(body.status))
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid account status.",
      });
    account.status = body.status;
  }
  if (changesPermissions) {
    if (!Array.isArray(body.permissions))
      throw createError({
        statusCode: 400,
        statusMessage: "Permissions must be a list.",
      });
    account.permissions = normalizePermissions(body.permissions, actor);
  }
  audit(
    changesPermissions ? "changed permissions for" : "updated account for",
    account.name,
    actor,
  );
  return { user: safeAccount(account) };
});

function normalizePermissions(
  value: Permission[],
  actor: ReturnType<typeof requirePermission>,
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
