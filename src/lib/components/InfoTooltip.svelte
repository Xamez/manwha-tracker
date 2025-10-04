<script lang="ts">
  import { renderIcon } from "$lib/icons";

  interface Props {
    text: string;
  }

  let { text }: Props = $props();
</script>

<span class="info-icon-wrapper">
  <span class="info-icon">
    {@html renderIcon("info", "w-4 h-4")}
  </span>
  <span class="info-tooltip">
    {text}
  </span>
</span>

<style>
  @reference "tailwindcss";

  .info-icon-wrapper {
    @apply relative inline-flex items-center;
  }

  .info-icon {
    @apply text-gray-400 cursor-help;
  }

  .info-tooltip {
    @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
      bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0
      pointer-events-none transition-opacity duration-200 z-10;
  }

  .info-tooltip::after {
    content: "";
    @apply absolute top-full left-1/2 -translate-x-1/2 border-4
      border-transparent border-t-gray-800;
  }

  .info-icon-wrapper:hover .info-tooltip {
    @apply opacity-100;
  }
</style>
