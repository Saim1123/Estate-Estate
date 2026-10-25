import { randomBytes } from "node:crypto";
import { assertSameOrigin, requirePermission } from "../../../utils/auth";
import { getPrototypeStore } from "../../../utils/demo-store";

export default defineEventHandler(async (event) => {
  assertSameOrigin(event);
  const actor = requirePermission(event, "properties.create");
  const body = await readBody<Record<string, unknown>>(event);
  const title = String(body?.title || "").trim();
  if (!title)
    throw createError({
      statusCode: 400,
      statusMessage: "A property title is required.",
    });
  if (
    body.status === "Published" &&
    actor.role !== "system_admin" &&
    !actor.permissions.includes("properties.publish")
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: "You cannot publish properties.",
    });
  }
  const property = {
    ...filterProperty(body),
    id: `EE-${randomBytes(3).toString("hex").toUpperCase()}`,
    title,
    updated: new Date().toISOString().slice(0, 10),
  };
  getPrototypeStore().properties.unshift(property);
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
