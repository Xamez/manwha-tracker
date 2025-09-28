<script lang="ts">
  import type { Manwha, ManwhaStatus } from "$lib/types";

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

  function getStatusColor(status: ManwhaStatus) {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "reading":
        return "bg-blue-600";
      case "to-continue":
        return "bg-orange-600";
      case "abandoned":
        return "bg-red-600";
      case "ended":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  }
</script>

<div class="manwha-card">
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
        <span class="info-value">{manwha.currentChapter}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Status:</span>
        <span class="status-badge {getStatusColor(manwha.status)}">
          {manwha.status.toUpperCase()}
        </span>
      </div>
      {#if manwha.rating}
        <div class="info-item">
          <span class="info-label">Rating:</span>
          <span class="info-value">{manwha.rating}/10</span>
        </div>
      {/if}
    </div>

    {#if manwha.lastReadAt}
      <p class="last-read">Last read: {formatDate(manwha.lastReadAt)}</p>
    {/if}

    {#if manwha.note}
      <p class="manwha-notes">{manwha.note}</p>
    {/if}
  </div>
</div>

<style>
  @reference "tailwindcss";

  .manwha-card {
    @apply p-6 rounded-lg shadow-sm border transition-all hover:shadow-md;
    background-color: var(--color-card-bg);
    border-color: var(--color-gray-light);
  }

  .manwha-header {
    @apply flex items-start justify-between mb-4;
  }

  .manwha-title {
    font-size: 1.25rem;
    font-weight: 600;
    flex: 1;
    margin-right: 1rem;
    color: var(--color-text-primary);
  }

  .manwha-actions {
    @apply flex gap-2;
  }

  .action-btn {
    @apply p-2 rounded-lg transition-all hover:scale-105 focus:outline-none;
  }

  .edit-btn {
    @apply bg-blue-100 text-blue-600 hover:bg-blue-200;
  }

  .delete-btn {
    @apply bg-red-100 text-red-600 hover:bg-red-200;
  }

  .manwha-details {
    @apply space-y-3;
  }

  .manwha-author {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .manwha-info {
    @apply grid grid-cols-2 gap-4 text-sm;
  }

  .info-item {
    @apply flex justify-between;
  }

  .info-label {
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .info-value {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .last-read {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .manwha-notes {
    font-size: 0.875rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background-color: var(--color-dark-secondary);
    color: var(--color-text-secondary);
  }

  .status-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    color: white;
    letter-spacing: 0.05em;
  }
</style>
