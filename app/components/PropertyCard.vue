<script setup lang="ts">
import type { Property } from "~/data/properties";
defineProps<{ property: Property }>();
</script>

<template>
  <article class="property-card">
    <NuxtLink
      :to="`/properties/${property.id}`"
      class="card-image-link"
      :aria-label="`View ${property.title}`"
    >
      <img
        :src="property.image"
        :alt="`Illustrative photograph of ${property.title}`"
        loading="lazy"
      />
      <span class="status">{{ property.status }}</span>
    </NuxtLink>
    <div class="card-body">
      <div class="card-heading">
        <h3>
          <NuxtLink :to="`/properties/${property.id}`">{{
            property.title
          }}</NuxtLink>
        </h3>
        <strong>{{ property.priceLabel }}</strong>
      </div>
      <p class="location">{{ property.location }}</p>
      <div class="card-meta">
        <span>{{ property.beds }} beds</span
        ><span>{{ property.baths }} baths</span
        ><span>{{ property.area.toLocaleString() }} sq ft</span
        ><NuxtLink
          :to="`/properties/${property.id}`"
          class="view-link"
          :aria-label="`View ${property.title} details`"
          >View <span aria-hidden="true">↗</span></NuxtLink
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.property-card {
  min-width: 0;
  background: white;
}
.card-image-link {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 1.43;
  background: var(--cream);
}
.card-image-link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s;
}
.property-card:hover img {
  transform: scale(1.025);
}
.status {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 7px 10px;
  background: var(--paper);
  color: var(--ink);
  font-size: 0.69rem;
  font-weight: 700;
}
.card-body {
  padding: 18px 18px 15px;
  border: 1px solid var(--line);
  border-top: 0;
}
.card-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.card-heading h3 {
  margin: 0;
  font: 400 1.25rem var(--serif);
}
.card-heading strong {
  color: var(--green);
  font-size: 0.84rem;
  text-align: right;
}
.location {
  margin: 7px 0 16px;
  color: var(--muted);
  font-size: 0.82rem;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-top: 13px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.73rem;
}
.view-link {
  margin-left: auto;
  color: var(--green);
  font-weight: 700;
  white-space: nowrap;
}
@media (max-width: 440px) {
  .card-body {
    padding-inline: 13px;
  }
  .card-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
  .card-meta {
    gap: 10px;
    font-size: 0.68rem;
  }
}
</style>
