export const permissionKeys = [
  "users.view",
  "users.create",
  "users.manage_permissions",
  "properties.view",
  "properties.create",
  "properties.edit",
  "properties.delete",
  "properties.publish",
  "activity.view",
  "settings.manage",
] as const;

export type Permission = (typeof permissionKeys)[number];
export type AccountRole = "system_admin" | "property_manager" | "staff";
export type AccountStatus = "Active" | "Inactive";

export interface Account {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  permissions: Permission[];
  lastActive: string;
}

export type PublicAccount = Omit<Account, "email"> & { email: string };

export const permissionLabels: Record<Permission, string> = {
  "users.view": "View users",
  "users.create": "Create users",
  "users.manage_permissions": "Manage users and permissions",
  "properties.view": "View properties",
  "properties.create": "Create properties",
  "properties.edit": "Edit properties",
  "properties.delete": "Delete properties",
  "properties.publish": "Publish properties",
  "activity.view": "View activity log",
  "settings.manage": "Manage settings",
};

export type PermissionCheck =
  | Permission
  | "viewProperties"
  | "createProperties"
  | "editProperties"
  | "deleteProperties"
  | "publishProperties"
  | "viewUsers"
  | "createAccounts"
  | "editAccounts"
  | "deactivateAccounts"
  | "manageRoles"
  | "viewActivity"
  | "manageSettings";

const legacyPermissionMap: Record<
  Exclude<PermissionCheck, Permission>,
  Permission
> = {
  viewProperties: "properties.view",
  createProperties: "properties.create",
  editProperties: "properties.edit",
  deleteProperties: "properties.delete",
  publishProperties: "properties.publish",
  viewUsers: "users.view",
  createAccounts: "users.create",
  editAccounts: "users.manage_permissions",
  deactivateAccounts: "users.manage_permissions",
  manageRoles: "users.manage_permissions",
  viewActivity: "activity.view",
  manageSettings: "settings.manage",
};

export function canonicalPermission(permission: PermissionCheck): Permission {
  return permission in legacyPermissionMap
    ? legacyPermissionMap[permission as keyof typeof legacyPermissionMap]
    : (permission as Permission);
}

export function hasPermission(
  account: Pick<Account, "role" | "permissions"> | null | undefined,
  permission: PermissionCheck,
): boolean {
  if (!account) return false;
  return (
    account.role === "system_admin" ||
    account.permissions.includes(canonicalPermission(permission))
  );
}

export const defaultRolePermissions: Record<
  Exclude<AccountRole, "system_admin">,
  Permission[]
> = {
  property_manager: [
    "properties.view",
    "properties.create",
    "properties.edit",
    "properties.publish",
    "activity.view",
  ],
  staff: ["properties.view", "users.view"],
};
