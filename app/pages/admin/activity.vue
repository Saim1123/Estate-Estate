<script setup lang="ts">
definePageMeta({ layout: "admin" });
const { activity, can } = useAdminDemo();
const query = ref("");
const actionFilter = ref("All activity");
const filtered = computed(() =>
  activity.value.filter(
    (event) =>
      `${event.actor} ${event.action} ${event.record}`
        .toLowerCase()
        .includes(query.value.toLowerCase()) &&
      (actionFilter.value === "All activity" ||
        (actionFilter.value === "Properties" && event.kind === "Property") ||
        (actionFilter.value === "Accounts" && event.kind === "Account") ||
        (actionFilter.value === "Permissions" && event.kind === "Permissions")),
  ),
);
function glyph(kind: string) {
  return kind === "Property" ? "⌂" : kind === "Account" ? "♙" : "◇";
}
</script>
<template>
  <div>
    <AdminPageHeading
      eyebrow="WORKSPACE HISTORY"
      title="Activity log"
      description="A clear, chronological record of changes across your workspace."
    />
    <div v-if="!can('viewActivity')" class="permission-notice">
      Your preview role does not have permission to view activity logs.
    </div>
    <template v-else>
      <div class="activity-overview">
        <div>
          <strong>{{ activity.length }}</strong
          ><span>recorded events</span>
        </div>
        <div>
          <strong>{{
            activity.filter((e) => e.kind === "Property").length
          }}</strong
          ><span>property updates</span>
        </div>
        <div>
          <strong>{{
            activity.filter((e) => e.kind === "Account").length
          }}</strong
          ><span>account changes</span>
        </div>
        <div class="activity-stamp">A RECORD OF CARE <i>◷</i></div>
      </div>
      <section class="activity-log-panel">
        <div class="log-toolbar">
          <div>
            <h2>All activity</h2>
            <p>Events are recorded as actions happen in this demo.</p>
          </div>
          <div class="log-filters">
            <label class="search-field"
              ><span>⌕</span
              ><input v-model="query" placeholder="Search activity…" /></label
            ><select v-model="actionFilter">
              <option>All activity</option>
              <option>Properties</option>
              <option>Accounts</option>
              <option>Permissions</option>
            </select>
          </div>
        </div>
        <div v-if="filtered.length" class="timeline">
          <article
            v-for="event in filtered"
            :key="event.id"
            class="timeline-event"
          >
            <div class="timeline-icon" :class="event.kind.toLowerCase()">
              {{ glyph(event.kind) }}
            </div>
            <div class="timeline-copy">
              <p>
                <b>{{ event.actor }}</b
                ><span>{{ event.action }}</span
                ><strong>{{ event.record }}</strong>
              </p>
              <small>{{ event.kind }}</small>
            </div>
            <time>{{ event.at }}</time>
          </article>
        </div>
        <div v-else class="empty-table">
          <span>◷</span><b>No activity found</b>
          <p>Try a different search or action filter.</p>
        </div>
        <div class="log-footer">
          Showing <b>{{ filtered.length }}</b>
          {{ filtered.length === 1 ? "event" : "events" }}
          <span>Activity history is retained in this browser session.</span>
        </div>
      </section>
      <div class="demo-disclaimer">
        ⓘ <span>Demo activity</span> — Events are stored in frontend state only.
        A production audit log should be recorded and protected server-side.
      </div>
    </template>
  </div>
</template>
<style>
.activity-overview {
  display: flex;
  align-items: center;
  gap: 38px;
  background: #efede7;
  padding: 15px 18px;
  margin-bottom: 14px;
}
.activity-overview > div:not(.activity-stamp) {
  display: grid;
  gap: 3px;
}
.activity-overview strong {
  font: 18px var(--serif, Georgia, serif);
  font-weight: 400;
}
.activity-overview span {
  font-size: 9px;
  color: #8b8c84;
}
.activity-stamp {
  margin-left: auto;
  font-size: 8px;
  letter-spacing: 1.4px;
  color: #aaa295;
}
.activity-stamp i {
  font-size: 16px;
  font-style: normal;
  color: #a48a69;
  margin-left: 7px;
}
.activity-log-panel {
  background: white;
  border: 1px solid #e9e6df;
}
.log-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 16px 18px;
  border-bottom: 1px solid #efede7;
}
.log-toolbar h2 {
  font: 400 16px var(--serif, Georgia, serif);
  margin: 0 0 4px;
}
.log-toolbar p {
  font-size: 9px;
  color: #9a9a92;
  margin: 0;
}
.log-filters {
  display: flex;
  gap: 8px;
}
.log-filters .search-field {
  height: 32px;
}
.log-filters .search-field input {
  width: 150px;
}
.log-filters select {
  height: 32px;
  border: 1px solid #e9e6df;
  background: white;
  padding: 0 25px 0 8px;
  font-size: 9px;
  color: #686961;
}
.timeline {
  padding: 4px 18px;
}
.timeline-event {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #f0eee9;
}
.timeline-event:last-child {
  border-bottom: 0;
}
.timeline-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 50%;
  background: #f2efe8;
  color: #a07c54;
  font-size: 14px;
}
.timeline-icon.account {
  background: #eff2ec;
  color: #71866d;
}
.timeline-icon.permissions {
  background: #f2edf1;
  color: #8e7287;
}
.timeline-copy {
  flex: 1;
  min-width: 0;
}
.timeline-copy p {
  display: flex;
  align-items: baseline;
  gap: 5px;
  flex-wrap: wrap;
  margin: 0 0 5px;
  font-size: 10px;
  color: #85867e;
}
.timeline-copy p b {
  font-size: 10px;
  color: #454740;
  font-weight: 600;
}
.timeline-copy p strong {
  font-size: 10px;
  color: #635944;
  font-weight: 600;
}
.timeline-copy > small {
  font-size: 8px;
  color: #aaa99f;
}
.timeline-event time {
  color: #96978e;
  font-size: 9px;
  white-space: nowrap;
}
.log-footer {
  display: flex;
  justify-content: space-between;
  padding: 12px 17px;
  border-top: 1px solid #efede7;
  color: #999a92;
  font-size: 9px;
}
.log-footer b {
  color: #575951;
  margin: 0 3px;
}
.log-footer span {
  color: #aaa99f;
}
@media (max-width: 800px) {
  .log-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }
  .log-filters {
    width: 100%;
  }
  .log-filters .search-field {
    flex: 1;
  }
  .log-filters .search-field input {
    width: 100%;
  }
}
@media (max-width: 560px) {
  .activity-overview {
    gap: 15px;
    padding: 13px;
  }
  .activity-stamp {
    display: none;
  }
  .timeline {
    padding: 3px 12px;
  }
  .timeline-event {
    gap: 9px;
    align-items: flex-start;
  }
  .timeline-event time {
    font-size: 8px;
    padding-top: 4px;
  }
  .timeline-copy p {
    font-size: 9px;
  }
  .timeline-copy p b,
  .timeline-copy p strong {
    font-size: 9px;
  }
  .log-footer span {
    display: none;
  }
}
</style>
