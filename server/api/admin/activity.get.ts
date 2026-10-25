import { requirePermission } from "../../utils/auth";
import { getPrototypeStore } from "../../utils/demo-store";

export default defineEventHandler((event) => {
  requirePermission(event, "activity.view");
  return { activity: getPrototypeStore().activity };
});
