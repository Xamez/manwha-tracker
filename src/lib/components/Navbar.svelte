<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (browser) {
        goto("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Determine active link based on current route
  $: currentPath = $page.url.pathname;
  $: isDashboard = currentPath === '/dashboard';
  $: isManwhas = currentPath.startsWith('/manwhas');
</script>

<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-brand">
      <h1 class="brand-text">Manwha Tracker</h1>
    </div>

    <div class="navbar-menu">
      <a href="/dashboard" class="navbar-link" class:active={isDashboard}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"></path>
        </svg>
        <span>Dashboard</span>
      </a>
      <a href="/manwhas" class="navbar-link" class:active={isManwhas}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <span>My Manwhas</span>
      </a>
      <button on:click={handleLogout} class="navbar-link">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </div>
</nav>

<style>
  .navbar {
    background-color: var(--color-dark-primary);
    border-bottom: 1px solid var(--color-border);
  }

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .navbar-brand {
    flex-shrink: 0;
  }

  .brand-text {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--color-text-primary);
  }

  .navbar-menu {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .navbar-link {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-text-secondary);
    text-decoration: none;
    border: none;
    background: none;
    font-size: 0.875rem;
  }

  .navbar-link:hover,
  .navbar-link.active {
    background-color: var(--color-purple-dark);
    color: white;
  }
</style>
