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
  <h1 class="page-title">Dashboard</h1>

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
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .activity-card {
    background-color: var(--color-card-bg);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--color-gray-light);
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }

  .empty-state {
    color: var(--color-dark-secondary);
  }

  .link-primary {
    color: var(--color-purple-dark);
    text-decoration: underline;
  }

  .link-primary:hover {
    color: var(--color-purple-light);
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .activity-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: var(--color-bg-primary);
    border-radius: 0.5rem;
    border: 1px solid var(--color-gray-light);
  }

  .activity-info {
    flex: 1;
  }

  .activity-title {
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
  }

  .activity-details {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.25rem;
  }

  .activity-date {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    opacity: 0.8;
  }

  .activity-action {
    color: var(--color-purple-dark);
    font-size: 0.875rem;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
  }

  .activity-action:hover {
    background-color: var(--color-purple-light);
    color: white;
  }

  /* Quick Actions */
  .quick-action-purple {
    display: block;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    color: white;
    text-decoration: none;
    background: linear-gradient(
      135deg,
      var(--color-purple-dark) 0%,
      #5a4a7a 100%
    );
  }

  .quick-action-blue {
    display: block;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    color: white;
    text-decoration: none;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }

  .quick-action-purple:hover,
  .quick-action-blue:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .quick-action-purple h3,
  .quick-action-blue h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  .quick-action-purple p,
  .quick-action-blue p {
    opacity: 0.9;
    margin: 0;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
</style>
