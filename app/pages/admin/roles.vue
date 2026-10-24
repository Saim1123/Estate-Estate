<script setup lang="ts">
import {
  permissionLabels,
  permissionKeys,
  type DemoRole,
  type Permission,
} from "~/data/adminDemo";
definePageMeta({ layout: "admin" });
const { roles, can, log } = useAdminDemo();
const roleNames: DemoRole[] = [
  "System Administrator",
  "Property Manager",
  "Staff",
];
const roleDescriptions: Record<DemoRole, string> = {
  "System Administrator": "Complete access to every area of the workspace.",
  "Property Manager": "Manage property listings and publishing workflow.",
  Staff: "Read access to shared portfolio information.",
};
const permissionGroups = [
  { title: "PROPERTY MANAGEMENT", keys: permissionKeys.slice(0, 5) },
  { title: "TEAM & ACCESS", keys: permissionKeys.slice(5, 10) },
  { title: "WORKSPACE", keys: permissionKeys.slice(10) },
];
const toast = ref("");
function update(role: DemoRole, permission: Permission, checked: boolean) {
  if (!can("manageRoles") || role === "System Administrator") return;
  const next = new Set(roles.value[role]);
  checked ? next.add(permission) : next.delete(permission);
  roles.value[role] = [...next];
  log("changed permissions for", role, "Permissions");
  toast.value = `${role} permissions updated.`;
  setTimeout(() => (toast.value = ""), 2500);
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="TEAM & ACCESS"
      title="Roles & permissions"
      description="Shape what each role can see and do in your workspace."
    />
    <div v-if="!can('manageRoles')" class="permission-notice">
      Your preview role does not have permission to manage roles and
      permissions.
    </div>
    <template v-else>
      <div class="roles-callout">
        <span>◇</span>
        <p>
          <b>Permissions are role-based.</b> Changes here affect the experience
          of every demo user assigned to that role. These controls are a
          frontend preview only.
        </p>
      </div>
      <div class="role-cards">
        <article
          v-for="role in roleNames"
          :key="role"
          class="role-card"
          :class="{ protected: role === 'System Administrator' }"
        >
          <div class="role-card-top">
            <span class="role-symbol">{{
              role === "System Administrator"
                ? "✳"
                : role === "Property Manager"
                  ? "⌂"
                  : "♙"
            }}</span
            ><span v-if="role === 'System Administrator'" class="locked-label"
              >PROTECTED</span
            >
          </div>
          <h2>{{ role }}</h2>
          <p>{{ roleDescriptions[role] }}</p>
          <div class="role-card-foot">
            <b>{{ roles[role].length }} <span>permissions</span></b
            ><span>{{
              role === "System Administrator"
                ? "Always full access"
                : "Editable below"
            }}</span>
          </div>
        </article>
      </div>
      <section class="permission-panel">
        <div class="permission-panel-head">
          <div>
            <span class="panel-eyebrow">ACCESS MATRIX</span>
            <h2>Individual permissions</h2>
            <p>Use the toggles to fine-tune each role’s capabilities.</p>
          </div>
          <span class="readonly-badge">System Administrator · Protected</span>
        </div>
        <div
          v-for="group in permissionGroups"
          :key="group.title"
          class="permission-group"
        >
          <div class="permission-group-title">{{ group.title }}</div>
          <div
            v-for="permission in group.keys"
            :key="permission"
            class="permission-row"
          >
            <div>
              <b>{{ permissionLabels[permission] }}</b
              ><small>{{
                permission === "viewProperties"
                  ? "Open and review property listings."
                  : permission === "publishProperties"
                    ? "Make listings visible or hidden on the public site."
                    : permission === "manageRoles"
                      ? "Configure permissions for other roles."
                      : permissionLabels[permission] +
                        " within the admin workspace."
              }}</small>
            </div>
            <div
              v-for="role in roleNames"
              :key="role"
              class="permission-choice"
            >
              <span class="mobile-role-label">{{ role }}</span
              ><label
                class="toggle-switch"
                :class="{ locked: role === 'System Administrator' }"
                ><input
                  type="checkbox"
                  :checked="roles[role].includes(permission)"
                  :disabled="role === 'System Administrator'"
                  @change="
                    update(
                      role,
                      permission,
                      ($event.target as HTMLInputElement).checked,
                    )
                  " /><span
              /></label>
            </div>
          </div>
        </div>
        <div class="permission-legend">
          <span><i class="legend-on" /> Enabled</span
          ><span><i class="legend-off" /> Disabled</span>
          <p>
            System Administrator retains full access to prevent accidental
            lockout.
          </p>
        </div>
      </section>
      <div class="demo-disclaimer">
        ⓘ <span>Frontend preview only</span> — Production authorization will be
        enforced on the server, independent of these UI controls.
      </div>
      <div v-if="toast" class="admin-toast">✓ {{ toast }}</div>
    </template>
  </div>
</template>
<style>
.roles-callout {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 15px;
  background: #f2efe7;
  border: 1px solid #e8e2d6;
  margin-bottom: 14px;
  color: #9c7d56;
}
.roles-callout > span {
  font-size: 17px;
}
.roles-callout p {
  margin: 0;
  font-size: 9px;
  line-height: 1.7;
  color: #85847a;
}
.roles-callout b {
  color: #5c594f;
  font-weight: 600;
}
.role-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}
.role-card {
  background: #fff;
  border: 1px solid #e9e6df;
  padding: 15px 16px 12px;
  min-height: 130px;
}
.role-card.protected {
  background: #fbfaf7;
  border-color: #ded5c6;
}
.role-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.role-symbol {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  background: #f3f0e9;
  color: #9f8059;
  border-radius: 50%;
  font-size: 14px;
}
.locked-label {
  font-size: 7px;
  letter-spacing: 0.8px;
  color: #a27d52;
  background: #f2ede4;
  padding: 4px 6px;
}
.role-card h2 {
  font: 15px var(--serif, Georgia, serif);
  margin: 10px 0 4px;
}
.role-card p {
  font-size: 9px;
  color: #8d8e86;
  line-height: 1.5;
  margin: 0 0 11px;
}
.role-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0eee8;
  padding-top: 9px;
  color: #9b9a92;
  font-size: 8px;
}
.role-card-foot b {
  font-size: 9px;
  color: #64665f;
}
.role-card-foot b span {
  font-weight: 400;
  color: #96978f;
}
.permission-panel {
  background: #fff;
  border: 1px solid #e9e6df;
}
.permission-panel-head {
  padding: 17px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #efede7;
}
.permission-panel-head h2 {
  font: 17px var(--serif, Georgia, serif);
  margin: 5px 0;
}
.permission-panel-head p {
  font-size: 9px;
  color: #96978f;
  margin: 0;
}
.readonly-badge {
  font-size: 8px;
  color: #82745f;
  background: #f5f2ec;
  padding: 7px 9px;
}
.permission-group-title {
  font-size: 8px;
  letter-spacing: 1px;
  font-weight: 700;
  color: #a09f96;
  background: #fbfaf8;
  padding: 9px 17px;
  border-bottom: 1px solid #efede7;
}
.permission-row {
  display: grid;
  grid-template-columns: minmax(190px, 1fr) repeat(3, 116px);
  align-items: center;
  padding: 10px 17px;
  border-bottom: 1px solid #f1efe9;
  min-height: 48px;
}
.permission-row > div:first-child {
  display: grid;
  gap: 4px;
}
.permission-row > div:first-child b {
  font-size: 9px;
  font-weight: 600;
  color: #55574f;
}
.permission-row > div:first-child small {
  font-size: 8px;
  color: #a09f97;
}
.permission-choice {
  display: flex;
  justify-content: center;
}
.toggle-switch {
  width: 28px;
  height: 16px;
  display: block;
  position: relative;
  cursor: pointer;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-switch > span {
  position: absolute;
  inset: 0;
  background: #deded8;
  border-radius: 10px;
  transition: 0.15s;
}
.toggle-switch > span:before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.15s;
  box-shadow: 0 1px 2px #0002;
}
.toggle-switch input:checked + span {
  background: #71866d;
}
.toggle-switch input:checked + span:before {
  transform: translateX(12px);
}
.toggle-switch.locked {
  opacity: 0.72;
  cursor: not-allowed;
}
.permission-legend {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 17px;
  color: #96978f;
  font-size: 8px;
}
.permission-legend span {
  display: flex;
  align-items: center;
  gap: 5px;
}
.permission-legend i {
  width: 10px;
  height: 7px;
  border-radius: 5px;
}
.legend-on {
  background: #71866d;
}
.legend-off {
  background: #deded8;
}
.permission-legend p {
  margin: 0 0 0 auto;
}
.mobile-role-label {
  display: none;
}
@media (max-width: 760px) {
  .role-cards {
    grid-template-columns: 1fr;
  }
  .role-card {
    min-height: 0;
  }
  .permission-panel-head {
    align-items: flex-start;
    gap: 10px;
    flex-direction: column;
  }
  .permission-row {
    grid-template-columns: minmax(150px, 1fr) repeat(3, 58px);
    padding: 9px 11px;
  }
  .permission-legend {
    flex-wrap: wrap;
  }
  .permission-legend p {
    width: 100%;
    margin: 0;
  }
}
@media (max-width: 480px) {
  .permission-row {
    grid-template-columns: minmax(120px, 1fr) repeat(3, 40px);
    padding: 9px 8px;
  }
  .permission-row > div:first-child b {
    font-size: 8px;
  }
  .permission-row > div:first-child small {
    font-size: 7px;
  }
  .mobile-role-label {
    display: block;
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }
  .readonly-badge {
    font-size: 7px;
  }
  .permission-legend {
    gap: 10px;
  }
}
</style>
