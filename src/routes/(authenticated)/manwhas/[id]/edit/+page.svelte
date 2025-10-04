<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { renderIcon } from "$lib/icons";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let title = $state(data.manwha.title);
  let note = $state(data.manwha.note || "");
  let link = $state(data.manwha.link || "");
  let currentChapter = $state(data.manwha.currentChapter);
  let status = $state(data.manwha.status);
  let rating = $state(data.manwha.rating?.toString() || "");
  let startDate = $state(data.manwha.startDate);
  let endDate = $state(data.manwha.endDate || "");
  let loading = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");

  const statusOptions = [
    { value: "reading", label: "Reading" },
    { value: "to-continue", label: "To Continue" },
    { value: "completed", label: "Completed" },
    { value: "abandoned", label: "Abandoned" },
    { value: "ended", label: "Ended" },
  ];

  $effect(() => {
    if (
      (status === "completed" || status === "abandoned" ||
        status === "ended") &&
      !endDate
    ) {
      endDate = new Date().toISOString().split("T")[0];
    }
  });

  async function handleSubmit() {
    if (!title.trim()) {
      errorMessage = "Title is required";
      return;
    }

    if (currentChapter < 0) {
      errorMessage = "Current chapter cannot be negative";
      return;
    }

    if (rating && (parseFloat(rating) < 0 || parseFloat(rating) > 10)) {
      errorMessage = "Rating must be between 0 and 10";
      return;
    }

    loading = true;
    errorMessage = "";
    successMessage = "";

    try {
      const manwhaData = {
        title: title.trim(),
        note: note.trim() || undefined,
        link: link.trim() || undefined,
        currentChapter,
        status,
        rating: rating ? parseFloat(rating) : undefined,
        startDate,
        endDate: endDate || undefined,
      };

      const response = await fetch(`/api/manwhas/${data.manwha._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(manwhaData),
      });

      const responseData = await response.json();

      if (response.ok) {
        successMessage = "Manwha updated successfully! Redirecting...";
        setTimeout(() => {
          goto("/manwhas");
        }, 1000);
      } else {
        errorMessage = responseData.error || "Failed to update manwha";
      }
    } catch (error) {
      console.error("Update manwha error:", error);
      errorMessage = "Network error occurred";
    } finally {
      loading = false;
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this manwha? This action cannot be undone.",
      )
    ) {
      return;
    }

    loading = true;
    errorMessage = "";

    try {
      const response = await fetch(`/api/manwhas/${data.manwha._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        successMessage = "Manwha deleted successfully! Redirecting...";
        setTimeout(() => {
          goto("/manwhas");
        }, 1000);
      } else {
        const responseData = await response.json();
        errorMessage = responseData.error || "Failed to delete manwha";
      }
    } catch (error) {
      console.error("Delete manwha error:", error);
      errorMessage = "Network error occurred";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Edit {data.manwha.title} - Manwha Tracker</title>
</svelte:head>

<div class="max-w-3xl mx-auto">
  <div class="page-header">
    <h1 class="page-title">Edit Manwha</h1>
    <p class="page-subtitle">Update your manwha details</p>
  </div>

  <div class="form-container">
    <form
      onsubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div class="form-group">
        <label for="title" class="form-label">Title *</label>
        <input
          id="title"
          type="text"
          bind:value={title}
          class="form-input"
          placeholder="Enter manwha title"
          required
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="note" class="form-label">Personal Note</label>
        <textarea
          id="note"
          bind:value={note}
          class="form-textarea"
          placeholder="Your personal thoughts or notes"
          rows="2"
          disabled={loading}
        ></textarea>
      </div>

      <div class="form-group">
        <label for="link" class="form-label">
          <span class="flex items-center gap-2">
            Link
            <span class="info-icon-wrapper">
              <span class="info-icon">
                {@html renderIcon("info", "w-4 h-4")}
              </span>
              <span class="info-tooltip">
                Supported websites: DemonicScans, ManhuaUS, AsuraComic
              </span>
            </span>
          </span>
        </label>
        <input
          id="link"
          type="url"
          bind:value={link}
          class="form-input"
          placeholder="https://example.com/manwha"
          disabled={loading}
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="currentChapter" class="form-label"
          >Current Chapter *</label>
          <input
            id="currentChapter"
            type="number"
            bind:value={currentChapter}
            class="form-input"
            min="0"
            required
            disabled={loading}
          />
        </div>
        <div class="form-group">
          <label for="status" class="form-label">Status *</label>
          <select
            id="status"
            bind:value={status}
            class="form-select"
            required
            disabled={loading}
          >
            {#each statusOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="startDate" class="form-label">Start Date *</label>
          <input
            id="startDate"
            type="date"
            bind:value={startDate}
            class="form-input"
            required
            disabled={loading}
          />
        </div>
        <div class="form-group">
          <label for="rating" class="form-label">Rating (0-10)</label>
          <input
            id="rating"
            type="number"
            bind:value={rating}
            class="form-input"
            min="0"
            max="10"
            step="0.1"
            placeholder="Optional rating"
            disabled={loading}
          />
        </div>
      </div>

      {#if         status === "completed" || status === "abandoned" ||
          status === "ended"}
        <div class="form-group">
          <label for="endDate" class="form-label">End Date</label>
          <input
            id="endDate"
            type="date"
            bind:value={endDate}
            class="form-input"
            disabled={loading}
          />
        </div>
      {/if}

      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}

      {#if successMessage}
        <div class="success-message">{successMessage}</div>
      {/if}

      <div class="form-actions">
        <button
          type="button"
          onclick={handleDelete}
          class="btn-danger"
          disabled={loading}
        >
          {#if loading}
            {@html renderIcon("spinner", "w-4 h-4")}
            <span>Deleting...</span>
          {:else}
            {@html renderIcon("delete", "w-4 h-4")}
            <span>Delete</span>
          {/if}
        </button>
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onclick={() => goto("/manwhas")}
            class="btn-secondary"
            disabled={loading}
          >
            {@html renderIcon("close", "w-4 h-4")}
            <span>Cancel</span>
          </button>
          <button type="submit" class="btn-primary" disabled={loading}>
            {#if loading}
              {@html renderIcon("spinner", "w-4 h-4")}
              <span>Updating...</span>
            {:else}
              {@html renderIcon("check", "w-4 h-4")}
              <span>Update</span>
            {/if}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .info-icon-wrapper {
    @apply relative inline-flex items-center;
  }

  .info-icon {
    @apply text-gray-400 cursor-help;
  }

  .info-tooltip {
    @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 z-10;
  }

  .info-tooltip::after {
    content: "";
    @apply absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800;
  }

  .info-icon-wrapper:hover .info-tooltip {
    @apply opacity-100;
  }
</style>
