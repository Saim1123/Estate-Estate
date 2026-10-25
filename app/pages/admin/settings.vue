<script setup lang="ts">
definePageMeta({ layout: "admin" });
const { profile, preferences, can, log, currentUser } = useAdminDemo();
const profileForm = reactive({
  ...profile.value,
  name: currentUser.value?.name || profile.value.name,
  email: currentUser.value?.email || profile.value.email,
});
const passwordForm = reactive({ current: "", next: "", confirm: "" });
const passwordError = ref("");
const toast = ref("");
const saved = ref(false);
const isSaving = ref(false);
onMounted(async () => {
  if (!can("manageSettings")) return;
  try {
    const result = await $fetch<{
      profile: typeof profile.value;
      preferences: typeof preferences.value;
    }>("/api/admin/settings");
    Object.assign(profile.value, result.profile);
    Object.assign(profileForm, result.profile);
    Object.assign(preferences.value, result.preferences);
  } catch {
    toast.value = "Settings could not be loaded from the development server.";
  }
});
async function saveProfile() {
  if (!can("manageSettings") || isSaving.value) return;
  isSaving.value = true;
  try {
    const result = await $fetch<{ profile: typeof profile.value }>(
      "/api/admin/settings",
      {
        method: "PATCH",
        body: { profile: profileForm },
      },
    );
    Object.assign(profile.value, result.profile);
    log("updated profile settings", profileForm.name, "Settings");
    saved.value = true;
    toast.value = "Profile changes saved.";
  } catch (error: any) {
    toast.value =
      error?.data?.statusMessage || "Profile changes could not be saved.";
  } finally {
    isSaving.value = false;
  }
  setTimeout(() => {
    saved.value = false;
    toast.value = "";
  }, 3000);
}
async function changePassword() {
  passwordError.value = "";
  if (!passwordForm.current || passwordForm.next.length < 10) {
    passwordError.value =
      "Enter your current password and a new password with at least 10 characters.";
    return;
  }
  if (passwordForm.next !== passwordForm.confirm) {
    passwordError.value = "The new passwords do not match.";
    return;
  }
  try {
    await $fetch("/api/auth/change-password", {
      method: "POST",
      body: {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      },
    });
    passwordForm.current = "";
    passwordForm.next = "";
    passwordForm.confirm = "";
    toast.value = "Password updated for this development process.";
  } catch (error: any) {
    passwordError.value =
      error?.data?.statusMessage || "Password could not be changed.";
  }
  setTimeout(() => (toast.value = ""), 3000);
}
async function savePreferences() {
  if (!can("manageSettings") || isSaving.value) return;
  isSaving.value = true;
  try {
    const result = await $fetch<{ preferences: typeof preferences.value }>(
      "/api/admin/settings",
      {
        method: "PATCH",
        body: { preferences: preferences.value },
      },
    );
    Object.assign(preferences.value, result.preferences);
    toast.value = "Workspace preferences saved.";
  } catch (error: any) {
    toast.value =
      error?.data?.statusMessage || "Workspace preferences could not be saved.";
  } finally {
    isSaving.value = false;
  }
  setTimeout(() => (toast.value = ""), 3000);
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="YOUR WORKSPACE"
      title="Profile & settings"
      description="A few personal details and preferences for your property office."
    />
    <div v-if="!can('manageSettings')" class="settings-role-note">
      Your account can view this page but cannot edit system preferences.
    </div>
    <div class="settings-grid">
      <div class="settings-main-column">
        <section class="settings-panel">
          <div class="settings-panel-head">
            <span class="settings-icon">♙</span>
            <div>
              <h2>Profile information</h2>
              <p>Update the details associated with your account.</p>
            </div>
          </div>
          <form class="settings-form" @submit.prevent="saveProfile">
            <label class="field"
              ><span>Full name</span
              ><UInput class="admin-ui-input"
                v-model="profileForm.name"
                :disabled="!can('manageSettings')"
                required
                size="sm"
              /></label
            ><label class="field"
              ><span>Email address</span
              ><UInput class="admin-ui-input"
                v-model="profileForm.email"
                :disabled="!can('manageSettings')"
                required
                type="email"
                size="sm"
              /></label
            ><label class="field"
              ><span>Phone number</span
              ><UInput class="admin-ui-input"
                v-model="profileForm.phone"
                :disabled="!can('manageSettings')"
                placeholder="+92 300 000 0000"
                size="sm"
            /></label>
            <div class="settings-save-row">
              <UButton variant="ghost"
                v-if="can('manageSettings')"
                class="admin-button primary"
                type="submit"
                :disabled="isSaving"
              >
                Save profile</UButton
              ><span v-if="saved" class="inline-success">✓ Saved</span>
            </div>
          </form>
        </section>
        <section class="settings-panel">
          <div class="settings-panel-head">
            <span class="settings-icon">⌑</span>
            <div>
              <h2>Change password</h2>
              <p>Choose a strong password to help protect your account.</p>
            </div>
          </div>
          <form class="settings-form" @submit.prevent="changePassword">
            <label class="field"
              ><span>Current password</span
              ><UInput class="admin-ui-input"
                v-model="passwordForm.current"
                type="password"
                placeholder="Enter current password"
                size="sm"
            /></label>
            <div class="settings-fields-two">
              <label class="field"
                ><span>New password</span
                ><UInput class="admin-ui-input"
                  v-model="passwordForm.next"
                  type="password"
                  placeholder="At least 8 characters"
                  size="sm"
                /></label
              ><label class="field"
                ><span>Confirm new password</span
                ><UInput class="admin-ui-input"
                  v-model="passwordForm.confirm"
                  type="password"
                  placeholder="Re-enter password"
                  size="sm"
              /></label>
            </div>
            <small v-if="passwordError" class="form-error">{{
              passwordError
            }}</small>
            <div class="settings-save-row">
              <UButton variant="ghost" class="admin-button" type="submit">
                Update password
              </UButton>
            </div>
            <p class="password-note">
              Password updates are a UI preview. No credentials are stored or
              sent.
            </p>
          </form>
        </section>
      </div>
      <div class="settings-side-column">
        <section class="settings-panel">
          <div class="settings-panel-head">
            <span class="settings-icon">⚙</span>
            <div>
              <h2>Workspace preferences</h2>
              <p>Set the defaults for your admin experience.</p>
            </div>
          </div>
          <div class="preference-rows">
            <label class="preference-row"
              ><span
                ><b>Currency</b><small>Display property prices in</small></span
              ><USelect class="admin-ui-select"
                v-model="preferences.currency"
                :items="['PKR', 'USD']"
                :disabled="!can('manageSettings')"
                size="sm"
              /></label
            ><label class="preference-row"
              ><span
                ><b>Timezone</b
                ><small>Used for activity timestamps</small></span
              ><USelect class="admin-ui-select"
                v-model="preferences.timezone"
                :items="['Asia/Karachi', 'UTC']"
                :disabled="!can('manageSettings')"
                size="sm"
              /></label
            ><label class="preference-row"
              ><span
                ><b>Email updates</b
                ><small>Receive important workspace updates</small></span
              ><USwitch
                v-model="preferences.emailUpdates"
                :disabled="!can('manageSettings')"
                aria-label="Email updates"
                size="sm"
              /></label>
          </div>
          <div class="settings-save-row preference-save">
            <UButton variant="ghost"
              v-if="can('manageSettings')"
              class="admin-button primary"
              :disabled="isSaving"
              @click="savePreferences"
            >
              Save preferences
            </UButton>
          </div>
        </section>
        <section class="settings-help">
          <span>✳</span>
          <h2>A considered approach.</h2>
          <p>
            Estate & Estate is a private property office. Your workspace is
            designed to keep your listings, team, and decisions in good order.
          </p>
          <NuxtLink to="/">Visit the public website ↗</NuxtLink>
        </section>
      </div>
    </div>
    <div class="demo-disclaimer">
      ⓘ <span>Development prototype</span> — Settings and account changes are
      stored in process memory. Passwords are hashed server-side and are not
      kept after a server restart.
    </div>
    <div v-if="toast" class="admin-toast">✓ {{ toast }}</div>
  </div>
</template>
<style>
.settings-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 15px;
  align-items: start;
}
.settings-main-column,
.settings-side-column {
  display: grid;
  gap: 14px;
}
.settings-panel {
  background: #fff;
  border: 1px solid #e9e6df;
  padding: 18px;
}
.settings-panel-head {
  display: flex;
  gap: 11px;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0eee8;
}
.settings-icon {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f3f0e9;
  color: #9b7a52;
  font-size: 15px;
}
.settings-panel-head h2 {
  font: 16px var(--serif, Georgia, serif);
  margin: 0 0 4px;
}
.settings-panel-head p {
  font-size: 9px;
  color: #96978f;
  margin: 0;
}
.settings-form {
  display: grid;
  gap: 13px;
  padding-top: 15px;
}
.settings-form .field input {
  height: 38px;
}
.settings-form .field input:disabled,
.preference-row select:disabled {
  background: #faf9f6;
  color: #777970;
}
.settings-save-row {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 2px;
}
.settings-save-row .admin-button {
  min-height: 35px;
}
.inline-success {
  font-size: 9px;
  color: #63805b;
}
.settings-fields-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.form-error {
  font-size: 9px;
  line-height: 1.5;
  color: #a95148;
}
.password-note {
  font-size: 8px;
  color: #aaa99f;
  margin: 0;
}
.preference-rows {
  display: grid;
}
.preference-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 13px 0;
  border-bottom: 1px solid #f0eee8;
}
.preference-row > span {
  display: grid;
  gap: 4px;
}
.preference-row b {
  font-size: 9px;
  font-weight: 600;
  color: #585a52;
}
.preference-row small {
  font-size: 8px;
  color: #9a9a92;
}
.preference-row select {
  height: 30px;
  border: 1px solid #e9e6df;
  background: white;
  color: #62645d;
  font-size: 9px;
  padding: 0 22px 0 7px;
}
.preference-save {
  justify-content: flex-end;
  padding-top: 13px;
}
.settings-help {
  background: #efede7;
  padding: 19px;
}
.settings-help > span {
  font-size: 17px;
  color: #a17e57;
}
.settings-help h2 {
  font: 20px var(--serif, Georgia, serif);
  margin: 9px 0 6px;
}
.settings-help p {
  font-size: 9px;
  line-height: 1.7;
  color: #898a82;
  margin: 0 0 13px;
}
.settings-help a {
  font-size: 9px;
  color: #7d6c50;
}
.settings-role-note {
  padding: 11px 14px;
  background: #f3f0e9;
  border: 1px solid #e9e4da;
  color: #77746b;
  font-size: 9px;
  line-height: 1.6;
  margin-bottom: 14px;
}
@media (max-width: 800px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  .settings-side-column {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 560px) {
  .settings-side-column {
    grid-template-columns: 1fr;
  }
  .settings-panel {
    padding: 15px;
  }
  .settings-fields-two {
    grid-template-columns: 1fr;
  }
}
</style>
