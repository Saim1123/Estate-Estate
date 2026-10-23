<script setup lang="ts">
withDefaults(
  defineProps<{ kind?: "info" | "error" | "success"; text: string }>(),
  { kind: "info" },
);
</script>

<template>
  <p
    class="auth-notice"
    :class="kind"
    :role="kind === 'error' ? 'alert' : 'status'"
    aria-live="polite"
  >
    {{ text }}
  </p>
</template>
