<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import StatusBadge from "./StatusBadge.svelte";
  import type { Manwha } from "$lib/types.ts";

  import { renderIcon } from "$lib/icons";
  import ChapterInfo from "./ChapterInfo.svelte";

  interface Props {
    manwhas: Manwha[];
    sortBy: string;
    sortOrder: string;
    onedit: (id: string) => void;
    ondelete: (id: string) => void;
    onincrement: (id: string) => void;
  }

  let { manwhas, sortBy, sortOrder, onedit, ondelete, onincrement }: Props =
    $props();

  function handleSort(column: string) {
    let newOrder = "desc";
    if (sortBy === column && sortOrder === "desc") {
      newOrder = "asc";
    }

    const params = new URLSearchParams($page.url.searchParams);
    params.set("sortBy", column);
    params.set("sortOrder", newOrder);

    goto(`?${params.toString()}`, { replaceState: true });
  }

  function getSortIcon(column: string) {
    if (sortBy !== column) {
      return "none";
    }
    return sortOrder === "asc" ? "asc" : "desc";
  }

  function getSortIconHtml(column: string) {
    const iconType = getSortIcon(column);
    if (iconType === "asc") return renderIcon("chevronUp");
    if (iconType === "desc") return renderIcon("chevronDown");
    return renderIcon("chevronUpDown");
  }

  function handleEdit(manwhaId: string) {
    onedit(manwhaId);
  }

  function handleDelete(manwhaId: string) {
    ondelete(manwhaId);
  }

  function handleIncrement(manwhaId: string) {
    onincrement(manwhaId);
  }

  function handleView(manwhaId: string) {
    goto(`/manwhas/${manwhaId}`);
  }
</script>

<div class="table-container">
  <table class="manwhas-table">
    <thead>
      <tr>
        <th>
          <button class="sort-header" onclick={() => handleSort("title")}>
            <span>Name</span>
            {@html getSortIconHtml("title")}
          </button>
        </th>
        <th class="hidden sm:table-cell">
          <button
            class="sort-header"
            onclick={() => handleSort("currentChapter")}
          >
            <span>Chapter</span>
            {@html getSortIconHtml("currentChapter")}
          </button>
        </th>
        <th class="hidden sm:table-cell">
          <button
            class="sort-header"
            onclick={() => handleSort("status")}
          >
            <span>Status</span>
            {@html getSortIconHtml("status")}
          </button>
        </th>
        <th class="hidden lg:table-cell">
          <button
            class="sort-header"
            onclick={() => handleSort("rating")}
          >
            <span>Rating</span>
            {@html getSortIconHtml("rating")}
          </button>
        </th>
        <th class="hidden sm:table-cell">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each manwhas as manwha}
        <tr class="table-row">
          <td class="title-cell">
            <button class="title-link" onclick={() => handleView(manwha._id!)}>
              {manwha.title}
            </button>
          </td>
          <td class="hidden sm:table-cell">
            {#if manwha.link}
              <ChapterInfo link={manwha.link} chapter={manwha.currentChapter} />
            {:else}
              <span>{manwha.currentChapter}</span>
            {/if}
          </td>
          <td class="hidden sm:table-cell">
            <StatusBadge status={manwha.status} />
          </td>
          <td class="hidden lg:table-cell">
            {#if manwha.rating}
              <span class="rating-number">{manwha.rating}/10</span>
            {:else}
              <span class="no-rating">-</span>
            {/if}
          </td>
          <td class="hidden sm:table-cell">
            <div class="action-buttons">
              <button
                class="action-btn increment-btn"
                onclick={() => handleIncrement(manwha._id!)}
                title="Increment Chapter"
                aria-label="Increment chapter"
              >
                {@html renderIcon("plus")}
              </button>
              <button
                class="action-btn view-btn"
                onclick={() => handleView(manwha._id!)}
                title="View"
                aria-label="View manwha"
              >
                {@html renderIcon("info")}
              </button>
              <button
                class="action-btn edit-btn"
                onclick={() => handleEdit(manwha._id!)}
                title="Edit"
                aria-label="Edit manwha"
              >
                {@html renderIcon("edit")}
              </button>
              <button
                class="action-btn delete-btn"
                onclick={() => handleDelete(manwha._id!)}
                title="Delete"
                aria-label="Delete manwha"
              >
                {@html renderIcon("delete")}
              </button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  @reference "tailwindcss";

  .table-container {
    @apply bg-gray-800 rounded-xl border border-gray-600 overflow-hidden;
  }

  .manwhas-table {
    @apply w-full border-collapse;
  }

  .manwhas-table thead {
    @apply bg-gray-700;
  }

  .manwhas-table th {
    @apply p-4 text-left font-semibold text-gray-200 border-b border-gray-600;
  }

  .sort-header {
    @apply bg-transparent border-none text-inherit font-semibold cursor-pointer
      p-0 flex items-center gap-2 transition-colors duration-200
      hover:text-indigo-400;
  }

  .table-row {
    @apply transition-colors duration-200 hover:bg-gray-700;
  }

  .manwhas-table td {
    @apply p-4 border-b border-gray-600 align-middle;
  }

  .title-cell {
    @apply max-w-xs;
  }

  .title-link {
    @apply font-semibold text-gray-200 bg-transparent border-none cursor-pointer
      p-0 text-left transition-colors duration-200 hover:text-indigo-400;
  }

  .rating-number {
    @apply font-semibold text-gray-200;
  }

  .no-rating {
    @apply text-gray-400 italic;
  }

  .action-buttons {
    @apply flex gap-2;
  }

  .action-btn {
    @apply flex items-center justify-center w-8 h-8 rounded-md border-none
      cursor-pointer transition-all duration-200;
  }

  .increment-btn {
    @apply bg-green-900/20 text-green-400 hover:bg-green-900/30;
  }

  .view-btn {
    @apply bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 hidden
      md:flex;
  }

  .edit-btn {
    @apply bg-blue-900/20 text-blue-400 hover:bg-blue-900/30;
  }

  .delete-btn {
    @apply bg-red-900/20 text-red-400 hover:bg-red-900/30;
  }
</style>
