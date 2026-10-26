<script setup lang="ts">
import type { Permission } from "~/data/adminDemo";
import { useAuthSession } from "~/composables/useAuthSession";
const route = useRoute();
const { users, properties, activity, can } = useAdminDemo();
const { user } = useAuthSession();
const menuOpen = ref(false);
if (import.meta.server) {
  const requestFetch = useRequestFetch();
  const initialRequests: Promise<void>[] = [];
  if (can("users.view")) {
    initialRequests.push(
      requestFetch<{ users: typeof users.value }>("/api/admin/users")
        .then((result) => {
          users.value = result.users;
        })
        .catch(() => undefined),
    );
  }
  if (can("properties.view")) {
    initialRequests.push(
      requestFetch<{ properties: typeof properties.value }>(
        "/api/admin/properties",
      )
        .then((result) => {
          properties.value = result.properties;
        })
        .catch(() => undefined),
    );
  }
  if (can("viewActivity")) {
    initialRequests.push(
      requestFetch<{ activity: typeof activity.value }>("/api/admin/activity")
        .then((result) => {
          activity.value = result.activity;
        })
        .catch(() => undefined),
    );
  }
  await Promise.all(initialRequests);
}
const links: {
  label: string;
  to: string;
  permission?: Permission;
  icon: string;
}[] = [
  { label: "Overview", to: "/admin", icon: "◫" },
  {
    label: "Properties",
    to: "/admin/properties",
    permission: "viewProperties",
    icon: "⌂",
  },
  {
    label: "Users & accounts",
    to: "/admin/users",
    permission: "viewUsers",
    icon: "♙",
  },
  {
    label: "Roles & permissions",
    to: "/admin/roles",
    permission: "manageRoles",
    icon: "◇",
  },
  {
    label: "Activity log",
    to: "/admin/activity",
    permission: "viewActivity",
    icon: "◷",
  },
  { label: "Profile & settings", to: "/admin/settings", icon: "⚙" },
];
const visibleLinks = computed(() =>
  links.filter((link) => !link.permission || can(link.permission)),
);
const roleLabel = computed(() =>
  user.value?.role === "system_admin"
    ? "System administrator"
    : user.value?.role === "property_manager"
      ? "Property manager"
      : "Staff",
);
async function signOut() {
  try {
    await $fetch("/api/auth/logout", { method: "POST" });
  } finally {
    user.value = null;
    await navigateTo("/login");
  }
}
onMounted(async () => {
  const requests: Promise<void>[] = [];
  if (can("users.view")) {
    requests.push(
      $fetch<{ users: typeof users.value }>("/api/admin/users")
        .then((result) => {
          users.value = result.users;
        })
        .catch(() => undefined),
    );
  }
  if (can("properties.view")) {
    requests.push(
      $fetch<{ properties: typeof properties.value }>("/api/admin/properties")
        .then((result) => {
          properties.value = result.properties;
        })
        .catch(() => undefined),
    );
  }
  if (can("viewActivity")) {
    requests.push(
      $fetch<{ activity: typeof activity.value }>("/api/admin/activity")
        .then((result) => {
          activity.value = result.activity;
        })
        .catch(() => undefined),
    );
  }
  await Promise.all(requests);
});
</script>

<template>
  <div class="admin-frame">
    <div v-if="menuOpen" class="admin-overlay" @click="menuOpen = false" />
    <aside class="admin-sidebar" :class="{ 'is-open': menuOpen }">
      <NuxtLink to="/admin" class="admin-brand" @click="menuOpen = false">
        <span class="brand-mark">E<span>&</span>E</span
        ><span><b>estate & estate</b><small>PROPERTY OFFICE</small></span>
      </NuxtLink>
      <div class="sidebar-caption">WORKSPACE</div>
      <nav class="admin-nav" aria-label="Admin navigation">
        <NuxtLink
          v-for="link in visibleLinks"
          :key="link.to"
          :to="link.to"
          class="admin-nav-link"
          :class="{
            active:
              route.path === link.to ||
              (link.to !== '/admin' && route.path.startsWith(link.to)),
          }"
          @click="menuOpen = false"
        >
          <span class="nav-icon">{{ link.icon }}</span
          >{{ link.label
          }}<span v-if="link.to === '/admin/properties'" class="nav-count">{{
            useAdminDemo().properties.value.length
          }}</span>
        </NuxtLink>
      </nav>
      <div class="sidebar-bottom">
        <div class="preview-note">
          <span class="preview-dot" /> DEMO PREVIEW
          <span class="info-mark">i</span>
          <p>
            Development prototype. Demo data resets when the server restarts.
          </p>
        </div>
        <NuxtLink to="/" class="back-site"
          ><span>↖</span> Back to website</NuxtLink
        >
      </div>
    </aside>
    <section class="admin-main">
      <header class="admin-topbar">
        <UButton variant="ghost"
          class="mobile-menu"
          aria-label="Open navigation"
          @click="menuOpen = !menuOpen"
        >
          ☰
        </UButton>
        <div class="topbar-context">
          <span class="top-dot" /> Private workspace
          <span class="context-divider">/</span>
          <span class="context-current">Admin console</span>
        </div>
        <div class="topbar-right">
          <UButton variant="ghost" class="top-icon" aria-label="Notifications">♧<i /></UButton>
          <div class="top-user">
            <span class="avatar">{{ user?.name.slice(0, 1) || "?" }}</span
            ><span
              ><b>{{ user?.name || "Signed in" }}</b
              ><small>{{ roleLabel }}</small></span
            ><UButton variant="ghost" class="admin-sign-out" type="button" @click="signOut">
              Sign out
            </UButton>
          </div>
        </div>
      </header>
      <main class="admin-content"><slot /></main>
      <footer class="admin-footer">
        © 2026 Estate & Estate
        <span>Made for thoughtful property management</span
        ><a href="/">Public website ↗</a>
      </footer>
    </section>
  </div>
</template>

<style>
.admin-frame {
  min-height: 100vh;
  background: #f8f7f4;
  color: #292c27;
  font-family: var(--sans, Arial, sans-serif);
  display: flex;
  --bronze: #a27750;
  --line: #e8e5de;
  --muted: #85867f;
}
.admin-sidebar {
  width: 252px;
  background: #fff;
  border-right: 1px solid var(--line);
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  padding: 27px 17px 18px;
}
.admin-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  margin: 0 7px 45px;
}
.brand-mark {
  width: 39px;
  height: 39px;
  border: 1px solid #c9b99f;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--serif, Georgia, serif);
  font-size: 15px;
  color: #41433e;
  letter-spacing: -1px;
}
.brand-mark span {
  font-size: 10px;
  color: var(--bronze);
}
.admin-brand b {
  font: 600 14px var(--sans, Arial, sans-serif);
  display: block;
  letter-spacing: -0.3px;
}
.admin-brand small {
  display: block;
  margin-top: 4px;
  color: #99968d;
  font-size: 8px;
  letter-spacing: 1.6px;
}
.sidebar-caption {
  font-size: 9px;
  letter-spacing: 1.4px;
  font-weight: 700;
  color: #a09f98;
  padding: 0 11px;
  margin-bottom: 11px;
}
.admin-nav {
  display: grid;
  gap: 4px;
}
.admin-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px;
  border-radius: 5px;
  color: #62645e;
  font-size: 12px;
  font-weight: 500;
  transition: 0.15s;
}
.admin-nav-link:hover {
  background: #f8f6f1;
  color: #2c302b;
}
.admin-nav-link.active {
  background: #f2eee7;
  color: #504330;
  font-weight: 600;
}
.nav-icon {
  width: 17px;
  text-align: center;
  color: #85847b;
  font-size: 16px;
}
.active .nav-icon {
  color: var(--bronze);
}
.nav-count {
  margin-left: auto;
  font-size: 10px;
  color: #a09e95;
}
.sidebar-bottom {
  margin-top: auto;
}
.preview-note {
  position: relative;
  border: 1px solid #e9e4da;
  background: #faf9f6;
  padding: 12px 12px 11px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #827d70;
}
.preview-dot,
.top-dot {
  width: 6px;
  height: 6px;
  background: #88a17f;
  border-radius: 50%;
  display: inline-block;
  vertical-align: 1px;
  margin-right: 5px;
}
.info-mark {
  float: right;
  border: 1px solid #d5d0c5;
  color: #938b7b;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  text-align: center;
  line-height: 11px;
  font: 9px Georgia;
}
.preview-note p {
  font-size: 10px;
  letter-spacing: 0;
  line-height: 1.55;
  font-weight: 400;
  color: #8b8981;
  margin: 8px 0 0;
}
.back-site {
  display: flex;
  gap: 9px;
  align-items: center;
  margin: 17px 7px 0;
  color: #777971;
  font-size: 11px;
}
.back-site span {
  font-size: 15px;
}
.admin-main {
  margin-left: 252px;
  width: calc(100% - 252px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.admin-topbar {
  height: 68px;
  background: #fff;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px;
  position: sticky;
  top: 0;
  z-index: 20;
}
.topbar-context {
  font-size: 11px;
  color: #96968e;
}
.context-divider {
  margin: 0 9px;
  color: #d0cec6;
}
.context-current {
  color: #565851;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 22px;
}
.role-switcher {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 7px 10px;
  color: #a09e95;
}
.role-switcher > span:first-child {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.8px;
}
.role-switcher select {
  border: 0;
  background: transparent;
  color: #4a4b45;
  font-size: 10px;
  outline: none;
  appearance: none;
  cursor: pointer;
}
.chevron {
  color: #a7a69e;
  font-size: 14px;
}
.top-icon {
  position: relative;
  background: none;
  border: 0;
  font-size: 18px;
  color: #66665f;
}
.top-icon i {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #b58353;
  right: 0;
  top: 0;
  border: 1px solid white;
}
.top-user {
  display: flex;
  align-items: center;
  gap: 8px;
}
.avatar {
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background: #e9e4d9;
  color: #72634f;
  display: grid;
  place-items: center;
  font: 14px var(--serif, Georgia, serif);
}
.top-user b {
  display: block;
  font-size: 10px;
  font-weight: 600;
}
.top-user small {
  display: block;
  color: #9b9b94;
  font-size: 9px;
  margin-top: 2px;
}
.admin-sign-out {
  border: 0;
  background: transparent;
  color: #81745e;
  font-size: 10px;
  cursor: pointer;
}
.admin-sign-out:hover {
  text-decoration: underline;
}
.admin-content {
  width: 100%;
  max-width: 1500px;
  padding: 33px 38px 48px;
  margin: 0 auto;
  flex: 1;
}
.admin-footer {
  padding: 15px 38px;
  border-top: 1px solid var(--line);
  display: flex;
  gap: 25px;
  color: #9a9991;
  font-size: 9px;
}
.admin-footer span {
  flex: 1;
}
.admin-footer a {
  color: #77776f;
}
.mobile-menu,
.admin-overlay {
  display: none;
}
@media (max-width: 900px) {
  .admin-sidebar {
    width: 228px;
  }
  .admin-main {
    margin-left: 228px;
    width: calc(100% - 228px);
  }
  .admin-content {
    padding: 27px 24px 38px;
  }
  .admin-topbar {
    padding: 0 24px;
  }
  .topbar-right {
    gap: 12px;
  }
}
@media (max-width: 680px) {
  .admin-sidebar {
    transform: translateX(-100%);
    transition: transform 0.2s;
    width: 264px;
  }
  .admin-sidebar.is-open {
    transform: translateX(0);
  }
  .admin-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: #16191566;
    z-index: 25;
  }
  .admin-main {
    margin-left: 0;
    width: 100%;
  }
  .admin-topbar {
    height: 59px;
    padding: 0 15px;
  }
  .mobile-menu {
    display: block;
    border: 0;
    background: transparent;
    font-size: 19px;
    color: #565951;
    padding: 4px 9px 4px 0;
  }
  .topbar-context {
    font-size: 10px;
    margin-right: auto;
  }
  .topbar-right {
    gap: 10px;
  }
  .top-icon {
    display: none;
  }
  .top-user > span:nth-child(2) {
    display: none;
  }
  .top-user {
    margin-left: 1px;
  }
  .admin-content {
    padding: 24px 16px 32px;
  }
  .admin-footer {
    padding: 14px 16px;
    gap: 8px;
    flex-wrap: wrap;
  }
  .admin-footer span {
    display: none;
  }
}


/* Shared workspace refresh */
.admin-frame {
  --bronze: #34483b;
  --line: #e6e6e6;
  --muted: #717171;
  background: #f7f7f5;
  color: #222;
}
.admin-sidebar {
  padding: 26px 16px 18px;
  border-color: #e9e9e7;
}
.admin-brand { margin-bottom: 38px; }
.brand-mark { border-color: #d9e0d8; color: #34483b; }
.brand-mark span { color: #34483b; }
.admin-brand b { font-size: 14px; letter-spacing: -.35px; }
.admin-brand small { color: #858585; }
.sidebar-caption { color: #858585; font-size: 10px; }
.admin-nav { gap: 5px; }
.admin-nav-link {
  min-height: 42px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #555;
  font-size: 13px;
}
.admin-nav-link:hover { background: #f6f7f5; color: #222; }
.admin-nav-link.active { background: #edf2ed; color: #2d4535; }
.nav-icon { color: #777; }
.active .nav-icon { color: #34483b; }
.preview-note { border-color: #e6e6e6; border-radius: 12px; background: #f8f8f6; }
.admin-topbar { border-color: #e8e8e8; }
.topbar-context { font-size: 12px; color: #777; }
.context-current { color: #333; }
.topbar-right { gap: 18px; }
.avatar { background: #edf2ed; color: #34483b; font-family: var(--sans, Arial, sans-serif); }
.top-user b { font-size: 12px; }
.top-user small { font-size: 10px; }
.admin-sign-out { color: #555; font-size: 11px; }
.admin-content { padding-top: 30px; }
.admin-footer { border-color: #e8e8e8; font-size: 10px; }
.admin-heading { margin-bottom: 24px; }
.admin-crumb { font-size: 11px; color: #888; }
.admin-crumb a { color: #555; }
.admin-eyebrow { color: #536957; font-size: 10px; letter-spacing: 1.1px; }
.admin-heading h1 { font: 650 30px/1.15 var(--sans, Arial, sans-serif); letter-spacing: -.9px; color: #222; }
.heading-description { font-size: 13px; color: #717171; }
.admin-frame .admin-button {
  min-height: 40px;
  padding-inline: 16px;
  border-radius: 999px;
  border-color: #dedede;
  color: #333;
  font-size: 12px;
}
.admin-frame .admin-button.primary { border-color: #34483b; background: #34483b; color: #fff; }
.admin-frame .admin-button.primary:hover { border-color: #26372d; background: #26372d; }
.admin-frame .admin-button.danger { border-color: #eedbd7; color: #9d5145; }
.admin-frame .stat-card,
.admin-frame .dash-panel,
.admin-frame .quick-panel,
.admin-frame .role-card,
.admin-frame .permission-panel,
.admin-frame .settings-panel,
.admin-frame .form-panel,
.admin-frame .users-panel,
.admin-frame .property-table-panel,
.admin-frame .activity-log-panel {
  border: 1px solid #e8e8e6;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 2%);
}
.admin-frame .stat-card { padding: 18px; }
.admin-frame .stat-head { font-size: 11px; color: #717171; }
.admin-frame .stat-icon { color: #536957; }
.admin-frame .stat-card > strong { font: 650 28px/1.1 var(--sans, Arial, sans-serif); color: #222; }
.admin-frame .stat-card small { font-size: 10px; color: #717171; }
.admin-frame .stat-rule { height: 3px; border-radius: 999px; background: #edf0ec; }
.admin-frame .stat-rule span { border-radius: inherit; background: #819382; }
.admin-frame .welcome-strip {
  border-radius: 18px;
  background: linear-gradient(115deg, #34483b, #4c6352);
  padding: 28px 30px;
}
.admin-frame .welcome-strip:after { border-color: rgb(255 255 255 / 15%); }
.admin-frame .welcome-kicker { color: #d6e0d7; font-size: 10px; }
.admin-frame .welcome-strip h2 { font: 650 25px/1.2 var(--sans, Arial, sans-serif); color: #fff; letter-spacing: -.5px; }
.admin-frame .welcome-strip p { color: #e2e8e2; font-size: 12px; }
.admin-frame .welcome-art { border-color: rgb(255 255 255 / 35%); color: #fff; }
.admin-frame .welcome-art i { color: #d4e0d4; }
.admin-frame .panel-eyebrow { color: #536957; font-size: 9px; }
.admin-frame .panel-heading h2,
.admin-frame .quick-panel h2,
.admin-frame .table-toolbar h2,
.admin-frame .users-toolbar h2,
.admin-frame .log-toolbar h2,
.admin-frame .settings-panel-head h2,
.admin-frame .permission-panel-head h2 {
  font: 650 17px/1.3 var(--sans, Arial, sans-serif);
  color: #222;
}
.admin-frame .panel-heading { margin-bottom: 18px; }
.admin-frame .recent-property,
.admin-frame .activity-item,
.admin-frame .timeline-event { border-color: #eee; }
.admin-frame .recent-property img { border-radius: 9px; }
.admin-frame .recent-info b,
.admin-frame .recent-price b { font-size: 11px; }
.admin-frame .recent-info small,
.admin-frame .recent-price .status-pill { font-size: 10px; }
.admin-frame .status-pill { padding: 6px 9px; font-size: 9px; }
.admin-frame .subtle-link { color: #34483b; font-size: 11px; font-weight: 600; }
.admin-frame .quick-action { border-color: #e8e8e6; border-radius: 12px; padding-block: 13px; }
.admin-frame .quick-action:hover { border-color: #b9c7bb; background: #f8faf8; }
.admin-frame .quick-action b { font-size: 11px; }
.admin-frame .quick-action small { font-size: 10px; }
.admin-frame .property-summary,
.admin-frame .activity-overview,
.admin-frame .users-summary {
  border: 1px solid #e8e8e6;
  border-radius: 14px;
  background: #fff;
  padding: 17px 20px;
}
.admin-frame .property-summary strong,
.admin-frame .activity-overview strong,
.admin-frame .users-summary strong { font: 650 21px var(--sans, Arial, sans-serif); color: #222; }
.admin-frame .property-summary span,
.admin-frame .activity-overview span,
.admin-frame .users-summary span { color: #717171; font-size: 11px; }
.admin-frame .summary-decoration,
.admin-frame .activity-stamp,
.admin-frame .users-summary p { color: #777 !important; font-size: 9px !important; }
.admin-frame .table-toolbar,
.admin-frame .users-toolbar,
.admin-frame .log-toolbar,
.admin-frame .permission-panel-head { padding: 18px 20px; border-color: #eee; }
.admin-frame .table-toolbar p,
.admin-frame .users-toolbar p,
.admin-frame .log-toolbar p { font-size: 11px; color: #777; }
.admin-frame .table-filters,
.admin-frame .users-filters,
.admin-frame .log-filters { gap: 9px; }
.admin-frame .search-field { border-radius: 999px; border-color: #ddd; padding-inline: 12px; }
.admin-frame .search-field input { font-size: 12px; }
.admin-frame .property-table th,
.admin-frame .users-table th { background: #fafaf9; color: #777; font-size: 9px; }
.admin-frame .property-table td,
.admin-frame .users-table td { border-color: #eee; font-size: 11px; }
.admin-frame .table-property b,
.admin-frame .price-cell b,
.admin-frame .member-cell b { font-size: 11px; }
.admin-frame .table-property small,
.admin-frame .price-cell small,
.admin-frame .member-cell small { font-size: 10px; }
.admin-frame .table-property img { border-radius: 8px; }
.admin-frame .table-pagination,
.admin-frame .users-table-foot,
.admin-frame .log-footer { border-color: #eee; font-size: 10px; }
.admin-frame .table-pagination button { border-radius: 8px; }
.admin-frame .table-pagination button.selected { background: #edf2ed; color: #34483b; }
.admin-frame .form-panel,
.admin-frame .settings-panel { padding: 21px; }
.admin-frame .form-panel-title h2 { font-size: 15px; }
.admin-frame .form-panel-title p,
.admin-frame .settings-panel-head p { font-size: 11px; color: #717171; }
.admin-frame .field { font-size: 12px; color: #555; }
.admin-frame .field input,
.admin-frame .field select,
.admin-frame .field textarea,
.admin-frame .field-pair input {
  border-radius: 10px;
  border-color: #ddd;
  color: #222;
  font-size: 12px;
}
.admin-frame .field input,
.admin-frame .field select { height: 42px; }
.admin-frame .field textarea { min-height: 110px; }
.admin-frame .image-drop { border-radius: 14px; background: #fafaf9; }
.admin-frame .role-card { padding: 18px; }
.admin-frame .role-card h2 { font: 650 16px var(--sans, Arial, sans-serif); }
.admin-frame .role-card p,
.admin-frame .roles-callout p { font-size: 11px; }
.admin-frame .permission-group-title { background: #fafaf9; font-size: 9px; }
.admin-frame .permission-row > div:first-child b { font-size: 11px; }
.admin-frame .permission-row > div:first-child small { font-size: 10px; }
.admin-frame .settings-help,
.admin-frame .roles-callout,
.admin-frame .settings-role-note { border-radius: 14px; }
.admin-frame .settings-help { padding: 21px; background: #f2f5f1; }
.admin-frame .settings-help h2 { font: 650 18px var(--sans, Arial, sans-serif); }
.admin-frame .settings-help p,
.admin-frame .settings-help a { font-size: 11px; }
.admin-frame .modal-backdrop section { border-radius: 18px; overflow: hidden; }
.admin-frame .admin-toast { border-radius: 12px; font-size: 12px; }
.admin-frame .permission-notice { border-radius: 14px; font-size: 13px; }
.admin-frame .demo-disclaimer { font-size: 10px; }
.admin-frame .admin-ui-select,
.admin-frame .admin-ui-input [data-slot="base"],
.admin-frame .admin-ui-textarea [data-slot="base"] { border-radius: 10px; }

</style>
