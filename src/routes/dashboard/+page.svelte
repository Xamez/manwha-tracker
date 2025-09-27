<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	
	export let data: PageData;

	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST',
			});

			if (response.ok) {
				goto('/login');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<svelte:head>
	<title>Dashboard - Manwha Tracker</title>
</svelte:head>

<div class="min-h-screen" style="background-color: #202531;">
	<!-- Navigation Bar -->
	<nav class="flex items-center justify-between px-6 py-4 shadow-lg" style="background-color: #322f42;">
		<div class="text-xl font-bold text-white">
			📚 Manwha Tracker
		</div>
		<div class="flex items-center space-x-4">
			<span style="color: #b6a2c9;">Welcome, {data.user.username}!</span>
			<a href="/dashboard" class="px-4 py-2 rounded-lg transition-all" style="color: #b6a2c9;">Dashboard</a>
			<a href="/manwhas" class="px-4 py-2 rounded-lg transition-all" style="color: #b6a2c9;">My Manwhas</a>
			<a href="/manwhas/add" class="px-4 py-2 rounded-lg transition-all" style="color: #b6a2c9;">Add New</a>
			<button on:click={handleLogout} class="px-4 py-2 rounded-lg transition-all cursor-pointer" style="color: #b6a2c9;">Logout</button>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="p-6">
		<div class="max-w-7xl mx-auto">
			<h1 class="text-3xl font-bold text-white mb-8">Dashboard</h1>
			
			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div class="bg-white rounded-lg p-6 shadow-lg">
					<div class="flex items-center">
						<div class="bg-green-100 p-3 rounded-full mr-4">
							<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
							</svg>
						</div>
						<div>
							<p class="text-gray-600 text-sm">Currently Reading</p>
							<p class="text-2xl font-bold text-gray-800">0</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg p-6 shadow-lg">
					<div class="flex items-center">
						<div class="bg-blue-100 p-3 rounded-full mr-4">
							<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<div>
							<p class="text-gray-600 text-sm">Completed</p>
							<p class="text-2xl font-bold text-gray-800">0</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg p-6 shadow-lg">
					<div class="flex items-center">
						<div class="bg-yellow-100 p-3 rounded-full mr-4">
							<svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<div>
							<p class="text-gray-600 text-sm">To Continue</p>
							<p class="text-2xl font-bold text-gray-800">0</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-lg p-6 shadow-lg">
					<div class="flex items-center">
						<div class="bg-purple-100 p-3 rounded-full mr-4">
							<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
							</svg>
						</div>
						<div>
							<p class="text-gray-600 text-sm">Total Manwhas</p>
							<p class="text-2xl font-bold text-gray-800">0</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Recent Activity -->
			<div class="bg-white rounded-lg shadow-lg p-6 mb-8">
				<h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
				<div class="text-gray-600">
					<p>No recent activity yet. <a href="/manwhas/add" class="text-purple-600 hover:underline">Add your first manwha!</a></p>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<a href="/manwhas/add" class="block">
					<div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
						<div class="flex items-center">
							<svg class="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
							</svg>
							<div>
								<h3 class="text-lg font-semibold">Add New Manwha</h3>
								<p class="text-purple-100">Start tracking a new series</p>
							</div>
						</div>
					</div>
				</a>

				<a href="/manwhas" class="block">
					<div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
						<div class="flex items-center">
							<svg class="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
							</svg>
							<div>
								<h3 class="text-lg font-semibold">View All Manwhas</h3>
								<p class="text-blue-100">Browse your collection</p>
							</div>
						</div>
					</div>
				</a>
			</div>
		</div>
	</main>
</div>