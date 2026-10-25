<script setup lang="ts">
const props = withDefaults(
  defineProps<{ initial?: Record<string, any>; allowPublish?: boolean }>(),
  { allowPublish: false },
);
const emit = defineEmits<{
  save: [value: Record<string, any>, complete: (error?: string) => void];
}>();
const form = reactive({
  title: "",
  description: "",
  price: "",
  type: "House",
  listing: "Sale",
  beds: "",
  baths: "",
  areaSize: "",
  address: "",
  city: "Karachi",
  area: "",
  status: "Draft",
  image: "",
});

const errors = ref<Record<string, string>>({});
const saved = ref(false);
const isSaving = ref(false);
const saveError = ref("");
const fileInput = ref<HTMLInputElement>();

watch(
  () => props.initial,
  (value) => {
    if (value) Object.assign(form, value);
  },
  { immediate: true },
);

function preview(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) form.image = URL.createObjectURL(file);
}

function submit() {
  errors.value = {};
  saveError.value = "";
  for (const key of [
    "title",
    "description",
    "price",
    "address",
    "area",
    "city",
    "areaSize",
  ])
    if (!String(form[key as keyof typeof form]).trim())
      errors.value[key] = "This field is required.";
  if (Number(form.price) <= 0) errors.value.price = "Enter a valid price.";
  if (Object.keys(errors.value).length) return;
  if (isSaving.value) return;
  isSaving.value = true;
  emit(
    "save",
    {
      ...form,
      price: Number(form.price),
      beds: Number(form.beds || 0),
      baths: Number(form.baths || 0),
      areaSize: Number(form.areaSize),
    },
    (error) => {
      isSaving.value = false;
      if (error) {
        saveError.value = error;
        return;
      }
      saved.value = true;
      setTimeout(() => (saved.value = false), 4000);
    },
  );
}
</script>
<template>
  <form class="property-form" @submit.prevent="submit">
    <div class="form-main-column">
      <section class="form-panel">
        <div class="form-panel-title">
          <span class="form-step">01</span>
          <div>
            <h2>Property details</h2>
            <p>Start with the essentials of the listing.</p>
          </div>
        </div>
        <div class="field-grid">
          <label class="field full"
            ><span>Property title <i>*</i></span
            ><UInput class="admin-ui-input"
              v-model="form.title"
              placeholder="e.g. Seafront Residence"
              size="sm"
            /><small v-if="errors.title">{{ errors.title }}</small></label
          >
          <label class="field full"
            ><span>Description <i>*</i></span
            ><UTextarea class="admin-ui-textarea"
              v-model="form.description"
              rows="4"
              placeholder="Describe what makes this property special…"
            /><small v-if="errors.description">{{
              errors.description
            }}</small></label
          >
          <label class="field"
            ><span>Price (PKR) <i>*</i></span>
            <div class="price-input">
              <span>₨</span
              ><UInput class="admin-ui-input"
                v-model="form.price"
                type="number"
                min="1"
                placeholder="0"
                size="sm"
              />
            </div>
            <small v-if="errors.price">{{ errors.price }}</small></label
          >
          <label class="field"
            ><span>Property type <i>*</i></span
            ><USelect class="admin-ui-select"
              v-model="form.type"
              :items="['House', 'Apartment', 'Townhouse', 'Plot', 'Commercial']"
              size="sm"
            /></label
          >
          <label class="field"
            ><span>Listing type <i>*</i></span
            ><USelect class="admin-ui-select" v-model="form.listing" :items="['Sale', 'Rent']" size="sm" /></label
          >
          <div class="field">
            <span>Bedrooms & bathrooms</span>
            <div class="field-pair">
              <UInput class="admin-ui-input"
                v-model="form.beds"
                type="number"
                min="0"
                placeholder="Bedrooms"
                size="sm"
              /><UInput class="admin-ui-input"
                v-model="form.baths"
                type="number"
                min="0"
                placeholder="Bathrooms"
                size="sm"
              />
            </div>
          </div>
          <label class="field"
            ><span>Area (sq. ft.) <i>*</i></span
            ><UInput class="admin-ui-input"
              v-model="form.areaSize"
              type="number"
              min="1"
              placeholder="e.g. 2,400"
              size="sm"
            /><small v-if="errors.areaSize">{{ errors.areaSize }}</small></label
          >
        </div>
      </section>
      <section class="form-panel">
        <div class="form-panel-title">
          <span class="form-step">02</span>
          <div>
            <h2>Location</h2>
            <p>Where can this property be found?</p>
          </div>
        </div>
        <div class="field-grid">
          <label class="field full"
            ><span>Street address <i>*</i></span
            ><UInput class="admin-ui-input"
              v-model="form.address"
              placeholder="House number and street"
              size="sm"
            /><small v-if="errors.address">{{ errors.address }}</small></label
          ><label class="field"
            ><span>City <i>*</i></span
            ><USelect class="admin-ui-select" v-model="form.city" :items="['Karachi', 'Lahore', 'Islamabad']" size="sm" /></label
          ><label class="field"
            ><span>Neighbourhood / area <i>*</i></span
            ><UInput class="admin-ui-input" v-model="form.area" placeholder="e.g. DHA Phase 8" size="sm" /><small
              v-if="errors.area"
              >{{ errors.area }}</small
            ></label
          >
        </div>
      </section>
    </div>
    <div class="form-side-column">
      <section class="form-panel">
        <div class="form-panel-title">
          <span class="form-step">03</span>
          <div>
            <h2>Cover image</h2>
            <p>Add a first impression.</p>
          </div>
        </div>
        <UButton type="button" class="image-drop" variant="ghost" @click="fileInput?.click()">
          <img
            v-if="form.image"
            :src="form.image"
            alt="Property preview"
          /><template v-else
            ><span class="upload-icon">↥</span><b>Choose an image</b
            ><small>JPG or PNG · Local preview only</small></template
          ></UButton
        ><input
          ref="fileInput"
          hidden
          type="file"
          accept="image/*"
          @change="preview"
        /><UButton
          v-if="form.image"
          type="button"
          class="remove-image"
          variant="ghost"
          @click="form.image = ''"
        >
          Remove image
        </UButton>
      </section>
      <section class="form-panel status-panel">
        <div class="form-panel-title">
          <span class="form-step">04</span>
          <div>
            <h2>Listing status</h2>
            <p>Choose how this listing appears.</p>
          </div>
        </div>
        <label class="field"
          ><span>Status</span
          ><USelect class="admin-ui-select"
            v-model="form.status"
            :items="['Draft', 'Review', 'Published']"
            :disabled="!allowPublish"
            size="sm"
          /></label
        >
        <div class="publish-note">
          <span>ⓘ</span>
          <p>
            {{
              allowPublish
                ? "Published listings are visible on the public website."
                : "Your preview role can save listings as drafts. Publishing requires the publish permission."
            }}
            Your changes are stored in the development server process only.
          </p>
        </div>
      </section>
      <div class="form-actions">
        <UButton
          type="submit"
          class="admin-button primary"
          color="primary"
          :disabled="isSaving"
          :aria-busy="isSaving"
        >
          {{ isSaving ? "Saving…" : "Save property" }} <span>→</span></UButton
        ><NuxtLink to="/admin/properties" class="cancel-link">Cancel</NuxtLink>
        <p v-if="saved" class="save-success">
          ✓ Property saved to the development workspace.
        </p>
        <p v-if="saveError" class="form-save-error" role="alert">
          {{ saveError }}
        </p>
      </div>
    </div>
  </form>
</template>
<style>
.property-form {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(235px, 0.9fr);
  gap: 18px;
  align-items: start;
}
.form-save-error {
  grid-column: 1 / -1;
  margin: 0;
  color: #9a3e34;
  font-size: 10px;
}
.form-main-column,
.form-side-column {
  display: grid;
  gap: 15px;
}
.form-panel {
  background: white;
  border: 1px solid #e9e6df;
  padding: 19px 20px;
}
.form-panel-title {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 20px;
}
.form-step {
  font: 13px var(--serif, Georgia, serif);
  color: #a47c53;
  border: 1px solid #e9e3d8;
  border-radius: 50%;
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  flex: none;
}
.form-panel-title h2 {
  font: 500 14px var(--sans, Arial, sans-serif);
  margin: 1px 0 4px;
  color: #333730;
}
.form-panel-title p {
  font-size: 10px;
  color: #999a92;
  margin: 0;
}
.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 13px;
}
.field {
  display: grid;
  gap: 7px;
  font-size: 10px;
  color: #666860;
}
.field > span {
  font-weight: 600;
  color: #5e6059;
}
.field i {
  font-style: normal;
  color: #b47757;
}
.field input,
.field select,
.field textarea,
.field-pair input {
  width: 100%;
  min-width: 0;
  border: 1px solid #e6e4de;
  border-radius: 3px;
  background: #fff;
  color: #373a34;
  padding: 10px 11px;
  font-size: 10px;
  outline: none;
}
.field input,
.field select {
  height: 37px;
}
.field textarea {
  resize: vertical;
  line-height: 1.55;
}
.field input:focus,
.field select:focus,
.field textarea:focus,
.field-pair input:focus {
  border-color: #b4a486;
  box-shadow: 0 0 0 2px #b4a4861c;
}
.field input::placeholder,
.field textarea::placeholder,
.field-pair input::placeholder {
  color: #b1b1aa;
}
.field small {
  font-size: 9px;
  color: #a95148;
}
.full {
  grid-column: 1/-1;
}
.price-input {
  display: flex;
}
.price-input span {
  height: 37px;
  padding: 10px 11px;
  border: 1px solid #e6e4de;
  border-right: 0;
  background: #f9f8f5;
  color: #88867c;
}
.price-input input {
  border-radius: 0 3px 3px 0;
}
.field-pair {
  display: flex;
  gap: 7px;
}
.field-pair input {
  height: 37px;
}
.image-drop {
  width: 100%;
  aspect-ratio: 1.6;
  border: 1px dashed #d8d3c9;
  background: #faf9f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #696961;
  cursor: pointer;
  overflow: hidden;
}
.image-drop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload-icon {
  font-size: 22px;
  color: #a47c53;
}
.image-drop b {
  font-size: 10px;
  font-weight: 600;
}
.image-drop small {
  font-size: 9px;
  color: #a2a198;
}
.remove-image {
  font-size: 9px;
  border: 0;
  background: none;
  color: #9c6355;
  cursor: pointer;
  margin-top: 7px;
}
.status-panel .field {
  margin-bottom: 14px;
}
.publish-note {
  display: flex;
  gap: 8px;
  border-top: 1px solid #efede7;
  padding-top: 12px;
  color: #a47c53;
}
.publish-note p {
  margin: 0;
  font-size: 9px;
  line-height: 1.6;
  color: #8f9088;
}
.form-actions {
  display: grid;
  gap: 12px;
}
.form-actions .admin-button {
  width: 100%;
}
.form-actions .admin-button span {
  font-size: 14px;
}
.cancel-link {
  text-align: center;
  font-size: 10px;
  color: #85867d;
}
.save-success {
  margin: 0;
  text-align: center;
  color: #54734d;
  font-size: 10px;
  line-height: 1.5;
}
@media (max-width: 800px) {
  .property-form {
    grid-template-columns: 1fr;
  }
  .form-side-column {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
  .form-actions {
    grid-column: 1/-1;
    grid-template-columns: 1fr auto;
    align-items: center;
  }
  .form-actions .admin-button {
    width: auto;
  }
  .cancel-link {
    padding: 10px;
  }
  .save-success {
    grid-column: 1/-1;
  }
}
@media (max-width: 520px) {
  .form-panel {
    padding: 16px;
  }
  .field-grid {
    grid-template-columns: 1fr;
  }
  .full {
    grid-column: auto;
  }
  .form-side-column {
    grid-template-columns: 1fr;
  }
  .form-actions {
    grid-template-columns: 1fr;
  }
  .cancel-link {
    padding: 0;
  }
  .form-actions .admin-button {
    width: 100%;
  }
}
</style>
