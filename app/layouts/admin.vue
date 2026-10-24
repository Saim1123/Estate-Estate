<script setup lang="ts">
import type { Permission } from "~/data/adminDemo";
const route = useRoute();
const { activeRole, can } = useAdminDemo();
const menuOpen = ref(false);
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
  activeRole.value === "System Administrator"
    ? "Administrator"
    : activeRole.value,
);
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
          <p>Changes are stored in this browser session only.</p>
        </div>
        <NuxtLink to="/" class="back-site"
          ><span>↖</span> Back to website</NuxtLink
        >
      </div>
    </aside>
    <section class="admin-main">
      <header class="admin-topbar">
        <button
          class="mobile-menu"
          aria-label="Open navigation"
          @click="menuOpen = !menuOpen"
        >
          ☰
        </button>
        <div class="topbar-context">
          <span class="top-dot" /> Private workspace
          <span class="context-divider">/</span>
          <span class="context-current">Admin console</span>
        </div>
        <div class="topbar-right">
          <label class="role-switcher"
            ><span>PREVIEW AS</span
            ><select v-model="activeRole" aria-label="Preview as demo user">
              <option>System Administrator</option>
              <option>Property Manager</option>
              <option>Staff</option></select
            ><span class="chevron">⌄</span></label
          >
          <button class="top-icon" aria-label="Notifications">♧<i /></button>
          <div class="top-user">
            <span class="avatar">{{ roleLabel.slice(0, 1) }}</span
            ><span
              ><b>{{ roleLabel }}</b
              ><small>Estate & Estate</small></span
            ><span class="chevron">⌄</span>
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
  .role-switcher {
    padding: 6px 7px;
    gap: 5px;
  }
  .role-switcher > span:first-child {
    display: none;
  }
  .role-switcher select {
    font-size: 9px;
    max-width: 105px;
  }
  .top-icon {
    display: none;
  }
  .top-user > span:nth-child(2),
  .top-user > .chevron {
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
</style>
