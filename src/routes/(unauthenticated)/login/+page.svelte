<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { renderIcon } from "$lib/icons";

  let email = $state("");
  let password = $state("");
  let loading = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");

  async function handleLogin() {
    if (!email || !password) {
      errorMessage = "Please fill in all fields";
      return;
    }

    loading = true;
    errorMessage = "";
    successMessage = "";

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = "Login successful! Redirecting...";
        setTimeout(() => {
          if (browser) {
            goto("/dashboard");
          }
        }, 1000);
      } else {
        errorMessage = data.error || "Login failed";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage = "Network error occurred";
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }
</script>

<svelte:head>
  <title>Login - Manwha Tracker</title>
</svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <h1 class="auth-title">Welcome Back</h1>

    <form
      onsubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          onkeypress={handleKeyPress}
          class="form-input"
          placeholder="Enter your email"
          required
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          onkeypress={handleKeyPress}
          class="form-input"
          placeholder="Enter your password"
          required
          disabled={loading}
        />
      </div>

      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}

      {#if successMessage}
        <div class="success-message">{successMessage}</div>
      {/if}

      <button type="submit" class="btn-primary" disabled={loading}>
        {#if loading}
          {@html renderIcon("spinner", "w-4 h-4")}
          <span>Signing in...</span>
        {:else}
          {@html renderIcon("login", "w-4 h-4")}
          <span>Sign In</span>
        {/if}
      </button>
    </form>

    <div class="mt-6 text-center">
      <span class="text-gray-400">Don't have an account?</span>
      <a href="/register" class="ml-2 link-primary">
        Sign up
      </a>
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .auth-container {
    @apply min-h-screen flex items-center justify-center p-4;
    background: linear-gradient(
      135deg,
      var(--color-dark-primary) 0%,
      var(--color-dark-secondary) 100%
    );
  }

  .auth-card {
    @apply w-full max-w-md p-8 rounded-lg shadow-xl bg-gray-800 border
      border-gray-600;
  }

  .auth-title {
    @apply text-3xl font-bold text-center mb-8 text-gray-50;
  }

  .form-group {
    @apply mb-6;
  }

  .form-label {
    @apply block text-sm font-medium mb-2 text-gray-50;
  }

  .form-input {
    @apply w-full px-4 py-3 rounded-lg border border-gray-600 bg-slate-800
      text-gray-50 placeholder-gray-300 focus:outline-none transition-all;
  }

  .btn-primary {
    @apply w-full py-3 px-6 rounded-lg font-medium transition-all duration-200
      focus:outline-none text-white bg-indigo-600 hover:bg-purple-500
      disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
      justify-center;
  }

  .error-message {
    @apply text-red-400 text-sm mt-2 p-3 rounded-lg bg-red-500/10 border
      border-red-500/30;
  }

  .success-message {
    @apply text-green-400 text-sm mt-2 p-3 rounded-lg bg-green-500/10 border
      border-green-500/30;
  }

  .link-primary {
    @apply font-medium hover:underline transition-colors text-indigo-400;
  }
</style>
