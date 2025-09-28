<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import StatusBadge from "./StatusBadge.svelte";
  import type { Manwha } from "$lib/types.ts";

  interface Props {
    manwhas: Manwha[];
    sortBy: string;
    sortOrder: string;
    onedit: (id: string) => void;
    ondelete: (id: string) => void;
  }

  let { manwhas, sortBy, sortOrder, onedit, ondelete }: Props = $props();

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

  function handleEdit(manwhaId: string) {
    onedit(manwhaId);
  }

  function handleDelete(manwhaId: string) {
    ondelete(manwhaId);
  }
</script>

<div class="table-container">
  <table class="manwhas-table">
    <thead>
      <tr>
        <th>
          <button class="sort-header" onclick={() => handleSort("title")}>
            <span>Name</span>
            {#if getSortIcon("title") === "asc"}
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
                  d="M5 15l7-7 7 7"
                >
                </path>
              </svg>
            {:else if getSortIcon("title") === "desc"}
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
                  d="M19 9l-7 7-7-7"
                >
                </path>
              </svg>
            {:else}
              <svg
                class="w-4 h-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                >
                </path>
              </svg>
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-header"
            onclick={() => handleSort("currentChapter")}
          >
            <span>Chapter</span>
            {#if getSortIcon("currentChapter") === "asc"}
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
                  d="M5 15l7-7 7 7"
                >
                </path>
              </svg>
            {:else if getSortIcon("currentChapter") === "desc"}
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
                  d="M19 9l-7 7-7-7"
                >
                </path>
              </svg>
            {:else}
              <svg
                class="w-4 h-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                >
                </path>
              </svg>
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-header"
            onclick={() => handleSort("status")}
          >
            <span>Status</span>
            {#if getSortIcon("status") === "asc"}
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
                  d="M5 15l7-7 7 7"
                >
                </path>
              </svg>
            {:else if getSortIcon("status") === "desc"}
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
                  d="M19 9l-7 7-7-7"
                >
                </path>
              </svg>
            {:else}
              <svg
                class="w-4 h-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                >
                </path>
              </svg>
            {/if}
          </button>
        </th>
        <th>
          <button
            class="sort-header"
            onclick={() => handleSort("rating")}
          >
            <span>Rating</span>
            {#if getSortIcon("rating") === "asc"}
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
                  d="M5 15l7-7 7 7"
                >
                </path>
              </svg>
            {:else if getSortIcon("rating") === "desc"}
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
                  d="M19 9l-7 7-7-7"
                >
                </path>
              </svg>
            {:else}
              <svg
                class="w-4 h-4 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                >
                </path>
              </svg>
            {/if}
          </button>
        </th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each manwhas as manwha}
        <tr class="table-row">
          <td class="title-cell">
            <span class="title">{manwha.title}</span>
          </td>
          <td class="chapter-cell">
            {#if manwha.link}
              <a
                href={manwha.link}
                target="_blank"
                rel="noopener noreferrer"
                class="chapter-link"
                title="Read Chapter {manwha.currentChapter}"
              >
                {manwha.currentChapter}
                <svg
                  class="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  >
                  </path>
                </svg>
              </a>
            {:else}
              <span>{manwha.currentChapter}</span>
            {/if}
          </td>
          <td class="status-cell">
            <StatusBadge status={manwha.status} />
          </td>
          <td class="rating-cell">
            {#if manwha.rating}
              <span class="rating-number">{manwha.rating}/10</span>
            {:else}
              <span class="no-rating">-</span>
            {/if}
          </td>
          <td class="actions-cell">
            <div class="action-buttons">
              <button
                class="action-btn edit-btn"
                onclick={() => handleEdit(manwha._id!)}
                title="Edit"
                aria-label="Edit manwha"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  >
                  </path>
                </svg>
              </button>
              <button
                class="action-btn delete-btn"
                onclick={() => handleDelete(manwha._id!)}
                title="Delete"
                aria-label="Delete manwha"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  >
                  </path>
                </svg>
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

  .title-cell .title {
    @apply font-semibold text-gray-200;
  }

  .chapter-cell {
    @apply font-medium text-gray-200;
  }

  .chapter-link {
    @apply inline-flex items-center font-semibold text-indigo-400
      hover:text-indigo-300 transition-colors duration-200 no-underline
      hover:underline;
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

  .edit-btn {
    @apply bg-blue-900/20 text-blue-400 hover:bg-blue-900/30;
  }

  .delete-btn {
    @apply bg-red-900/20 text-red-400 hover:bg-red-900/30;
  }
</style>
