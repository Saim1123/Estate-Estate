<script setup lang="ts">
definePageMeta({ layout: "admin" });
const { properties, can, log } = useAdminDemo();
const query = ref("");
const statusFilter = ref("All status");
const listingFilter = ref("All types");
const page = ref(1);
const pageSize = 5;
const pendingDelete = ref<any>(null);
const viewing = ref<any>(null);
const toast = ref("");
const filtered = computed(() =>
  properties.value.filter(
    (item) =>
      `${item.title} ${item.city} ${item.area}`
        .toLowerCase()
        .includes(query.value.toLowerCase()) &&
      (statusFilter.value === "All status" ||
        item.status === statusFilter.value) &&
      (listingFilter.value === "All types" ||
        item.listing === listingFilter.value),
  ),
);
const pages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize)),
);
const rows = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);
watch([query, statusFilter, listingFilter], () => (page.value = 1));
function remove() {
  properties.value = properties.value.filter(
    (item) => item.id !== pendingDelete.value.id,
  );
  log("deleted", pendingDelete.value.title);
  toast.value = "Property removed from your demo listings.";
  pendingDelete.value = null;
  setTimeout(() => (toast.value = ""), 3000);
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="YOUR PORTFOLIO"
      title="Properties"
      description="A considered collection of homes, ready to find their next chapter."
      :action-label="can('createProperties') ? 'Add property' : undefined"
      :action-to="can('createProperties') ? '/admin/properties/new' : undefined"
    />
    <div v-if="!can('viewProperties')" class="permission-notice">
      Your preview role does not have permission to view properties.
    </div>
    <template v-else>
      <div class="property-summary">
        <div>
          <strong>{{ properties.length }}</strong
          ><span>properties total</span>
        </div>
        <div>
          <strong>{{
            properties.filter((p) => p.status === "Published").length
          }}</strong
          ><span>published</span>
        </div>
        <div>
          <strong>{{
            properties.filter((p) => p.status === "Draft").length
          }}</strong
          ><span>in draft</span>
        </div>
        <span class="summary-decoration">PROPERTY INDEX <i>✳</i></span>
      </div>
      <section class="property-table-panel">
        <div class="table-toolbar">
          <div>
            <h2>All properties</h2>
            <p>Manage every listing in your portfolio.</p>
          </div>
          <div class="table-filters">
            <label class="search-field"
              ><span>⌕</span
              ><input v-model="query" placeholder="Search properties…" /><kbd
                >⌘ K</kbd
              ></label
            ><select v-model="listingFilter" aria-label="Filter listing type">
              <option>All types</option>
              <option>Sale</option>
              <option>Rent</option></select
            ><select v-model="statusFilter" aria-label="Filter status">
              <option>All status</option>
              <option>Published</option>
              <option>Draft</option>
              <option>Review</option>
            </select>
          </div>
        </div>
        <div class="table-overflow">
          <table class="property-table">
            <thead>
              <tr>
                <th>PROPERTY</th>
                <th>LISTING</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th>UPDATED</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="property in rows" :key="property.id">
                <td>
                  <div class="table-property">
                    <img :src="property.image" :alt="property.title" />
                    <div>
                      <b>{{ property.title }}</b
                      ><small>{{ property.area }}, {{ property.city }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="listing-type"
                    >{{ property.type }} <i>·</i> {{ property.listing }}</span
                  >
                </td>
                <td class="price-cell">
                  <b>₨ {{ Number(property.price).toLocaleString() }}</b
                  ><small v-if="property.listing === 'Rent'">per month</small>
                </td>
                <td>
                  <span
                    class="status-pill"
                    :class="property.status.toLowerCase()"
                    >{{ property.status }}</span
                  >
                </td>
                <td class="date-cell">{{ property.updated }}</td>
                <td>
                  <div class="row-actions">
                    <button
                      aria-label="View property"
                      title="View"
                      @click="viewing = property"
                    >
                      ◉</button
                    ><NuxtLink
                      v-if="can('editProperties')"
                      :to="`/admin/properties/${property.id}`"
                      title="Edit"
                      aria-label="Edit property"
                      >↗</NuxtLink
                    ><button
                      v-if="can('deleteProperties')"
                      aria-label="Delete property"
                      title="Delete"
                      class="delete-action"
                      @click="pendingDelete = property"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!rows.length">
                <td colspan="6">
                  <div class="empty-table">
                    <span>⌂</span
                    ><b>{{
                      query
                        ? "No properties match your search"
                        : "No properties yet"
                    }}</b>
                    <p>
                      {{
                        query
                          ? "Try a different name, location, or filter."
                          : "Create your first listing to get started."
                      }}
                    </p>
                    <NuxtLink
                      v-if="!query && can('createProperties')"
                      to="/admin/properties/new"
                      class="admin-button primary small"
                      >Add a property</NuxtLink
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-pagination">
          <span
            >Showing
            <b
              >{{ filtered.length ? (page - 1) * pageSize + 1 : 0 }}–{{
                Math.min(page * pageSize, filtered.length)
              }}</b
            >
            of <b>{{ filtered.length }}</b> properties</span
          >
          <div>
            <button
              :disabled="page <= 1"
              aria-label="Previous page"
              @click="page--"
            >
              ‹</button
            ><button
              v-for="number in pages"
              :key="number"
              :class="{ selected: page === number }"
              @click="page = number"
            >
              {{ number }}</button
            ><button
              :disabled="page >= pages"
              aria-label="Next page"
              @click="page++"
            >
              ›
            </button>
          </div>
        </div>
      </section>
      <div v-if="toast" class="admin-toast">✓ {{ toast }}</div>
    </template>
    <div
      v-if="pendingDelete"
      class="modal-backdrop"
      @click.self="pendingDelete = null"
    >
      <section
        class="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <span class="modal-icon danger-icon">×</span>
        <h2 id="delete-title">Remove this property?</h2>
        <p>
          <b>{{ pendingDelete.title }}</b> will be removed from your demo
          workspace. This action cannot be undone.
        </p>
        <div>
          <button class="admin-button" @click="pendingDelete = null">
            Keep property</button
          ><button class="admin-button danger" @click="remove">
            Delete property
          </button>
        </div>
      </section>
    </div>
    <div v-if="viewing" class="modal-backdrop" @click.self="viewing = null">
      <section class="view-modal" role="dialog" aria-modal="true">
        <img :src="viewing.image" :alt="viewing.title" /><button
          class="modal-close"
          aria-label="Close"
          @click="viewing = null"
        >
          ×
        </button>
        <div>
          <span class="panel-eyebrow"
            >{{ viewing.type }} · {{ viewing.listing }}</span
          >
          <h2>{{ viewing.title }}</h2>
          <p>{{ viewing.address }}, {{ viewing.city }}</p>
          <strong
            >₨ {{ Number(viewing.price).toLocaleString() }}
            <small v-if="viewing.listing === 'Rent'">/ month</small></strong
          >
          <div class="view-meta">
            {{ viewing.beds }} bedrooms <i>·</i> {{ viewing.baths }} bathrooms
            <i>·</i> {{ Number(viewing.areaSize).toLocaleString() }} sq. ft.
          </div>
          <span class="status-pill" :class="viewing.status.toLowerCase()">{{
            viewing.status
          }}</span
          ><NuxtLink
            v-if="can('editProperties')"
            :to="`/admin/properties/${viewing.id}`"
            class="admin-button primary"
            >Edit listing ↗</NuxtLink
          >
        </div>
      </section>
    </div>
  </div>
</template>
<style>
.property-summary {
  display: flex;
  align-items: center;
  gap: 35px;
  background: #efede7;
  padding: 15px 18px;
  margin-bottom: 14px;
}
.property-summary > div {
  display: grid;
  gap: 3px;
}
.property-summary strong {
  font: 18px var(--serif, Georgia, serif);
  font-weight: 400;
}
.property-summary span {
  font-size: 9px;
  color: #8b8c84;
}
.summary-decoration {
  margin-left: auto !important;
  letter-spacing: 1.5px !important;
  font-size: 8px !important;
  color: #aaa295 !important;
}
.summary-decoration i {
  font-style: normal;
  font-size: 16px;
  color: #ac8c65;
  margin-left: 8px;
}
.property-table-panel {
  background: #fff;
  border: 1px solid #e9e6df;
}
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 16px 18px;
  border-bottom: 1px solid #efede7;
}
.table-toolbar h2 {
  font: 400 16px var(--serif, Georgia, serif);
  margin: 0 0 4px;
}
.table-toolbar p {
  margin: 0;
  color: #9a9a92;
  font-size: 9px;
}
.table-filters {
  display: flex;
  gap: 7px;
}
.search-field {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #e9e6df;
  padding: 0 8px;
  color: #a1a097;
}
.search-field > span {
  font-size: 16px;
}
.search-field input {
  width: 140px;
  border: 0;
  outline: 0;
  font-size: 9px;
  color: #42443f;
}
.search-field input::placeholder {
  color: #aaa99f;
}
.search-field kbd {
  font-size: 8px;
  color: #aaa99f;
  border: 1px solid #eeece6;
  padding: 2px 3px;
}
.table-filters select {
  height: 32px;
  border: 1px solid #e9e6df;
  background: white;
  padding: 0 24px 0 8px;
  font-size: 9px;
  color: #686961;
}
.table-overflow {
  overflow: auto;
}
.property-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}
.property-table th {
  text-align: left;
  padding: 11px 13px;
  font-size: 8px;
  letter-spacing: 0.8px;
  color: #a2a198;
  font-weight: 600;
  background: #fbfaf8;
}
.property-table td {
  padding: 11px 13px;
  border-top: 1px solid #f0eee9;
  font-size: 9px;
}
.property-table th:first-child,
.property-table td:first-child {
  padding-left: 18px;
}
.table-property {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 205px;
}
.table-property img {
  width: 48px;
  height: 38px;
  object-fit: cover;
  border-radius: 2px;
}
.table-property div {
  display: grid;
  gap: 4px;
}
.table-property b,
.price-cell b {
  font-size: 9px;
  font-weight: 600;
  color: #42443e;
}
.table-property small,
.price-cell small {
  font-size: 8px;
  color: #9a9b93;
}
.listing-type {
  color: #66685f;
}
.listing-type i {
  font-style: normal;
  color: #b4ad9f;
  margin: 0 3px;
}
.price-cell {
  display: grid;
  gap: 4px;
}
.date-cell {
  font-size: 9px;
  color: #8b8c84;
}
.row-actions {
  display: flex;
  gap: 5px;
  justify-content: flex-end;
}
.row-actions button,
.row-actions a {
  border: 1px solid transparent;
  background: transparent;
  color: #929188;
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
}
.row-actions button:hover,
.row-actions a:hover {
  background: #f5f3ee;
  border-color: #ebe8e0;
  color: #4d4e46;
}
.row-actions .delete-action:hover {
  color: #a85145;
  background: #fbf1ef;
}
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 17px;
  color: #999a92;
  font-size: 9px;
  border-top: 1px solid #efede7;
}
.table-pagination b {
  color: #5e6058;
  font-weight: 600;
}
.table-pagination > div {
  display: flex;
  gap: 3px;
}
.table-pagination button {
  width: 25px;
  height: 25px;
  border: 1px solid transparent;
  background: transparent;
  color: #82837b;
  font-size: 10px;
  cursor: pointer;
  border-radius: 3px;
}
.table-pagination button.selected {
  background: #f1eee8;
  color: #68583f;
}
.table-pagination button:disabled {
  opacity: 0.35;
  cursor: default;
}
.empty-table {
  padding: 45px 10px;
  text-align: center;
  display: grid;
  justify-items: center;
  gap: 8px;
}
.empty-table > span {
  font-size: 24px;
  color: #b4a283;
}
.empty-table b {
  font: 16px var(--serif, Georgia, serif);
}
.empty-table p {
  font-size: 10px;
  color: #96978f;
  margin: 0 0 5px;
}
.admin-toast {
  position: fixed;
  right: 25px;
  bottom: 25px;
  padding: 12px 17px;
  background: #34483b;
  color: white;
  font-size: 11px;
  box-shadow: 0 7px 22px #0002;
  z-index: 30;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: #24251f88;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 16px;
}
.confirm-modal {
  background: white;
  width: min(100%, 390px);
  padding: 28px;
  text-align: center;
  box-shadow: 0 12px 45px #0002;
}
.modal-icon {
  display: grid;
  place-items: center;
  margin: auto;
  width: 37px;
  height: 37px;
  border-radius: 50%;
  font-size: 21px;
}
.danger-icon {
  background: #f8eeeb;
  color: #a35b4d;
}
.confirm-modal h2 {
  font: 22px var(--serif, Georgia, serif);
  margin: 14px 0 8px;
}
.confirm-modal p {
  font-size: 11px;
  line-height: 1.6;
  color: #82837b;
  margin: 0;
}
.confirm-modal p b {
  color: #474942;
}
.confirm-modal > div {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 21px;
}
.confirm-modal .admin-button {
  font-size: 9px;
}
.view-modal {
  position: relative;
  background: white;
  width: min(100%, 700px);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  box-shadow: 0 12px 45px #0002;
}
.view-modal > img {
  width: 100%;
  height: 100%;
  min-height: 320px;
  object-fit: cover;
}
.view-modal > div {
  padding: 35px 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.view-modal h2 {
  font: 26px var(--serif, Georgia, serif);
  margin: 0;
}
.view-modal p {
  font-size: 11px;
  color: #898a82;
  margin: 0;
}
.view-modal > div > strong {
  font: 18px var(--serif, Georgia, serif);
  margin-top: 5px;
}
.view-modal > div > strong small {
  font: 10px var(--sans, Arial, sans-serif);
  color: #8a8b83;
}
.view-meta {
  font-size: 10px;
  color: #82837a;
  margin: 2px 0;
}
.view-meta i {
  font-style: normal;
  color: #c0b7a7;
  margin: 0 4px;
}
.view-modal .admin-button {
  margin-top: 5px;
}
.modal-close {
  position: absolute;
  right: 10px;
  top: 8px;
  width: 30px;
  height: 30px;
  border: 0;
  background: #ffffffd9;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  color: #53544d;
}
.permission-notice {
  padding: 30px;
  background: white;
  border: 1px solid #e9e6df;
  font-size: 12px;
  color: #85867e;
}
@media (max-width: 920px) {
  .table-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .table-filters {
    width: 100%;
    flex-wrap: wrap;
  }
  .search-field {
    flex: 1;
  }
  .search-field input {
    width: 100%;
  }
}
@media (max-width: 560px) {
  .property-summary {
    gap: 16px;
    padding: 13px;
  }
  .summary-decoration {
    display: none;
  }
  .property-table {
    min-width: 700px;
  }
  .table-pagination {
    gap: 8px;
  }
  .table-pagination > span {
    font-size: 8px;
  }
  .table-pagination button {
    width: 23px;
  }
  .view-modal {
    grid-template-columns: 1fr;
    max-height: 90vh;
    overflow: auto;
  }
  .view-modal > img {
    height: 190px;
    min-height: 0;
  }
  .view-modal > div {
    padding: 22px;
  }
  .confirm-modal {
    padding: 23px 17px;
  }
  .confirm-modal > div {
    flex-direction: column;
  }
}
</style>
