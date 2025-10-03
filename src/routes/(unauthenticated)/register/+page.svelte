<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { renderIcon } from "$lib/icons";

  let username = $state("");
  let email = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  let loading = $state(false);
  let errorMessage = $state("");
  let successMessage = $state("");

  async function handleRegister() {
    if (!username || !email || !password || !confirmPassword) {
      errorMessage = "Please fill in all fields";
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match";
      return;
    }

    if (password.length < 8) {
      errorMessage = "Password must be at least 8 characters long";
      return;
    }

    loading = true;
    errorMessage = "";
    successMessage = "";

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = "Account created successfully! Redirecting...";
        setTimeout(() => {
          if (browser) {
            goto("/dashboard");
          }
        }, 1000);
      } else {
        errorMessage = data.error || "Registration failed";
      }
    } catch (error) {
      console.error("Registration error:", error);
      errorMessage = "Network error occurred";
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleRegister();
    }
  }
</script>

<svelte:head>
  <title>Register - Manwha Tracker</title>
</svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <h1 class="auth-title">Create Account</h1>

    <form
      onsubmit={(e) => {
        e.preventDefault();
        handleRegister();
      }}
    >
      <div class="form-group">
        <label for="username" class="form-label">Username</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          onkeypress={handleKeyPress}
          class="form-input"
          placeholder="Choose a username"
          required
          disabled={loading}
        />
      </div>

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
          placeholder="Create a password"
          required
          disabled={loading}
        />
        <small class="text-gray-400 text-xs"
        >Must be at least 8 characters long</small>
      </div>

      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          onkeypress={handleKeyPress}
          class="form-input"
          placeholder="Confirm your password"
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
          <span>Creating Account...</span>
        {:else}
          {@html renderIcon("userPlus", "w-4 h-4")}
          <span>Create Account</span>
        {/if}
      </button>
    </form>

    <div class="mt-6 text-center">
      <span class="text-gray-400">Already have an account?</span>
      <a href="/login" class="ml-2 link-primary">
        Sign in
      </a>
    </div>
  </div>
</div><style>
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
      text-gray-50 placeholder-gray-300 focus:outline-none
      focus:border-indigo-600 transition-all;
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
