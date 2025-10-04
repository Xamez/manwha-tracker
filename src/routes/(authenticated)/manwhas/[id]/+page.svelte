<script lang="ts">
  import type { PageData } from "./$types";
  import StatusBadge from "$lib/components/StatusBadge.svelte";
  import ChapterInfo from "$lib/components/ChapterInfo.svelte";
  import IconButton from "$lib/components/IconButton.svelte";
  import { renderIcon } from "$lib/icons";
  import { invalidateAll } from "$app/navigation";
  import { incrementManwhaChapter } from "$lib/utils/manwhaUtils.ts";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  async function handleIncrement() {
    if (!data.manwha._id) return;

    const success = await incrementManwhaChapter(
      data.manwha._id,
      data.manwha,
    );
    if (success) {
      await invalidateAll();
    }
  }

  function formatDate(dateValue?: Date | string) {
    if (!dateValue) return "N/A";
    try {
      const date = typeof dateValue === "string"
        ? new Date(dateValue)
        : dateValue;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  }

  function handleCoverClick() {
    if (data.manwha.link) {
      window.open(data.manwha.link, "_blank", "noopener,noreferrer");
    }
  }
</script>

<svelte:head>
  <title>{data.manwha.title} - Manwha Tracker</title>
</svelte:head>

<div class="container">
  <div class="header-section">
    <h1 class="page-title">{data.manwha.title}</h1>
    <div class="header-actions">
      <IconButton
        icon="plus"
        onclick={handleIncrement}
        title="Increment Chapter"
        ariaLabel="Increment chapter for {data.manwha.title}"
        textColor="text-green-400"
        bgColor="bg-green-900/20"
        hoverBgColor="hover:bg-green-900/30"
        size="lg"
      />
      <IconButton
        icon="edit"
        href="/manwhas/{data.manwha._id}/edit"
        title="Edit Manwha"
        ariaLabel="Edit {data.manwha.title}"
        textColor="text-blue-400"
        bgColor="bg-blue-900/20"
        hoverBgColor="hover:bg-blue-900/30"
        size="lg"
      />
    </div>
  </div>

  <div class="content-grid">
    {#if data.manwha.coverImage}
      <div class="cover-section">
        <button
          onclick={handleCoverClick}
          class="cover-button"
          class:clickable={data.manwha.link}
          disabled={!data.manwha.link}
          title={data.manwha.link ? "Visit manwha homepage" : ""}
        >
          <img
            src={data.manwha.coverImage}
            alt="{data.manwha.title} cover"
            class="cover-image"
          />
          {#if data.manwha.link}
            <div class="cover-overlay">
              <div class="overlay-icon">
                {@html renderIcon("externalLink", "w-8 h-8")}
              </div>
              <span class="overlay-text">Visit Homepage</span>
            </div>
          {/if}
        </button>
      </div>
    {/if}

    <div class="info-section">
      <div class="info-card">
        <h2 class="section-title">Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Status</span>
            <div class="info-value">
              <StatusBadge status={data.manwha.status} />
            </div>
          </div>

          <div class="info-item">
            <span class="info-label">Current Chapter</span>
            <div class="info-value">
              <ChapterInfo
                chapter={data.manwha.currentChapter}
                link={data.manwha.link}
              />
            </div>
          </div>

          {#if data.manwha.rating}
            <div class="info-item">
              <span class="info-label">Rating</span>
              <span class="info-value rating">{data.manwha.rating}/10</span>
            </div>
          {/if}

          <div class="info-item">
            <span class="info-label">Started</span>
            <span class="info-value">{formatDate(data.manwha.startDate)}</span>
          </div>

          {#if data.manwha.endDate}
            <div class="info-item">
              <span class="info-label">Ended</span>
              <span class="info-value">{formatDate(data.manwha.endDate)}</span>
            </div>
          {/if}

          <div class="info-item">
            <span class="info-label">Last Read</span>
            <span class="info-value">{formatDate(data.manwha.lastReadAt)}</span>
          </div>
        </div>
      </div>

      {#if data.manwha.note}
        <div class="info-card">
          <h2 class="section-title">Personal Notes</h2>
          <p class="note-text">{data.manwha.note}</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .container {
    @apply max-w-6xl mx-auto px-4 py-6;
  }

  .header-section {
    @apply flex items-start justify-between mb-6 gap-4;
  }

  .page-title {
    @apply text-3xl font-bold text-gray-100 break-words;
  }

  .header-actions {
    @apply flex gap-2 flex-shrink-0;
  }

  .content-grid {
    @apply grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6;
  }

  .cover-section {
    @apply flex justify-center lg:justify-start;
  }

  .cover-button {
    @apply relative rounded-lg overflow-hidden border-2 border-gray-600
      shadow-lg transition-all focus:outline-none focus:ring-2
      focus:ring-purple-500;
    @apply max-w-xs w-full;
  }

  .cover-button.clickable {
    @apply cursor-pointer hover:border-purple-500 hover:shadow-purple-500/20;
  }

  .cover-button:not(.clickable) {
    @apply cursor-default;
  }

  .cover-image {
    @apply w-full h-auto object-cover;
    max-height: 600px;
  }

  .cover-overlay {
    @apply absolute inset-0 bg-black/70 flex flex-col items-center
      justify-center opacity-0 transition-opacity;
  }

  .cover-button:hover .cover-overlay {
    @apply opacity-100;
  }

  .overlay-icon {
    @apply text-white mb-2;
  }

  .overlay-text {
    @apply text-white text-lg font-semibold;
  }

  .info-section {
    @apply flex flex-col gap-6;
  }

  .info-card {
    @apply bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-sm;
  }

  .section-title {
    @apply text-xl font-semibold mb-4 text-gray-100 pb-2 border-b
      border-gray-700;
  }

  .info-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-4;
  }

  .info-item {
    @apply flex flex-col gap-1;
  }

  .info-label {
    @apply text-sm font-medium text-gray-400;
  }

  .info-value {
    @apply text-base font-semibold text-gray-200;
  }

  .info-value.rating {
    @apply text-yellow-400;
  }

  .note-text {
    @apply text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-900 p-4
      rounded-lg border border-gray-700;
  }
</style>
