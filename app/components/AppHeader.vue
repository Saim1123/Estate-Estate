<script setup lang="ts">
const route = useRoute();
const menuOpen = ref(false);
const headerSearch = ref("");
const router = useRouter();
function searchHomes() {
  const term = headerSearch.value.trim();
  router.push({ path: "/properties", query: term ? { search: term } : {} });
}
const links = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to content</a>
  <header class="site-header">
    <div class="header-inner container">
      <NuxtLink to="/" class="wordmark" aria-label="Estate and Estate home"
        >Estate <span>&amp;</span> Estate<small
          >PROPERTY, CONSIDERED</small
        ></NuxtLink
      >
      <form class="header-search" role="search" @submit.prevent="searchHomes">
        <label class="sr-only" for="header-property-search">Search homes</label>
        <input
          id="header-property-search"
          v-model="headerSearch"
          type="search"
          placeholder="Search homes"
        />
        <button type="submit" aria-label="Search properties">
          <span aria-hidden="true">⌕</span>
        </button>
      </form>
      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="primary-navigation"
        aria-label="Toggle navigation"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span>
      </button>
      <nav
        id="primary-navigation"
        class="primary-nav"
        :class="{ 'is-open': menuOpen }"
        aria-label="Main navigation"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{
            active:
              route.path === link.to ||
              (link.to === '/properties' &&
                route.path.startsWith('/properties')),
          }"
          >{{ link.label }}</NuxtLink
        >
        <NuxtLink to="/contact" class="btn nav-cta"
          >Arrange a conversation <span aria-hidden="true">↗</span></NuxtLink
        >
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgb(255 255 255 / 96%);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(12px);
}
.header-inner {
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.wordmark {
  font: 700 1.22rem/1 var(--sans);
  letter-spacing: -0.055em;
  white-space: nowrap;
}
.wordmark span {
  color: var(--green);
}
.wordmark small {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font: 600 0.5rem/1 var(--sans);
  letter-spacing: 0.18em;
}
.header-search {
  display: flex;
  align-items: center;
  width: min(330px, 30vw);
  gap: 8px;
  padding: 6px 7px 6px 18px;
  border: 1px solid #ddd;
  border-radius: 999px;
  box-shadow: 0 2px 5px rgb(0 0 0 / 7%);
}
.header-search input {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font: 400 .84rem var(--sans);
}
.header-search input::placeholder { color: #717171; opacity: 1; }
.header-search button {
  display: grid;
  flex: none;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--green);
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
}
.header-search button:hover { background: var(--green-dark); }
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
.primary-nav {
  display: flex;
  align-items: center;
  gap: clamp(18px, 2vw, 28px);
}
.primary-nav > a:not(.btn) {
  position: relative;
  padding: 10px 0;
  color: var(--muted);
  font-size: 0.88rem;
  transition: color 0.2s;
}
.primary-nav > a:not(.btn):hover,
.primary-nav > a.active {
  color: var(--ink);
}
.primary-nav > a.active::after {
  position: absolute;
  right: 0;
  bottom: 2px;
  left: 0;
  height: 1px;
  background: var(--green);
  content: "";
}
.nav-cta {
  min-height: 42px;
  padding-inline: 16px;
  font-size: 0.8rem;
}
.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  border: 1px solid var(--line);
  background: transparent;
}
.menu-toggle span {
  width: 18px;
  height: 1px;
  background: var(--ink);
}
@media (max-width: 760px) {
  .header-inner {
    min-height: 70px;
  }
  .header-search {
    flex: 1;
    width: auto;
    min-width: 0;
    margin-left: auto;
  }
  .menu-toggle {
    display: flex;
    border-radius: 50%;
    background: white;
  }
  .primary-nav {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 10px 22px 20px;
    border-bottom: 1px solid var(--line);
    background: var(--paper);
    box-shadow: 0 14px 18px rgb(36 39 34 / 5%);
  }
  .primary-nav.is-open {
    display: flex;
  }
  .primary-nav > a:not(.btn) {
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
  }
  .primary-nav > a.active::after {
    display: none;
  }
  .nav-cta {
    margin-top: 14px;
  }
}
</style>
