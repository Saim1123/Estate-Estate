<script setup lang="ts">
import { isValidEmail } from "~/utils/authValidation";
definePageMeta({ layout: "auth" });
useSeoMeta({
  title: "Forgot your password? | Estate & Estate",
  description: "Request help resetting your Estate & Estate password.",
});

const flow = useAuthFlow();
const email = computed({
  get: () => flow.value.email,
  set: (value: string) => {
    flow.value.email = value;
  },
});
const attempted = ref(false);
const emailError = computed(() =>
  !attempted.value
    ? ""
    : !email.value.trim()
      ? "Enter your email address."
      : !isValidEmail(email.value)
        ? "Enter a valid email address."
        : "",
);
const isSubmitting = ref(false);
const errorMessage = ref("");
const resetLink = ref("");
const requestMessage = ref("");

async function requestCode() {
  attempted.value = true;
  errorMessage.value = "";
  resetLink.value = "";
  requestMessage.value = "";
  if (emailError.value || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const result = await $fetch<{
      message: string;
      developmentResetUrl?: string;
    }>("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });
    flow.value.purpose = "password-reset";
    requestMessage.value = result.message;
    resetLink.value = result.developmentResetUrl || "";
  } catch (error: any) {
    errorMessage.value =
      error?.data?.statusMessage || "Unable to prepare a reset link.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div>
    <header class="auth-card-heading">
      <span class="eyebrow">Account assistance</span>
      <h1>Forgot your password?</h1>
      <p>
        Enter the email address associated with your account to begin the
        password reset process.
      </p>
    </header>
    <form class="auth-form" novalidate @submit.prevent="requestCode">
      <AuthInput
        id="forgot-email"
        v-model="email"
        label="Email address"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :error="emailError"
      />
      <AuthMessage v-if="errorMessage" kind="error" :text="errorMessage" />
      <AuthMessage v-if="requestMessage" kind="info" :text="requestMessage" />
      <a v-if="resetLink" :href="resetLink" class="btn auth-button"
        >Open development reset link <span aria-hidden="true">→</span></a
      >
      <button
        v-else
        class="btn auth-button"
        type="submit"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? "Preparing…" : "Send reset code" }}
      </button>
    </form>
    <p class="auth-switch">
      <NuxtLink to="/login" class="auth-link">← Return to sign in</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth-button {
  text-align: center;
}
.auth-button:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
