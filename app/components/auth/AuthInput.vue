<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: string;
    type?: string;
    autocomplete?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    inputmode?:
      | "text"
      | "email"
      | "numeric"
      | "tel"
      | "url"
      | "search"
      | "decimal"
      | "none";
    maxlength?: number;
  }>(),
  { type: "text", required: true },
);
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <div class="auth-field">
    <label class="auth-field-label" :for="id"
      >{{ label
      }}<span v-if="!required">
        <span class="muted">(optional)</span></span
      ></label
    >
    <input
      :id="id"
      class="auth-input"
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :required="required"
      :inputmode="inputmode"
      :maxlength="maxlength"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${id}-error` : undefined"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <p v-if="error" :id="`${id}-error`" class="auth-field-error">{{ error }}</p>
  </div>
</template>
