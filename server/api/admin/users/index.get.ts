import { requirePermission, safeAccount } from "../../../utils/auth";
import { getPrototypeStore } from "../../../utils/demo-store";

export default defineEventHandler((event) => {
  requirePermission(event, "users.view");
  return { users: getPrototypeStore().users.map(safeAccount) };
});
