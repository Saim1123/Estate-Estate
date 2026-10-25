<script setup lang="ts">
definePageMeta({ layout: "admin" });
const route = useRoute();
const router = useRouter();
const { properties, saveProperty, can } = useAdminDemo();
const property = computed(() =>
  properties.value.find((item) => item.id === route.params.id),
);
async function save(
  value: Record<string, any>,
  complete: (error?: string) => void,
) {
  if (!can("editProperties") || !property.value)
    return complete("You do not have permission to edit properties.");
  try {
    await saveProperty({ ...property.value, ...value });
    complete();
    setTimeout(() => router.push("/admin/properties"), 650);
  } catch (error: any) {
    complete(error?.data?.statusMessage || "The property could not be saved.");
  }
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="PORTFOLIO · EDIT LISTING"
      :title="property ? property.title : 'Property not found'"
      description="Update the details and keep your portfolio current."
    />
    <div v-if="!can('editProperties')" class="permission-notice">
      Your preview role does not have permission to edit properties.
    </div>
    <div v-else-if="!property" class="permission-notice">
      This demo listing may have been removed.
      <NuxtLink to="/admin/properties">Return to properties →</NuxtLink>
    </div>
    <PropertyForm
      v-else
      :initial="property"
      :allow-publish="can('publishProperties')"
      @save="save"
    />
  </div>
</template>
