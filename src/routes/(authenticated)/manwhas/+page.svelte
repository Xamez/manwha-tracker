<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ManwhaCard from "$lib/components/ManwhaCard.svelte";
  import ManwhaTable from "$lib/components/ManwhaTable.svelte";
  import StatsMini from "$lib/components/StatsMini.svelte";
  import { getManwhaStatusColor } from "$lib/types.ts";
  import { renderIcon } from "$lib/icons";
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
  let manwhas = $state(data.manwhas);
  let stats = $state(data.stats);

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
      try {
        const response = await fetch(`/api/manwhas/${manwhaId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          manwhas = manwhas.filter((m) => m._id !== manwhaId);
          await refreshData();
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

  async function refreshData() {
    try {
      const response = await fetch("/api/manwhas");
      if (response.ok) {
        const result = await response.json();
        manwhas = result.manwhas;

        stats = {
          total: manwhas.length,
          reading: manwhas.filter((m) => m.status === "reading").length,
          completed: manwhas.filter((m) => m.status === "completed").length,
          toContinue: manwhas.filter((m) =>
            m.status === "to-continue"
          ).length,
          abandoned: manwhas.filter((m) => m.status === "abandoned").length,
          ended: manwhas.filter((m) => m.status === "ended").length,
        };
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
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

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
    <StatsMini value={stats.total} label="Total" />
    <StatsMini
      value={stats.reading}
      label="Reading"
      colorClass={getStatColor("reading")}
    />
    <StatsMini
      value={stats.completed}
      label="Completed"
      colorClass={getStatColor("completed")}
    />
    <StatsMini
      value={stats.toContinue}
      label="To Continue"
      colorClass={getStatColor("to-continue")}
    />
    <StatsMini
      value={stats.abandoned}
      label="Abandoned"
      colorClass={getStatColor("abandoned")}
    />
    <StatsMini
      value={stats.ended}
      label="Ended"
      colorClass={getStatColor("ended")}
    />
  </div>

  {#if manwhas.length === 0}
    <div class="empty-state">
      <div class="text-center">
        {@html renderIcon("book", "w-16 h-16 mx-auto text-gray-400 mb-4")}
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
        {#each manwhas as manwha}
          <ManwhaCard
            {manwha}
            onedit={handleEdit}
            ondelete={handleDelete}
          />
        {/each}
      </div>
    {:else}
      <ManwhaTable
        {manwhas}
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
