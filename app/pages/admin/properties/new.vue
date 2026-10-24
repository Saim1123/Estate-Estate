<script setup lang="ts">
definePageMeta({ layout: "admin" });
const { saveProperty, can } = useAdminDemo();
const router = useRouter();
function save(value: Record<string, any>) {
  if (!can("createProperties")) return;
  saveProperty(value);
  setTimeout(() => router.push("/admin/properties"), 650);
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="PORTFOLIO · NEW LISTING"
      title="Add a property"
      description="A few thoughtful details are all it takes to get started."
    />
    <div v-if="!can('createProperties')" class="permission-notice">
      Your preview role does not have permission to create properties.
    </div>
    <PropertyForm
      v-else
      :allow-publish="can('publishProperties')"
      @save="save"
    />
  </div>
</template>
