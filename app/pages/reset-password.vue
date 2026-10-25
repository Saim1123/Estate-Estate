<script setup lang="ts">
import { passwordIssue } from "~/utils/authValidation";
definePageMeta({ layout: "auth" });
useSeoMeta({
  title: "Create a new password | Estate & Estate",
  description: "Set a new password using a one-time development reset link.",
});

const flow = useAuthFlow();
const route = useRoute();
const password = ref("");
const confirmPassword = ref("");
const attempted = ref(false);
const isSubmitting = ref(false);
const notice = ref("");
const errorMessage = ref("");
const didReset = ref(false);
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
  errorMessage.value = "";
  if (
    passwordError.value ||
    confirmError.value ||
    isSubmitting.value ||
    !route.query.token
  )
    return;
  isSubmitting.value = true;
  try {
    const result = await $fetch<{ message: string }>(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: { token: route.query.token, password: password.value },
      },
    );
    notice.value = result.message;
    didReset.value = true;
    password.value = "";
    confirmPassword.value = "";
  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage || "Password could not be reset.";
  } finally {
    isSubmitting.value = false;
  }
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
        <AuthPasswordInput
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
      <AuthPasswordInput
        id="reset-confirm-password"
        v-model="confirmPassword"
        label="Confirm new password"
        autocomplete="new-password"
        :error="confirmError"
      />
      <AuthMessage v-if="errorMessage" kind="error" :text="errorMessage" />
      <AuthMessage v-if="notice" kind="success" :text="notice" />
      <AuthMessage
        v-else-if="!route.query.token"
        kind="error"
        text="A valid one-time development reset link is required."
      />
      <button
        class="btn auth-button"
        type="submit"
        :disabled="isSubmitting || didReset || !route.query.token"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? "Updating…" : "Reset password" }}
      </button>
    </form>

    <div class="auth-flow-actions">
      <NuxtLink v-if="didReset" to="/login" class="auth-link"
        >← Return to sign in</NuxtLink
      ><NuxtLink v-else to="/forgot-password" class="auth-link"
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
