import { requirePermission } from "../../../utils/auth";
import { getPrototypeStore } from "../../../utils/demo-store";

export default defineEventHandler((event) => {
  requirePermission(event, "properties.view");
  const property = getPrototypeStore().properties.find(
    (item) => item.id === getRouterParam(event, "id"),
  );
  if (!property)
    throw createError({
      statusCode: 404,
      statusMessage: "Property not found.",
    });
  return { property };
});
