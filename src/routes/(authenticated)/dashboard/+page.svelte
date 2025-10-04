<script lang="ts">
  import type { PageData } from "./$types";
  import StatsCard from "$lib/components/StatsCard.svelte";
  import StatusBadge from "$lib/components/StatusBadge.svelte";
  import ChapterInfo from "$lib/components/ChapterInfo.svelte";
  import IconButton from "$lib/components/IconButton.svelte";
  import { renderIcon } from "$lib/icons";
  import { goto, invalidateAll } from "$app/navigation";
  import { incrementManwhaChapter } from "$lib/utils/manwhaUtils.ts";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  async function handleIncrement(manwhaId: string) {
    const manwha = data.recentManwhas.find((m) => m._id === manwhaId);
    if (!manwha) return;

    const success = await incrementManwhaChapter(manwhaId, manwha);
    if (success) {
      await invalidateAll();
    }
  }
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
            <button
              class="item-link"
              onclick={() => goto(`/manwhas/${manwha._id}`)}
            >
              {#if manwha.coverImage}
                <img
                  src={manwha.coverImage}
                  alt={manwha.title}
                  class="activity-image"
                />
              {:else}
                <div class="activity-image-placeholder">
                  {@html renderIcon("book")}
                </div>
              {/if}
              <div class="activity-info">
                <h3 class="activity-title">{manwha.title}</h3>
                <div class="activity-details">
                  <ChapterInfo
                    chapter={manwha.currentChapter}
                    link={manwha.link}
                  />
                  <span class="separator">•</span>
                  <StatusBadge status={manwha.status} />
                </div>
                <p class="activity-date">
                  Last updated: {
                    new Date(manwha.updatedAt)
                      .toLocaleDateString()
                  }
                </p>
              </div>
            </button>
            <div class="activity-actions">
              <IconButton
                icon="plus"
                onclick={() => handleIncrement(manwha._id!)}
                title="Increment Chapter"
                ariaLabel="Increment chapter"
                textColor="text-green-400"
                bgColor="bg-green-900/20"
                hoverBgColor="hover:bg-green-900/30"
              />
              <IconButton
                icon="edit"
                href="/manwhas/{manwha._id}/edit"
                title="Edit"
                ariaLabel="Edit manwha"
                textColor="text-blue-400"
                bgColor="bg-blue-900/20"
                hoverBgColor="hover:bg-blue-900/30"
              />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="actions-grid">
    <a href="/manwhas/add" class="quick-action-purple">
      <div class="quick-action-content">
        <div class="quick-action-icon">
          {@html renderIcon("plus")}
        </div>
        <div>
          <h3>Add New Manwha</h3>
          <p>Start tracking a new series</p>
        </div>
      </div>
    </a>

    <a href="/manwhas" class="quick-action-blue">
      <div class="quick-action-content">
        <div class="quick-action-icon">
          {@html renderIcon("library")}
        </div>
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
      border-gray-600 transition-colors hover:bg-gray-800 hover:border-gray-500;
  }

  .item-link {
    @apply flex items-center flex-1 min-w-0 cursor-pointer bg-transparent
      border-none p-0 text-left text-inherit;
  }

  .activity-actions {
    @apply flex-shrink-0 ml-4 flex gap-2;
  }

  .activity-image {
    @apply w-16 h-20 object-cover rounded mr-4 flex-shrink-0 hidden sm:block;
  }

  .activity-image-placeholder {
    @apply w-16 h-20 bg-gray-700 rounded mr-4 flex-shrink-0 items-center
      justify-center text-gray-500 hidden sm:flex;
  }

  .activity-image-placeholder :global(svg) {
    @apply w-8 h-8;
  }

  .activity-info {
    @apply flex-1;
  }

  .activity-title {
    @apply font-semibold text-gray-100 mb-1;
  }

  .activity-details {
    @apply flex items-center gap-2 text-sm mb-1;
  }

  .separator {
    @apply text-gray-500;
  }

  .activity-date {
    @apply text-xs text-gray-400 opacity-80;
  }

  .quick-action-purple {
    @apply block p-4 rounded-xl shadow-lg transition-shadow text-white
      no-underline bg-gradient-to-br from-purple-700 to-purple-900;
  }

  .quick-action-blue {
    @apply block p-4 rounded-xl shadow-lg transition-shadow text-white
      no-underline bg-gradient-to-br from-blue-500 to-blue-800;
  }

  .quick-action-purple:hover,
  .quick-action-blue:hover {
    @apply shadow-2xl;
  }

  .quick-action-content {
    @apply flex items-center;
  }

  .quick-action-icon {
    @apply mr-4;
  }

  .quick-action-icon :global(svg) {
    @apply w-8 h-8 text-white;
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
