<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import "../../app.css";

  let { children } = $props();
</script>

<div class="app-container">
  <Navbar />

  <main class="main-content">
    {@render children?.()}
  </main>
</div>

<style>
  @reference "tailwindcss";

  .app-container {
    @apply flex flex-col h-screen overflow-hidden;
  }

  .main-content {
    @apply flex-1 overflow-y-auto;
    background-color: var(--color-bg-primary);
  }
</style>
