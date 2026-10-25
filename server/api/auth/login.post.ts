import {
  assertSameOrigin,
  createSession,
  requirePrototype,
  safeAccount,
  verifyPassword,
} from "../../utils/auth";
import { getPrototypeStore } from "../../utils/demo-store";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  const config = requirePrototype(event);
  const body = await readBody<{
    email?: string;
    password?: string;
    remember?: boolean;
  }>(event);
  const email = String(body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(body?.password || "");
  if (!email || password.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Enter your email and password.",
    });
  }

  const store = getPrototypeStore();
  const account = store.users.find(
    (user) => user.email.toLowerCase() === email,
  );
  const passwordRecord = account ? store.passwords.get(account.id) : undefined;
  const passwordMatches = passwordRecord
    ? verifyPassword(password, passwordRecord)
    : verifyPassword(password, {
        salt: "estate-demo-invalid-account-salt",
        hash: "0".repeat(128),
      });
  if (
    !account ||
    !passwordRecord ||
    !passwordMatches ||
    account.status !== "Active"
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: "Email or password is incorrect.",
    });
  }

  createSession(event, account, Boolean(body.remember));
  account.lastActive = "Just now";
  return { user: safeAccount(account) };
});
