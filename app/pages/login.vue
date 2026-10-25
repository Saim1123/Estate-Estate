<script setup lang="ts">
import { isValidEmail } from "~/utils/authValidation";
import type { PublicAccount } from "~/types/access";
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
const isSubmitting = ref(false);
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

async function signIn() {
  attempted.value = true;
  notice.value = "";
  if (emailError.value || passwordError.value || isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const result = await $fetch<{ user: PublicAccount }>("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        remember: rememberMe.value,
      },
    });
    useAuthSession().user.value = result.user;
    const requested = String(useRoute().query.redirect || "/admin");
    await navigateTo(requested.startsWith("/admin") ? requested : "/admin");
  } catch (error: any) {
    notice.value =
      error?.data?.statusMessage ||
      "Sign-in is unavailable. Check the development prototype setup.";
  } finally {
    isSubmitting.value = false;
  }
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
      <AuthPasswordInput
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
      <AuthMessage v-if="notice" :text="notice" kind="error" />
      <button
        class="btn auth-button"
        type="submit"
        :disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? "Signing in…" : "Sign in" }}
        <span aria-hidden="true">→</span>
      </button>
    </form>

    <p class="auth-switch">
      New to Estate &amp; Estate?
      <NuxtLink to="/signup" class="auth-link">Create an account</NuxtLink>
    </p>
  </div>
</template>
