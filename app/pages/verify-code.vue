<script setup lang="ts">
import { isValidEmail } from "~/utils/authValidation";
definePageMeta({ layout: "auth" });
useSeoMeta({
  title: "Verify your email | Estate & Estate",
  description: "Continue the Estate & Estate account recovery flow.",
});

const flow = useAuthFlow();
const email = computed({
  get: () => flow.value.email,
  set: (value: string) => {
    flow.value.email = value;
  },
});
const showEmailInput = ref(!flow.value.email);
const code = ref("");
const attempted = ref(false);
const codeMessage = ref("");
const secondsRemaining = ref(0);
let cooldownTimer: ReturnType<typeof setInterval> | undefined;
const emailError = computed(() =>
  attempted.value && (!email.value.trim() || !isValidEmail(email.value))
    ? "Enter a valid email address to continue."
    : "",
);
const codeError = computed(() =>
  attempted.value && !/^\d{6}$/.test(code.value) ? "Enter all six digits." : "",
);

function submitCode() {
  attempted.value = true;
  codeMessage.value = "";
  if (emailError.value || codeError.value) return;
  flow.value.purpose = "password-reset";
  codeMessage.value =
    "This legacy code screen is a design preview only. No code was checked and no password can be changed here. Use the one-time development link on the forgot-password screen.";
}

function resendCode() {
  if (secondsRemaining.value > 0) return;
  if (!isValidEmail(email.value)) {
    attempted.value = true;
    return;
  }
  secondsRemaining.value = 30;
  codeMessage.value =
    "Demo only: no new code was sent. The resend cooldown is shown for interface preview.";
  if (cooldownTimer) clearInterval(cooldownTimer);
  cooldownTimer = setInterval(() => {
    secondsRemaining.value -= 1;
    if (secondsRemaining.value <= 0 && cooldownTimer)
      clearInterval(cooldownTimer);
  }, 1000);
}
onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});
</script>

<template>
  <div>
    <header class="auth-card-heading">
      <span class="eyebrow">Password reset</span>
      <h1>Verify your email</h1>
      <p>
        Enter the six-digit code associated with
        <strong>{{ email || "your email address" }}</strong
        >.
      </p>
    </header>

    <form class="auth-form" novalidate @submit.prevent="submitCode">
      <AuthInput
        v-if="showEmailInput"
        id="verify-email"
        v-model="email"
        label="Email address"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :error="emailError"
      />
      <AuthInput
        id="verification-code"
        v-model="code"
        label="Six-digit verification code"
        inputmode="numeric"
        autocomplete="one-time-code"
        placeholder="— — — — — —"
        :maxlength="6"
        :error="codeError"
      />
      <AuthMessage v-if="codeMessage" kind="info" :text="codeMessage" />
      <button class="btn auth-button" type="submit">Preview code screen</button>
    </form>

    <div class="auth-flow-actions">
      <button
        class="auth-resend"
        type="button"
        :disabled="secondsRemaining > 0"
        @click="resendCode"
      >
        {{
          secondsRemaining > 0
            ? `Request another code in ${secondsRemaining}s`
            : "Request another code"
        }}</button
      ><NuxtLink to="/forgot-password" class="auth-link"
        >← Back to password reset</NuxtLink
      >
    </div>
  </div>
</template>
