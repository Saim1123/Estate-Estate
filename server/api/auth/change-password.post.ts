import {
  assertSameOrigin,
  requireAccount,
  requirePrototype,
  storePassword,
  verifyPassword,
} from "../../utils/auth";
import { getPrototypeStore } from "../../utils/demo-store";
import { passwordIssue } from "~/utils/authValidation";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  requirePrototype(event);
  const account = requireAccount(event);
  const body = await readBody<{
    currentPassword?: string;
    newPassword?: string;
  }>(event);
  const currentPassword = String(body?.currentPassword || "");
  const newPassword = String(body?.newPassword || "");
  const issue = passwordIssue(newPassword);
  if (issue) throw createError({ statusCode: 400, statusMessage: issue });
  const stored = getPrototypeStore().passwords.get(account.id);
  if (!stored) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Set an initial password through the development password-reset flow first.",
    });
  }
  if (!verifyPassword(currentPassword, stored)) {
    throw createError({
      statusCode: 400,
      statusMessage: "The current password is incorrect.",
    });
  }
  storePassword(account.id, newPassword);
  return { message: "Password updated for this development process." };
});
