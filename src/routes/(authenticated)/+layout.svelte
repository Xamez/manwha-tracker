<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";

  let { children } = $props();
</script>

<Navbar />

<main class="main-content">
  {@render children?.()}
</main>

<style>
  @reference "tailwindcss";

  .main-content {
    @apply min-h-screen;
    background-color: var(--color-bg-primary);
  }
</style>