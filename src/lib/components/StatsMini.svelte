<script lang="ts">
  interface Props {
    value: number | string;
    label: string;
    colorClass?: string;
    onclick?: () => void;
    active?: boolean;
  }

  let {
    value,
    label,
    colorClass = "text-gray-400",
    onclick,
    active = false,
  }: Props = $props();
</script>

<button
  class="stats-card-mini"
  class:active
  class:clickable={onclick !== undefined}
  {onclick}
  disabled={!onclick}
  type="button"
>
  <div class="text-center">
    <p class="{colorClass} stats-number">{value}</p>
    <p class="stats-label-mini">{label}</p>
  </div>
</button>

<style>
  @reference "tailwindcss";

  .stats-card-mini {
    @apply p-4 rounded-lg text-center border border-gray-600 bg-gray-800 w-full
      transition-all duration-200;
  }

  .stats-card-mini.clickable {
    @apply cursor-pointer hover:bg-gray-700 hover:border-gray-500;
  }

  .stats-card-mini.active {
    @apply bg-indigo-900/30 border-indigo-500;
  }

  .stats-card-mini:disabled {
    @apply cursor-default;
  }

  .stats-number {
    @apply text-2xl font-bold mb-1;
  }

  .stats-label-mini {
    @apply text-xs text-gray-400;
  }
</style>
