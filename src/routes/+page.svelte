<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	onMount(async () => {
		if (browser) {
			// Check if user is already authenticated by trying to access dashboard
			try {
				const response = await fetch('/dashboard');
				if (response.redirected && response.url.includes('/login')) {
					goto('/login');
				} else {
					goto('/dashboard');
				}
			} catch (error) {
				// If there's an error, redirect to login
				goto('/login');
			}
		}
	});
</script>

<svelte:head>
	<title>Manwha Tracker</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4" style="background: linear-gradient(135deg, #202531 0%, #322f42 100%);">
	<div class="text-center text-white">
		<h1 class="text-4xl font-bold mb-4">📚 Manwha Tracker</h1>
		<p class="text-xl">Loading...</p>
	</div>
</div>
