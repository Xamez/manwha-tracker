<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ManwhaCard from "$lib/components/ManwhaCard.svelte";
  import ManwhaTable from "$lib/components/ManwhaTable.svelte";
  import StatsMini from "$lib/components/StatsMini.svelte";
  import { getManwhaStatusColor } from "$lib/types.ts";
  import type {
    AuthenticatedUser,
    Manwha,
    ManwhaStats,
  } from "$lib/types.ts";

  interface PageData {
    user: AuthenticatedUser;
    manwhas: Manwha[];
    stats: ManwhaStats;
    sortBy: string;
    sortOrder: string;
  }

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let viewMode: "cards" | "table" = $state("cards");

  onMount(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedViewMode = localStorage.getItem("manwha-view-mode");
      if (savedViewMode === "cards" || savedViewMode === "table") {
        viewMode = savedViewMode;
      }
    }
  });

  function setViewMode(mode: "cards" | "table") {
    viewMode = mode;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("manwha-view-mode", mode);
    }
  }

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
    <div class="header-left">
      <h1 class="page-title">My Manwhas</h1>
      <div class="view-toggle">
        <button
          class="toggle-btn"
          class:active={viewMode === "cards"}
          onclick={() => setViewMode("cards")}
        >
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
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            >
            </path>
          </svg>
          Cards
        </button>
        <button
          class="toggle-btn"
          class:active={viewMode === "table"}
          onclick={() => setViewMode("table")}
        >
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
              d="M3 10h18M3 6h18M3 14h18M3 18h18"
            >
            </path>
          </svg>
          Table
        </button>
      </div>
    </div>
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
    {#if viewMode === "cards"}
      <div class="manwhas-grid">
        {#each data.manwhas as manwha}
          <ManwhaCard
            {manwha}
            onedit={handleEdit}
            ondelete={handleDelete}
          />
        {/each}
      </div>
    {:else}
      <ManwhaTable
        manwhas={data.manwhas}
        sortBy={data.sortBy}
        sortOrder={data.sortOrder}
        onedit={handleEdit}
        ondelete={handleDelete}
      />
    {/if}
  {/if}
</div>

<style>
  @reference "tailwindcss";

  .container {
    @apply max-w-5xl mx-auto;
  }

  .header-section {
    @apply flex items-center justify-between mb-8;
  }

  .header-left {
    @apply flex items-center gap-6;
  }

  .view-toggle {
    @apply flex bg-gray-800 rounded-lg border border-gray-600 overflow-hidden;
  }

  .toggle-btn {
    @apply flex items-center gap-2 px-3 py-2 bg-transparent border-none
      text-gray-400 text-sm cursor-pointer transition-all duration-200;
  }

  .toggle-btn:hover {
    @apply bg-gray-600;
  }

  .toggle-btn.active {
    @apply bg-indigo-600 text-white;
  }

  .btn-primary {
    @apply flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white
      no-underline transition-all duration-200 bg-indigo-600 hover:bg-indigo-700
      hover:-translate-y-0.5;
  }

  .manwhas-grid {
    @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6;
  }

  .empty-state {
    @apply text-center p-12 bg-gray-800 rounded-xl border border-gray-600;
  }

  .empty-state h3 {
    @apply text-lg font-semibold text-gray-300 mb-2;
  }

  .empty-state p {
    @apply text-gray-400 mb-6;
  }
</style>
