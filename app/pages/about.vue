<template>
  <div>
    <section class="container page-intro about-intro">
      <span class="eyebrow">A considered approach</span>
      <h1 class="page-title">
        Property is personal.<br />Our work should be too.
      </h1>
      <p class="body-copy">
        Estate &amp; Estate is built around a simple belief: good property
        guidance begins with understanding the person, not just the property.
      </p>
    </section>
    <section class="container about-hero">
      <img
        src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85"
        alt="Warm, thoughtful residential interior with natural materials"
      />
      <div class="image-caption">Space to make your own</div>
    </section>
    <section class="container section-space principles">
      <div>
        <span class="eyebrow">How we work</span>
        <h2 class="section-title">
          A steadier way<br />to make a big decision.
        </h2>
      </div>
      <div class="principle-copy">
        <p class="body-copy">
          Choosing where to live can feel like a lot to hold at once. We bring a
          clear point of view, thoughtful questions, and room to make a decision
          that feels right for you.
        </p>
        <p class="body-copy">
          We focus on the details that shape everyday life: how a place feels,
          how it fits your plans, and what you should know before taking the
          next step. The process stays open, considered, and centred on your
          priorities.
        </p>
      </div>
    </section>
    <section class="surface service-band">
      <div class="container service-inner">
        <span class="eyebrow">Our principles</span>
        <div class="principle-list">
          <article>
            <span>01</span>
            <div>
              <h3>Listen first</h3>
              <p>
                We begin with your needs, your timing, and the way you want to
                live.
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Offer clarity</h3>
              <p>
                Useful guidance should make a decision easier to understand,
                never harder.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Stay thoughtful</h3>
              <p>
                We take care with the details, from the first conversation
                through the next steps.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
    <section class="container about-cta">
      <span class="eyebrow">Whenever you’re ready</span>
      <h2 class="section-title">Let’s find your way forward.</h2>
      <div>
        <NuxtLink to="/properties" class="btn"
          >Explore properties <span aria-hidden="true">↗</span></NuxtLink
        ><NuxtLink to="/contact" class="text-link"
          >Talk with us <span aria-hidden="true">→</span></NuxtLink
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-intro {
  padding-top: 82px;
  padding-bottom: 45px;
}
.about-intro h1 {
  margin: 14px 0 18px;
}
.about-intro p {
  max-width: 630px;
  margin: 0;
}
.about-hero {
  position: relative;
}
.about-hero img {
  width: 100%;
  max-height: 590px;
  aspect-ratio: 2.05;
  object-fit: cover;
}
.image-caption {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 13px 17px;
  background: var(--paper);
  color: var(--green);
  font: 400 1rem var(--serif);
}
.principles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
}
.principles h2 {
  margin: 14px 0 0;
}
.principle-copy p {
  margin: 0 0 17px;
}
.service-band {
  padding-block: 72px;
}
.service-inner {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr;
  gap: 60px;
}
.principle-list {
  border-top: 1px solid #d8d6ce;
}
.principle-list article {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 12px;
  padding: 22px 0;
  border-bottom: 1px solid #d8d6ce;
}
.principle-list article > span {
  color: var(--green);
  font-size: 0.75rem;
}
.principle-list h3 {
  margin: -4px 0 6px;
  font: 400 1.55rem var(--serif);
}
.principle-list p {
  max-width: 500px;
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.65;
}
.about-cta {
  display: grid;
  justify-items: center;
  padding-block: 90px;
  text-align: center;
}
.about-cta h2 {
  margin: 12px 0 24px;
}
.about-cta > div {
  display: flex;
  align-items: center;
  gap: 25px;
}
@media (max-width: 650px) {
  .about-intro {
    padding-top: 52px;
  }
  .about-hero img {
    min-height: 300px;
    aspect-ratio: 1.2;
  }
  .principles,
  .service-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .service-band {
    padding-block: 55px;
  }
  .about-cta {
    padding-block: 64px;
  }
}
</style>
