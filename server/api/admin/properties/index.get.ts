import { requirePermission } from "../../../utils/auth";
import { getPrototypeStore } from "../../../utils/demo-store";

export default defineEventHandler((event) => {
  requirePermission(event, "properties.view");
  return { properties: getPrototypeStore().properties };
});
