import { requirePermission, safeAccount } from "../../../utils/auth";
import { getPrototypeStore } from "../../../utils/demo-store";

export default defineEventHandler((event) => {
  requirePermission(event, "users.view");
  const account = getPrototypeStore().users.find(
    (user) => user.id === getRouterParam(event, "id"),
  );
  if (!account)
    throw createError({ statusCode: 404, statusMessage: "Account not found." });
  return { user: safeAccount(account) };
});
