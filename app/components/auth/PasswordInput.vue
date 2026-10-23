<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: string;
    autocomplete?: string;
    error?: string;
    required?: boolean;
  }>(),
  { autocomplete: "current-password", required: true },
);
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const visible = ref(false);
</script>

<template>
  <div class="auth-field">
    <label class="auth-field-label" :for="id">{{ label }}</label>
    <div class="auth-input-wrap">
      <input
        :id="id"
        class="auth-input has-toggle"
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        :autocomplete="autocomplete"
        :required="required"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="error ? `${id}-error` : undefined"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <button
        class="auth-toggle"
        type="button"
        :aria-label="
          visible
            ? `Hide ${label.toLowerCase()}`
            : `Show ${label.toLowerCase()}`
        "
        :aria-pressed="visible"
        @click="visible = !visible"
      >
        {{ visible ? "Hide" : "Show" }}
      </button>
    </div>
    <p v-if="error" :id="`${id}-error`" class="auth-field-error">{{ error }}</p>
  </div>
</template>
