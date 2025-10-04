<script lang="ts">
  import { onMount } from "svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import ManwhaCard from "$lib/components/ManwhaCard.svelte";
  import ManwhaTable from "$lib/components/ManwhaTable.svelte";
  import StatsMini from "$lib/components/StatsMini.svelte";
  import { getManwhaStatusColor } from "$lib/types.ts";
  import { renderIcon } from "$lib/icons";
  import { incrementManwhaChapter } from "$lib/utils/manwhaUtils.ts";
  import {
    filterManwhas,
    sortManwhasByLastUpdate,
    type StatusFilter,
  } from "$lib/utils/manwhaUtils.ts";
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
  let statusFilter: StatusFilter = $state("all");
  let searchQuery = $state("");

  let filteredManwhas = $derived.by(() => {
    const filtered = filterManwhas(data.manwhas, statusFilter, searchQuery);

    if (viewMode === "cards") {
      return sortManwhasByLastUpdate(filtered);
    }
    
    return filtered;
  });

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

  function setStatusFilter(filter: StatusFilter) {
    statusFilter = filter;
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

  async function handleIncrement(manwhaId: string) {
    const manwha = data.manwhas.find((m) => m._id === manwhaId);
    if (!manwha) return;

    const success = await incrementManwhaChapter(manwhaId, manwha);
    if (success) {
      await invalidateAll();
    }
  }

  async function deleteManwha(manwhaId: string) {
    if (confirm("Are you sure you want to delete this manwha?")) {
      try {
        const response = await fetch(`/api/manwhas/${manwhaId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await invalidateAll();
        } else {
          const errorData = await response.json();
          alert(
            "Failed to delete manwha: " +
              (errorData.error || "Unknown error"),
          );
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Network error occurred while deleting");
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
          {@html renderIcon("grid", "w-4 h-4")}
          Cards
        </button>
        <button
          class="toggle-btn"
          class:active={viewMode === "table"}
          onclick={() => setViewMode("table")}
        >
          {@html renderIcon("table", "w-4 h-4")}
          Table
        </button>
      </div>
    </div>
    <a href="/manwhas/add" class="btn-primary">
      {@html renderIcon("cross", "w-4 h-4")}
      <span>New Manwha</span>
    </a>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
    <StatsMini
      value={data.stats.total}
      label="Total"
      onclick={() => setStatusFilter("all")}
      active={statusFilter === "all"}
    />
    <StatsMini
      value={data.stats.reading}
      label="Reading"
      colorClass={getStatColor("reading")}
      onclick={() => setStatusFilter("reading")}
      active={statusFilter === "reading"}
    />
    <StatsMini
      value={data.stats.toContinue}
      label="To Continue"
      colorClass={getStatColor("to-continue")}
      onclick={() => setStatusFilter("to-continue")}
      active={statusFilter === "to-continue"}
    />
    <StatsMini
      value={data.stats.completed}
      label="Completed"
      colorClass={getStatColor("completed")}
      onclick={() => setStatusFilter("completed")}
      active={statusFilter === "completed"}
    />
    <StatsMini
      value={data.stats.abandoned}
      label="Abandoned"
      colorClass={getStatColor("abandoned")}
      onclick={() => setStatusFilter("abandoned")}
      active={statusFilter === "abandoned"}
    />
    <StatsMini
      value={data.stats.totalChaptersRead.toLocaleString()}
      label="Chapters Read"
      colorClass="text-purple-400"
    />
    <StatsMini
      value={`${data.stats.estimatedReadingHours}h`}
      label="Reading Time"
      colorClass="text-cyan-400"
    />
  </div>

  <div class="search-container">
    <div class="search-wrapper">
      <div class="search-icon">
        {@html renderIcon("search", "w-5 h-5")}
      </div>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search manwhas by title or note..."
        class="search-input"
      />
      {#if searchQuery}
        <button
          class="clear-search-btn"
          onclick={() => (searchQuery = "")}
          aria-label="Clear search"
        >
          {@html renderIcon("close", "w-4 h-4")}
        </button>
      {/if}
    </div>
  </div>

  {#if filteredManwhas.length === 0}
    <div class="empty-state">
      <div class="text-center">
        {@html renderIcon("book", "w-16 h-16 mx-auto text-gray-400 mb-4")}
        {#if searchQuery || statusFilter !== "all"}
          <h3 class="text-xl font-semibold text-gray-300 mb-2">
            No manwhas found
          </h3>
          <p class="text-gray-400 mb-6">
            Try adjusting your filters or search query
          </p>
          <button
            class="btn-secondary"
            onclick={() => {
              searchQuery = "";
              statusFilter = "all";
            }}
          >
            Clear Filters
          </button>
        {:else}
          <h3 class="text-xl font-semibold text-gray-300 mb-2">
            No manwhas yet
          </h3>
          <p class="text-gray-400 mb-6">
            Start tracking your favorite manwhas!
          </p>
          <a href="/manwhas/add" class="btn-primary">Add Your First Manwha</a>
        {/if}
      </div>
    </div>
  {:else}
    {#if viewMode === "cards"}
      <div class="manwhas-grid">
        {#each filteredManwhas as manwha}
          <ManwhaCard
            {manwha}
            onedit={handleEdit}
            ondelete={handleDelete}
            onincrement={handleIncrement}
          />
        {/each}
      </div>
    {:else}
      <ManwhaTable
        manwhas={filteredManwhas}
        sortBy={data.sortBy}
        sortOrder={data.sortOrder}
        onedit={handleEdit}
        ondelete={handleDelete}
        onincrement={handleIncrement}
      />
    {/if}
  {/if}
</div>

<style>
  @reference "tailwindcss";

  .header-section {
    @apply flex flex-col md:flex-row items-start md:items-center justify-between
      gap-4 mb-6;
  }

  .header-left {
    @apply flex flex-row items-center md:items-center gap-4 md:gap-6
      justify-between w-full md:w-auto;
  }

  .page-title {
    @apply text-xl md:text-3xl font-bold;
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
    @apply flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3
      rounded-lg font-medium text-sm md:text-base text-white no-underline
      transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 w-full
      md:w-auto whitespace-nowrap;
  }

  .btn-secondary {
    @apply flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3
      rounded-lg font-medium text-sm md:text-base text-white no-underline
      transition-all duration-200 bg-gray-600 hover:bg-gray-500 w-full md:w-auto
      whitespace-nowrap border-none cursor-pointer;
  }

  .search-container {
    @apply mb-6;
  }

  .search-wrapper {
    @apply relative;
  }

  .search-icon {
    @apply absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400
      pointer-events-none;
  }

  .search-input {
    @apply w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg
      text-gray-200 placeholder-gray-500 focus:outline-none
      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
      transition-colors duration-200;
  }

  .clear-search-btn {
    @apply absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400
      hover:text-gray-200 transition-colors duration-200 bg-transparent
      border-none cursor-pointer p-1;
  }

  .manwhas-grid {
    @apply grid grid-cols-1 xl:grid-cols-2 gap-6;
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
