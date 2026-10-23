<script setup lang="ts">
import { properties } from "~/data/properties";
const route = useRoute();
const property = computed(() =>
  properties.find((item) => item.id === route.params.id),
);
const activeImage = ref(0);
const related = computed(() =>
  properties.filter((item) => item.id !== property.value?.id).slice(0, 3),
);
watch(
  () => route.params.id,
  () => {
    activeImage.value = 0;
  },
);
function moveImage(direction: number) {
  if (!property.value) return;
  activeImage.value =
    (activeImage.value + direction + property.value.images.length) %
    property.value.images.length;
}
</script>

<template>
  <div v-if="property" class="container detail-page">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink><span>/</span
      ><NuxtLink to="/properties">Properties</NuxtLink><span>/</span
      ><span aria-current="page">{{ property.title }}</span>
    </nav>
    <div class="detail-heading">
      <div>
        <span class="eyebrow">{{ property.status }} · {{ property.type }}</span>
        <h1 class="page-title">{{ property.title }}</h1>
        <p class="location">
          {{ property.location }} <span>·</span> Illustrative area only
        </p>
      </div>
      <div class="price-box">
        <span>Asking price</span><strong>{{ property.priceLabel }}</strong>
      </div>
    </div>
    <div class="gallery">
      <div class="main-photo">
        <img
          :src="property.images[activeImage]"
          :alt="`${property.title}, view ${activeImage + 1}`"
        />
        <div class="gallery-controls">
          <button
            type="button"
            aria-label="Previous photo"
            @click="moveImage(-1)"
          >
            ←</button
          ><span
            >{{ String(activeImage + 1).padStart(2, "0") }} /
            {{ String(property.images.length).padStart(2, "0") }}</span
          ><button type="button" aria-label="Next photo" @click="moveImage(1)">
            →
          </button>
        </div>
      </div>
      <div class="thumbs">
        <button
          v-for="(image, index) in property.images"
          :key="image"
          type="button"
          :aria-label="`Show photo ${index + 1}`"
          :aria-pressed="activeImage === index"
          :class="{ selected: activeImage === index }"
          @click="activeImage = index"
        >
          <img :src="image" :alt="`${property.title} thumbnail ${index + 1}`" />
        </button>
        <div class="gallery-note">Illustrative mock property imagery</div>
      </div>
    </div>
    <div class="detail-columns">
      <div class="detail-main">
        <div class="facts">
          <div>
            <strong>{{ property.beds }}</strong
            ><span>Bedrooms</span>
          </div>
          <div>
            <strong>{{ property.baths }}</strong
            ><span>Bathrooms</span>
          </div>
          <div>
            <strong>{{ property.area.toLocaleString() }}</strong
            ><span>Approx. sq ft</span>
          </div>
          <div>
            <strong>{{ property.type }}</strong
            ><span>Property type</span>
          </div>
        </div>
        <section class="detail-section">
          <span class="eyebrow">The property</span>
          <h2 class="section-title">A home with room to settle in.</h2>
          <p class="body-copy">{{ property.description }}</p>
          <p class="body-copy disclaimer">
            This page presents an illustrative mock listing for design purposes.
            Availability, pricing, and property details have not been verified.
          </p>
        </section>
        <section class="detail-section features">
          <span class="eyebrow">Highlights</span>
          <h2 class="section-title">Considered details</h2>
          <ul>
            <li v-for="feature in property.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </section>
        <section class="detail-section location-section">
          <span class="eyebrow">The neighbourhood</span>
          <h2 class="section-title">{{ property.location }}</h2>
          <p class="body-copy">
            Explore the surrounding area with our team. This listing shows a
            neighbourhood only; no street address or precise location is
            provided.
          </p>
        </section>
      </div>
      <aside class="inquiry-card">
        <span class="eyebrow">Interested in this property?</span>
        <h2 class="section-title">Let’s talk it through.</h2>
        <p class="body-copy">
          Tell us what you’d like to know and we’ll help you understand the next
          steps.
        </p>
        <NuxtLink :to="`/contact?property=${property.id}`" class="btn"
          >Enquire about this home <span aria-hidden="true">↗</span></NuxtLink
        ><NuxtLink to="/properties" class="text-link"
          >Back to all properties <span aria-hidden="true">→</span></NuxtLink
        ><small>Mock listing · details are illustrative</small>
      </aside>
    </div>
    <section class="related">
      <div class="section-head">
        <div>
          <span class="eyebrow">Continue exploring</span>
          <h2 class="section-title">More places to consider.</h2>
        </div>
        <NuxtLink to="/properties" class="text-link"
          >All properties <span aria-hidden="true">→</span></NuxtLink
        >
      </div>
      <div class="related-grid">
        <PropertyCard v-for="item in related" :key="item.id" :property="item" />
      </div>
    </section>
  </div>
  <section v-else class="container not-found">
    <span class="eyebrow">Property unavailable</span>
    <h1 class="page-title">We couldn’t find that listing.</h1>
    <p class="body-copy">
      It may have been removed or the link may be incorrect.
    </p>
    <NuxtLink to="/properties" class="btn">Browse properties</NuxtLink>
  </section>
</template>

<style scoped>
.detail-page {
  padding-bottom: 90px;
}
.breadcrumbs {
  display: flex;
  gap: 10px;
  padding: 25px 0;
  color: var(--muted);
  font-size: 0.76rem;
}
.breadcrumbs a:hover {
  color: var(--green);
}
.detail-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 0 25px;
}
.detail-heading h1 {
  margin: 9px 0 6px;
}
.location {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
}
.location span {
  padding-inline: 4px;
}
.price-box {
  display: grid;
  gap: 6px;
  text-align: right;
}
.price-box span {
  color: var(--muted);
  font-size: 0.75rem;
}
.price-box strong {
  color: var(--green);
  font-size: 1.12rem;
}
.gallery {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(220px, 0.8fr);
  gap: 10px;
}
.main-photo {
  position: relative;
  min-height: 360px;
  aspect-ratio: 1.65;
  background: var(--cream);
}
.main-photo > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery-controls {
  position: absolute;
  right: 14px;
  bottom: 14px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 6px;
  background: var(--paper);
  font-size: 0.75rem;
}
.gallery-controls button {
  width: 34px;
  height: 34px;
  border: 0;
  background: white;
  color: var(--green);
  cursor: pointer;
  font-size: 1rem;
}
.thumbs {
  display: grid;
  grid-template-rows: 1fr 1fr auto;
  gap: 10px;
}
.thumbs button {
  min-height: 0;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  background: var(--cream);
  cursor: pointer;
}
.thumbs button.selected {
  border-color: var(--green);
}
.thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.gallery-note {
  color: var(--muted);
  font-size: 0.68rem;
}
.detail-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 60px;
  padding-top: 44px;
}
.facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 18px 0;
  border-block: 1px solid var(--line);
}
.facts div {
  display: grid;
  gap: 5px;
  padding: 0 12px;
  border-right: 1px solid var(--line);
}
.facts div:first-child {
  padding-left: 0;
}
.facts div:last-child {
  border: 0;
}
.facts strong {
  font: 400 1.35rem var(--serif);
}
.facts span {
  color: var(--muted);
  font-size: 0.72rem;
}
.detail-section {
  padding: 38px 0;
  border-bottom: 1px solid var(--line);
}
.detail-section h2 {
  margin: 10px 0 14px;
  font-size: 2.1rem;
}
.detail-section p {
  max-width: 700px;
}
.disclaimer {
  font-size: 0.82rem;
}
.features ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px 30px;
  padding: 0;
  list-style: none;
  color: var(--muted);
  font-size: 0.9rem;
}
.features li::before {
  content: "—";
  margin-right: 9px;
  color: var(--green);
}
.inquiry-card {
  align-self: start;
  position: sticky;
  top: 20px;
  display: grid;
  gap: 16px;
  padding: 24px;
  background: var(--cream);
}
.inquiry-card h2 {
  margin: 0;
  font-size: 2rem;
}
.inquiry-card p {
  margin: 0;
  font-size: 0.88rem;
}
.inquiry-card .text-link {
  justify-content: center;
}
.inquiry-card small {
  color: var(--muted);
  font-size: 0.68rem;
  text-align: center;
}
.related {
  padding-top: 78px;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 24px;
}
.section-head h2 {
  margin: 10px 0 0;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.not-found {
  min-height: 60vh;
  padding-block: 100px;
}
.not-found h1 {
  max-width: 700px;
  margin: 14px 0;
}
.not-found p {
  margin-bottom: 24px;
}
@media (max-width: 850px) {
  .detail-columns {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .inquiry-card {
    position: static;
    grid-row: 1;
  }
  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .related-grid > :last-child {
    display: none;
  }
}
@media (max-width: 600px) {
  .detail-page {
    padding-bottom: 64px;
  }
  .detail-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }
  .price-box {
    text-align: left;
  }
  .gallery {
    grid-template-columns: 1fr;
  }
  .main-photo {
    min-height: 250px;
    aspect-ratio: 1.15;
  }
  .thumbs {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 80px auto;
  }
  .thumbs button {
    grid-row: 1;
  }
  .gallery-note {
    grid-column: 1 / -1;
  }
  .detail-columns {
    padding-top: 24px;
  }
  .facts {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 0;
  }
  .facts div:nth-child(2) {
    border: 0;
  }
  .facts div:nth-child(3) {
    padding-left: 0;
  }
  .features ul {
    grid-template-columns: 1fr;
  }
  .related {
    padding-top: 55px;
  }
  .related-grid {
    grid-template-columns: 1fr;
  }
  .related-grid > :last-child {
    display: block;
  }
  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
