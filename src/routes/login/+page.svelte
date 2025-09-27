<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let email = '';
	let password = '';
	let loading = false;
	let errorMessage = '';
	let successMessage = '';

	async function handleLogin() {
		if (!email || !password) {
			errorMessage = 'Please fill in all fields';
			return;
		}

		loading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				successMessage = 'Login successful! Redirecting...';
				setTimeout(() => {
					if (browser) {
						goto('/dashboard');
					}
				}, 1000);
			} else {
				errorMessage = data.error || 'Login failed';
			}
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = 'Network error occurred';
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<svelte:head>
	<title>Login - Manwha Tracker</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4" style="background: linear-gradient(135deg, #202531 0%, #322f42 100%);">
	<div class="w-full max-w-md p-8 rounded-lg shadow-xl bg-white">
		<h1 class="text-3xl font-bold text-center mb-8" style="color: #202531;">Welcome Back</h1>
		
		<form on:submit|preventDefault={handleLogin}>
			<div class="mb-6">
				<label for="email" class="block text-sm font-medium mb-2" style="color: #322f42;">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					on:keypress={handleKeyPress}
					class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all bg-white"
					style="border-color: #c5c3c4; --tw-ring-color: rgba(75, 57, 111, 0.5);"
					placeholder="Enter your email"
					required
					disabled={loading}
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="block text-sm font-medium mb-2" style="color: #322f42;">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					on:keypress={handleKeyPress}
					class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all bg-white"
					style="border-color: #c5c3c4; --tw-ring-color: rgba(75, 57, 111, 0.5);"
					placeholder="Enter your password"
					required
					disabled={loading}
				/>
			</div>

			{#if errorMessage}
				<div class="text-red-500 text-sm mt-2">{errorMessage}</div>
			{/if}

			{#if successMessage}
				<div class="text-green-500 text-sm mt-2">{successMessage}</div>
			{/if}

			<button type="submit" 
				class="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white"
				style="background-color: #4b396f;"
				disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<div class="mt-6 text-center">
			<span class="text-gray-600">Don't have an account?</span>
			<a href="/register" class="ml-2 font-medium" style="color: #4b396f;">
				Sign up
			</a>
		</div>
	</div>
</div>