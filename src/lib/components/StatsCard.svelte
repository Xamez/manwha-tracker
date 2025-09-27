<script lang="ts">
  export let title: string;
  export let value: number | string;
  export let icon: string = '';
  export let color: 'purple' | 'blue' | 'green' | 'orange' = 'purple';
</script>

<div class="stats-card">
  <div class="stats-content">
    <div class="stats-info">
      <h3 class="stats-title">{title}</h3>
      <p class="stats-value">{value}</p>
    </div>
    <div class="stats-icon {color}">
      {#if icon === 'book'}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      {:else if icon === 'reading'}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
      {:else if icon === 'completed'}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      {:else if icon === 'planned'}
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
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
</style>