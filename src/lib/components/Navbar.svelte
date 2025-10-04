<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { renderIcon } from "$lib/icons";

  let mobileMenuOpen = $state(false);

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

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  const currentPath = $derived($page.url.pathname);
  const isDashboard = $derived(currentPath === "/dashboard");
  const isManwhas = $derived(currentPath.startsWith("/manwhas"));
</script>

<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-brand">
      <a href="/dashboard" class="brand-text">Manwha Tracker</a>
    </div>

    <button
      class="mobile-menu-button"
      onclick={toggleMobileMenu}
      aria-label="Toggle menu"
    >
      {#if mobileMenuOpen}
        {@html renderIcon("close", "w-6 h-6")}
      {:else}
        {@html renderIcon("menu", "w-6 h-6")}
      {/if}
    </button>

    <div class="navbar-menu desktop-menu">
      <a href="/dashboard" class="navbar-link" class:active={isDashboard}>
        {@html renderIcon("dashboard")}
        <span>Dashboard</span>
      </a>
      <a href="/manwhas" class="navbar-link" class:active={isManwhas}>
        {@html renderIcon("book")}
        <span>My Manwhas</span>
      </a>
      <button onclick={handleLogout} class="navbar-link">
        {@html renderIcon("logout")}
        <span>Logout</span>
      </button>
    </div>
  </div>

  {#if mobileMenuOpen}
    <div class="mobile-menu">
      <a
        href="/dashboard"
        class="navbar-link"
        class:active={isDashboard}
        onclick={closeMobileMenu}
      >
        {@html renderIcon("dashboard")}
        <span>Dashboard</span>
      </a>
      <a
        href="/manwhas"
        class="navbar-link"
        class:active={isManwhas}
        onclick={closeMobileMenu}
      >
        {@html renderIcon("book")}
        <span>My Manwhas</span>
      </a>
      <button
        onclick={() => {
          handleLogout();
          closeMobileMenu();
        }}
        class="navbar-link"
      >
        {@html renderIcon("logout")}
        <span>Logout</span>
      </button>
    </div>
  {/if}
</nav>

<style>
  @reference "tailwindcss";

  .navbar {
    background-color: var(--color-dark-primary);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .navbar-container {
    @apply flex justify-between items-center h-16 mx-auto;
    @apply px-3 md:px-6 lg:px-8;
    @apply max-w-[80%];
  }

  .navbar-brand {
    flex-shrink: 0;
  }

  .brand-text {
    @apply text-lg md:text-xl font-bold no-underline transition-colors;
    color: var(--color-text-primary);
  }

  .brand-text:hover {
    color: var(--color-purple-light);
  }

  .mobile-menu-button {
    @apply hidden md:hidden p-2 rounded-md cursor-pointer border-none
      transition-colors;
    color: var(--color-text-primary);
    background: none;
  }

  .mobile-menu-button:hover {
    background-color: var(--color-dark-secondary);
  }

  .desktop-menu {
    @apply hidden md:flex items-center gap-2;
  }

  .mobile-menu {
    @apply hidden md:hidden flex-col gap-1 p-4 border-t;
    background-color: var(--color-dark-secondary);
    border-top-color: var(--color-border);
  }

  .navbar-link {
    @apply flex items-center gap-2 px-4 py-3 md:py-2.5 rounded-lg
      cursor-pointer;
    @apply transition-all no-underline border-none whitespace-nowrap;
    @apply text-base md:text-sm w-full md:w-auto;
    color: var(--color-text-secondary);
    background: none;
    font-family: inherit;
  }

  .navbar-link:hover {
    background-color: var(--color-dark-secondary);
    color: var(--color-text-primary);
  }

  .navbar-link.active {
    background-color: var(--color-purple-dark);
    color: white;
  }

  .desktop-menu .navbar-link :global(svg) {
    @apply w-4 h-4 flex-shrink-0;
  }

  .mobile-menu .navbar-link :global(svg) {
    @apply w-5 h-5 flex-shrink-0;
  }

  @media (max-width: 768px) {
    .mobile-menu-button {
      @apply block;
    }

    .mobile-menu {
      @apply flex;
    }
  }
</style>
