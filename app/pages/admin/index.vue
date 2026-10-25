<script setup lang="ts">
definePageMeta({ layout: "admin" });
const { properties, users, activity, can } = useAdminDemo();
const route = useRoute();
const published = computed(
  () => properties.value.filter((item) => item.status === "Published").length,
);
const drafts = computed(
  () => properties.value.filter((item) => item.status === "Draft").length,
);
const recentProperties = computed(() =>
  [...properties.value]
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .slice(0, 4),
);
</script>
<template>
  <div>
    <div v-if="route.query.denied" class="permission-notice">
      You do not have permission to open that page.
    </div>
    <AdminPageHeading
      eyebrow="SUNDAY, OCTOBER 25, 2026"
      title="Good morning, Amina"
      description="Here’s what’s happening across your property portfolio."
    />
    <div class="welcome-strip">
      <div>
        <span class="welcome-kicker">YOUR PROPERTY OFFICE</span>
        <h2>Thoughtful spaces. Well managed.</h2>
        <p>A clear view of your listings and the people behind them.</p>
      </div>
      <div class="welcome-art"><span>EST.</span><b>2026</b><i>✳</i></div>
    </div>
    <div class="stat-grid">
      <article class="stat-card">
        <template v-if="can('properties.view')">
          <div class="stat-head">
            <span>Total properties</span><span class="stat-icon">⌂</span>
          </div>
          <strong>{{ properties.length }}</strong
          ><small><i>↗</i> {{ properties.length }} in your portfolio</small>
          <div class="stat-rule"><span style="width: 78%" /></div>
        </template>
      </article>
      <article class="stat-card">
        <template v-if="can('properties.view')">
          <div class="stat-head">
            <span>Published listings</span><span class="stat-icon">◉</span>
          </div>
          <strong>{{ published }}</strong
          ><small><i>↗</i> Visible on your website</small>
          <div class="stat-rule"><span style="width: 62%" /></div>
        </template>
      </article>
      <article class="stat-card">
        <template v-if="can('properties.view')">
          <div class="stat-head">
            <span>Drafts in progress</span><span class="stat-icon">▤</span>
          </div>
          <strong>{{ drafts }}</strong
          ><small>Ready when you are</small>
          <div class="stat-rule"><span style="width: 36%" /></div>
        </template>
      </article>
      <article class="stat-card">
        <template v-if="can('users.view')">
          <div class="stat-head">
            <span>Total users</span><span class="stat-icon">♙</span>
          </div>
          <strong>{{ users.length }}</strong
          ><small>Across your team</small>
          <div class="stat-rule"><span style="width: 48%" /></div>
        </template>
      </article>
    </div>
    <div class="dash-grid">
      <section v-if="can('properties.view')" class="dash-panel recent-panel">
        <div class="panel-heading">
          <div>
            <span class="panel-eyebrow">PORTFOLIO</span>
            <h2>Recently updated</h2>
          </div>
          <NuxtLink to="/admin/properties" class="subtle-link"
            >All properties <span>→</span></NuxtLink
          >
        </div>
        <div class="recent-list">
          <article
            v-for="property in recentProperties"
            :key="property.id"
            class="recent-property"
          >
            <img :src="property.image" :alt="property.title" />
            <div class="recent-info">
              <b>{{ property.title }}</b
              ><small>{{ property.area }}, {{ property.city }}</small>
            </div>
            <div class="recent-price">
              <b>{{
                property.listing === "Rent"
                  ? "₨ " + Number(property.price).toLocaleString() + " / mo"
                  : "₨ " + (Number(property.price) / 1000000).toFixed(1) + "m"
              }}</b
              ><span
                class="status-pill"
                :class="property.status.toLowerCase()"
                >{{ property.status }}</span
              >
            </div>
          </article>
        </div>
      </section>
      <section v-if="can('viewActivity')" class="dash-panel activity-panel">
        <div class="panel-heading">
          <div>
            <span class="panel-eyebrow">THE LATEST</span>
            <h2>Recent activity</h2>
          </div>
          <NuxtLink
            v-if="can('viewActivity')"
            to="/admin/activity"
            class="subtle-link"
            >View log <span>→</span></NuxtLink
          >
        </div>
        <div class="activity-list">
          <article
            v-for="event in activity.slice(0, 4)"
            :key="event.id"
            class="activity-item"
          >
            <span class="activity-marker" :class="event.kind.toLowerCase()">{{
              event.kind === "Property" ? "⌂" : "·"
            }}</span>
            <div>
              <p>
                <b>{{ event.actor }}</b> {{ event.action }}
                <strong>{{ event.record }}</strong>
              </p>
              <small>{{ event.at }}</small>
            </div>
          </article>
        </div>
      </section>
    </div>
    <section class="quick-panel">
      <div>
        <span class="panel-eyebrow">A GOOD PLACE TO START</span>
        <h2>Quick actions</h2>
        <p>Keep your property office moving.</p>
      </div>
      <div class="quick-actions">
        <NuxtLink
          v-if="can('createProperties')"
          to="/admin/properties/new"
          class="quick-action"
          ><span>＋</span><b>Add a property</b
          ><small>Create a new listing</small><i>↗</i></NuxtLink
        ><NuxtLink
          v-if="can('viewProperties')"
          to="/admin/properties"
          class="quick-action"
          ><span>⌂</span><b>Manage properties</b
          ><small>Review your portfolio</small><i>↗</i></NuxtLink
        ><NuxtLink
          v-if="can('createAccounts')"
          to="/admin/users"
          class="quick-action"
          ><span>♙</span><b>Invite a teammate</b><small>Grow your team</small
          ><i>↗</i></NuxtLink
        >
      </div>
    </section>
    <div class="demo-disclaimer">
      ⓘ <span>Demo workspace</span> — Data and permissions shown here are for
      preview only. Authorization will be enforced server-side in production.
    </div>
  </div>
</template>
<style>
.welcome-strip {
  min-height: 144px;
  background: #ece8df;
  position: relative;
  overflow: hidden;
  padding: 25px 29px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.welcome-strip:after {
  content: "";
  position: absolute;
  width: 245px;
  height: 245px;
  border: 1px solid #d5cec0;
  border-radius: 50%;
  right: 95px;
  top: -74px;
}
.welcome-kicker,
.panel-eyebrow {
  font-size: 8px;
  letter-spacing: 1.4px;
  color: #9a7954;
  font-weight: 700;
}
.welcome-strip h2 {
  font: 400 23px var(--serif, Georgia, serif);
  margin: 10px 0 6px;
  color: #45483f;
}
.welcome-strip p {
  font-size: 10px;
  color: #85847c;
  margin: 0;
}
.welcome-art {
  position: relative;
  z-index: 1;
  width: 88px;
  height: 88px;
  border: 1px solid #cfc6b6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #777363;
  margin-right: 42px;
  transform: rotate(-12deg);
}
.welcome-art span {
  font-size: 7px;
  letter-spacing: 2px;
}
.welcome-art b {
  font: 20px var(--serif, Georgia, serif);
}
.welcome-art i {
  position: absolute;
  font-style: normal;
  font-size: 14px;
  right: -15px;
  top: -7px;
  color: #a77d54;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.stat-card {
  background: #fff;
  border: 1px solid #e9e6df;
  padding: 15px 16px 12px;
  min-height: 114px;
}
.stat-head {
  display: flex;
  justify-content: space-between;
  color: #898a82;
  font-size: 9px;
}
.stat-icon {
  font-size: 15px;
  color: #aa8b65;
}
.stat-card > strong {
  display: block;
  font: 400 26px var(--serif, Georgia, serif);
  margin-top: 8px;
  color: #353a33;
}
.stat-card small {
  font-size: 8px;
  color: #9a9a92;
}
.stat-card small i {
  font-style: normal;
  color: #829577;
  margin-right: 3px;
}
.stat-rule {
  margin-top: 10px;
  height: 2px;
  background: #f0eee8;
}
.stat-rule span {
  display: block;
  height: 100%;
  background: #c7b99f;
}
.dash-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 14px;
  margin-bottom: 15px;
}
.dash-panel,
.quick-panel {
  background: #fff;
  border: 1px solid #e9e6df;
  padding: 18px 19px;
}
.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.panel-heading h2,
.quick-panel h2 {
  font: 400 17px var(--serif, Georgia, serif);
  margin: 5px 0 0;
}
.subtle-link {
  font-size: 9px;
  color: #8d806b;
}
.subtle-link span {
  margin-left: 4px;
}
.recent-list {
  display: grid;
}
.recent-property {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 0;
  border-top: 1px solid #f0eee8;
}
.recent-property img {
  width: 54px;
  height: 43px;
  object-fit: cover;
  border-radius: 2px;
}
.recent-info {
  min-width: 0;
  display: grid;
  gap: 5px;
  flex: 1;
}
.recent-info b {
  font-size: 10px;
  font-weight: 600;
}
.recent-info small {
  font-size: 9px;
  color: #999a92;
}
.recent-price {
  display: grid;
  gap: 5px;
  text-align: right;
}
.recent-price b {
  font-size: 9px;
  font-weight: 600;
}
.status-pill {
  display: inline-block;
  justify-self: end;
  border-radius: 20px;
  padding: 4px 7px;
  font-size: 8px;
  line-height: 1;
}
.status-pill.published {
  color: #57704f;
  background: #eef3eb;
}
.status-pill.draft {
  color: #95794f;
  background: #f6f1e6;
}
.status-pill.review {
  color: #8b6a50;
  background: #f5ede5;
}
.activity-list {
  display: grid;
}
.activity-item {
  display: flex;
  gap: 10px;
  padding: 9px 0;
  border-top: 1px solid #f0eee8;
}
.activity-marker {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #f2efe8;
  display: grid;
  place-items: center;
  color: #9c805e;
  flex: none;
  font-size: 13px;
}
.activity-marker.account {
  background: #f0f2ec;
  color: #70836a;
}
.activity-item p {
  font-size: 9px;
  line-height: 1.55;
  margin: 0;
  color: #777870;
}
.activity-item p b {
  font-weight: 600;
  color: #484a43;
}
.activity-item p strong {
  font-weight: 600;
  color: #605745;
}
.activity-item small {
  font-size: 8px;
  color: #aaa99f;
  display: block;
  margin-top: 4px;
}
.quick-panel {
  display: flex;
  gap: 22px;
  align-items: center;
  margin-bottom: 12px;
}
.quick-panel > div:first-child {
  width: 165px;
  flex: none;
}
.quick-panel p {
  font-size: 9px;
  color: #96968e;
  margin: 5px 0 0;
}
.quick-actions {
  display: flex;
  gap: 9px;
  flex: 1;
}
.quick-action {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 69px;
  border: 1px solid #efede7;
  padding: 11px 10px 9px 35px;
  display: grid;
  align-content: center;
  gap: 3px;
}
.quick-action > span {
  position: absolute;
  left: 11px;
  top: 12px;
  color: #a47c53;
  font-size: 16px;
}
.quick-action b {
  font-size: 9px;
  font-weight: 600;
}
.quick-action small {
  font-size: 8px;
  color: #9a9a92;
}
.quick-action i {
  position: absolute;
  right: 9px;
  top: 8px;
  color: #aaa69b;
  font-size: 10px;
  font-style: normal;
}
.quick-action:hover {
  border-color: #cfc3af;
  background: #fbfaf7;
}
.demo-disclaimer {
  font-size: 9px;
  color: #989890;
  padding: 7px 1px;
}
.demo-disclaimer:first-letter {
  color: #a17b52;
}
.demo-disclaimer span {
  font-weight: 600;
  color: #77786f;
}
@media (max-width: 900px) {
  .dash-grid {
    grid-template-columns: 1fr;
  }
  .quick-panel {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }
  .quick-panel > div:first-child {
    width: auto;
  }
  .quick-actions {
    width: 100%;
  }
}
@media (max-width: 600px) {
  .welcome-strip {
    padding: 20px;
    min-height: 131px;
  }
  .welcome-strip h2 {
    font-size: 19px;
    max-width: 220px;
  }
  .welcome-strip p {
    max-width: 210px;
    line-height: 1.5;
  }
  .welcome-art {
    width: 64px;
    height: 64px;
    margin-right: 4px;
    flex: none;
  }
  .welcome-art b {
    font-size: 16px;
  }
  .welcome-strip:after {
    right: 24px;
  }
  .stat-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .stat-card {
    padding: 13px;
    min-height: 104px;
  }
  .stat-card > strong {
    font-size: 24px;
  }
  .dash-panel,
  .quick-panel {
    padding: 15px;
  }
  .recent-property {
    gap: 8px;
  }
  .recent-property img {
    width: 48px;
    height: 41px;
  }
  .recent-price b {
    font-size: 8px;
  }
  .quick-actions {
    flex-direction: column;
  }
  .quick-action {
    min-height: 61px;
  }
  .demo-disclaimer {
    line-height: 1.6;
  }
}
</style>
