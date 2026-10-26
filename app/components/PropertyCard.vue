<script setup lang="ts">
import type { Property } from "~/data/properties";
defineProps<{ property: Property }>();
const saved = ref(false);
</script>

<template>
  <article class="property-card">
    <div class="card-photo">
      <NuxtLink :to="`/properties/${property.id}`" class="card-image-link" :aria-label="`View ${property.title}`">
        <img :src="property.image" :alt="`Illustrative photograph of ${property.title}`" loading="lazy" />
      </NuxtLink>
      <span class="status">{{ property.status }}</span>
      <button class="save-button" type="button" :aria-label="saved ? 'Remove from saved homes' : 'Save this home'" :aria-pressed="saved" @click="saved = !saved">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
      </button>
    </div>
    <div class="card-body">
      <div class="card-heading">
        <h3><NuxtLink :to="`/properties/${property.id}`">{{ property.location }}</NuxtLink></h3>
        <span class="rating" aria-label="Featured listing"><span aria-hidden="true">★</span> New</span>
      </div>
      <p class="subheading">{{ property.title }} · {{ property.type }}</p>
      <p class="subheading">{{ property.beds }} beds · {{ property.baths }} baths · {{ property.area.toLocaleString() }} sq ft</p>
      <p class="price"><strong>{{ property.priceLabel }}</strong><span v-if="property.status === 'To rent'"> per month</span></p>
    </div>
  </article>
</template>

<style scoped>
.property-card { min-width: 0; }
.card-photo { position: relative; overflow: hidden; aspect-ratio: 1.04; border-radius: 13px; background: #f1f1ef; }
.card-image-link { display: block; width: 100%; height: 100%; }
.card-image-link img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.property-card:hover .card-image-link img { transform: scale(1.035); }
.status { position: absolute; top: 13px; left: 13px; padding: 8px 12px; border-radius: 999px; background: white; color: #222; font-size: .74rem; font-weight: 700; box-shadow: 0 1px 3px #00000018; }
.save-button { position: absolute; top: 12px; right: 12px; display: grid; width: 38px; height: 38px; place-items: center; border: 0; border-radius: 50%; background: transparent; color: white; cursor: pointer; filter: drop-shadow(0 1px 2px #0008); transition: transform .18s, color .18s; }
.save-button:hover { transform: scale(1.08); }
.save-button[aria-pressed="true"] { color: #e85565; }
.save-button svg { width: 25px; fill: transparent; stroke: currentColor; stroke-width: 1.8; }
.save-button[aria-pressed="true"] svg { fill: currentColor; }
.card-body { padding: 12px 1px 0; }
.card-heading { display: flex; justify-content: space-between; align-items: center; gap: 9px; }
.card-heading h3 { overflow: hidden; margin: 0; font-size: .95rem; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
.rating { flex: none; color: #333; font-size: .78rem; }
.rating span { font-size: .85rem; }
.subheading { overflow: hidden; margin: 4px 0 0; color: #717171; font-size: .83rem; text-overflow: ellipsis; white-space: nowrap; }
.price { margin: 9px 0 0; font-size: .84rem; }
.price strong { text-decoration: underline; text-underline-offset: 2px; }
.price span { color: #555; }
@media (max-width: 440px) { .card-photo { aspect-ratio: 1.12; } }
</style>
