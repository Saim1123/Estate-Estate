<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}>();
</script>
<template>
  <div class="admin-heading">
    <div>
      <div class="admin-crumb">
        <NuxtLink to="/admin">Workspace</NuxtLink><span>/</span>{{ title }}
      </div>
      <p v-if="eyebrow" class="admin-eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="description" class="heading-description">{{ description }}</p>
    </div>
    <NuxtLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="admin-button primary"
      ><span>＋</span>{{ actionLabel }}</NuxtLink
    >
  </div>
</template>
<style>
.admin-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 25px;
}
.admin-crumb {
  font-size: 10px;
  color: #aaa79e;
  margin-bottom: 18px;
}
.admin-crumb a {
  color: #8c8b82;
}
.admin-crumb span {
  margin: 0 8px;
  color: #d1cdc4;
}
.admin-eyebrow {
  font-size: 9px;
  color: #a1784f;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin: 0 0 8px;
}
.admin-heading h1 {
  font: 400 29px/1.15 var(--serif, Georgia, serif);
  letter-spacing: -0.6px;
  margin: 0;
  color: #2c302b;
}
.heading-description {
  font-size: 11px;
  line-height: 1.6;
  color: #888981;
  margin: 8px 0 0;
}
.admin-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dedbd3;
  border-radius: 3px;
  background: #fff;
  color: #4c4d46;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;
}
.admin-button:hover {
  border-color: #b8a98e;
  background: #faf9f6;
}
.admin-button.primary {
  background: #39483b;
  border-color: #39483b;
  color: white;
}
.admin-button.primary:hover {
  background: #2e3a30;
}
.admin-button.primary span {
  font-size: 16px;
  font-weight: 300;
}
.admin-button.danger {
  border-color: #ead8d4;
  color: #9d5145;
}
.admin-button.small {
  min-height: 30px;
  padding: 0 10px;
  font-size: 9px;
}
@media (max-width: 560px) {
  .admin-heading {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 20px;
  }
  .admin-heading .admin-button {
    align-self: stretch;
  }
  .admin-heading h1 {
    font-size: 27px;
  }
}
</style>
