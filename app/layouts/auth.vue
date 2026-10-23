<template>
  <main class="auth-layout">
    <aside class="auth-brand-panel">
      <NuxtLink to="/" class="auth-wordmark"
        >Estate <span>&amp;</span> Estate<small
          >PROPERTY, CONSIDERED</small
        ></NuxtLink
      >
      <div class="auth-brand-copy">
        <span class="eyebrow">A considered approach</span>
        <p>Good property advice begins with listening.</p>
        <span class="auth-brand-caption"
          >A more thoughtful way to move forward.</span
        >
      </div>
      <div
        class="auth-brand-image"
        role="img"
        aria-label="Calm, light-filled residential interior"
      ></div>
    </aside>
    <section class="auth-content">
      <NuxtLink to="/" class="auth-mobile-wordmark"
        >Estate <span>&amp;</span> Estate</NuxtLink
      >
      <div class="auth-form-wrap"><slot /></div>
      <NuxtLink to="/" class="auth-back-link"
        >← Back to Estate &amp; Estate</NuxtLink
      >
    </section>
  </main>
</template>

<style>
.auth-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.1fr);
  background: var(--paper);
}
.auth-brand-panel {
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 38px clamp(28px, 5vw, 76px);
  background: #eeece6;
}
.auth-wordmark,
.auth-mobile-wordmark {
  position: relative;
  z-index: 1;
  width: fit-content;
  color: var(--ink);
  font: 400 1.5rem/1 var(--serif);
  letter-spacing: -0.035em;
}
.auth-wordmark span,
.auth-mobile-wordmark span {
  color: var(--green);
}
.auth-wordmark small {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font: 700 0.55rem/1 var(--sans);
  letter-spacing: 0.18em;
}
.auth-brand-copy {
  position: relative;
  z-index: 1;
  max-width: 410px;
  margin-block: auto;
  padding-block: 80px;
}
.auth-brand-copy .eyebrow {
  color: var(--green);
}
.auth-brand-copy p {
  margin: 18px 0 16px;
  color: var(--ink);
  font: 400 clamp(2.3rem, 4vw, 4rem)/1.04 var(--serif);
  letter-spacing: -0.03em;
}
.auth-brand-caption {
  color: var(--muted);
  font-size: 0.9rem;
}
.auth-brand-image {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 33vh;
  min-height: 210px;
  background:
    linear-gradient(0deg, rgb(32 40 34 / 15%), transparent 55%),
    url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85")
      center 53% / cover;
}
.auth-content {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 42px clamp(24px, 6vw, 90px);
}
.auth-form-wrap {
  width: min(100%, 440px);
  margin-block: auto;
  padding-block: 45px;
}
.auth-back-link {
  align-self: flex-start;
  width: min(100%, 440px);
  margin: 0 auto;
  color: var(--muted);
  font-size: 0.8rem;
}
.auth-back-link:hover {
  color: var(--green);
}
.auth-mobile-wordmark {
  display: none;
}
.auth-card-heading .eyebrow {
  display: block;
  margin-bottom: 12px;
}
.auth-card-heading h1 {
  margin: 0;
  color: var(--ink);
  font: 400 clamp(2.35rem, 4vw, 3.25rem)/1.05 var(--serif);
  letter-spacing: -0.03em;
}
.auth-card-heading p {
  margin: 12px 0 26px;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.65;
}
.auth-form {
  display: grid;
  gap: 17px;
}
.auth-field {
  display: grid;
  gap: 7px;
}
.auth-field-label {
  color: var(--ink);
  font-size: 0.8rem;
  font-weight: 600;
}
.auth-input-wrap {
  position: relative;
}
.auth-input {
  width: 100%;
  height: 48px;
  padding: 0 13px;
  border: 1px solid var(--line);
  border-radius: 0;
  background: white;
  color: var(--ink);
  font: inherit;
  font-size: 0.9rem;
}
.auth-input::placeholder {
  color: #8d8f88;
}
.auth-input:focus {
  outline: 2px solid #9aa99c;
  outline-offset: 1px;
  border-color: transparent;
}
.auth-input[aria-invalid="true"] {
  border-color: #a84e43;
}
.auth-input.has-toggle {
  padding-right: 76px;
}
.auth-toggle {
  position: absolute;
  top: 0;
  right: 0;
  height: 48px;
  padding-inline: 13px;
  border: 0;
  background: transparent;
  color: var(--green);
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
.auth-field-error {
  margin: 0;
  color: #9a3e34;
  font-size: 0.75rem;
  line-height: 1.45;
}
.auth-form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.auth-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.8rem;
  cursor: pointer;
}
.auth-check input {
  width: 16px;
  height: 16px;
  accent-color: var(--green);
}
.auth-link {
  color: var(--green);
  font-size: 0.8rem;
  font-weight: 700;
}
.auth-link:hover {
  color: var(--green-dark);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.auth-button {
  width: 100%;
  min-height: 49px;
}
.auth-notice {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid var(--line);
  background: #f5f4ef;
  color: #555950;
  font-size: 0.79rem;
  line-height: 1.55;
}
.auth-notice.error {
  border-color: #e7c7c1;
  background: #fcf3f1;
  color: #88372f;
}
.auth-notice.success {
  border-color: #cbd7cc;
  background: #f0f5ef;
  color: #2f523b;
}
.auth-notice.info {
  border-color: #d7d9d0;
  background: #f5f4ef;
}
.auth-switch {
  margin: 22px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
  text-align: center;
}
.auth-password-hint {
  margin: -1px 0 0;
  color: var(--muted);
  font-size: 0.74rem;
  line-height: 1.5;
}
.auth-code-input {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.55em;
  text-align: center;
}
.auth-flow-actions {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}
.auth-resend {
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--green);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.auth-resend:disabled {
  color: var(--muted);
  cursor: not-allowed;
}
@media (max-width: 760px) {
  .auth-layout {
    display: block;
    min-height: 100vh;
  }
  .auth-brand-panel {
    display: none;
  }
  .auth-content {
    min-height: 100vh;
    justify-content: flex-start;
    padding: 24px 20px 30px;
  }
  .auth-mobile-wordmark {
    display: block;
    align-self: flex-start;
    font-size: 1.3rem;
  }
  .auth-form-wrap {
    margin-block: auto;
    padding-block: 45px;
  }
  .auth-back-link {
    margin-top: auto;
  }
}
@media (max-width: 380px) {
  .auth-content {
    padding-inline: 17px;
  }
  .auth-form-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .auth-card-heading h1 {
    font-size: 2.25rem;
  }
}
</style>
