<script lang="ts">
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import Navbar from "$lib/components/Navbar.svelte";
  import ManwhaCard from "$lib/components/ManwhaCard.svelte";
  import {
    formatManwhaStatus,
    getManwhaStatusColor,
  } from "$lib/types.ts";

  export let data: PageData;

  function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString();
  }

  function handleEdit(event: CustomEvent<string>) {
    const manwhaId = event.detail;
    goto(`/manwhas/${manwhaId}/edit`);
  }

  function handleDelete(event: CustomEvent<string>) {
    const manwhaId = event.detail;
    deleteManwha(manwhaId);
  }

  async function deleteManwha(manwhaId: string) {
    if (confirm("Are you sure you want to delete this manwha?")) {
      // Optimistically remove from UI
      data.manwhas = data.manwhas.filter(m => m._id !== manwhaId);
      
      // Process delete in background
      try {
        const response = await fetch(`/api/manwhas/${manwhaId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          // If delete failed, refresh the page to restore correct state
          window.location.reload();
        }
      } catch (error) {
        // If network error, refresh to restore correct state
        window.location.reload();
      }
    }
  }
</script>

<svelte:head>
  <title>My Manwhas - Manwha Tracker</title>
</svelte:head>

<div class="app-layout">
  <Navbar />

  <!-- Main Content -->
  <main class="main-content">
    <div class="container">
      <div class="header-section">
        <h1 class="page-title">My Manwhas</h1>
        <a href="/manwhas/add" class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add New Manwha</span>
        </a>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div class="stats-card-mini">
          <div class="text-center">
            <p class="stats-number">{data.stats.total}</p>
            <p class="stats-label-mini">Total</p>
          </div>
        </div>
        <div class="stats-card-mini">
          <div class="text-center">
            <p class="stats-number text-green-600">{data.stats.reading}</p>
            <p class="stats-label-mini">Reading</p>
          </div>
        </div>
        <div class="stats-card-mini">
          <div class="text-center">
            <p class="stats-number text-blue-600">{data.stats.completed}</p>
            <p class="stats-label-mini">Completed</p>
          </div>
        </div>
        <div class="stats-card-mini">
          <div class="text-center">
            <p class="stats-number text-yellow-600">{data.stats.toContinue}</p>
            <p class="stats-label-mini">To Continue</p>
          </div>
        </div>
        <div class="stats-card-mini">
          <div class="text-center">
            <p class="stats-number text-red-600">{data.stats.abandoned}</p>
            <p class="stats-label-mini">Abandoned</p>
          </div>
        </div>
        <div class="stats-card-mini">
          <div class="text-center">
            <p class="stats-number text-purple-600">{data.stats.ended}</p>
            <p class="stats-label-mini">Ended</p>
          </div>
        </div>
      </div>

      <!-- Manwhas List -->
      {#if data.manwhas.length === 0}
        <div class="empty-state">
          <div class="text-center">
            <svg
              class="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              >
              </path>
            </svg>
            <h3 class="text-xl font-semibold text-gray-300 mb-2">
              No manwhas yet
            </h3>
            <p class="text-gray-400 mb-6">
              Start tracking your favorite manwhas!
            </p>
            <a href="/manwhas/add" class="btn-primary">Add Your First Manwha</a>
          </div>
        </div>
      {:else}
        <div class="manwhas-grid">
          {#each data.manwhas as manwha}
            <ManwhaCard 
              {manwha}
              on:edit={handleEdit}
              on:delete={handleDelete}
            />
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .app-layout {
    min-height: 100vh;
    background-color: var(--color-bg-primary);
  }

  .main-content {
    padding: 2rem;
    min-height: calc(100vh - 80px);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }



  .btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    color: white;
    text-decoration: none;
    transition: all 0.2s;
    background-color: var(--color-purple-dark);
  }

  .btn-primary:hover {
    background-color: var(--color-dark-secondary);
    transform: translateY(-1px);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

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
    color: var(--color-text-primary);
    margin-bottom: 0.25rem;
  }

  .stats-label-mini {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .manwhas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    background-color: var(--color-card-bg);
    border-radius: 0.75rem;
    border: 1px solid var(--color-gray-light);
  }

  .empty-state h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-dark-primary);
    margin-bottom: 0.5rem;
  }

  .empty-state p {
    color: var(--color-dark-secondary);
    margin-bottom: 1.5rem;
  }
</style>
