<script lang="ts">
  import { renderIcon } from "$lib/icons";
  import { generateChapterUrl } from "$lib/utils/urlUtils";

  interface Props {
    chapter: number;
    link?: string;
  }

  let { chapter, link }: Props = $props();
</script>

<div class="chapter-container">
  {#if link}
    <a
      href={generateChapterUrl(link, chapter)}
      target="_blank"
      rel="noopener noreferrer"
      class="chapter-link"
      title="Read Chapter {chapter}"
    >
      {chapter}
      {@html renderIcon("externalLink")}
    </a>
  {:else}
    <span class="chapter-number">{chapter}</span>
  {/if}
</div>

<style>
  @reference "tailwindcss";

  .chapter-container {
    @apply inline-flex items-center gap-1.5;
  }

  .chapter-number {
    @apply text-gray-200 font-semibold;
  }

  .chapter-link {
    @apply inline-flex items-center font-semibold text-indigo-400
      hover:text-indigo-300 transition-colors duration-200 no-underline
      hover:underline;
    gap: 0.25rem;
  }
</style>
