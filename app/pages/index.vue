<script setup lang="ts">
import { properties } from "~/data/properties";
const router = useRouter();
const destination = ref("");
const listingType = ref("");
const bedrooms = ref("");
const activeCategory = ref("All homes");
const categories = ["All homes", "Houses", "Apartments", "Townhouses"];
const featured = computed(() => {
  const categoryType = { Houses: "House", Apartments: "Apartment", Townhouses: "Townhouse" } as const;
  return properties.filter((property) => activeCategory.value === "All homes" || property.type === categoryType[activeCategory.value as keyof typeof categoryType]);
});
function searchHomes() {
  router.push({ path: "/properties", query: {
    ...(destination.value ? { search: destination.value } : {}),
    ...(listingType.value ? { status: listingType.value } : {}),
    ...(bedrooms.value ? { beds: bedrooms.value } : {}),
  }});
}
</script>

<template>
  <div class="home-page">
    <section class="container home-hero">
      <div class="hero-copy">
        <span class="eyebrow">Make room for what matters</span>
        <h1>Find a place<br class="desktop-break" /> to call home.</h1>
        <p>Thoughtful homes, in the neighbourhoods you love.</p>
      </div>
      <form class="home-search" @submit.prevent="searchHomes">
        <label class="search-item destination-item"><span>Where</span><input v-model="destination" aria-label="Where" placeholder="Search neighbourhoods" /></label>
        <label class="search-item"><span>Looking for</span><select v-model="listingType" aria-label="Looking for"><option value="">Buy or rent</option><option value="For sale">For sale</option><option value="To rent">To rent</option></select></label>
        <label class="search-item beds-item"><span>Bedrooms</span><select v-model="bedrooms" aria-label="Bedrooms"><option value="">Any number</option><option value="1">1+ bedroom</option><option value="2">2+ bedrooms</option><option value="3">3+ bedrooms</option><option value="4">4+ bedrooms</option></select></label>
        <button class="search-submit" type="submit" aria-label="Search homes"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><span>Search</span></button>
      </form>
    </section>

    <section class="container homes-section">
      <div class="section-head">
        <div><h2>Explore homes</h2><p>Find a place that fits your life.</p></div>
        <NuxtLink to="/properties" class="view-all">See all homes <span aria-hidden="true">→</span></NuxtLink>
      </div>
      <div class="category-tabs" aria-label="Filter featured properties">
        <button v-for="category in categories" :key="category" type="button" :class="{ selected: activeCategory === category }" :aria-pressed="activeCategory === category" @click="activeCategory = category">{{ category }}</button>
      </div>
      <div class="property-grid">
        <PropertyCard v-for="property in featured" :key="property.id" :property="property" />
      </div>
      <div v-if="!featured.length" class="category-empty">No homes in this category yet. <button type="button" @click="activeCategory = 'All homes'">View all homes</button></div>
    </section>

    <section class="host-banner">
      <div class="container host-inner">
        <div><span class="eyebrow">A better move starts here</span><h2>Find your next place<br />with a little more ease.</h2><p>Clear advice and a thoughtful selection, from first search to front door.</p><NuxtLink to="/about" class="host-link">Get to know us <span aria-hidden="true">→</span></NuxtLink></div>
        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85" alt="Warm, light-filled home interior" loading="lazy" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page { background: white; }
.home-hero { padding-top: 52px; padding-bottom: 38px; }
.hero-copy { text-align: center; }
.hero-copy .eyebrow { color: #717171; letter-spacing: .08em; }
.hero-copy h1 { margin: 13px 0 8px; font-size: clamp(2.5rem, 5vw, 3.5rem); line-height: 1.08; letter-spacing: -.055em; font-weight: 650; }
.hero-copy p { margin: 0; color: #717171; font-size: 1.02rem; }
.home-search { display: flex; align-items: center; max-width: 900px; min-height: 78px; margin: 32px auto 0; padding: 8px; border: 1px solid #ddd; border-radius: 999px; background: white; box-shadow: 0 3px 14px rgb(0 0 0 / 9%); }
.search-item { display: grid; flex: 1; min-width: 0; gap: 3px; padding: 7px 22px; border-left: 1px solid #ebebeb; }
.search-item:first-child { border: 0; }
.search-item span { font-size: .76rem; font-weight: 700; }
.search-item input, .search-item select { width: 100%; padding: 0; border: 0; outline: 0; background: transparent; color: #626262; font-size: .84rem; }
.search-item select { appearance: none; cursor: pointer; }
.search-submit { display: flex; flex: none; align-items: center; justify-content: center; gap: 8px; min-width: 108px; height: 54px; padding: 0 18px; border: 0; border-radius: 999px; background: #34483b; color: white; font-size: .88rem; font-weight: 650; cursor: pointer; transition: background .18s; }
.search-submit:hover { background: #26372d; }
.search-submit svg { width: 19px; fill: none; stroke: currentColor; stroke-width: 2; }
.homes-section { padding-top: 32px; padding-bottom: 76px; }
.section-head { display: flex; align-items: end; justify-content: space-between; gap: 20px; }
.section-head h2 { margin: 0; font-size: 1.55rem; letter-spacing: -.035em; }
.section-head p { margin: 5px 0 0; color: #717171; font-size: .9rem; }
.view-all { color: #333; font-size: .88rem; font-weight: 650; }
.category-tabs { display: flex; gap: 8px; overflow-x: auto; margin: 24px 0 20px; padding-bottom: 5px; scrollbar-width: none; }
.category-tabs button { flex: none; padding: 10px 17px; border: 1px solid #ddd; border-radius: 999px; background: white; color: #444; font-size: .84rem; cursor: pointer; transition: border .18s, background .18s; }
.category-tabs button:hover { border-color: #777; }
.category-tabs button.selected { border-color: #222; background: #222; color: white; }
.property-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 24px 20px; }
.category-empty { padding: 34px 0; color: #717171; }
.category-empty button { margin-left: 6px; border: 0; background: none; color: #34483b; text-decoration: underline; cursor: pointer; }
.host-banner { padding: 54px 0; background: #f7f7f5; }
.host-inner { display: grid; grid-template-columns: .85fr 1.15fr; align-items: center; gap: 60px; }
.host-inner h2 { margin: 12px 0; font-size: clamp(1.9rem, 4vw, 2.6rem); line-height: 1.12; letter-spacing: -.05em; }
.host-inner p { max-width: 390px; color: #717171; line-height: 1.6; }
.host-link { display: inline-block; margin-top: 8px; font-size: .9rem; font-weight: 650; text-decoration: underline; text-underline-offset: 3px; }
.host-inner img { width: 100%; height: 310px; border-radius: 15px; object-fit: cover; }
@media(max-width:850px) { .property-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .host-inner { gap: 30px; } }
@media(max-width:620px) { .home-hero { padding-top: 38px; } .hero-copy h1 { font-size: 2.55rem; } .desktop-break { display: none; } .home-search { align-items: stretch; flex-wrap: wrap; gap: 4px; padding: 14px; border-radius: 24px; } .search-item { flex-basis: calc(50% - 3px); padding: 8px 10px; border: 0; } .search-item:nth-child(2) { border-left: 1px solid #ebebeb; } .search-item input, .search-item select { font-size: .76rem; } .search-submit { width: 100%; height: 48px; margin-top: 4px; } .homes-section { padding-top: 24px; padding-bottom: 52px; } .property-grid { grid-template-columns: 1fr; gap: 24px; } .section-head h2 { font-size: 1.35rem; } .view-all { font-size: .8rem; } .host-banner { padding: 38px 0; } .host-inner { grid-template-columns: 1fr; gap: 22px; } .host-inner img { height: 235px; } }
</style>
