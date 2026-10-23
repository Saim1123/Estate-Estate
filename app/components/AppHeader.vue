<script setup lang="ts">
const route = useRoute();
const menuOpen = ref(false);
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
  position: relative;
  z-index: 20;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}
.header-inner {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.wordmark {
  font: 400 1.5rem/1 var(--serif);
  letter-spacing: -0.035em;
  white-space: nowrap;
}
.wordmark span {
  color: var(--green);
}
.wordmark small {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font: 700 0.55rem/1 var(--sans);
  letter-spacing: 0.18em;
}
.primary-nav {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 38px);
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
    min-height: 72px;
  }
  .menu-toggle {
    display: flex;
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
