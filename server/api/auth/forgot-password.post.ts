import {
  assertSameOrigin,
  createResetToken,
  requirePrototype,
} from "../../utils/auth";
import { getPrototypeStore } from "../../utils/demo-store";
import { isValidEmail } from "~/utils/authValidation";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  requirePrototype(event);
  const body = await readBody<{ email?: string }>(event);
  const email = String(body?.email || "")
    .trim()
    .toLowerCase();
  if (!isValidEmail(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Enter a valid email address.",
    });
  }

  const account = getPrototypeStore().users.find(
    (user) => user.email.toLowerCase() === email && user.status === "Active",
  );
  if (!account)
    return {
      message: "If the account exists, reset instructions are available.",
    };

  const token = createResetToken(account.id);
  const url = new URL("/reset-password", getRequestURL(event));
  url.searchParams.set("token", token);
  return {
    message: "Development prototype only: no email was sent.",
    developmentResetUrl: url.toString(),
  };
});
