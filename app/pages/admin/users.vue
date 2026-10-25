<script setup lang="ts">
import {
  defaultRolePermissions,
  permissionKeys,
  permissionLabels,
  type Account,
  type AccountRole,
  type AccountStatus,
  type Permission,
} from "~/types/access";
definePageMeta({ layout: "admin" });
const { users, can, currentUser } = useAdminDemo();
const query = ref("");
const statusFilter = ref("All accounts");
const roleFilter = ref("All roles");
const modal = ref(false);
const selected = ref<Account | null>(null);
const toast = ref("");
const formError = ref("");
const isSaving = ref(false);
const form = reactive({
  name: "",
  email: "",
  role: "staff" as AccountRole,
  permissions: [] as Permission[],
});
const filtered = computed(() =>
  users.value.filter(
    (user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(query.value.toLowerCase()) &&
      (statusFilter.value === "All accounts" ||
        user.status === statusFilter.value) &&
      (roleFilter.value === "All roles" ||
        roleLabel(user.role) === roleFilter.value),
  ),
);
const mayManage = computed(() => can("users.manage_permissions"));
function roleLabel(role: AccountRole) {
  return role === "system_admin"
    ? "System Administrator"
    : role === "property_manager"
      ? "Property Manager"
      : "Staff";
}
function canEditPermissions(permission: Permission) {
  const manager = currentUser.value;
  return Boolean(
    mayManage.value &&
    manager &&
    selected.value?.role !== "system_admin" &&
    selected.value?.id !== manager.id &&
    (manager.role === "system_admin" ||
      (permission !== "users.manage_permissions" &&
        manager.permissions.includes(permission))),
  );
}
function setPermission(permission: Permission, checked: boolean) {
  form.permissions = checked
    ? [...new Set([...form.permissions, permission])]
    : form.permissions.filter((value) => value !== permission);
}
function openCreate() {
  if (!can("users.create")) return;
  selected.value = null;
  Object.assign(form, {
    name: "",
    email: "",
    role: "staff",
    permissions: mayManage.value ? [...defaultRolePermissions.staff] : [],
  });
  formError.value = "";
  modal.value = true;
}
function openEdit(user: Account) {
  if (!mayManage.value) return;
  selected.value = user;
  Object.assign(form, {
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: [...user.permissions],
  });
  formError.value = "";
  modal.value = true;
}
async function saveUser() {
  formError.value = "";
  if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    formError.value = "Enter a name and a valid email address.";
    return;
  }
  if (isSaving.value) return;
  isSaving.value = true;
  try {
    const body = {
      name: form.name.trim(),
      email: form.email.trim(),
      ...(selected.value?.role === "system_admin" ? {} : { role: form.role }),
      ...(mayManage.value &&
      selected.value?.role !== "system_admin" &&
      selected.value?.id !== currentUser.value?.id
        ? { permissions: form.permissions }
        : {}),
    };
    const result = selected.value
      ? await $fetch<{ user: Account }>(
          `/api/admin/users/${encodeURIComponent(selected.value.id)}`,
          { method: "PATCH", body },
        )
      : await $fetch<{ user: Account }>("/api/admin/users", {
          method: "POST",
          body: {
            ...body,
            role: mayManage.value ? form.role : "staff",
            permissions: mayManage.value ? form.permissions : [],
          },
        });
    if (selected.value) {
      const index = users.value.findIndex((user) => user.id === result.user.id);
      if (index >= 0) users.value[index] = result.user;
    } else {
      users.value.push(result.user);
    }
    modal.value = false;
    toast.value = selected.value
      ? "Account details saved."
      : "Account created.";
    setTimeout(() => (toast.value = ""), 3000);
  } catch (error: any) {
    formError.value =
      error?.data?.statusMessage || "The account could not be saved.";
  } finally {
    isSaving.value = false;
  }
}
async function toggle(user: Account) {
  if (
    !mayManage.value ||
    user.role === "system_admin" ||
    user.id === currentUser.value?.id
  )
    return;
  try {
    const status: AccountStatus =
      user.status === "Active" ? "Inactive" : "Active";
    const result = await $fetch<{ user: Account }>(
      `/api/admin/users/${encodeURIComponent(user.id)}`,
      {
        method: "PATCH",
        body: { status },
      },
    );
    Object.assign(user, result.user);
    toast.value = `Account ${status.toLowerCase()}.`;
    setTimeout(() => (toast.value = ""), 3000);
  } catch (error: any) {
    toast.value =
      error?.data?.statusMessage || "Account status could not be changed.";
  }
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="YOUR TEAM"
      title="Users & accounts"
      description="Manage team accounts and configure each teammate’s individual access."
      :action-label="can('users.create') ? 'Create account' : undefined"
      :action-to="undefined"
    />
    <UButton variant="ghost"
      v-if="can('users.create')"
      class="users-create-float"
      @click="openCreate"
    >
      ＋ Create account
    </UButton>
    <div v-if="!can('viewUsers')" class="permission-notice">
      You do not have permission to view accounts.
    </div>
    <template v-else>
      <div class="users-summary">
        <div>
          <strong>{{ users.length }}</strong
          ><span>team members</span>
        </div>
        <div>
          <strong>{{
            users.filter((u) => u.status === "Active").length
          }}</strong
          ><span>active accounts</span>
        </div>
        <div>
          <strong>{{
            users.filter((u) => u.status === "Inactive").length
          }}</strong
          ><span>inactive</span>
        </div>
        <p>TEAM ACCESS <i>✳</i></p>
      </div>
      <section class="users-panel">
        <div class="users-toolbar">
          <div>
            <h2>All accounts</h2>
            <p>Manage access across your team.</p>
          </div>
          <div class="users-filters">
            <label class="search-field"
              ><span>⌕</span
              ><UInput class="admin-ui-input"
                v-model="query"
                placeholder="Search by name or email…"
                size="sm"
              /></label
            ><USelect class="admin-ui-select"
              v-model="roleFilter"
              :items="['All roles', 'System Administrator', 'Property Manager', 'Staff']"
              size="sm"
            /><USelect class="admin-ui-select"
              v-model="statusFilter"
              :items="['All accounts', 'Active', 'Inactive']"
              size="sm"
            />
          </div>
        </div>
        <div class="table-overflow">
          <table class="users-table">
            <thead>
              <tr>
                <th>TEAM MEMBER</th>
                <th>ROLE</th>
                <th>ASSIGNED PERMISSIONS</th>
                <th>STATUS</th>
                <th>LAST ACTIVE</th>
                <th>ACCOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filtered" :key="user.id">
                <td>
                  <div class="member-cell">
                    <span class="member-avatar">{{
                      user.name
                        .split(" ")
                        .map((v: string) => v[0])
                        .join("")
                    }}</span>
                    <div>
                      <b>{{ user.name }}</b
                      ><small>{{ user.email }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="role-tag">{{ roleLabel(user.role) }}</span>
                </td>
                <td>
                  <div class="permission-chips">
                    <span
                      v-if="user.role === 'system_admin'"
                      class="permission-chip protected-chip"
                      >All permissions · Protected</span
                    >
                    <span
                      v-else-if="user.permissions.length === 0"
                      class="permission-chip"
                      >No permissions</span
                    >
                    <span
                      v-for="permission in user.permissions"
                      :key="permission"
                      class="permission-chip"
                      >{{ permissionLabels[permission] }}</span
                    >
                  </div>
                </td>
                <td>
                  <span
                    class="account-status"
                    :class="user.status.toLowerCase()"
                    ><i />{{ user.status }}</span
                  >
                </td>
                <td class="last-active">{{ user.lastActive }}</td>
                <td>
                  <div class="account-actions">
                    <UButton variant="ghost" v-if="mayManage" @click="openEdit(user)">
                      Edit</UButton
                    ><UButton variant="ghost"
                      v-if="
                        mayManage &&
                        user.role !== 'system_admin' &&
                        user.id !== currentUser?.id
                      "
                      @click="toggle(user)"
                    >
                      {{
                        user.status === "Active" ? "Deactivate" : "Activate"
                      }}</UButton
                    ><span v-if="!mayManage" class="read-only-tag"
                      >Read only</span
                    >
                    <span
                      v-if="
                        mayManage &&
                        (user.role === 'system_admin' ||
                          user.id === currentUser?.id)
                      "
                      class="read-only-tag"
                      >Protected</span
                    >
                  </div>
                </td>
              </tr>
              <tr v-if="!filtered.length">
                <td colspan="6">
                  <div class="empty-table">
                    <span>♙</span><b>No accounts found</b>
                    <p>Try another name or change the filters.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="users-table-foot">
          Showing <b>{{ filtered.length }}</b> of
          <b>{{ users.length }}</b> accounts
          <span
            >Permissions are assigned individually. System administrator access
            is protected.</span
          >
        </div>
      </section>
      <div class="demo-disclaimer">
        ⓘ <span>Development prototype</span> — User records and permissions are
        checked by the server and stored in process memory only.
      </div>
      <div v-if="toast" class="admin-toast">✓ {{ toast }}</div>
    </template>
    <div v-if="modal" class="modal-backdrop" @click.self="modal = false">
      <form class="account-modal" @submit.prevent="saveUser">
        <UButton variant="ghost"
          type="button"
          class="modal-close"
          aria-label="Close"
          @click="modal = false"
        >
          ×</UButton
        ><span class="panel-eyebrow">TEAM ACCESS</span>
        <h2>{{ selected ? "Edit account" : "Create an account" }}</h2>
        <p>
          Choose a baseline role and assign this account’s individual
          permissions.
        </p>
        <label class="field"
          ><span>Full name</span
          ><UInput class="admin-ui-input"
            v-model="form.name"
            required
            placeholder="e.g. Sara Malik"
            size="sm"
          /></label
        ><label class="field"
          ><span>Email address</span
          ><UInput class="admin-ui-input"
            v-model="form.email"
            required
            :disabled="selected?.role === 'system_admin'"
            type="email"
            placeholder="name@estateandestate.pk"
            size="sm"
          /></label
        ><label class="field"
          ><span>Role</span
          ><USelect class="admin-ui-select"
            v-model="form.role"
            :items="[
              { label: 'Staff', value: 'staff' },
              { label: 'Property Manager', value: 'property_manager' },
            ]"
            :disabled="
              selected?.role === 'system_admin' ||
              selected?.id === currentUser?.id
            "
            size="sm"
          /></label
        >
        <p
          v-if="selected?.role === 'system_admin'"
          class="account-protected-note"
        >
          System administrator privileges are protected and cannot be edited
          here.
        </p>
        <fieldset
          class="permission-editor"
          :disabled="
            !mayManage ||
            selected?.role === 'system_admin' ||
            selected?.id === currentUser?.id
          "
        >
          <legend>Individual permissions</legend>
          <div
            v-for="permission in permissionKeys"
            :key="permission"
            class="permission-editor-row"
          >
            <UCheckbox
              :model-value="form.permissions.includes(permission)"
              :value="permission"
              :disabled="!canEditPermissions(permission)"
              :aria-label="permissionLabels[permission]"
              size="sm"
              @update:model-value="setPermission(permission, $event)"
            />
            <span>{{ permissionLabels[permission] }}</span>
            <small>{{ permission }}</small>
          </div>
        </fieldset>
        <AuthMessage v-if="formError" kind="error" :text="formError" />
        <div class="account-modal-actions">
          <UButton variant="ghost" type="button" class="admin-button" @click="modal = false">
            Cancel</UButton
          ><UButton variant="ghost"
            type="submit"
            class="admin-button primary"
            :disabled="isSaving"
            :aria-busy="isSaving"
          >
            {{
              isSaving
                ? "Saving…"
                : selected
                  ? "Save changes"
                  : "Create account"
            }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>
<style>
.users-create-float {
  float: right;
  margin-top: -72px;
  margin-right: 0;
  position: relative;
  z-index: 1;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #39483b;
  border-radius: 3px;
  background: #39483b;
  color: white;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
}
.users-summary {
  display: flex;
  align-items: center;
  gap: 35px;
  padding: 15px 18px;
  background: #efede7;
  margin-bottom: 14px;
  clear: both;
}
.users-summary > div {
  display: grid;
  gap: 3px;
}
.users-summary strong {
  font: 18px var(--serif, Georgia, serif);
  font-weight: 400;
}
.users-summary span {
  font-size: 9px;
  color: #8b8c84;
}
.users-summary p {
  margin: 0 0 0 auto;
  color: #aaa295;
  font-size: 8px;
  letter-spacing: 1.5px;
}
.users-summary p i {
  font-style: normal;
  color: #ac8c65;
  font-size: 16px;
  margin-left: 8px;
}
.users-panel {
  background: #fff;
  border: 1px solid #e9e6df;
}
.users-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 16px 18px;
  border-bottom: 1px solid #efede7;
}
.users-toolbar h2 {
  font: 400 16px var(--serif, Georgia, serif);
  margin: 0 0 4px;
}
.users-toolbar p {
  margin: 0;
  color: #9a9a92;
  font-size: 9px;
}
.users-filters {
  display: flex;
  gap: 7px;
}
.users-filters .search-field {
  height: 32px;
}
.users-filters .search-field input {
  width: 165px;
}
.users-filters select {
  height: 32px;
  border: 1px solid #e9e6df;
  background: white;
  padding: 0 24px 0 8px;
  font-size: 9px;
  color: #686961;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}
.users-table th {
  text-align: left;
  padding: 11px 14px;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #a2a198;
  font-weight: 600;
  background: #fbfaf8;
}
.users-table td {
  padding: 12px 14px;
  border-top: 1px solid #f0eee9;
  font-size: 9px;
}
.member-cell {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 220px;
}
.member-avatar {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f0eee8;
  color: #826d50;
  font: 12px var(--serif, Georgia, serif);
}
.member-cell div {
  display: grid;
  gap: 4px;
}
.member-cell b {
  font-size: 9px;
  font-weight: 600;
}
.member-cell small {
  font-size: 8px;
  color: #999a92;
}
.role-tag {
  font-size: 8px;
  color: #726755;
  background: #f5f2ec;
  padding: 5px 7px;
  border-radius: 2px;
}
.permission-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 280px;
  white-space: normal;
}
.permission-chip {
  display: inline-flex;
  padding: 4px 6px;
  border: 1px solid #eeeae2;
  color: #7c796f;
  background: #fbfaf8;
  font-size: 8px;
  line-height: 1.25;
}
.permission-chip.protected-chip {
  color: #70634d;
  background: #f2eee7;
}
.account-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  color: #65815d;
}
.account-status i {
  width: 5px;
  height: 5px;
  background: #8ca27f;
  border-radius: 50%;
}
.account-status.inactive {
  color: #a19b8f;
}
.account-status.inactive i {
  background: #c4b9a8;
}
.last-active {
  color: #888980;
}
.account-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.account-actions button {
  border: 0;
  background: none;
  padding: 3px 0;
  color: #81745e;
  font-size: 9px;
  cursor: pointer;
}
.account-actions button:hover {
  text-decoration: underline;
}
.account-actions button + button {
  color: #a2675d;
}
.read-only-tag {
  font-size: 8px;
  color: #a3a198;
}
.users-table-foot {
  display: flex;
  justify-content: space-between;
  padding: 12px 17px;
  border-top: 1px solid #efede7;
  color: #999a92;
  font-size: 9px;
}
.users-table-foot b {
  color: #575951;
  margin: 0 2px;
}
.users-table-foot span {
  color: #aaa99f;
}
.account-modal {
  position: relative;
  width: min(100%, 430px);
  background: white;
  padding: 29px;
  box-shadow: 0 12px 45px #0002;
  display: grid;
  gap: 14px;
}
.account-modal h2 {
  font: 23px var(--serif, Georgia, serif);
  margin: -7px 0 -10px;
}
.account-modal > p {
  font-size: 10px;
  color: #92938b;
  margin: 0 0 3px;
}
.account-modal .field {
  gap: 6px;
}
.account-modal .field input,
.account-modal .field select {
  height: 40px;
}
.account-modal .field select:disabled {
  color: #8c8a82;
  background: #f7f6f2;
}
.permission-editor {
  max-height: 225px;
  overflow: auto;
  margin: 1px 0 0;
  padding: 8px 10px;
  border: 1px solid #e9e6df;
}
.permission-editor legend {
  padding: 0 5px;
  color: #77786f;
  font-size: 9px;
  font-weight: 700;
}
.permission-editor-row {
  display: grid;
  grid-template-columns: 14px 1fr auto;
  align-items: center;
  gap: 7px;
  padding: 6px 1px;
  border-bottom: 1px solid #f1efe9;
  color: #5f6059;
  font-size: 9px;
}
.permission-editor-row:last-child {
  border-bottom: 0;
}
.permission-editor-row input {
  accent-color: #39483b;
}
.permission-editor-row input:disabled {
  cursor: not-allowed;
}
.permission-editor-row small {
  color: #a09f97;
  font-size: 8px;
}
.account-protected-note {
  margin: 0;
  padding: 9px 10px;
  background: #f6f3ec;
  color: #776b58;
  font-size: 9px;
  line-height: 1.5;
}
.account-modal-actions button:disabled {
  opacity: 0.65;
  cursor: wait;
}
.account-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 5px;
}
@media (max-width: 920px) {
  .users-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .users-filters {
    width: 100%;
    flex-wrap: wrap;
  }
  .users-filters .search-field {
    flex: 1;
  }
  .users-filters .search-field input {
    width: 100%;
  }
}
@media (max-width: 600px) {
  .users-summary {
    gap: 14px;
    padding: 13px;
  }
  .users-summary p {
    display: none;
  }
  .users-table {
    min-width: 900px;
  }
  .users-table-foot span {
    display: none;
  }
  .users-create-float {
    float: none;
    margin: 0 0 14px;
    width: 100%;
  }
  .users-summary {
    clear: none;
  }
  .account-modal {
    padding: 23px 18px;
  }
}
</style>
