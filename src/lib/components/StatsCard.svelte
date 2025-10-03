<script lang="ts">
  import { type IconName, renderIcon } from "$lib/icons";

  interface Props {
    title: string;
    value: number | string;
    icon?: IconName;
    color?: "purple" | "blue" | "green" | "orange";
  }

  let { title, value, icon = undefined, color = "purple" }: Props =
    $props();
</script>

<div class="stats-card">
  <div class="stats-content">
    <div class="stats-info">
      <h3 class="stats-title">{title}</h3>
      <p class="stats-value">{value}</p>
    </div>
    <div class="stats-icon {color}">
      {#if icon}
        {@html renderIcon(icon, "w-6 h-6")}
      {/if}
    </div>
  </div>
</div>

<style>
  .stats-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-border);
    background-color: var(--color-card-bg);
  }

  .stats-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stats-info {
    flex: 1;
  }

  .stats-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    margin-bottom: 0.25rem;
  }

  .stats-value {
    font-size: 1.875rem;
    font-weight: bold;
    color: var(--color-text-primary);
  }

  .stats-icon {
    padding: 0.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stats-icon.purple {
    background-color: rgba(139, 92, 246, 0.2);
    color: #a855f7;
  }

  .stats-icon.blue {
    background-color: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
  }

  .stats-icon.green {
    background-color: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }

  .stats-icon.orange {
    background-color: rgba(249, 115, 22, 0.2);
    color: #f97316;
  }

  .stats-icon :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
