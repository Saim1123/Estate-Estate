<script setup lang="ts">
import type { DemoRole } from "~/data/adminDemo";
definePageMeta({ layout: "admin" });
const { users, can, log } = useAdminDemo();
const query = ref("");
const statusFilter = ref("All accounts");
const roleFilter = ref("All roles");
const modal = ref(false);
const selected = ref<any>(null);
const toast = ref("");
const form = reactive({ name: "", email: "", role: "Staff" as DemoRole });
const filtered = computed(() =>
  users.value.filter(
    (user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(query.value.toLowerCase()) &&
      (statusFilter.value === "All accounts" ||
        user.status === statusFilter.value) &&
      (roleFilter.value === "All roles" || user.role === roleFilter.value),
  ),
);
const mayManage = computed(
  () =>
    can("createAccounts") || can("editAccounts") || can("deactivateAccounts"),
);
function openCreate() {
  selected.value = null;
  Object.assign(form, { name: "", email: "", role: "Staff" });
  modal.value = true;
}
function openEdit(user: any) {
  selected.value = user;
  Object.assign(form, { name: user.name, email: user.email, role: user.role });
  modal.value = true;
}
function saveUser() {
  if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return;
  if (selected.value) {
    if (!can("editAccounts")) return;
    Object.assign(selected.value, form);
    log("updated account for", selected.value.name, "Account");
  } else {
    if (!can("createAccounts")) return;
    const user = {
      id: `U-${String(Date.now()).slice(-3)}`,
      ...form,
      status: "Active",
      lastActive: "Never",
    };
    users.value.push(user);
    log("created account for", user.name, "Account");
  }
  modal.value = false;
  toast.value = "Account details saved.";
  setTimeout(() => (toast.value = ""), 3000);
}
function toggle(user: any) {
  user.status = user.status === "Active" ? "Inactive" : "Active";
  log(
    `${user.status === "Active" ? "activated" : "deactivated"} account for`,
    user.name,
    "Account",
  );
  toast.value = `Account ${user.status.toLowerCase()}.`;
  setTimeout(() => (toast.value = ""), 3000);
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="YOUR TEAM"
      title="Users & accounts"
      description="The people who take thoughtful care of your property portfolio."
      :action-label="can('createAccounts') ? 'Create account' : undefined"
      :action-to="undefined"
    />
    <button
      v-if="can('createAccounts')"
      class="users-create-float"
      @click="openCreate"
    >
      ＋ Create account
    </button>
    <div v-if="!can('viewUsers')" class="permission-notice">
      Your preview role does not have permission to view accounts.
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
              ><input
                v-model="query"
                placeholder="Search by name or email…" /></label
            ><select v-model="roleFilter">
              <option>All roles</option>
              <option>System Administrator</option>
              <option>Property Manager</option>
              <option>Staff</option></select
            ><select v-model="statusFilter">
              <option>All accounts</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <div class="table-overflow">
          <table class="users-table">
            <thead>
              <tr>
                <th>TEAM MEMBER</th>
                <th>ROLE</th>
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
                  <span class="role-tag">{{ user.role }}</span>
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
                    <button v-if="can('editAccounts')" @click="openEdit(user)">
                      Edit</button
                    ><button
                      v-if="can('deactivateAccounts')"
                      @click="toggle(user)"
                    >
                      {{
                        user.status === "Active" ? "Deactivate" : "Activate"
                      }}</button
                    ><span
                      v-if="!can('editAccounts') && !can('deactivateAccounts')"
                      class="read-only-tag"
                      >Read only</span
                    >
                  </div>
                </td>
              </tr>
              <tr v-if="!filtered.length">
                <td colspan="5">
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
          <span>Account permissions are controlled by assigned roles.</span>
        </div>
      </section>
      <div class="demo-disclaimer">
        ⓘ <span>Demo access controls</span> — These role previews control the
        interface only. Production access requires server-side authorization.
      </div>
      <div v-if="toast" class="admin-toast">✓ {{ toast }}</div>
    </template>
    <div v-if="modal" class="modal-backdrop" @click.self="modal = false">
      <form class="account-modal" @submit.prevent="saveUser">
        <button
          type="button"
          class="modal-close"
          aria-label="Close"
          @click="modal = false"
        >
          ×</button
        ><span class="panel-eyebrow">TEAM ACCESS</span>
        <h2>{{ selected ? "Edit account" : "Create an account" }}</h2>
        <p>Assign a role to define this teammate’s demo access.</p>
        <label class="field"
          ><span>Full name</span
          ><input
            v-model="form.name"
            required
            placeholder="e.g. Sara Malik" /></label
        ><label class="field"
          ><span>Email address</span
          ><input
            v-model="form.email"
            required
            type="email"
            placeholder="name@estateandestate.pk" /></label
        ><label class="field"
          ><span>Role</span
          ><select v-model="form.role">
            <option>System Administrator</option>
            <option>Property Manager</option>
            <option>Staff</option>
          </select></label
        >
        <div class="account-modal-actions">
          <button type="button" class="admin-button" @click="modal = false">
            Cancel</button
          ><button type="submit" class="admin-button primary">
            {{ selected ? "Save changes" : "Create account" }}
          </button>
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
    min-width: 660px;
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
