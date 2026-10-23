<script setup lang="ts">
const route = useRoute();
const name = ref("");
const email = ref("");
const phone = ref("");
const subject = ref("General enquiry");
const message = ref("");
const prepared = ref(false);
const propertyId = computed(() =>
  typeof route.query.property === "string" ? route.query.property : "",
);
onMounted(() => {
  if (propertyId.value) {
    subject.value = "Property enquiry";
    message.value = `I’d like to learn more about ${propertyId.value.replaceAll("-", " ")}.`;
  }
});
function prepareInquiry() {
  prepared.value = true;
}
</script>

<template>
  <section class="container page-intro">
    <span class="eyebrow">We’re here to help</span>
    <h1 class="page-title">A good conversation<br />can start anywhere.</h1>
    <p class="body-copy">
      Share what you’re looking for, ask a question, or simply introduce
      yourself. We’ll make the next step clear.
    </p>
  </section>
  <section class="container contact-layout">
    <aside class="contact-info">
      <span class="eyebrow">Get in touch</span>
      <h2 class="section-title">Tell us a little about it.</h2>
      <p class="body-copy">
        Use the form to outline your enquiry. Contact details will be added here
        once verified by the business.
      </p>
      <div class="info-note">
        <span aria-hidden="true">01</span>
        <div>
          <strong>Buying or renting</strong>
          <p>
            Tell us about the area, type of home, and timing you have in mind.
          </p>
        </div>
      </div>
      <div class="info-note">
        <span aria-hidden="true">02</span>
        <div>
          <strong>Considering a property</strong>
          <p>Include the listing name and what you’d like to know.</p>
        </div>
      </div>
      <p class="contact-note">
        This is a frontend demonstration. No inquiry is sent or stored.
      </p>
    </aside>
    <form class="contact-form" @submit.prevent="prepareInquiry">
      <div class="form-row">
        <div>
          <label class="field-label" for="name">Your name</label
          ><input
            id="name"
            v-model="name"
            class="form-control"
            autocomplete="name"
            required
          />
        </div>
        <div>
          <label class="field-label" for="email">Email address</label
          ><input
            id="email"
            v-model="email"
            class="form-control"
            type="email"
            autocomplete="email"
            required
          />
        </div>
      </div>
      <div class="form-row">
        <div>
          <label class="field-label" for="phone"
            >Phone <span>(optional)</span></label
          ><input
            id="phone"
            v-model="phone"
            class="form-control"
            type="tel"
            autocomplete="tel"
          />
        </div>
        <div>
          <label class="field-label" for="subject">Enquiry type</label
          ><select id="subject" v-model="subject" class="form-control">
            <option>General enquiry</option>
            <option>Property enquiry</option>
            <option>Buying a home</option>
            <option>Finding a rental</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label class="field-label" for="message">How can we help?</label
        ><textarea
          id="message"
          v-model="message"
          class="form-control"
          required
        ></textarea>
      </div>
      <div class="submit-row">
        <button type="submit" class="btn">
          {{ prepared ? "Inquiry prepared" : "Prepare inquiry" }}
          <span aria-hidden="true">→</span>
        </button>
        <p role="status" aria-live="polite">
          {{
            prepared
              ? "Your inquiry is ready for a future contact integration. It has not been sent."
              : "Your details stay in this browser session and are not submitted."
          }}
        </p>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page-intro h1 {
  margin: 14px 0 17px;
}
.page-intro p {
  margin: 0;
}
.contact-layout {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: clamp(40px, 9vw, 130px);
  padding-bottom: 100px;
}
.contact-info h2 {
  margin: 13px 0;
}
.contact-info > .body-copy {
  margin-bottom: 30px;
}
.info-note {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  padding: 17px 0;
  border-top: 1px solid var(--line);
}
.info-note > span {
  color: var(--green);
  font-size: 0.72rem;
}
.info-note strong {
  font-size: 0.9rem;
}
.info-note p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.55;
}
.contact-note {
  margin-top: 25px;
  padding: 14px;
  background: var(--cream);
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.6;
}
.contact-form {
  display: grid;
  align-content: start;
  gap: 20px;
  padding: 26px;
  border: 1px solid var(--line);
  background: white;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.field-label span {
  color: var(--muted);
  font-weight: 400;
}
.submit-row {
  display: grid;
  justify-items: start;
  gap: 10px;
}
.submit-row p {
  margin: 0;
  color: var(--muted);
  font-size: 0.75rem;
  line-height: 1.5;
}
@media (max-width: 720px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 35px;
    padding-bottom: 64px;
  }
  .contact-form {
    padding: 19px;
  }
}
@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>
