<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import ManwhaCard from "$lib/components/ManwhaCard.svelte";
  import StatsMini from "$lib/components/StatsMini.svelte";
  import { getManwhaStatusColor } from "$lib/types.ts";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  function getStatColor(status: string) {
    const colorClasses = getManwhaStatusColor(status as any);
    return colorClasses.split(" ").find((cls) => cls.startsWith("text-")) ||
      "text-gray-400";
  }

  function handleEdit(manwhaId: string) {
    goto(`/manwhas/${manwhaId}/edit`);
  }

  function handleDelete(manwhaId: string) {
    deleteManwha(manwhaId);
  }

  async function deleteManwha(manwhaId: string) {
    if (confirm("Are you sure you want to delete this manwha?")) {
      data.manwhas = data.manwhas.filter((m) => m._id !== manwhaId);

      try {
        const response = await fetch(`/api/manwhas/${manwhaId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          window.location.reload();
        }
      } catch (error) {
        window.location.reload();
      }
    }
  }
</script>

<svelte:head>
  <title>My Manwhas - Manwha Tracker</title>
</svelte:head>

<div class="container">
  <div class="header-section">
    <h1 class="page-title">My Manwhas</h1>
    <a href="/manwhas/add" class="btn-primary">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        >
        </path>
      </svg>
      <span>Add New Manwha</span>
    </a>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
    <StatsMini value={data.stats.total} label="Total" />
    <StatsMini
      value={data.stats.reading}
      label="Reading"
      colorClass={getStatColor("reading")}
    />
    <StatsMini
      value={data.stats.completed}
      label="Completed"
      colorClass={getStatColor("completed")}
    />
    <StatsMini
      value={data.stats.toContinue}
      label="To Continue"
      colorClass={getStatColor("to-continue")}
    />
    <StatsMini
      value={data.stats.abandoned}
      label="Abandoned"
      colorClass={getStatColor("abandoned")}
    />
    <StatsMini
      value={data.stats.ended}
      label="Ended"
      colorClass={getStatColor("ended")}
    />
  </div>

  {#if data.manwhas.length === 0}
    <div class="empty-state">
      <div class="text-center">
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          >
          </path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-300 mb-2">
          No manwhas yet
        </h3>
        <p class="text-gray-400 mb-6">
          Start tracking your favorite manwhas!
        </p>
        <a href="/manwhas/add" class="btn-primary">Add Your First Manwha</a>
      </div>
    </div>
  {:else}
    <div class="manwhas-grid">
      {#each data.manwhas as manwha}
        <ManwhaCard
          {manwha}
          onedit={handleEdit}
          ondelete={handleDelete}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 70%;
    margin: 0 auto;
  }

  .header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    color: white;
    text-decoration: none;
    transition: all 0.2s;
    background-color: var(--color-purple-dark);
  }

  .btn-primary:hover {
    background-color: var(--color-dark-secondary);
    transform: translateY(-1px);
  }

  .manwhas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    background-color: var(--color-card-bg);
    border-radius: 0.75rem;
    border: 1px solid var(--color-gray-light);
  }

  .empty-state h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-dark-primary);
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: var(--color-dark-secondary);
    margin-bottom: 1.5rem;
  }
</style>
