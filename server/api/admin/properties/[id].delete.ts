import { assertSameOrigin, requirePermission } from "../../../utils/auth";
import { getPrototypeStore } from "../../../utils/demo-store";

export default defineEventHandler((event) => {
  assertSameOrigin(event);
  requirePermission(event, "properties.delete");
  const store = getPrototypeStore();
  const index = store.properties.findIndex(
    (item) => item.id === getRouterParam(event, "id"),
  );
  if (index < 0)
    throw createError({
      statusCode: 404,
      statusMessage: "Property not found.",
    });
  store.properties.splice(index, 1);
  return { ok: true };
});
