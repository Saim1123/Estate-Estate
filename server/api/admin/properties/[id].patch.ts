import { assertSameOrigin, requirePermission } from "../../../utils/auth";
import { getPrototypeStore } from "../../../utils/demo-store";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  const actor = requirePermission(event, "properties.edit");
  const id = getRouterParam(event, "id");
  const property = getPrototypeStore().properties.find(
    (item) => item.id === id,
  );
  if (!property)
    throw createError({
      statusCode: 404,
      statusMessage: "Property not found.",
    });
  const body = await readBody<Record<string, unknown>>(event);
  if (
    body.status === "Published" &&
    property.status !== "Published" &&
    actor.role !== "system_admin" &&
    !actor.permissions.includes("properties.publish")
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: "You cannot publish properties.",
    });
  }
  Object.assign(property, filterProperty(body), {
    id,
    updated: new Date().toISOString().slice(0, 10),
  });
  return { property };
});

function filterProperty(value: Record<string, unknown>) {
  const keys = [
    "title",
    "city",
    "area",
    "address",
    "price",
    "type",
    "listing",
    "beds",
    "baths",
    "areaSize",
    "status",
    "image",
  ];
  return Object.fromEntries(
    keys.filter((key) => key in value).map((key) => [key, value[key]]),
  );
}
