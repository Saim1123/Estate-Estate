<script setup lang="ts">
definePageMeta({ layout: "admin" });
const { saveProperty, can } = useAdminDemo();
const router = useRouter();
async function save(
  value: Record<string, any>,
  complete: (error?: string) => void,
) {
  if (!can("createProperties"))
    return complete("You do not have permission to create properties.");
  try {
    await saveProperty(value);
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
