<script lang="ts">
  import { onMount } from "svelte";

  interface MangaData {
    base64Image: string;
    originalUrl?: string;
    downloadBlocked?: boolean;
    title?: string;
  }

  let url = "";
  let loading = false;
  let mangaData: MangaData | null = null;
  let error = "";

  async function scrapeManga() {
    if (!url.trim()) {
      error = "Please enter a URL";
      return;
    }

    loading = true;
    error = "";
    mangaData = null;

    try {
      const response = await fetch("/api/scrape-manga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        mangaData = result.data;
        console.log("Base64 image length:", mangaData?.base64Image.length);
      } else {
        error = result.error || "Failed to scrape manga data";
      }
    } catch (err) {
      error = "Network error occurred";
      console.error("Scraping error:", err);
    } finally {
      loading = false;
    }
  }

  const exampleUrls = [
    "https://manhuaus.com/manga/becoming-the-swordmaster-rank-young-lord-of-the-sichuan-tang-family/",
    "https://demonicscans.org/manga/Heavenly-Inquisition-Sword-%2528Nine-Heavens-Swordmaster%2529",
    "https://www.manganato.gg/manga/heavenly-inquisition-sword-nine-heavens-swordmaster",
  ];
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
  <div class="bg-white rounded-lg shadow-md p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      Manga Scraper Integration
    </h1>

    <div class="mb-4">
      <label for="url" class="block text-sm font-medium mb-2 text-gray-700">
        Manga URL
      </label>
      <input
        id="url"
        type="url"
        bind:value={url}
        placeholder="https://manhuaus.com/manga/..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
    </div>

    <div class="mb-6">
      <p class="text-sm text-gray-600 mb-2">Try these example URLs:</p>
      <div class="space-y-1">
        {#each exampleUrls as exampleUrl}
          <button
            type="button"
            on:click={() => (url = exampleUrl)}
            class="block text-sm text-blue-600 hover:text-blue-800 underline text-left"
            disabled={loading}
          >
            {exampleUrl}
          </button>
        {/each}
      </div>
    </div>

    <button
      on:click={scrapeManga}
      disabled={loading || !url.trim()}
      class="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
    >
      {
        loading
          ? "Scraping & Converting to Base64..."
          : "Scrape Cover Image"
      }
    </button>
  </div>

  {#if error}
    <div
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
    >
      <strong>Error:</strong> {error}
    </div>
  {/if}

  {#if mangaData}
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          Cover Image Scraped Successfully!
        </h2>
        <span
          class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded"
        >
          Ready for Database
        </span>
      </div>

      {#if mangaData.title}
        <div class="mb-4">
          <h3 class="font-medium text-gray-700 mb-2">Title</h3>
          <div class="bg-gray-50 rounded-md p-3 text-gray-800">
            {mangaData.title}
          </div>
        </div>
      {/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-3">
          <h3 class="font-medium text-gray-700">Cover Image Preview</h3>
          <div class="border rounded-lg p-4 bg-gray-50">
            {#if mangaData.downloadBlocked}
              <div class="space-y-2">
                <div
                  class="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded text-sm"
                >
                  ⚠️ Direct download blocked. Using fallback SVG placeholder.
                  {#if mangaData.originalUrl}
                    <br />Original: <a
                      href={mangaData.originalUrl}
                      target="_blank"
                      class="underline"
                    >{mangaData.originalUrl}</a>
                  {/if}
                </div>
                <img
                  src={mangaData.base64Image}
                  alt="Manga Cover Placeholder"
                  class="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                />
              </div>
            {:else}
              <img
                src={mangaData.base64Image}
                alt="Manga Cover"
                class="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                loading="lazy"
              />
            {/if}
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="font-medium text-gray-700 mb-2">Image Details</h3>
            <div class="bg-gray-50 rounded-md p-3 space-y-2 text-sm">
              <div>
                <span class="font-medium">Base64 Size:</span>
                {
                  (mangaData.base64Image.length / 1024).toFixed(
                    1,
                  )
                } KB
                {#if mangaData.downloadBlocked}
                  <span class="text-yellow-600">(Fallback SVG)</span>
                {:else}
                  <span class="text-green-600">(Downloaded Image)</span>
                {/if}
              </div>
              {#if mangaData.originalUrl}
                <div>
                  <span class="font-medium">Original URL:</span>
                  <a
                    href={mangaData.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 hover:text-blue-800 underline break-all ml-1"
                  >
                    {mangaData.originalUrl}
                  </a>
                </div>
              {/if}
              <div>
                <span class="font-medium">Source URL:</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 underline break-all ml-1"
                >
                  {url}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="font-medium text-gray-700 mb-2">
          Base64 Data (Ready for Database)
        </h3>
        <div
          class="bg-gray-900 text-green-400 p-4 rounded-md text-sm font-mono overflow-x-auto max-h-32"
        >
          {mangaData.base64Image.substring(0, 200)}...
          <div class="text-gray-500 mt-2">
            ({mangaData.base64Image.length} characters total)
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    background-color: #f9fafb;
  }
</style>
