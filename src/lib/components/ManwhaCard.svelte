<script lang="ts">
  import type { Manwha } from "$lib/types";
  import StatusBadge from "./StatusBadge.svelte";
  import ChapterInfo from "./ChapterInfo.svelte";
  import IconButton from "./IconButton.svelte";
  import { goto } from "$app/navigation";

  interface Props {
    manwha: Manwha;
    onedit?: ((id: string) => void) | undefined;
    ondelete?: ((id: string) => void) | undefined;
    onincrement?: ((id: string) => void) | undefined;
  }

  let {
    manwha,
    onedit = undefined,
    ondelete = undefined,
    onincrement = undefined,
  }: Props = $props();

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

  function handleIncrement() {
    if (manwha._id) {
      onincrement?.(manwha._id);
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

<div
  class="manwha-card-wrapper"
  onclick={() => goto(`/manwhas/${manwha._id}`)}
  role="button"
  tabindex="0"
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goto(`/manwhas/${manwha._id}`);
    }
  }}
>
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
            <IconButton
              icon="plus"
              onclick={handleIncrement}
              title="Increment Chapter"
              ariaLabel="Increment chapter"
              textColor="text-green-400"
              bgColor="bg-green-900/20"
              hoverBgColor="hover:bg-green-900/30"
            />
            <IconButton
              icon="edit"
              onclick={handleEdit}
              title="Edit"
              ariaLabel="Edit manwha"
              textColor="text-blue-400"
              bgColor="bg-blue-900/20"
              hoverBgColor="hover:bg-blue-900/30"
            />
            <IconButton
              icon="delete"
              onclick={handleDelete}
              title="Delete"
              ariaLabel="Delete manwha"
              textColor="text-red-400"
              bgColor="bg-red-900/20"
              hoverBgColor="hover:bg-red-900/30"
            />
          </div>
        </div>

        <div class="manwha-details">
          <div class="manwha-info">
            <div class="info-item">
              <span class="info-label">Chapter:</span>
              <ChapterInfo chapter={manwha.currentChapter} link={manwha.link} />
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

          {#if manwha.lastReadAt}
            <p class="last-read">Last read: {formatDate(manwha.lastReadAt)}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .manwha-card-wrapper {
    @apply cursor-pointer;
  }

  .manwha-card {
    @apply p-6 rounded-lg shadow-sm border border-gray-600 bg-gray-800
      transition-all hover:shadow-md hover:border-gray-500;
  }

  .manwha-layout {
    @apply flex flex-col sm:flex-row gap-4;
  }

  .cover-image-container {
    @apply flex-shrink-0 self-center sm:self-start;
  }

  .cover-image {
    @apply w-24 sm:w-20 h-32 sm:h-28 object-cover rounded-lg border
      border-gray-600 shadow-sm;
  }

  .manwha-content {
    @apply flex-1 min-w-0;
  }

  .manwha-header {
    @apply flex flex-col md:flex-row items-start justify-between mb-4 gap-2;
  }

  .manwha-title {
    @apply text-lg sm:text-xl font-semibold flex-1 text-gray-200 mr-2 min-w-0
      break-words;
  }

  .manwha-actions {
    @apply flex flex-row gap-2 flex-shrink-0;
  }

  .manwha-details {
    @apply space-y-3;
  }

  .manwha-info {
    @apply flex flex-wrap gap-4 text-sm mb-0;
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

  .last-read {
    @apply text-xs text-gray-400;
  }
</style>
