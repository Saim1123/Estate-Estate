<script setup lang="ts">
import { properties } from "~/data/properties";
const search = ref("");
const location = ref("");
const type = ref("");
const status = ref("");
const maxPrice = ref("");
const sortBy = ref("featured");
const filtersOpen = ref(false);
const filtered = computed(() => {
  let result = properties.filter((property) => {
    const matchesSearch =
      !search.value ||
      `${property.title} ${property.location}`
        .toLowerCase()
        .includes(search.value.toLowerCase());
    return (
      matchesSearch &&
      (!location.value || property.location.includes(location.value)) &&
      (!type.value || property.type === type.value) &&
      (!status.value || property.status === status.value) &&
      (!maxPrice.value || property.price <= Number(maxPrice.value))
    );
  });
  if (sortBy.value === "price-low")
    result = [...result].sort((a, b) => a.price - b.price);
  if (sortBy.value === "price-high")
    result = [...result].sort((a, b) => b.price - a.price);
  if (sortBy.value === "newest") result = [...result].reverse();
  return result;
});
function resetFilters() {
  search.value = "";
  location.value = "";
  type.value = "";
  status.value = "";
  maxPrice.value = "";
  sortBy.value = "featured";
}
</script>

<template>
  <section class="container page-intro">
    <span class="eyebrow">The collection</span>
    <h1 class="page-title">Find a place<br />that feels like yours.</h1>
    <p class="body-copy">
      Browse a considered selection of homes to buy and rent. The properties and
      neighbourhood examples are illustrative mock content.
    </p>
  </section>
  <section class="container listing-section">
    <div class="toolbar">
      <div class="search-wrap">
        <label class="sr-only" for="property-search"
          >Search by name or area</label
        ><span aria-hidden="true">⌕</span
        ><input
          id="property-search"
          v-model="search"
          class="form-control"
          placeholder="Search by name or area"
        />
      </div>
      <button
        class="btn btn-outline mobile-filter-toggle"
        type="button"
        :aria-expanded="filtersOpen"
        @click="filtersOpen = !filtersOpen"
      >
        {{ filtersOpen ? "Hide filters" : "Filters" }}
        <span aria-hidden="true">⌄</span></button
      ><label class="sort-control"
        ><span>Sort by</span
        ><select v-model="sortBy" class="form-control">
          <option value="featured">Featured</option>
          <option value="newest">Recently added</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select></label
      >
    </div>
    <div class="listing-layout">
      <aside
        class="filters"
        :class="{ 'filters-open': filtersOpen }"
        aria-label="Property filters"
      >
        <div class="filter-heading">
          <strong>Refine your search</strong
          ><button type="button" @click="resetFilters">Reset</button>
        </div>
        <label class="field-label" for="location">Neighbourhood</label
        ><select id="location" v-model="location" class="form-control">
          <option value="">All areas</option>
          <option>Clifton, Karachi</option>
          <option>DHA Phase 5, Karachi</option>
          <option>DHA Phase 6, Karachi</option>
          <option>DHA Phase 8, Karachi</option>
          <option>PECHS, Karachi</option>
        </select>
        <label class="field-label" for="status">Listing type</label
        ><select id="status" v-model="status" class="form-control">
          <option value="">Buy or rent</option>
          <option>For sale</option>
          <option>To rent</option>
        </select>
        <label class="field-label" for="property-type">Property type</label
        ><select id="property-type" v-model="type" class="form-control">
          <option value="">All types</option>
          <option>House</option>
          <option>Apartment</option>
          <option>Townhouse</option>
        </select>
        <label class="field-label" for="max-price">Maximum price (PKR)</label
        ><input
          id="max-price"
          v-model="maxPrice"
          class="form-control"
          type="number"
          min="0"
          placeholder="No maximum"
        />
      </aside>
      <div class="results">
        <div class="results-count">
          <span
            ><strong>{{ filtered.length }}</strong>
            {{ filtered.length === 1 ? "property" : "properties" }} found</span
          ><span class="muted">Illustrative listings</span>
        </div>
        <div v-if="filtered.length" class="results-grid">
          <PropertyCard
            v-for="property in filtered"
            :key="property.id"
            :property="property"
          />
        </div>
        <div v-else class="empty-state">
          <span class="eyebrow">No matches just yet</span>
          <h2 class="section-title">Try widening your search.</h2>
          <p class="body-copy">
            Adjust the filters or clear them to see all available properties.
          </p>
          <button class="btn" type="button" @click="resetFilters">
            Clear filters
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-intro h1 {
  margin: 14px 0 16px;
}
.page-intro p {
  margin: 0;
}
.listing-section {
  padding-bottom: 100px;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.search-wrap {
  position: relative;
  flex: 1;
  max-width: 480px;
}
.search-wrap > span {
  position: absolute;
  top: 10px;
  left: 13px;
  color: var(--muted);
  font-size: 1.3rem;
}
.search-wrap input {
  padding-left: 40px;
}
.sort-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  color: var(--muted);
  font-size: 0.8rem;
}
.sort-control select {
  width: 190px;
}
.listing-layout {
  display: grid;
  grid-template-columns: 225px minmax(0, 1fr);
  gap: 32px;
  padding-top: 25px;
}
.filters {
  align-self: start;
  display: grid;
  gap: 9px;
  padding: 16px;
  background: var(--cream);
}
.filter-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.88rem;
}
.filter-heading button {
  border: 0;
  padding: 4px 0;
  background: transparent;
  color: var(--green);
  font-size: 0.75rem;
  text-decoration: underline;
  cursor: pointer;
}
.filters .field-label {
  margin: 9px 0 -4px;
  font-size: 0.76rem;
}
.filters .form-control {
  height: 44px;
  font-size: 0.8rem;
}
.results-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 17px;
  font-size: 0.84rem;
}
.results-count strong {
  font-weight: 700;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.mobile-filter-toggle {
  display: none;
  min-height: 44px;
  padding-inline: 12px;
}
.empty-state {
  padding: 70px 20px;
  border: 1px solid var(--line);
  text-align: center;
}
.empty-state h2 {
  margin: 12px 0;
}
.empty-state .body-copy {
  margin: 0 auto 22px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 900px) {
  .listing-layout {
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 22px;
  }
  .results-grid {
    gap: 14px;
  }
}
@media (max-width: 680px) {
  .listing-section {
    padding-bottom: 64px;
  }
  .toolbar {
    flex-wrap: wrap;
  }
  .search-wrap {
    flex-basis: calc(100% - 120px);
    max-width: none;
  }
  .mobile-filter-toggle {
    display: inline-flex;
  }
  .sort-control {
    flex: 1;
    justify-content: space-between;
    margin-left: 0;
  }
  .sort-control select {
    width: min(65%, 230px);
  }
  .listing-layout {
    grid-template-columns: 1fr;
    gap: 18px;
    padding-top: 16px;
  }
  .filters {
    display: none;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
  }
  .filters.filters-open {
    display: grid;
  }
  .filter-heading {
    grid-column: 1 / -1;
  }
  .filters .field-label {
    margin-top: 4px;
  }
  .results-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 420px) {
  .filters.filters-open {
    grid-template-columns: 1fr;
  }
}
</style>
