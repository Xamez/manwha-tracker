<script lang="ts">
  import { goto } from "$app/navigation";
  import { renderIcon } from "$lib/icons";

  let title = $state("");
  let description = $state("");
  let note = $state("");
  let link = $state("");
  let currentChapter = $state(1);
  let status = $state("reading");
  let rating = $state("");
  let startDate = $state(new Date().toISOString().split("T")[0]);
  let endDate = $state("");
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

      const response = await fetch("/api/manwhas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(manwhaData),
      });

      const responseData = await response.json();

      if (response.ok) {
        successMessage = "Manwha added successfully! Redirecting...";
        setTimeout(() => {
          goto("/manwhas");
        }, 1000);
      } else {
        errorMessage = responseData.error || "Failed to add manwha";
      }
    } catch (error) {
      console.error("Add manwha error:", error);
      errorMessage = "Network error occurred";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Add Manwha - Manwha Tracker</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
  <div class="page-header">
    <h1 class="page-title">Add New Manwha</h1>
    <p class="page-subtitle">Start tracking a new series</p>
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
        <label for="link" class="form-label">
          Base Link
          <span class="text-xs text-gray-400 font-normal block mt-1">
            Enter the base URL (chapters will be automatically appended)
          </span>
        </label>
        <input
          id="link"
          type="url"
          bind:value={link}
          class="form-input"
          placeholder="https://demonicscans.org/manga/your-manga-title"
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
          onclick={() => goto("/manwhas")}
          class="btn-secondary"
          disabled={loading}
        >
          {@html renderIcon("close", "w-4 h-4 mr-2")}
          Cancel
        </button>
        <button type="submit" class="btn-primary" disabled={loading}>
          {#if loading}
            {@html renderIcon("spinner", "w-4 h-4 mr-2")}
            Adding...
          {:else}
            {@html renderIcon("plus", "w-4 h-4 mr-2")}
            Add Manwha
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .form-actions {
    @apply flex justify-end gap-3;
  }
</style>
