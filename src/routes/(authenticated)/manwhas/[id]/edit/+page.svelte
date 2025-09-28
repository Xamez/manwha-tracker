<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let title = $state(data.manwha.title);
  let description = $state(data.manwha.description || "");
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
        description: description.trim() || undefined,
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
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          bind:value={description}
          class="form-textarea"
          placeholder="Brief description of the manwha"
          rows="3"
          disabled={loading}
        ></textarea>
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
        <label for="link" class="form-label">Link</label>
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
            <svg
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              >
              </circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              >
              </path>
            </svg>
            <span>Deleting...</span>
          {:else}
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
            <span>Delete Manwha</span>
          {/if}
        </button>
        <div class="flex space-x-4">
          <button
            type="button"
            onclick={() => goto("/manwhas")}
            class="btn-secondary"
            disabled={loading}
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
                d="M6 18L18 6M6 6l12 12"
              >
              </path>
            </svg>
            <span>Cancel</span>
          </button>
          <button type="submit" class="btn-primary" disabled={loading}>
            {#if loading}
              <svg
                class="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                >
                </circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                >
                </path>
              </svg>
              <span>Updating...</span>
            {:else}
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
                  d="M5 13l4 4L19 7"
                >
                </path>
              </svg>
              <span>Update Manwha</span>
            {/if}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
