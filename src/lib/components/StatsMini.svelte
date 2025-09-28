<script lang="ts">
  interface Props {
    value: number | string;
    label: string;
    colorClass?: string;
  }

  let { value, label, colorClass = "text-gray-400" }: Props = $props();
</script>

<div class="stats-card-mini">
  <div class="text-center">
    <p class="{colorClass} stats-number">{value}</p>
    <p class="stats-label-mini">{label}</p>
  </div>
</div>

<style>
  .stats-card-mini {
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-gray-light);
  }

  .stats-number {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .stats-label-mini {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
</style>
