<script setup lang="ts">
import { isValidEmail, passwordIssue } from "~/utils/authValidation";
definePageMeta({ layout: "auth" });
useSeoMeta({
  title: "Create an account | Estate & Estate",
  description: "Request an Estate & Estate account.",
});

const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const attempted = ref(false);
const isSubmitting = ref(false);
const notice = ref("");
const errors = computed(() => ({
  fullName:
    attempted.value && !fullName.value.trim() ? "Enter your full name." : "",
  email: !attempted.value
    ? ""
    : !email.value.trim()
      ? "Enter your email address."
      : !isValidEmail(email.value)
        ? "Enter a valid email address."
        : "",
  password: attempted.value
    ? passwordIssue(password.value) ||
      (!password.value ? "Create a password." : "")
    : "",
  confirmPassword:
    attempted.value && !confirmPassword.value
      ? "Confirm your password."
      : attempted.value && password.value !== confirmPassword.value
        ? "Passwords do not match."
        : "",
}));

async function createAccount() {
  attempted.value = true;
  notice.value = "";
  if (Object.values(errors.value).some(Boolean) || isSubmitting.value) return;
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 350));
  notice.value =
    "Demo only: account creation is not connected. No account or permissions were created. A secure invitation or administrator-approved flow will be required.";
  isSubmitting.value = false;
}
</script>

<template>
  <div>
    <header class="auth-card-heading">
      <span class="eyebrow">Authorized personnel</span>
      <h1>Create your account</h1>
      <p>
        Estate &amp; Estate accounts are for authorized personnel. Access must
        be approved through a secure invitation flow.
      </p>
    </header>

    <form class="auth-form" novalidate @submit.prevent="createAccount">
      <AuthInput
        id="signup-name"
        v-model="fullName"
        label="Full name"
        autocomplete="name"
        placeholder="Your name"
        :error="errors.fullName"
      />
      <AuthInput
        id="signup-email"
        v-model="email"
        label="Email address"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :error="errors.email"
      />
      <div>
        <AuthPasswordInput
          id="signup-password"
          v-model="password"
          label="Password"
          autocomplete="new-password"
          :error="errors.password"
        />
        <p class="auth-password-hint">
          At least 10 characters, with uppercase, lowercase, and a number.
        </p>
      </div>
      <AuthPasswordInput
        id="signup-confirm-password"
        v-model="confirmPassword"
        label="Confirm password"
        autocomplete="new-password"
        :error="errors.confirmPassword"
      />
      <AuthMessage v-if="notice" :text="notice" kind="info" />
      <p class="auth-password-hint">
        Terms and privacy information will be provided as part of approved
        onboarding. Submitting this demo form does not create an account.
      </p>
      <button
        class="btn auth-button"
        type="submit"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? "Preparing…" : "Create account" }}
      </button>
    </form>

    <p class="auth-switch">
      Already have access?
      <NuxtLink to="/login" class="auth-link">Sign in</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth-card-heading p {
  margin-bottom: 20px;
}
.auth-form {
  gap: 13px;
}
.auth-button:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
