import { requirePermission } from "../../utils/auth";
import { getPrototypeStore } from "../../utils/demo-store";

export default defineEventHandler((event) => {
  requirePermission(event, "settings.manage");
  const store = getPrototypeStore();
  return { profile: store.profile, preferences: store.preferences };
});
