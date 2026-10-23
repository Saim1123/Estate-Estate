<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-brand">
        <NuxtLink to="/" class="wordmark"
          >Estate <span>&amp;</span> Estate</NuxtLink
        >
        <p>A more considered way to find your next place.</p>
      </div>
      <div class="footer-links">
        <div>
          <span class="footer-label">Explore</span
          ><NuxtLink to="/properties">Properties</NuxtLink
          ><NuxtLink to="/about">Our approach</NuxtLink>
        </div>
        <div>
          <span class="footer-label">Connect</span
          ><NuxtLink to="/contact">Contact the team</NuxtLink
          ><NuxtLink to="/contact">Arrange a conversation ↗</NuxtLink>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© {{ year }} Estate &amp; Estate</span
      ><span>Property, considered.</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding-top: 54px;
  background: #eeece6;
}
.footer-main {
  display: flex;
  justify-content: space-between;
  gap: 48px;
  padding-bottom: 48px;
}
.wordmark {
  font: 400 1.5rem var(--serif);
  letter-spacing: -0.035em;
}
.wordmark span {
  color: var(--green);
}
.footer-brand p {
  max-width: 250px;
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.6;
}
.footer-links {
  display: flex;
  gap: clamp(52px, 10vw, 150px);
}
.footer-links > div {
  display: grid;
  align-content: start;
  gap: 12px;
}
.footer-label {
  margin-bottom: 3px;
  color: var(--muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}
.footer-links a {
  font-size: 0.86rem;
}
.footer-links a:hover {
  color: var(--green);
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  padding-block: 18px;
  border-top: 1px solid #dbd9d1;
  color: var(--muted);
  font-size: 0.75rem;
}
@media (max-width: 600px) {
  .footer-main {
    flex-direction: column;
    gap: 34px;
  }
  .footer-links {
    justify-content: space-between;
    gap: 24px;
  }
  .footer-bottom {
    gap: 18px;
    flex-wrap: wrap;
  }
}
</style>
