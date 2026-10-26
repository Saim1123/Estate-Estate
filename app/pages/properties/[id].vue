<script setup lang="ts">
import { properties } from "~/data/properties";

const route = useRoute();
const property = computed(() => properties.find((item) => item.id === route.params.id));
const related = computed(() => properties.filter((item) => item.id !== property.value?.id).slice(0, 3));
const activeImage = ref(0);
const galleryOpen = ref(false);
const saved = ref(false);
const shareMessage = ref("");

watch(() => route.params.id, () => {
  activeImage.value = 0;
  galleryOpen.value = false;
  saved.value = false;
});

function moveImage(direction: number) {
  if (!property.value) return;
  activeImage.value = (activeImage.value + direction + property.value.images.length) % property.value.images.length;
}

async function shareProperty() {
  if (!property.value) return;
  try {
    if (navigator.share) {
      await navigator.share({ title: property.value.title, url: window.location.href });
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    shareMessage.value = "Link copied";
  } catch {
    shareMessage.value = "Copy this page link from your browser";
  }
  window.setTimeout(() => (shareMessage.value = ""), 2500);
}
</script>

<template>
  <div v-if="property" class="container detail-page">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <NuxtLink to="/">Home</NuxtLink><span aria-hidden="true">›</span>
      <NuxtLink to="/properties">Properties</NuxtLink><span aria-hidden="true">›</span>
      <span aria-current="page">{{ property.title }}</span>
    </nav>

    <header class="listing-heading">
      <div class="listing-title">
        <h1>{{ property.title }}</h1>
        <p>{{ property.location }} <span aria-hidden="true">·</span> {{ property.status }} <span aria-hidden="true">·</span> {{ property.type }}</p>
      </div>
      <div class="listing-actions">
        <button type="button" @click="shareProperty"><span aria-hidden="true">↗</span> Share</button>
        <button type="button" :aria-pressed="saved" @click="saved = !saved"><span aria-hidden="true">{{ saved ? "♥" : "♡" }}</span> {{ saved ? "Saved" : "Save" }}</button>
        <span class="share-message" aria-live="polite">{{ shareMessage }}</span>
      </div>
    </header>

    <section class="photo-grid" aria-label="Property photos">
      <button v-for="(image, index) in property.images.slice(0, 3)" :key="image" type="button" class="photo-tile" :class="{ 'photo-primary': index === 0 }" :aria-label="`View photo ${index + 1} of ${property.title}`" @click="activeImage = index; galleryOpen = true">
        <img :src="image" :alt="`${property.title}, photo ${index + 1}`" :loading="index === 0 ? 'eager' : 'lazy'" />
      </button>
      <button class="all-photos" type="button" @click="activeImage = 0; galleryOpen = true"><span aria-hidden="true">▦</span> Show all {{ property.images.length }} photos</button>
    </section>

    <div class="detail-columns">
      <main class="detail-main">
        <div class="listing-facts">
          <div><strong>{{ property.beds }}</strong><span>bedrooms</span></div><i aria-hidden="true">·</i>
          <div><strong>{{ property.baths }}</strong><span>bathrooms</span></div><i aria-hidden="true">·</i>
          <div><strong>{{ property.area.toLocaleString() }}</strong><span>sq ft</span></div><i aria-hidden="true">·</i>
          <div><strong>{{ property.type }}</strong><span>property</span></div>
        </div>
        <section class="detail-section about-section">
          <span class="eyebrow">About this home</span>
          <h2>{{ property.title }}</h2>
          <p class="body-copy">{{ property.description }}</p>
          <p class="listing-disclaimer">Illustrative listing: pricing, availability, location and property details have not been independently verified.</p>
        </section>
        <section class="detail-section features-section">
          <span class="eyebrow">Inside the home</span>
          <h2>What this place offers</h2>
          <ul><li v-for="feature in property.features" :key="feature"><span aria-hidden="true">✓</span>{{ feature }}</li></ul>
        </section>
        <section class="detail-section location-section">
          <span class="eyebrow">Location</span>
          <h2>{{ property.location }}</h2>
          <p class="body-copy">The listing shows the neighbourhood only. Contact our team to discuss the area and arrange a viewing.</p>
          <div class="location-note"><span aria-hidden="true">⌖</span><div><strong>Neighbourhood only</strong><small>Street address is not shown on this demo listing</small></div></div>
        </section>
      </main>

      <aside class="inquiry-card">
        <div class="inquiry-price"><span>Asking price</span><strong>{{ property.priceLabel }}</strong></div>
        <div class="inquiry-summary"><span>{{ property.beds }} bedrooms</span><i>·</i><span>{{ property.baths }} bathrooms</span></div>
        <NuxtLink :to="`/contact?property=${property.id}`" class="btn inquiry-button">Contact about this home <span aria-hidden="true">→</span></NuxtLink>
        <p class="inquiry-note">Our team can answer questions and help arrange a viewing.</p>
        <NuxtLink to="/properties" class="all-listings">Browse all properties</NuxtLink>
      </aside>
    </div>

    <section class="related-section">
      <div class="related-heading"><div><span class="eyebrow">Keep exploring</span><h2>More homes to discover</h2></div><NuxtLink to="/properties">See all <span aria-hidden="true">→</span></NuxtLink></div>
      <div class="related-grid"><PropertyCard v-for="item in related" :key="item.id" :property="item" /></div>
    </section>

    <div v-if="galleryOpen" class="gallery-modal" role="dialog" aria-modal="true" aria-label="Property photo gallery" @click.self="galleryOpen = false" @keydown.esc.window="galleryOpen = false">
      <button type="button" class="gallery-close" aria-label="Close gallery" @click="galleryOpen = false">×</button>
      <button type="button" class="gallery-arrow previous" aria-label="Previous photo" @click="moveImage(-1)">‹</button>
      <figure><img :src="property.images[activeImage]" :alt="`${property.title}, photo ${activeImage + 1}`" /><figcaption>{{ activeImage + 1 }} / {{ property.images.length }}</figcaption></figure>
      <button type="button" class="gallery-arrow next" aria-label="Next photo" @click="moveImage(1)">›</button>
    </div>
  </div>
  <section v-else class="container not-found">
    <span class="eyebrow">Property unavailable</span><h1>We couldn’t find that listing.</h1>
    <p class="body-copy">It may have been removed or the link may be incorrect.</p>
    <NuxtLink to="/properties" class="btn">Browse properties</NuxtLink>
  </section>
</template>

<style scoped>
.detail-page { padding-bottom: 88px; }
.breadcrumbs { display: flex; align-items: center; gap: 9px; padding: 18px 0 22px; color: #717171; font-size: .82rem; }
.breadcrumbs a { text-decoration: underline; text-underline-offset: 2px; }
.breadcrumbs a:hover { color: #222; }
.breadcrumbs span[aria-current="page"] { overflow: hidden; color: #444; text-overflow: ellipsis; white-space: nowrap; }
.listing-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 19px; }
.listing-title h1 { margin: 0 0 7px; font-size: clamp(1.7rem, 3vw, 2.15rem); font-weight: 650; line-height: 1.15; letter-spacing: -.045em; }
.listing-title p { margin: 0; color: #555; font-size: .93rem; }
.listing-title p span { padding-inline: 4px; color: #888; }
.listing-actions { position: relative; display: flex; gap: 8px; flex: none; }
.listing-actions button { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; padding: 0 11px; border: 0; border-radius: 999px; background: white; color: #333; font-size: .84rem; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
.listing-actions button:hover { background: #f5f5f4; }
.listing-actions button span { font-size: 1rem; }
.listing-actions button[aria-pressed="true"] span { color: #e25563; }
.share-message { position: absolute; top: calc(100% + 3px); right: 0; z-index: 2; color: #536957; font-size: .75rem; white-space: nowrap; }
.photo-grid { position: relative; display: grid; grid-template-columns: 1.25fr 1fr; grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 8px; aspect-ratio: 1.95; max-height: 520px; overflow: hidden; border-radius: 17px; background: #f3f3f2; }
.photo-tile { min-width: 0; min-height: 0; overflow: hidden; padding: 0; border: 0; background: #eee; cursor: pointer; }
.photo-primary { grid-row: span 2; }
.photo-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
.photo-tile:hover img { transform: scale(1.025); }
.all-photos { position: absolute; right: 18px; bottom: 18px; display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 14px; border: 1px solid #222; border-radius: 9px; background: white; color: #222; font-size: .82rem; font-weight: 600; cursor: pointer; }
.all-photos:hover { background: #f7f7f7; }
.detail-columns { display: grid; grid-template-columns: minmax(0, 1fr) 360px; align-items: start; gap: 74px; padding-top: 32px; }
.detail-main { min-width: 0; }
.listing-facts { display: flex; align-items: center; gap: 12px; padding: 0 0 23px; border-bottom: 1px solid #e6e6e6; color: #444; }
.listing-facts div { display: flex; align-items: baseline; gap: 5px; white-space: nowrap; }
.listing-facts strong { font-size: .95rem; font-weight: 650; }
.listing-facts span { font-size: .9rem; }
.listing-facts i { color: #888; font-style: normal; }
.detail-section { padding: 26px 0; border-bottom: 1px solid #e6e6e6; }
.detail-section .eyebrow { color: #717171; font-size: .73rem; letter-spacing: .08em; }
.detail-section h2 { margin: 6px 0 13px; font-size: 1.35rem; font-weight: 650; line-height: 1.25; letter-spacing: -.025em; }
.detail-section .body-copy { margin: 0; color: #555; font-size: .96rem; line-height: 1.7; }
.listing-disclaimer { margin: 16px 0 0; color: #777; font-size: .78rem; line-height: 1.55; }
.features-section ul { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; margin: 18px 0 0; padding: 0; list-style: none; }
.features-section li { display: flex; align-items: center; gap: 11px; color: #444; font-size: .9rem; }
.features-section li span { color: #536957; font-size: 1rem; }
.location-note { display: flex; align-items: center; gap: 13px; margin-top: 18px; padding: 17px; border: 1px solid #e6e6e6; border-radius: 13px; background: #fafaf9; }
.location-note > span { font-size: 1.35rem; }
.location-note div { display: grid; gap: 3px; }
.location-note strong { font-size: .86rem; font-weight: 600; }
.location-note small { color: #717171; font-size: .78rem; }
.inquiry-card { position: sticky; top: 102px; display: grid; gap: 17px; padding: 23px; border: 1px solid #e6e6e6; border-radius: 16px; background: white; box-shadow: 0 6px 22px rgb(0 0 0 / 8%); }
.inquiry-price { display: grid; gap: 4px; }
.inquiry-price > span { color: #717171; font-size: .82rem; }
.inquiry-price strong { font-size: 1.28rem; font-weight: 650; letter-spacing: -.025em; }
.inquiry-summary { display: flex; gap: 9px; color: #555; font-size: .85rem; }
.inquiry-summary i { font-style: normal; color: #888; }
.inquiry-button { width: 100%; min-height: 48px; }
.inquiry-note { margin: -3px 0 0; color: #717171; font-size: .78rem; line-height: 1.5; text-align: center; }
.all-listings { padding-top: 13px; border-top: 1px solid #eee; color: #444; font-size: .84rem; font-weight: 600; text-align: center; text-decoration: underline; text-underline-offset: 3px; }
.related-section { padding-top: 66px; }
.related-heading { display: flex; justify-content: space-between; align-items: end; gap: 18px; margin-bottom: 20px; }
.related-heading .eyebrow { color: #717171; font-size: .73rem; }
.related-heading h2 { margin: 5px 0 0; font-size: 1.55rem; font-weight: 650; letter-spacing: -.04em; }
.related-heading > a { color: #333; font-size: .88rem; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
.related-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.gallery-modal { position: fixed; inset: 0; z-index: 100; display: grid; grid-template-columns: 64px minmax(0, 1fr) 64px; align-items: center; justify-items: center; padding: 60px 30px 30px; background: rgb(20 20 20 / 94%); }
.gallery-modal figure { display: grid; justify-items: center; gap: 12px; width: min(100%, 1050px); max-height: 100%; margin: 0; }
.gallery-modal figure img { max-width: 100%; max-height: calc(100vh - 140px); object-fit: contain; border-radius: 8px; }
.gallery-modal figcaption { color: white; font-size: .85rem; }
.gallery-close, .gallery-arrow { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid #ffffff70; border-radius: 50%; background: transparent; color: white; font-size: 1.8rem; cursor: pointer; }
.gallery-close { position: absolute; top: 18px; right: 22px; font-size: 1.6rem; }
.gallery-arrow:hover, .gallery-close:hover { background: #ffffff20; }
.not-found { min-height: 60vh; padding-block: 100px; }
.not-found h1 { max-width: 700px; margin: 14px 0; font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -.04em; }
.not-found p { margin-bottom: 24px; }
@media (max-width: 900px) {
  .detail-columns { grid-template-columns: minmax(0, 1fr) 320px; gap: 30px; }
  .listing-facts { flex-wrap: wrap; gap: 9px; }
  .related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .related-grid > :last-child { display: none; }
}
@media (max-width: 700px) {
  .detail-page { padding-bottom: 58px; }
  .breadcrumbs { padding: 14px 0 18px; font-size: .77rem; }
  .listing-heading { align-items: flex-start; flex-direction: column; gap: 8px; margin-bottom: 14px; }
  .listing-title h1 { font-size: 1.75rem; }
  .listing-actions { margin-left: -9px; }
  .photo-grid { grid-template-columns: 1fr; grid-template-rows: 1fr; aspect-ratio: 1.25; border-radius: 13px; }
  .photo-tile:not(.photo-primary) { display: none; }
  .photo-primary { grid-row: auto; }
  .all-photos { right: 10px; bottom: 10px; min-height: 36px; font-size: .76rem; }
  .detail-columns { grid-template-columns: 1fr; gap: 12px; padding-top: 22px; }
  .inquiry-card { position: static; grid-row: 1; padding: 19px; }
  .listing-facts { gap: 7px; padding-bottom: 18px; }
  .listing-facts div { gap: 4px; }
  .listing-facts strong, .listing-facts span { font-size: .82rem; }
  .detail-section { padding: 22px 0; }
  .features-section ul { grid-template-columns: 1fr; gap: 13px; }
  .related-section { padding-top: 44px; }
  .related-grid { grid-template-columns: 1fr; }
  .related-grid > :last-child { display: block; }
  .related-heading { align-items: flex-start; }
  .related-heading h2 { font-size: 1.3rem; }
  .gallery-modal { grid-template-columns: 40px minmax(0,1fr) 40px; padding: 60px 8px 20px; }
  .gallery-arrow { width: 34px; height: 34px; }
}
</style>
