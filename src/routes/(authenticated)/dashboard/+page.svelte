<script lang="ts">
  import type { PageData } from "./$types";
  import StatsCard from "$lib/components/StatsCard.svelte";
  import { formatManwhaStatus } from "$lib/types.ts";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Dashboard - Manwha Tracker</title>
</svelte:head>

<div class="container">
  <div class="header-section">
    <h1 class="page-title">Dashboard</h1>
  </div>

  <div class="stats-grid">
    <StatsCard
      title="Currently Reading"
      value={data.stats.reading}
      icon="reading"
      color="green"
    />
    <StatsCard
      title="Completed"
      value={data.stats.completed}
      icon="completed"
      color="blue"
    />
    <StatsCard
      title="To Continue"
      value={data.stats.toContinue}
      icon="planned"
      color="orange"
    />
    <StatsCard
      title="Total Manwhas"
      value={data.stats.total}
      icon="book"
      color="purple"
    />
  </div>

  <div class="activity-card">
    <h2 class="section-title">Recent Activity</h2>
    {#if data.recentManwhas.length === 0}
      <div class="empty-state">
        <p>
          No recent activity yet. <a
            href="/manwhas/add"
            class="link-primary"
          >Add your first manwha!</a>
        </p>
      </div>
    {:else}
      <div class="activity-list">
        {#each data.recentManwhas as manwha}
          <div class="activity-item">
            <div class="activity-info">
              <h3 class="activity-title">{manwha.title}</h3>
              <p class="activity-details">
                Chapter {manwha.currentChapter}
                • {formatManwhaStatus(manwha.status)}
              </p>
              <p class="activity-date">
                Last updated: {
                  new Date(manwha.updatedAt)
                    .toLocaleDateString()
                }
              </p>
            </div>
            <a
              href="/manwhas/{manwha._id}/edit"
              class="activity-action"
            >
              Edit
            </a>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="actions-grid">
    <a href="/manwhas/add" class="quick-action-purple">
      <div style="display: flex; align-items: center">
        <svg
          style="width: 2rem; height: 2rem; margin-right: 1rem"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          >
          </path>
        </svg>
        <div>
          <h3>Add New Manwha</h3>
          <p>Start tracking a new series</p>
        </div>
      </div>
    </a>

    <a href="/manwhas" class="quick-action-blue">
      <div style="display: flex; align-items: center">
        <svg
          style="width: 2rem; height: 2rem; margin-right: 1rem"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          >
          </path>
        </svg>
        <div>
          <h3>View All Manwhas</h3>
          <p>Browse your collection</p>
        </div>
      </div>
    </a>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .container {
    @apply max-w-[70%] mx-auto;
  }

  .stats-grid {
    @apply grid gap-6 mb-8;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .activity-card {
    @apply bg-gray-800 rounded-xl p-6 mb-6 border border-gray-600;
  }

  .section-title {
    @apply text-xl font-semibold mb-4 text-gray-100;
  }

  .empty-state {
    @apply text-gray-400;
  }

  .link-primary {
    @apply text-purple-400 underline hover:text-purple-300;
  }

  .activity-list {
    @apply flex flex-col gap-4;
  }

  .activity-item {
    @apply flex items-center justify-between p-4 bg-gray-900 rounded-lg border
      border-gray-600;
  }

  .activity-info {
    @apply flex-1;
  }

  .activity-title {
    @apply font-semibold text-gray-100 mb-1;
  }

  .activity-details {
    @apply text-sm text-gray-300 mb-1;
  }

  .activity-date {
    @apply text-xs text-gray-400 opacity-80;
  }

  .activity-action {
    @apply text-purple-400 text-sm no-underline px-4 py-2 rounded-md
      transition-colors hover:bg-purple-500 hover:text-white;
  }

  .quick-action-purple {
    @apply block p-6 rounded-xl shadow-lg transition-shadow text-white
      no-underline;
    background: linear-gradient(
      135deg,
      var(--color-purple-dark) 0%,
      #5a4a7a 100%
    );
  }

  .quick-action-blue {
    @apply block p-6 rounded-xl shadow-lg transition-shadow text-white
      no-underline;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }

  .quick-action-purple:hover,
  .quick-action-blue:hover {
    @apply shadow-2xl;
  }

  .quick-action-purple h3,
  .quick-action-blue h3 {
    @apply text-lg font-semibold m-0;
  }

  .quick-action-purple p,
  .quick-action-blue p {
    @apply opacity-90 m-0;
  }

  .actions-grid {
    @apply grid gap-6;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
</style>
