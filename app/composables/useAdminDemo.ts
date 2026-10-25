import { initialRoles, type DemoRole, type Permission } from "~/data/adminDemo";
import {
  hasPermission,
  type Account,
  type PermissionCheck,
} from "~/types/access";
import { useAuthSession } from "~/composables/useAuthSession";

export function useAdminDemo() {
  const properties = useState<any[]>("admin-properties", () => []);
  const users = useState<Account[]>("admin-users", () => []);
  const activity = useState<any[]>("admin-activity", () => []);
  const roles = useState<Record<DemoRole, Permission[]>>("admin-roles", () =>
    structuredClone(initialRoles),
  );
  const { user: currentUser } = useAuthSession();
  const profile = useState("admin-profile", () => ({
    name: "Amina Shah",
    email: "saimtahir3211@gmail.com",
    phone: "+92 300 123 4567",
  }));
  const preferences = useState("admin-preferences", () => ({
    currency: "PKR",
    timezone: "Asia/Karachi",
    emailUpdates: true,
  }));
  const permissions = computed(() => currentUser.value?.permissions || []);
  const can = (permission: PermissionCheck) =>
    hasPermission(currentUser.value, permission);
  function log(action: string, record: string, kind = "Property") {
    activity.value.unshift({
      id: Date.now(),
      actor: currentUser.value?.name || "Unknown user",
      action,
      record,
      kind,
      at: `Today, ${new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}`,
    });
  }
  async function saveProperty(property: any) {
    const existing = properties.value.findIndex(
      (item) => item.id === property.id,
    );
    if (existing >= 0) {
      const result = await $fetch<{ property: any }>(
        `/api/admin/properties/${encodeURIComponent(property.id)}`,
        { method: "PATCH", body: property },
      );
      properties.value[existing] = result.property;
      log("updated", property.title);
      return result.property;
    } else {
      const result = await $fetch<{ property: any }>("/api/admin/properties", {
        method: "POST",
        body: property,
      });
      properties.value.unshift(result.property);
      log("created", property.title);
      return result.property;
    }
  }
  return {
    properties,
    users,
    activity,
    roles,
    currentUser,
    profile,
    preferences,
    permissions,
    can,
    log,
    saveProperty,
  };
}
