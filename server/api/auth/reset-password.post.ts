import {
  assertSameOrigin,
  consumeResetToken,
  requirePrototype,
  storePassword,
} from "../../utils/auth";
import { passwordIssue } from "~/utils/authValidation";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  requirePrototype(event);
  const body = await readBody<{ token?: string; password?: string }>(event);
  const token = String(body?.token || "");
  const password = String(body?.password || "");
  const issue = passwordIssue(password);
  if (issue) throw createError({ statusCode: 400, statusMessage: issue });
  if (!token)
    throw createError({
      statusCode: 400,
      statusMessage: "The reset link is missing.",
    });

  const account = consumeResetToken(token);
  if (!account || account.status !== "Active") {
    throw createError({
      statusCode: 400,
      statusMessage:
        "This reset link is invalid or expired. Request a new one.",
    });
  }
  storePassword(account.id, password);
  return { message: "Password updated in this development process." };
});
