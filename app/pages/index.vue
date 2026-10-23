<script setup lang="ts">
import { properties } from "~/data/properties";
const featured = properties.slice(0, 3);
</script>

<template>
  <div>
    <section class="hero">
      <img
        class="hero-image"
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90"
        alt="Sunlit contemporary home opening onto a garden"
      />
      <div class="hero-shade"></div>
      <div class="container hero-content">
        <span class="eyebrow">Property, thoughtfully considered</span>
        <h1 class="display">A place to feel<br />at home in.</h1>
        <p>
          Finding the right property starts with understanding how you want to
          live. We bring care and clarity to every step.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/properties" class="btn"
            >Explore properties <span aria-hidden="true">↗</span></NuxtLink
          ><NuxtLink to="/about" class="hero-secondary"
            >Get to know us <span aria-hidden="true">→</span></NuxtLink
          >
        </div>
      </div>
      <div class="hero-caption">
        A quieter kind of confidence <span>Estate &amp; Estate</span>
      </div>
    </section>

    <section class="container section-space featured">
      <div class="section-head">
        <div>
          <span class="eyebrow">A considered selection</span>
          <h2 class="section-title">Places with a point of view.</h2>
          <p class="body-copy">
            A selection of homes to buy or rent, chosen with care.
          </p>
        </div>
        <NuxtLink to="/properties" class="text-link"
          >View all properties <span aria-hidden="true">→</span></NuxtLink
        >
      </div>
      <div class="property-grid">
        <PropertyCard
          v-for="property in featured"
          :key="property.id"
          :property="property"
        />
      </div>
    </section>

    <section class="approach surface">
      <div class="container approach-grid">
        <div class="approach-image">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
            alt="Calm, light-filled living room with natural finishes"
            loading="lazy"
          /><span>Space to live well</span>
        </div>
        <div class="approach-copy">
          <span class="eyebrow">A more personal process</span>
          <h2 class="section-title">
            Good property advice begins with listening.
          </h2>
          <p class="body-copy">
            A home is more than its square footage. It’s the light at the end of
            the day, the rhythm of a neighbourhood, the room to grow into. We
            make space for what matters to you, then help you move forward with
            clarity.
          </p>
          <NuxtLink to="/about" class="text-link"
            >Our approach <span aria-hidden="true">→</span></NuxtLink
          >
        </div>
      </div>
    </section>

    <section class="container section-space closing">
      <span class="eyebrow">Start with a conversation</span>
      <h2 class="section-title">The right next step<br />starts here.</h2>
      <p class="body-copy">
        Tell us what you’re looking for. We’ll take it from there, together.
      </p>
      <NuxtLink to="/contact" class="btn"
        >Speak with our team <span aria-hidden="true">↗</span></NuxtLink
      >
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: min(680px, 75vw);
  min-height: clamp(520px, 58vw, 700px);
  overflow: hidden;
  color: white;
  background: #555d54;
}
.hero-image,
.hero-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-image {
  object-fit: cover;
  object-position: center 53%;
}
.hero-shade {
  background:
    linear-gradient(
      90deg,
      rgb(23 31 26 / 72%) 0%,
      rgb(23 31 26 / 47%) 43%,
      rgb(23 31 26 / 8%) 100%
    ),
    linear-gradient(0deg, rgb(23 31 26 / 20%), transparent 35%);
}
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: inherit;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-block: 64px;
}
.hero-content .eyebrow {
  color: #e2e8df;
}
.hero h1 {
  margin: 22px 0 16px;
}
.hero-content > p {
  max-width: 490px;
  margin: 0;
  color: #f0f0ec;
  font-size: 1.04rem;
  line-height: 1.75;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 26px;
  margin-top: 30px;
}
.hero-secondary {
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
}
.hero-caption {
  position: absolute;
  right: max(24px, calc((100vw - 1160px) / 2));
  bottom: 25px;
  display: flex;
  gap: 20px;
  color: white;
  font-size: 0.73rem;
}
.hero-caption span {
  opacity: 0.75;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 32px;
}
.section-head h2 {
  margin: 12px 0 8px;
}
.section-head p {
  margin: 0;
}
.section-head > .text-link {
  margin-bottom: 8px;
  white-space: nowrap;
}
.property-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}
.approach {
  padding-block: 96px;
}
.approach-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(44px, 8vw, 110px);
  align-items: center;
}
.approach-image {
  position: relative;
}
.approach-image img {
  width: 100%;
  aspect-ratio: 1.12;
  object-fit: cover;
}
.approach-image span {
  position: absolute;
  right: -14px;
  bottom: 20px;
  padding: 14px 18px;
  background: var(--paper);
  color: var(--green);
  font: 400 1.1rem var(--serif);
}
.approach-copy h2 {
  max-width: 480px;
  margin: 14px 0 18px;
}
.approach-copy p {
  max-width: 500px;
  margin: 0 0 22px;
}
.closing {
  text-align: center;
}
.closing h2 {
  margin: 14px 0;
}
.closing p {
  margin: 0 auto 24px;
}
@media (max-width: 850px) {
  .property-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .property-grid > :last-child {
    display: none;
  }
  .approach-grid {
    gap: 42px;
  }
}
@media (max-width: 650px) {
  .hero {
    min-height: 590px;
  }
  .hero-shade {
    background:
      linear-gradient(90deg, rgb(23 31 26 / 70%), rgb(23 31 26 / 32%)),
      linear-gradient(0deg, rgb(23 31 26 / 25%), transparent);
  }
  .hero h1 {
    font-size: clamp(2.9rem, 12vw, 4rem);
  }
  .hero-caption {
    right: 18px;
    bottom: 17px;
    font-size: 0.65rem;
  }
  .hero-actions {
    align-items: flex-start;
    flex-direction: column;
    gap: 17px;
  }
  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }
  .property-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .property-grid > :last-child {
    display: block;
  }
  .approach {
    padding-block: 64px;
  }
  .approach-grid {
    grid-template-columns: 1fr;
    gap: 35px;
  }
  .approach-image span {
    right: -6px;
  }
}
</style>
