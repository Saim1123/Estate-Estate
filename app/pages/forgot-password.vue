<script setup lang="ts">
import { isValidEmail } from '~/utils/authValidation'
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Forgot your password? | Estate & Estate', description: 'Request help resetting your Estate & Estate password.' })

const flow = useAuthFlow()
const email = computed({ get: () => flow.value.email, set: (value: string) => { flow.value.email = value } })
const attempted = ref(false)
const emailError = computed(() => !attempted.value ? '' : !email.value.trim() ? 'Enter your email address.' : !isValidEmail(email.value) ? 'Enter a valid email address.' : '')
const isSubmitting = ref(false)
const requestPrepared = ref(false)

async function requestCode() {
  attempted.value = true
  requestPrepared.value = false
  if (emailError.value || isSubmitting.value) return
  flow.value.purpose = 'password-reset'
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  isSubmitting.value = false
  requestPrepared.value = true
}
</script>

<template>
  <div>
    <header class="auth-card-heading"><span class="eyebrow">Account assistance</span><h1>Forgot your password?</h1><p>Enter the email address associated with your account to begin the password reset process.</p></header>
    <form class="auth-form" novalidate @submit.prevent="requestCode">
      <AuthInput id="forgot-email" v-model="email" label="Email address" type="email" autocomplete="email" placeholder="you@example.com" :error="emailError" />
      <AuthMessage v-if="requestPrepared" kind="info" text="Demo only: no email or reset code was sent. Continue to the verification preview to see the next screen." />
      <AuthMessage v-if="isSubmitting" kind="info" text="Preparing the demo flow… No message is being sent." />
      <NuxtLink v-if="requestPrepared" to="/verify-code" class="btn auth-button">Continue to code preview <span aria-hidden="true">→</span></NuxtLink>
      <button v-else class="btn auth-button" type="submit" :disabled="isSubmitting" :aria-busy="isSubmitting">{{ isSubmitting ? 'Preparing…' : 'Send reset code' }}</button>
    </form>
    <p class="auth-switch"><NuxtLink to="/login" class="auth-link">← Return to sign in</NuxtLink></p>
  </div>
</template>

<style scoped>
.auth-button { text-align: center; }
</style>
