import { assertSameOrigin, clearDemoSession } from "../../utils/auth";

export default defineEventHandler((event) => {
  assertSameOrigin(event);
  clearDemoSession(event);
  return { ok: true };
});
