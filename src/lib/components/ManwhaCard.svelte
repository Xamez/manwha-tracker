<script lang="ts">
  import type { Manwha, ManwhaStatus } from "$lib/types";
  import StatusBadge from "./StatusBadge.svelte";
  import { generateChapterUrl } from "$lib/utils/urlUtils.ts";

  interface Props {
    manwha: Manwha;
    onedit?: ((id: string) => void) | undefined;
    ondelete?: ((id: string) => void) | undefined;
  }

  let { manwha, onedit = undefined, ondelete = undefined }: Props =
    $props();

  function handleEdit() {
    if (manwha._id) {
      onedit?.(manwha._id);
    }
  }

  function handleDelete() {
    if (manwha._id) {
      ondelete?.(manwha._id);
    }
  }

  function formatDate(dateString?: Date) {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  }
</script>

<div class="manwha-card">
  <div class="manwha-layout">
    {#if manwha.coverImage}
      <div class="cover-image-container">
        <img
          src={manwha.coverImage}
          alt="{manwha.title} cover"
          class="cover-image"
          loading="lazy"
        />
      </div>
    {/if}

    <div class="manwha-content">
      <div class="manwha-header">
        <h3 class="manwha-title">{manwha.title}</h3>
        <div class="manwha-actions">
          <button
            onclick={handleEdit}
            class="action-btn edit-btn"
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
            onclick={handleDelete}
            class="action-btn delete-btn"
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
      </div>

      <div class="manwha-details">
        <div class="manwha-info">
          <div class="info-item">
            <span class="info-label">Chapter:</span>
            {#if manwha.link}
              <a
                href={generateChapterUrl(
                  manwha.link,
                  manwha.currentChapter,
                )}
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
              <span class="info-value">{manwha.currentChapter}</span>
            {/if}
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <StatusBadge status={manwha.status} />
          </div>
          {#if manwha.rating}
            <div class="info-item">
              <span class="info-label">Rating:</span>
              <span class="info-value">{manwha.rating}/10</span>
            </div>
          {/if}
        </div>

        {#if manwha.note}
          <p class="manwha-notes">{manwha.note}</p>
        {/if}

        {#if manwha.lastReadAt}
          <p class="last-read">Last read: {formatDate(manwha.lastReadAt)}</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .manwha-card {
    @apply p-6 rounded-lg shadow-sm border border-gray-600 bg-gray-800
      transition-all hover:shadow-md hover:border-gray-500;
  }

  .manwha-layout {
    @apply flex gap-4;
  }

  .cover-image-container {
    @apply flex-shrink-0;
  }

  .cover-image {
    @apply w-20 h-28 object-cover rounded-lg border border-gray-600 shadow-sm;
  }

  .manwha-content {
    @apply flex-1 min-w-0;
  }

  .manwha-header {
    @apply flex items-start justify-between mb-4;
  }

  .manwha-title {
    @apply text-xl font-semibold flex-1 mr-4 text-gray-200;
  }

  .manwha-actions {
    @apply flex gap-2;
  }

  .action-btn {
    @apply p-2 rounded-lg transition-all hover:scale-105 focus:outline-none
      cursor-pointer;
  }

  .edit-btn {
    @apply bg-blue-900/20 text-blue-400 hover:bg-blue-900/30;
  }

  .delete-btn {
    @apply bg-red-900/20 text-red-400 hover:bg-red-900/30;
  }

  .manwha-details {
    @apply space-y-3;
  }

  .manwha-info {
    @apply flex flex-wrap gap-4 text-sm;
  }

  .info-item {
    @apply flex items-center gap-2;
  }

  .info-label {
    @apply font-medium text-gray-400;
  }

  .info-value {
    @apply font-semibold text-gray-200;
  }

  .chapter-link {
    @apply inline-flex items-center font-semibold text-indigo-400
      hover:text-indigo-300 transition-colors duration-200 no-underline;
  }

  .chapter-link:hover {
    @apply underline;
  }

  .last-read {
    @apply text-xs text-gray-400;
  }

  .manwha-notes {
    @apply text-sm p-3 rounded-lg bg-gray-700 text-gray-300;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 640px) {
    .manwha-layout {
      @apply flex-col;
    }

    .cover-image-container {
      @apply self-center;
    }

    .cover-image {
      @apply w-24 h-32;
    }
  }
</style>
