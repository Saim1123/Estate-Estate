<script setup lang="ts">
import { isValidEmail } from "~/utils/authValidation";
definePageMeta({ layout: "auth" });
useSeoMeta({
  title: "Sign in | Estate & Estate",
  description: "Sign in to Estate & Estate.",
});

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const attempted = ref(false);
const notice = ref("");
const emailError = computed(() =>
  !attempted.value
    ? ""
    : !email.value.trim()
      ? "Enter your email address."
      : !isValidEmail(email.value)
        ? "Enter a valid email address."
        : "",
);
const passwordError = computed(() =>
  attempted.value && !password.value ? "Enter your password." : "",
);

function signIn() {
  attempted.value = true;
  notice.value = "";
  if (emailError.value || passwordError.value) return;
  notice.value = "Sign-in is not connected yet. No account was authenticated.";
}
</script>

<template>
  <div>
    <header class="auth-card-heading">
      <span class="eyebrow">Estate &amp; Estate</span>
      <h1>Welcome back</h1>
      <p>Sign in to continue to your Estate &amp; Estate account.</p>
    </header>

    <form class="auth-form" novalidate @submit.prevent="signIn">
      <AuthInput
        id="login-email"
        v-model="email"
        label="Email address"
        type="email"
        autocomplete="username"
        placeholder="you@example.com"
        :error="emailError"
      />
      <PasswordInput
        id="login-password"
        v-model="password"
        label="Password"
        autocomplete="current-password"
        :error="passwordError"
      />
      <div class="auth-form-row">
        <label class="auth-check"
          ><input v-model="rememberMe" type="checkbox" /> Remember me</label
        ><NuxtLink to="/forgot-password" class="auth-link"
          >Forgot password?</NuxtLink
        >
      </div>
      <AuthMessage v-if="notice" :text="notice" kind="info" />
      <button class="btn auth-button" type="submit">
        Sign in <span aria-hidden="true">→</span>
      </button>
    </form>

    <p class="auth-switch">
      New to Estate &amp; Estate?
      <NuxtLink to="/signup" class="auth-link">Create an account</NuxtLink>
    </p>
  </div>
</template>
