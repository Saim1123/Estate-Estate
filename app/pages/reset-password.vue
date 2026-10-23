<script setup lang="ts">
import { passwordIssue } from "~/utils/authValidation";
definePageMeta({ layout: "auth" });
useSeoMeta({
  title: "Create a new password | Estate & Estate",
  description: "Preview the Estate & Estate password reset screen.",
});

const flow = useAuthFlow();
const password = ref("");
const confirmPassword = ref("");
const attempted = ref(false);
const isSubmitting = ref(false);
const notice = ref("");
const passwordError = computed(() =>
  attempted.value ? passwordIssue(password.value) : "",
);
const confirmError = computed(() =>
  !attempted.value
    ? ""
    : !confirmPassword.value
      ? "Confirm your new password."
      : password.value !== confirmPassword.value
        ? "Passwords do not match."
        : "",
);

async function resetPassword() {
  attempted.value = true;
  notice.value = "";
  if (passwordError.value || confirmError.value || isSubmitting.value) return;
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  isSubmitting.value = false;
  notice.value =
    "Password reset is not connected. No server-verified reset session exists and your password has not been changed.";
  password.value = "";
  confirmPassword.value = "";
}
</script>

<template>
  <div>
    <header class="auth-card-heading">
      <span class="eyebrow">Password reset</span>
      <h1>Create a new password</h1>
      <p>
        Choose a strong password for your account<span v-if="flow.email">
          ({{ flow.email }})</span
        >.
      </p>
    </header>

    <form class="auth-form" novalidate @submit.prevent="resetPassword">
      <div>
        <PasswordInput
          id="reset-password"
          v-model="password"
          label="New password"
          autocomplete="new-password"
          :error="passwordError"
        />
        <p class="auth-password-hint">
          At least 10 characters, with uppercase, lowercase, and a number.
        </p>
      </div>
      <PasswordInput
        id="reset-confirm-password"
        v-model="confirmPassword"
        label="Confirm new password"
        autocomplete="new-password"
        :error="confirmError"
      />
      <AuthMessage v-if="notice" kind="error" :text="notice" />
      <AuthMessage
        v-else
        kind="info"
        text="This form is a UI preview. A valid server-verified reset session is required before any password can be changed."
      />
      <button
        class="btn auth-button"
        type="submit"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? "Preparing…" : "Reset password" }}
      </button>
    </form>

    <div class="auth-flow-actions">
      <NuxtLink to="/forgot-password" class="auth-link"
        >Start over with password reset</NuxtLink
      ><NuxtLink to="/login" class="auth-link">← Return to sign in</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.auth-button:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
