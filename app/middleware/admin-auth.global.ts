import { hasPermission, type Permission } from "~/types/access";

const routePermissions: Array<[RegExp, Permission]> = [
  [/^\/admin\/properties\/new\/?$/, "properties.create"],
  [/^\/admin\/properties\/[^/]+\/?$/, "properties.edit"],
  [/^\/admin\/properties\/?$/, "properties.view"],
  [/^\/admin\/users\/?$/, "users.view"],
  [/^\/admin\/roles\/?$/, "users.manage_permissions"],
  [/^\/admin\/activity\/?$/, "activity.view"],
];

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/admin")) return;

  const { user } = useAuthSession();
  try {
    const requestFetch = useRequestFetch();
    const result = await requestFetch<{ user: typeof user.value }>(
      "/api/auth/session",
    );
    user.value = result.user;
  } catch {
    user.value = null;
  }

  if (!user.value) {
    return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
  }

  const requirements = /^\/admin\/properties\/new\/?$/.test(to.path)
    ? (["properties.create"] as Permission[])
    : /^\/admin\/properties\/[^/]+\/?$/.test(to.path)
      ? (["properties.view", "properties.edit"] as Permission[])
      : routePermissions
          .filter(([pattern]) => pattern.test(to.path))
          .map(([, permission]) => permission);
  if (
    requirements.some((permission) => !hasPermission(user.value, permission))
  ) {
    return navigateTo({ path: "/admin", query: { denied: "1" } });
  }
});
