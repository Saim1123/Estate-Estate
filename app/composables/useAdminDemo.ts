import {
  initialActivity,
  initialProperties,
  initialRoles,
  initialUsers,
  type DemoRole,
  type Permission,
} from "~/data/adminDemo";

export function useAdminDemo() {
  const properties = useState<any[]>("admin-properties", () =>
    structuredClone(initialProperties),
  );
  const users = useState<any[]>("admin-users", () =>
    structuredClone(initialUsers),
  );
  const activity = useState<any[]>("admin-activity", () =>
    structuredClone(initialActivity),
  );
  const roles = useState<Record<DemoRole, Permission[]>>("admin-roles", () =>
    structuredClone(initialRoles),
  );
  const activeRole = useState<DemoRole>(
    "admin-active-role",
    () => "System Administrator",
  );
  const profile = useState("admin-profile", () => ({
    name: "Amina Shah",
    email: "amina@estateandestate.pk",
    phone: "+92 300 123 4567",
  }));
  const preferences = useState("admin-preferences", () => ({
    currency: "PKR",
    timezone: "Asia/Karachi",
    emailUpdates: true,
  }));
  const permissions = computed(() => roles.value[activeRole.value] || []);
  const can = (permission: Permission) =>
    permissions.value.includes(permission);
  function log(action: string, record: string, kind = "Property") {
    activity.value.unshift({
      id: Date.now(),
      actor:
        users.value.find((user) => user.role === activeRole.value)?.name ||
        activeRole.value,
      action,
      record,
      kind,
      at: `Today, ${new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}`,
    });
  }
  function saveProperty(property: any) {
    const existing = properties.value.findIndex(
      (item) => item.id === property.id,
    );
    if (existing >= 0) {
      properties.value[existing] = {
        ...properties.value[existing],
        ...property,
        updated: new Date().toISOString().slice(0, 10),
      };
      log("updated", property.title);
    } else {
      const id = `EE-${String(Date.now()).slice(-4)}`;
      properties.value.unshift({
        ...property,
        id,
        updated: new Date().toISOString().slice(0, 10),
      });
      log("created", property.title);
    }
  }
  return {
    properties,
    users,
    activity,
    roles,
    activeRole,
    profile,
    preferences,
    permissions,
    can,
    log,
    saveProperty,
  };
}
